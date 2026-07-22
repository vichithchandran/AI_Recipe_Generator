import nodemailer from 'nodemailer';
import { env } from '../config/env.js';

/**
 * Sends an email using Nodemailer.
 * If SMTP environment variables are not fully configured or sending fails in dev mode,
 * logs the details to console and returns success so dev flow is preserved.
 */
export const sendEmail = async (options) => {
  const { to, subject, html, text } = options;

  if (env.SMTP_HOST && env.SMTP_USER && env.SMTP_PASS) {
    try {
      const transporter = nodemailer.createTransport({
        host: env.SMTP_HOST,
        port: Number(env.SMTP_PORT) || 587,
        secure: Number(env.SMTP_PORT) === 465, // true for 465, false for other ports
        auth: {
          user: env.SMTP_USER,
          pass: env.SMTP_PASS,
        },
      });

      const mailOptions = {
        from: `"${env.FROM_NAME}" <${env.FROM_EMAIL || env.SMTP_USER}>`,
        to,
        subject,
        text,
        html,
      };

      const info = await transporter.sendMail(mailOptions);
      console.log(`📧 Email sent successfully to ${to}. MessageId: ${info.messageId}`);
      return { success: true, messageId: info.messageId };
    } catch (error) {
      console.error('❌ SMTP Email Delivery Failed:', error.message);
      console.log('--- EMAIL CONTENT (DEV FALLBACK) ---');
      console.log(`To: ${to}`);
      console.log(`Subject: ${subject}`);
      console.log(`Body: ${text || html}`);
      console.log('------------------------------------');
      return { success: true, fallback: true, error: error.message };
    }
  } else {
    console.log('⚠️ SMTP variables not configured. Printing email to console (DEV MODE):');
    console.log('----------------------------------------------------');
    console.log(`TO: ${to}`);
    console.log(`SUBJECT: ${subject}`);
    console.log(`CONTENT:\n${text || html}`);
    console.log('----------------------------------------------------');
    return { success: true, fallback: true };
  }
};
