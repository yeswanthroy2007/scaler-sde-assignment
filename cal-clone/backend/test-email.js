const sgMail = require('@sendgrid/mail');
require('dotenv').config();

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

async function test() {
    const fromEmail = process.env.EMAIL_FROM || 'hello@calclone.com';
    console.log(`Using 'From' address: ${fromEmail}`);

    const msg = {
        to: 'test@example.com',
        from: fromEmail,
        subject: 'Test Email Diagnostic',
        text: 'This is a diagnostic test email.',
    };

    try {
        console.log('Sending test email...');
        await sgMail.send(msg);
        console.log('Email sent successfully!');
    } catch (error) {
        console.error('--- Error Details ---');
        if (error.response) {
            console.error(JSON.stringify(error.response.body, null, 2));
        } else {
            console.error(error);
        }
        console.error('----------------------');
    }
}

test();
