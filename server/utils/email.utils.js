const nodemailer = require('nodemailer');
const dotenv = require('dotenv');

dotenv.config();

/**
 * Create a nodemailer transporter
 * First tries to use Gmail configuration, then falls back to a mock transporter
 * @returns {object} - Nodemailer transporter (real or mock)
 */
const createTransporter = () => {
  // Check if Gmail credentials are available
  if (process.env.EMAIL_USERNAME && process.env.EMAIL_PASSWORD) {
    console.log('Using Gmail transporter for sending emails');

    // Create Gmail transporter
    return nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD
      }
    });
  }

  // If no email configuration, create a mock transporter that just logs emails
  console.log('Email not configured. Using mock email transport that logs emails instead of sending them.');

  // Create a mock transporter that logs emails instead of sending them
  return {
    sendMail: (mailOptions) => {
      return new Promise((resolve) => {
        console.log('\n========== MOCK EMAIL ==========');
        console.log(`From: ${mailOptions.from}`);
        console.log(`To: ${mailOptions.to}`);
        console.log(`Subject: ${mailOptions.subject}`);
        console.log('Body:');
        console.log(mailOptions.html || mailOptions.text || '(empty body)');
        console.log('================================\n');

        // Simulate successful email sending
        resolve({
          messageId: `mock-email-${Date.now()}`,
          envelope: {
            from: mailOptions.from,
            to: [mailOptions.to]
          }
        });
      });
    }
  };
};

/**
 * Send an email
 * @param {Object} options - Email options
 * @param {String} options.to - Recipient email
 * @param {String} options.subject - Email subject
 * @param {String} options.text - Plain text content
 * @param {String} options.html - HTML content
 * @returns {Promise} - Promise that resolves when email is sent
 */
const sendEmail = async (options) => {
  try {
    // Skip if recipient email is missing
    if (!options.to) {
      console.log('Email sending skipped: Recipient email is missing');
      return { success: false };
    }

    const transporter = createTransporter();

    const fromName = process.env.EMAIL_FROM_NAME || "HackMap";
    const fromEmail = process.env.EMAIL_USERNAME || "noreply@hackmap.app";

    const mailOptions = {
      from: `"${fromName}" <${fromEmail}>`,
      to: options.to,
      subject: options.subject,
      text: options.text,
      html: options.html || options.text
    };

    console.log('Sending email to:', options.to);

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending email:', error);
    return { success: false, error };
  }
};

/**
 * Send a team invitation email
 * @param {string} to - Recipient email address
 * @param {string} inviterName - Name of the person who sent the invitation
 * @param {string} teamName - Name of the team
 * @returns {Promise<boolean>} - True if email was sent or logged successfully
 */
const sendTeamInviteEmail = async (to, inviterName, teamName) => {
  const subject = `You've been invited to join ${teamName} on HackMap`;
  const text = `Hello,\n\n${inviterName} has invited you to join their team ${teamName} on HackMap.\n\nLog in to your HackMap account and check your notifications to accept or decline this invitation.\n\nThanks,\nThe HackMap Team`;

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Team Invitation</title>
    </head>
    <body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; background-color: #f9f9f9; margin: 0; padding: 0;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); margin-top: 40px; margin-bottom: 40px;">
        <!-- Header -->
        <div style="background-color: #3b82f6; padding: 20px; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 24px;">Team Invitation</h1>
        </div>

        <!-- Content -->
        <div style="padding: 30px;">
          <p style="margin-top: 0;">Hello,</p>
          <p><strong>${inviterName}</strong> has invited you to join their team <strong>${teamName}</strong> on HackMap.</p>
          <p>Log in to your HackMap account and check your notifications to accept or decline this invitation.</p>
          <p style="margin-bottom: 0;">Thanks,<br>The HackMap Team</p>
        </div>

        <!-- Footer -->
        <div style="background-color: #f5f5f5; padding: 20px; text-align: center; font-size: 12px; color: #666;">
          <p>&copy; ${new Date().getFullYear()} HackMap. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  const result = await sendEmail({ to, subject, text, html });
  return result.success;
};

module.exports = {
  sendTeamInviteEmail
};
