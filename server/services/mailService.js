import nodemailer from 'nodemailer';
import 'dotenv/config';

/**
 * Check if SMTP credentials are configured in environment variables
 */
export function isSmtpConfigured() {
  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASSWORD;
  return Boolean(host && host.trim() && user && user.trim() && pass && pass.trim());
}

/**
 * Create a reusable Nodemailer SMTP Transporter from environment variables
 */
export function getTransporter() {
  if (!isSmtpConfigured()) {
    return null;
  }

  const port = Number(process.env.SMTP_PORT) || 587;
  const secure = process.env.SMTP_SECURE === 'true' || port === 465;

  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port,
    secure,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD
    }
  });
}

/**
 * Verify SMTP connection safely without exposing credentials
 */
export async function verifySMTPConnection() {
  const transporter = getTransporter();
  if (!transporter) {
    return {
      success: false,
      configured: false,
      message: 'SMTP credentials (SMTP_HOST, SMTP_USER, SMTP_PASSWORD) are not fully configured in .env'
    };
  }

  try {
    await transporter.verify();
    return {
      success: true,
      configured: true,
      message: 'SMTP Transporter connected and verified successfully!'
    };
  } catch (error) {
    // Mask sensitive details and report safe message
    const safeError = error.message.replace(process.env.SMTP_PASSWORD || '', '***');
    return {
      success: false,
      configured: true,
      error: safeError,
      message: `Failed to connect to SMTP server: ${safeError}`
    };
  }
}

/**
 * Reusable function to send emails safely
 */
export async function sendEmail({ to, subject, html, text }) {
  if (!to) {
    return { success: false, error: 'Recipient address (to) is required.' };
  }

  const transporter = getTransporter();
  if (!transporter) {
    console.log(`✉️  [Mail Service] SMTP not configured. Email queued/skipped for: ${to}`);
    return { success: false, message: 'SMTP not configured in environment.' };
  }

  try {
    const fromAddress = process.env.SMTP_FROM || 'Backbone Academy <noreply@backboneacademy.in>';
    const info = await transporter.sendMail({
      from: fromAddress,
      to,
      subject,
      html,
      text: text || html.replace(/<[^>]*>?/gm, '')
    });

    console.log(`✅ [Mail Service] Email sent successfully to: ${to} (MessageId: ${info.messageId})`);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    const safeError = error.message.replace(process.env.SMTP_PASSWORD || '', '***');
    console.error(`❌ [Mail Service] Failed to send email to ${to}:`, safeError);
    return { success: false, error: safeError };
  }
}

export default {
  isSmtpConfigured,
  getTransporter,
  verifySMTPConnection,
  sendEmail
};
