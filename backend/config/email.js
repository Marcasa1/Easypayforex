const nodemailer = require('nodemailer');
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: process.env.SMTP_PORT || 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});
const sendEmail = async ({ to, subject, html }) => {
  const info = await transporter.sendMail({
    from: `"EASYPAYFOREX" <${process.env.EMAIL_USER}>`,
    to, subject, html,
  });
  console.log(`📧 Email sent to ${to}`);
  return info;
};
module.exports = { sendEmail };
