/**
 * Master Email Layout Wrapper for Backbone Academy
 */
function renderEmailBaseLayout({ title, contentHtml, securityNotice }) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${title}</title>
    </head>
    <body style="margin: 0; padding: 0; background-color: #F8FAFC; font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
      <table border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed; background-color: #F8FAFC; padding: 30px 10px;">
        <tr>
          <td align="center">
            <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; background-color: #FFFFFF; border-radius: 16px; overflow: hidden; border: 1px solid #E2E8F0; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);">
              
              <!-- Header Section -->
              <tr>
                <td align="center" style="background: linear-gradient(135deg, #1E293B 0%, #0F172A 100%); padding: 24px 30px; border-bottom: 3px solid #E63946;">
                  <h1 style="color: #FFFFFF; font-size: 22px; font-weight: 800; margin: 0; letter-spacing: 1px; text-transform: uppercase;">BACKBONE ACADEMY</h1>
                  <div style="color: #FFB703; font-size: 13px; font-weight: 700; font-style: italic; margin-top: 4px;">"Where Knowledge Becomes Strength"</div>
                </td>
              </tr>

              <!-- Body Content -->
              <tr>
                <td style="padding: 30px 32px; color: #334155; font-size: 15px; line-height: 1.6;">
                  ${contentHtml}
                </td>
              </tr>

              <!-- Security Notice Banner if applicable -->
              ${securityNotice ? `
              <tr>
                <td style="padding: 0 32px 24px 32px;">
                  <div style="background-color: #FFFBEB; border-left: 4px solid #F59E0B; padding: 12px 16px; border-radius: 6px; font-size: 13px; color: #92400E;">
                    <strong>🛡️ Security Notice:</strong> ${securityNotice}
                  </div>
                </td>
              </tr>
              ` : ''}

              <!-- Footer Section -->
              <tr>
                <td align="center" style="background-color: #F1F5F9; padding: 20px 30px; border-top: 1px solid #E2E8F0; color: #64748B; font-size: 12px; line-height: 1.5;">
                  <strong style="color: #334155;">Backbone Academy Management Desk</strong><br />
                  Opp. Mittal Residency, Near Pandra Market, Pandra Ranchi, Jharkhand<br />
                  Helpline: +91 9304868696 | Email: contact@backboneacademy.in
                </td>
              </tr>

            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;
}

/**
 * 1. Password Reset OTP Template
 */
export function templatePasswordResetOTP({ name, otp }) {
  const contentHtml = `
    <h2 style="color: #E63946; font-size: 20px; font-weight: 800; margin-top: 0;">Password Recovery OTP Code</h2>
    <p>Hello <strong>${name || 'Student'}</strong>,</p>
    <p>You recently requested to reset your password for your Backbone Academy account. Please use the following 6-digit One-Time Password (OTP) to proceed:</p>
    
    <div style="background-color: #F8FAFC; border: 2px dashed #E63946; border-radius: 12px; padding: 18px; text-align: center; margin: 24px 0;">
      <div style="font-size: 32px; font-weight: 900; letter-spacing: 8px; color: #E63946; font-family: monospace;">${otp}</div>
      <div style="font-size: 12px; color: #64748B; margin-top: 6px; font-weight: 600;">VALID FOR 10 MINUTES ONLY</div>
    </div>
    
    <p>Enter this OTP in the application to create a new password. If you did not initiate this request, please ignore this email or notify our support team immediately.</p>
  `;

  const securityNotice = "Never share your OTP with anyone. Backbone Academy staff will never ask for your password or OTP code.";

  return renderEmailBaseLayout({
    title: '🔑 Backbone Academy - Password Reset OTP Code',
    contentHtml,
    securityNotice
  });
}

/**
 * 2. Student Registration Confirmation Template
 */
export function templateRegistrationConfirmation({ name, email, studentId }) {
  const contentHtml = `
    <h2 style="color: #1E293B; font-size: 20px; font-weight: 800; margin-top: 0;">Welcome to Backbone Academy! 🎓</h2>
    <p>Dear <strong>${name}</strong>,</p>
    <p>Congratulations! Your account has been successfully created. We are excited to welcome you to the Backbone Academy community.</p>
    
    <div style="background-color: #F1F5F9; border-radius: 10px; padding: 16px 20px; margin: 20px 0;">
      <div style="font-size: 14px; margin-bottom: 8px;"><strong>Student Name:</strong> ${name}</div>
      <div style="font-size: 14px; margin-bottom: 8px;"><strong>Registered Email:</strong> ${email}</div>
      <div style="font-size: 14px;"><strong>Assigned Student ID:</strong> <span style="color: #E63946; font-weight: 800;">${studentId || 'STU-2026-N/A'}</span></div>
    </div>

    <p>You can now log in to your Student Portal to access your enrolled courses, homework assignments, class attendance, fee statements, and study materials.</p>
  `;

  return renderEmailBaseLayout({
    title: '🎓 Welcome to Backbone Academy',
    contentHtml
  });
}

