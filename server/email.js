import mailService from './services/mailService.js';

export async function sendWelcomeEmail({ name, email }) {
  if (!email) return false;

  const html = `
    <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 8px; padding: 24px;">
      <h2 style="color: #E63946; margin-top: 0;">Welcome to Backbone Academy, ${name}!</h2>
      <p>Thank you for creating an account with Backbone Academy.</p>
      <p>We are dedicated to providing top-quality coaching for school academics (5th-10th), JNVST entrance prep, and computer courses (DCA/ADCA/Tally Prime).</p>
      <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
      <p style="font-size: 0.85rem; color: #666;">Backbone Academy | Opp. Mittal Residency, Pandra Ranchi | Helpline: +91 9304868696</p>
    </div>
  `;

  const result = await mailService.sendEmail({
    to: email,
    subject: 'Welcome to Backbone Academy! 🎓',
    html
  });

  return result.success;
}

export async function sendDemoBookingEmail({ studentName, phone, course, timeSlot }) {
  const adminEmail = process.env.SMTP_USER;
  if (!adminEmail) return false;

  const html = `
    <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6; max-width: 600px; margin: 0 auto; padding: 24px;">
      <h3 style="color: #E63946;">New 3-Day Free Demo Class Reserved</h3>
      <p><strong>Student Name:</strong> ${studentName}</p>
      <p><strong>Phone / WhatsApp:</strong> ${phone}</p>
      <p><strong>Course:</strong> ${course}</p>
      <p><strong>Preferred Time Slot:</strong> ${timeSlot}</p>
    </div>
  `;

  const result = await mailService.sendEmail({
    to: adminEmail,
    subject: `🎉 New Demo Booking: ${studentName} - ${course}`,
    html
  });

  return result.success;
}

export async function sendContactNotification({ name, email, phone, message }) {
  const adminEmail = process.env.SMTP_USER;
  if (!adminEmail) return false;

  const html = `
    <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6; max-width: 600px; margin: 0 auto; padding: 24px;">
      <h3 style="color: #E63946;">New Website Inquiry</h3>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email || 'N/A'}</p>
      <p><strong>Phone:</strong> ${phone || 'N/A'}</p>
      <p><strong>Message:</strong></p>
      <blockquote style="background: #f9f9f9; padding: 12px; border-left: 4px solid #E63946; margin: 0;">${message}</blockquote>
    </div>
  `;

  const result = await mailService.sendEmail({
    to: adminEmail,
    subject: `📩 New Contact Form Inquiry from ${name}`,
    html
  });

  return result.success;
}
