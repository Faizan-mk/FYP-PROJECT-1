require('dotenv').config();
const { sendMail, verifyMailConfig, getEmailCredentials } = require('./utils/mailTransporter');

async function testEmailConfiguration() {
    console.log('Testing email configuration...\n');

    const { user, pass } = getEmailCredentials();
    console.log('EMAIL_USER:', user ? 'Set' : 'Not set');
    console.log('EMAIL_PASSWORD:', pass ? 'Set' : 'Not set');
    console.log('EMAIL_PORT:', process.env.EMAIL_PORT || '587 (default)');
    console.log('RESEND_API_KEY:', process.env.RESEND_API_KEY ? 'Set' : 'Not set');
    console.log('');

    if (!user || !pass) {
        console.error('Missing EMAIL_USER or EMAIL_PASSWORD in .env');
        return;
    }

    await verifyMailConfig();

    const result = await sendMail({
        to: user,
        subject: 'Test — AI Trip Planner password reset',
        html: `<p>If you received this, email is working. Time: ${new Date().toLocaleString()}</p>`,
    });

    if (result.sent) {
        console.log(`\nTest email sent via ${result.provider || 'smtp'}.`);
        if (result.messageId) console.log('Message ID:', result.messageId);
    } else {
        console.error('\nTest email failed:', result.reason);
        console.log('\nOptions:');
        console.log('1. Use the reset link button on the forgot-password page (development).');
        console.log('2. Add RESEND_API_KEY from https://resend.com (works when SMTP ports are blocked).');
        console.log('3. Try mobile hotspot if university WiFi blocks Gmail SMTP.');
    }
}

testEmailConfiguration();