/**
 * 3. Important Account / Announcement Notification Template
 */
export function templateAccountNotification({ name, title, message }) {
  const contentHtml = `
    <h2 style="color: #E63946; font-size: 20px; font-weight: 800; margin-top: 0;">${title}</h2>
    <p>Dear <strong>${name || 'Student'}</strong>,</p>
    <div style="background-color: #F8FAFC; border-left: 4px solid #1E293B; padding: 16px; margin: 18px 0; border-radius: 4px;">
      ${message}
    </div>
    <p>If you have any questions regarding this notification, please contact the academy administration desk.</p>
  `;

  return renderEmailBaseLayout({
    title: `📢 ${title} - Backbone Academy`,
    contentHtml
  });
}

/**
 * 4. Fee Payment Notification Template
 */
export function templateFeePaymentNotification({ studentName, receiptNo, totalAmount, paidAmount, pendingAmount, paymentStatus }) {
  const isFullyPaid = paymentStatus === 'PAID';
  const statusColor = isFullyPaid ? '#22C55E' : '#F59E0B';

  const contentHtml = `
    <h2 style="color: #1E293B; font-size: 20px; font-weight: 800; margin-top: 0;">Fee Payment Receipt & Statement 🧾</h2>
    <p>Dear <strong>${studentName}</strong>,</p>
    <p>We have recorded a fee payment update for your account. Below is your official receipt statement:</p>
    
    <table border="0" cellpadding="8" cellspacing="0" width="100%" style="border-collapse: collapse; background-color: #F8FAFC; border-radius: 8px; margin: 20px 0; font-size: 14px;">
      <tr style="border-bottom: 1px solid #E2E8F0;">
        <td><strong>Receipt Number:</strong></td>
        <td align="right" style="color: #E63946; font-weight: 700;">${receiptNo || 'REC-2026'}</td>
      </tr>
      <tr style="border-bottom: 1px solid #E2E8F0;">
        <td><strong>Total Agreed Fee:</strong></td>
        <td align="right">₹${Number(totalAmount).toLocaleString()}</td>
      </tr>
      <tr style="border-bottom: 1px solid #E2E8F0;">
        <td><strong>Amount Paid:</strong></td>
        <td align="right" style="color: #22C55E; font-weight: 800;">₹${Number(paidAmount).toLocaleString()}</td>
      </tr>
      <tr style="border-bottom: 1px solid #E2E8F0;">
        <td><strong>Balance Pending:</strong></td>
        <td align="right" style="color: #EF4444; font-weight: 800;">₹${Number(pendingAmount).toLocaleString()}</td>
      </tr>
      <tr>
        <td><strong>Payment Status:</strong></td>
        <td align="right"><span style="background-color: ${statusColor}; color: #FFFFFF; padding: 2px 8px; border-radius: 4px; font-size: 12px; font-weight: 800;">${paymentStatus}</span></td>
      </tr>
    </table>

    <p>Thank you for your prompt fee submission!</p>
  `;

  return renderEmailBaseLayout({
    title: '🧾 Fee Payment Receipt - Backbone Academy',
    contentHtml
  });
}

/**
 * 5. Admission Enquiry / Demo Booking Confirmation Template
 */
export function templateAdmissionEnquiryConfirmation({ studentName, course, timeSlot, phone }) {
  const contentHtml = `
    <h2 style="color: #E63946; font-size: 20px; font-weight: 800; margin-top: 0;">3-Day Free Demo Class Reserved! 🎉</h2>
    <p>Dear <strong>${studentName}</strong>,</p>
    <p>Thank you for booking a 3-Day Free Trial Demo Class at Backbone Academy. Your demo reservation details are as follows:</p>
    
    <div style="background-color: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 10px; padding: 18px; margin: 20px 0;">
      <div style="margin-bottom: 8px;"><strong>Student Name:</strong> ${studentName}</div>
      <div style="margin-bottom: 8px;"><strong>Selected Course:</strong> ${course}</div>
      <div style="margin-bottom: 8px;"><strong>Preferred Batch Slot:</strong> ${timeSlot}</div>
      <div><strong>Contact Number:</strong> ${phone}</div>
    </div>

    <p>Our counselor team will contact you shortly to confirm your batch start date at our Pandra Ranchi campus.</p>
  `;

  return renderEmailBaseLayout({
    title: '🎉 3-Day Free Demo Class Confirmation - Backbone Academy',
    contentHtml
  });
}

export default {
  templatePasswordResetOTP,
  templateRegistrationConfirmation,
  templateAccountNotification,
  templateFeePaymentNotification,
  templateAdmissionEnquiryConfirmation
};
