const nodemailer = require('nodemailer');

function getEmailCredentials() {
    const user = String(process.env.EMAIL_USER || '').trim();
    const pass = String(process.env.EMAIL_PASSWORD || '').replace(/\s/g, '');
    return { user, pass };
}

function createMailTransporter() {
    const { user, pass } = getEmailCredentials();
    if (!user || !pass) {
        return null;
    }

    let port = Number(process.env.EMAIL_PORT) || 587;
    // Gmail on 465 often times out on campus/corporate networks — always prefer 587
    if (port === 465) {
        console.warn('⚠️ EMAIL_PORT=465 detected; using 587 (STARTTLS) instead.');
        port = 587;
    }

    return nodemailer.createTransport({
        host: process.env.EMAIL_HOST || 'smtp.gmail.com',
        port,
        secure: false,
        auth: { user, pass },
        requireTLS: port === 587,
        connectionTimeout: 8000,
        greetingTimeout: 8000,
        socketTimeout: 8000,
    });
}

let transporter = null;

function getTransporter() {
    if (!transporter) {
        transporter = createMailTransporter();
    }
    return transporter;
}

async function sendViaResend(mailOptions) {
    const apiKey = String(process.env.RESEND_API_KEY || '').trim();
    if (!apiKey) {
        return { sent: false, reason: 'resend_not_configured' };
    }

    const from =
        process.env.RESEND_FROM ||
        process.env.EMAIL_FROM ||
        '"AI Trip Planner" <onboarding@resend.dev>';

    try {
        const res = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${apiKey}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                from,
                to: [mailOptions.to],
                subject: mailOptions.subject,
                ...(mailOptions.text ? { text: mailOptions.text } : {}),
                ...(mailOptions.html ? { html: mailOptions.html } : {}),
            }),
        });

        if (!res.ok) {
            const errBody = await res.text();
            console.error('Resend API error:', res.status, errBody);
            return { sent: false, reason: `resend_${res.status}` };
        }

        return { sent: true, provider: 'resend' };
    } catch (err) {
        console.error('Resend send failed:', err.message);
        return { sent: false, reason: err.message };
    }
}

function withTimeout(promise, ms, label = 'operation') {
    return Promise.race([
        promise,
        new Promise((_, reject) => {
            setTimeout(() => reject(new Error(`${label} timed out after ${ms}ms`)), ms);
        }),
    ]);
}

function buildSmtpPayload(mailOptions, defaultFrom) {
    const payload = {
        from: mailOptions.from || defaultFrom,
        to: mailOptions.to,
        subject: mailOptions.subject,
    };
    if (mailOptions.text) payload.text = mailOptions.text;
    if (mailOptions.html) payload.html = mailOptions.html;
    if (!payload.text && !payload.html) {
        payload.text = mailOptions.subject || '(no content)';
    }
    return payload;
}

/** Password reset OTP — plain text only so every inbox shows the code. */
async function sendPasswordResetOtp({ to, name, code }, options = {}) {
    const otp = String(code || '').replace(/\D/g, '');
    if (!/^\d{6}$/.test(otp)) {
        throw new Error(`Invalid OTP for email: "${code}"`);
    }

    const { user } = getEmailCredentials();
    const from = user
        ? `"AI Trip Planner" <${user}>`
        : process.env.RESEND_FROM || '"AI Trip Planner" <onboarding@resend.dev>';
    const greeting = name || 'there';
    const subject = `OTP ${otp} - AI Trip Planner password reset`;
    const text = [
        'AI Trip Planner - Password Reset',
        '',
        `Hello ${greeting},`,
        '',
        `YOUR OTP CODE: ${otp}`,
        '',
        `Your 6-digit verification code is: ${otp}`,
        '',
        'Enter this code on the Forgot Password page in the app.',
        'This code expires in 15 minutes.',
        '',
        'If you did not request a password reset, ignore this email.',
    ].join('\n');

    console.log(`[Password reset] Sending OTP ${otp} to ${to}`);

    const result = await sendMail(
        { from, to, subject, text },
        { timeoutMs: options.timeoutMs || 20000 }
    );

    if (result.sent) {
        console.log(`[Password reset] OTP ${otp} emailed to ${to} via ${result.provider || 'smtp'}`);
    }
    return { ...result, code: otp };
}

async function sendMail(mailOptions, options = {}) {
    const timeoutMs = Number(options.timeoutMs) || 10000;
    const { user, pass } = getEmailCredentials();
    const defaultFrom = user ? `"AI Trip Planner" <${user}>` : undefined;

    const smtp = getTransporter();
    if (smtp) {
        try {
            const info = await withTimeout(
                smtp.sendMail(buildSmtpPayload(mailOptions, defaultFrom)),
                timeoutMs,
                'SMTP send'
            );
            return { sent: true, provider: 'smtp', messageId: info.messageId };
        } catch (err) {
            console.error('SMTP send failed:', err.message);
            const resendResult = await withTimeout(
                sendViaResend(mailOptions),
                Math.min(timeoutMs, 8000),
                'Resend'
            ).catch((e) => ({ sent: false, reason: e.message }));
            if (resendResult.sent) return resendResult;
            return { sent: false, reason: err.message };
        }
    }

    const resendResult = await sendViaResend(mailOptions);
    if (resendResult.sent) return resendResult;

    return { sent: false, reason: 'email_not_configured' };
}

/** Send without blocking the HTTP request (logs result). */
function sendMailAsync(mailOptions, options = {}) {
    setImmediate(() => {
        sendMail(mailOptions, options)
            .then((r) => {
                if (r.sent) {
                    console.log(`📧 Email sent to ${mailOptions.to} via ${r.provider || 'smtp'}`);
                } else {
                    console.warn(`📧 Email not sent to ${mailOptions.to}:`, r.reason);
                }
            })
            .catch((err) => console.error('📧 Email async error:', err.message));
    });
}

async function verifyMailConfig() {
    const { user, pass } = getEmailCredentials();
    if (!user || !pass) {
        console.warn('⚠️ EMAIL_USER / EMAIL_PASSWORD not set in .env');
        return false;
    }
    const smtp = getTransporter();
    if (!smtp) {
        return false;
    }
    try {
        await smtp.verify();
        console.log(`✅ Email SMTP ready (${process.env.EMAIL_HOST || 'smtp.gmail.com'}:${process.env.EMAIL_PORT || 587})`);
        return true;
    } catch (err) {
        console.error('❌ Email SMTP error:', err.message);
        if (process.env.RESEND_API_KEY) {
            console.log('ℹ️ RESEND_API_KEY is set — password reset can use Resend API over HTTPS.');
        } else {
            console.log('ℹ️ SMTP blocked? Add RESEND_API_KEY to .env (free at resend.com) OR use the reset link shown on the website.');
        }
        return false;
    }
}

module.exports = {
    get transporter() {
        return getTransporter();
    },
    sendMail,
    sendPasswordResetOtp,
    sendMailAsync,
    createMailTransporter,
    verifyMailConfig,
    getEmailCredentials,
    resetTransporter: () => {
        transporter = null;
    },
};
