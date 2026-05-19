const jwt = require('jsonwebtoken');
const ContactMessage = require('../model/ContactMessage');
const { sendMail, getEmailCredentials } = require('../utils/mailTransporter');

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function parseOptionalUser(req) {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) return null;
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded.user?.id || null;
  } catch {
    return null;
  }
}

async function sendContactEmail({ name, email, subject, message, messageId }) {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
    return { sent: false, reason: 'email_not_configured' };
  }

  const to = process.env.CONTACT_TO_EMAIL || process.env.EMAIL_USER;

  const mailOptions = {
    from: `"AI Trip Planner" <${process.env.EMAIL_USER}>`,
    to,
    replyTo: email,
    subject: `[Contact] ${subject} — ${name}`,
    text: [
      `New contact message (ID: ${messageId})`,
      '',
      `Name: ${name}`,
      `Email: ${email}`,
      `Subject: ${subject}`,
      '',
      'Message:',
      message,
    ].join('\n'),
    html: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;">
        <h2 style="color:#1e3a8a;">New contact message</h2>
        <p style="color:#64748b;font-size:12px;">Reference: ${messageId}</p>
        <table style="width:100%;border-collapse:collapse;margin:16px 0;">
          <tr><td style="padding:8px 0;color:#64748b;">Name</td><td style="padding:8px 0;font-weight:600;">${name}</td></tr>
          <tr><td style="padding:8px 0;color:#64748b;">Email</td><td style="padding:8px 0;"><a href="mailto:${email}">${email}</a></td></tr>
          <tr><td style="padding:8px 0;color:#64748b;">Subject</td><td style="padding:8px 0;font-weight:600;">${subject}</td></tr>
        </table>
        <div style="background:#f8fafc;border-radius:12px;padding:16px;border:1px solid #e2e8f0;">
          <p style="margin:0 0 8px;color:#64748b;font-size:12px;text-transform:uppercase;">Message</p>
          <p style="margin:0;white-space:pre-wrap;color:#0f172a;">${message.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</p>
        </div>
        <p style="margin-top:24px;font-size:12px;color:#94a3b8;">AI Trip Planner — FYP contact form</p>
      </div>
    `,
  };

  const { user } = getEmailCredentials();
  const result = await sendMail({
    from: mailOptions.from || `"AI Trip Planner" <${user}>`,
    to: mailOptions.to,
    subject: mailOptions.subject,
    html: mailOptions.html,
    text: mailOptions.text,
  });
  if (!result.sent) {
    console.error('Contact email failed:', result.reason);
  }
  return result;
}

exports.submitContact = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body || {};

    const trimmedName = String(name || '').trim();
    const trimmedEmail = String(email || '').trim().toLowerCase();
    const trimmedSubject = String(subject || '').trim();
    const trimmedMessage = String(message || '').trim();

    if (trimmedName.length < 2 || trimmedName.length > 120) {
      return res.status(400).json({ message: 'Please enter your name (2–120 characters).' });
    }
    if (!EMAIL_REGEX.test(trimmedEmail)) {
      return res.status(400).json({ message: 'Please enter a valid email address.' });
    }
    if (!trimmedSubject || trimmedSubject.length > 120) {
      return res.status(400).json({ message: 'Please select or enter a subject.' });
    }
    if (trimmedMessage.length < 10) {
      return res.status(400).json({ message: 'Message must be at least 10 characters.' });
    }
    if (trimmedMessage.length > 5000) {
      return res.status(400).json({ message: 'Message is too long (max 5000 characters).' });
    }

    const userId = parseOptionalUser(req);

    const record = await ContactMessage.create({
      userId,
      name: trimmedName,
      email: trimmedEmail,
      subject: trimmedSubject,
      message: trimmedMessage,
      status: 'new',
      emailSent: false,
    });

    const emailResult = await sendContactEmail({
      name: trimmedName,
      email: trimmedEmail,
      subject: trimmedSubject,
      message: trimmedMessage,
      messageId: record.id,
    });

    if (emailResult.sent) {
      await record.update({ emailSent: true });
    }

    return res.status(201).json({
      success: true,
      message: 'Your message was sent successfully. We will get back to you within 24–48 hours.',
      data: {
        id: record.id,
        emailNotified: emailResult.sent,
      },
    });
  } catch (err) {
    console.error('submitContact error:', err);
    return res.status(500).json({ message: 'Could not send your message. Please try again later.' });
  }
};
