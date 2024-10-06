import nodemailer from 'nodemailer';
import config from '../config';

export const sendEmail = async (to: string, resetUILink: string) => {
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com.',
    port: 587,
    secure: config.NODE_ENV === 'production',
    auth: {
      // TODO: replace `user` and `pass` values from <https://forwardemail.net>
      user: 'nirjhor.saha06@gmail.com',
      pass: 'ttzy acfd lsox trew',
    },
  });

  await transporter.sendMail({
    from: 'nirjhor.saha06@gmail.com', // sender address
    to, // list of receivers
    subject: 'Reset your password within 10 mins!', // Subject line
    text: 'You requested a password reset. Please click the link to reset password', // plain text body
    html: `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
      <h3>Hi there,</h3>
      <p>You requested a password reset. Click the link below to reset your password:</p>
      <a href="${resetUILink}" style="background-color: #4CAF50; color: white; padding: 10px 15px; text-decoration: none; border-radius: 5px;">Reset Password</a>
      <p>If you didn't request a password reset, please ignore this email.</p>
      <p>Best regards,<br>Garden Glimpse Team</p>
    </div>
  `, // html body
  });
};