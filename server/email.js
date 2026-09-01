import nodemailer from 'nodemailer';
import 'dotenv/config';

// Helper: Check if SMTP is fully configured in environment
function isSmtpConfigured() {
  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASSWORD;
  return Boolean(host && host.trim() && user && user.trim() && pass && pass.trim());
}

// Create Nodemailer Transporter if configured
function getTransporter() {
  if (!isSmtpConfigured()) {
    return null;
  }

  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: Number(process.env.SMTP_PORT) === 465, // true for 465, false for 587/other ports
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD
    }
  });
}

/**
 * Send Welcome Email to newly registered student
 */
export async function sendWelcomeEmail({ name, email }) {
  if (!email) return false;

  const transporter = getTransporter();
  if (!transporter) {
    console.log(`✉️  [Email Module] SMTP not configured. Welcome email queued/skipped for: ${email}`);
    return false;
  }

  try {
    const fromAddress = process.env.SMTP_FROM || 'Backbone Academy <noreply@backboneacademy.in>';
    await transporter.sendMail({
      from: fromAddress,
      to: email,
      subject: 'Welcome to Backbone Academy! 🎓',
      html: `
        <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 8px; padding: 24px;">
          <h2 style="color: #E63946; margin-top: 0;">Welcome to Backbone Academy, ${name}!</h2>
          <p>Thank you for creating an account with Backbone Academy.</p>
          <p>We are dedicated to providing top-quality coaching for school academics (5th-10th), JNVST entrance prep, and computer courses (DCA/ADCA/Tally Prime).</p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
          <p style="font-size: 0.85rem; color: #666;">Backbone Academy | Opp. Mittal Residency, Pandra Ranchi | Helpline: +91 9304868696</p>
        </div>
      `
    });
    console.log(`✅ [Email Module] Welcome email successfully sent to: ${email}`);
    return true;
  } catch (error) {
    console.error(`❌ [Email Module] Failed to send welcome email to ${email}:`, error.message);
    return false;
  }
}

/**
 * Send Demo Class Booking Confirmation Email / Admin Alert
 */
export async function sendDemoBookingEmail({ studentName, phone, course, timeSlot }) {
  const transporter = getTransporter();
  if (!transporter) {
    console.log(`✉️  [Email Module] SMTP not configured. Demo booking email notification skipped for: ${studentName} (${phone})`);
    return false;
  }

  try {
    const fromAddress = process.env.SMTP_FROM || 'Backbone Academy <noreply@backboneacademy.in>';
    await transporter.sendMail({
      from: fromAddress,
      to: process.env.SMTP_USER, // Send alert to admin email
      subject: `🎉 New Demo Booking: ${studentName} - ${course}`,
      html: `
        <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6; max-width: 600px; margin: 0 auto; padding: 24px;">
          <h3 style="color: #E63946;">New 3-Day Free Demo Class Reserved</h3>
          <p><strong>Student Name:</strong> ${studentName}</p>
          <p><strong>Phone / WhatsApp:</strong> ${phone}</p>
          <p><strong>Course:</strong> ${course}</p>
          <p><strong>Preferred Time Slot:</strong> ${timeSlot}</p>
        </div>
      `
    });
    console.log(`✅ [Email Module] Demo booking notification sent for ${studentName}`);
    return true;
  } catch (error) {
    console.error(`❌ [Email Module] Failed to send demo booking email:`, error.message);
    return false;
  }
}

/**
 * Send Contact Form Submission Notification
 */
export async function sendContactNotification({ name, email, phone, message }) {
  const transporter = getTransporter();
  if (!transporter) {
    console.log(`✉️  [Email Module] SMTP not configured. Contact submission email notification skipped for: ${name}`);
    return false;
  }

  try {
    const fromAddress = process.env.SMTP_FROM || 'Backbone Academy <noreply@backboneacademy.in>';
    await transporter.sendMail({
      from: fromAddress,
      to: process.env.SMTP_USER,
      subject: `📩 New Contact Form Inquiry from ${name}`,
      html: `
        <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6; max-width: 600px; margin: 0 auto; padding: 24px;">
          <h3 style="color: #E63946;">New Website Inquiry</h3>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email || 'N/A'}</p>
          <p><strong>Phone:</strong> ${phone || 'N/A'}</p>
          <p><strong>Message:</strong></p>
          <blockquote style="background: #f9f9f9; padding: 12px; border-left: 4px solid #E63946; margin: 0;">${message}</blockquote>
        </div>
      `
    });
    console.log(`✅ [Email Module] Contact notification sent for ${name}`);
    return true;
  } catch (error) {
    console.error(`❌ [Email Module] Failed to send contact notification:`, error.message);
    return false;
  }
}
