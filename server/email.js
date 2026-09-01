import mailService from './services/mailService.js';
import {
  templatePasswordResetOTP,
  templateRegistrationConfirmation,
  templateAccountNotification,
  templateFeePaymentNotification,
  templateAdmissionEnquiryConfirmation
} from './services/emailTemplates.js';

/**
 * Send Welcome / Registration Email
 */
export async function sendWelcomeEmail({ name, email, studentId }) {
  if (!email) return false;

  const html = templateRegistrationConfirmation({ name, email, studentId });
  const result = await mailService.sendEmail({
    to: email,
    subject: 'Welcome to Backbone Academy! 🎓',
    html
  });

  return result.success;
}

/**
 * Send Demo Class Booking Confirmation
 */
export async function sendDemoBookingEmail({ studentName, phone, course, timeSlot }) {
  const adminEmail = process.env.SMTP_USER;
  if (!adminEmail) return false;

  const html = templateAdmissionEnquiryConfirmation({ studentName, course, timeSlot, phone });
  const result = await mailService.sendEmail({
    to: adminEmail,
    subject: `🎉 New Demo Booking: ${studentName} - ${course}`,
    html
  });

  return result.success;
}

/**
 * Send Contact Notification
 */
export async function sendContactNotification({ name, email, phone, message }) {
  const adminEmail = process.env.SMTP_USER;
  if (!adminEmail) return false;

  const html = templateAccountNotification({
    name: 'Admin Desk',
    title: `New Inquiry from ${name}`,
    message: `
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email || 'N/A'}</p>
      <p><strong>Phone:</strong> ${phone || 'N/A'}</p>
      <p><strong>Message:</strong></p>
      <blockquote style="background: #FFF; padding: 12px; border-left: 3px solid #E63946;">${message}</blockquote>
    `
  });

  const result = await mailService.sendEmail({
    to: adminEmail,
    subject: `📩 New Website Inquiry from ${name}`,
    html
  });

  return result.success;
}

/**
 * Send Fee Payment Receipt Email
 */
export async function sendFeePaymentEmail({ email, studentName, receiptNo, totalAmount, paidAmount, pendingAmount, paymentStatus }) {
  if (!email) return false;

  const html = templateFeePaymentNotification({
    studentName,
    receiptNo,
    totalAmount,
    paidAmount,
    pendingAmount,
    paymentStatus
  });

  const result = await mailService.sendEmail({
    to: email,
    subject: `🧾 Fee Payment Receipt (${receiptNo || 'REC-2026'}) - Backbone Academy`,
    html
  });

  return result.success;
}
