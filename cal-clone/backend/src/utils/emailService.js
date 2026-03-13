const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const formatDate = (date) => new Date(date).toLocaleDateString();
const formatTime = (date) => new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

exports.sendBookingConfirmation = async (email, details) => {
    if (!process.env.SENDGRID_API_KEY) return;
    const msg = {
        to: email,
        from: process.env.EMAIL_FROM || 'hello@calclone.com',
        subject: `Booking Confirmed: ${details.title}`,
        text: `Your booking for ${details.title} with ${details.bookerName} is confirmed for ${formatDate(details.startTime)} at ${formatTime(details.startTime)} (${details.duration} mins).`,
        html: `<strong>Your booking for ${details.title} with ${details.bookerName} is confirmed for ${formatDate(details.startTime)} at ${formatTime(details.startTime)} (${details.duration} mins).</strong>`,
    };
    try {
        await sgMail.send(msg);
    } catch (error) {
        console.error('Error sending confirmation email:', error);
    }
};

exports.sendCancellationEmail = async (email, details) => {
    if (!process.env.SENDGRID_API_KEY) return;
    const msg = {
        to: email,
        from: process.env.EMAIL_FROM || 'hello@calclone.com',
        subject: `Booking Cancelled: ${details.title}`,
        text: `Your booking for ${details.title} on ${formatDate(details.startTime)} at ${formatTime(details.startTime)} has been cancelled.`,
        html: `<strong>Your booking for ${details.title} on ${formatDate(details.startTime)} at ${formatTime(details.startTime)} has been cancelled.</strong>`,
    };
    try {
        await sgMail.send(msg);
    } catch (error) {
        console.error('Error sending cancellation email:', error);
    }
};

exports.sendRescheduleEmail = async (email, details) => {
    if (!process.env.SENDGRID_API_KEY) return;
    const msg = {
        to: email,
        from: process.env.EMAIL_FROM || 'hello@calclone.com',
        subject: `Booking Rescheduled: ${details.title}`,
        text: `Your booking for ${details.title} has been rescheduled to ${formatDate(details.startTime)} at ${formatTime(details.startTime)}.`,
        html: `<strong>Your booking for ${details.title} has been rescheduled to ${formatDate(details.startTime)} at ${formatTime(details.startTime)}.</strong>`,
    };
    try {
        await sgMail.send(msg);
    } catch (error) {
        console.error('Error sending reschedule email:', error);
    }
};
