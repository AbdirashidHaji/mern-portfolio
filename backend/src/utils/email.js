import nodemailer from 'nodemailer'; // Email utility
import dotenv from 'dotenv';

dotenv.config();

// Validate required environment variables
const requiredEnvVars = ['SMTP_HOST', 'SMTP_PORT', 'SMTP_USER', 'SMTP_PASS', 'EMAIL_FROM', 'ADMIN_EMAIL'];
const missingVars = requiredEnvVars.filter(varName => !process.env[varName]?.trim());

if (missingVars.length > 0) {
  console.error('❌ Missing email environment variables:', missingVars.join(', '));
}

let transporter;
try {
  // Sanitize environment variables to remove hidden chars like \r\n
  const smtpHost = process.env.SMTP_HOST?.trim();
  const smtpPort = process.env.SMTP_PORT?.trim();
  const smtpUser = process.env.SMTP_USER?.trim();
  const smtpPass = process.env.SMTP_PASS?.trim();

  transporter = nodemailer.createTransport({
    host: smtpHost,
    port: smtpPort,
    secure: false, // true for 465, false for other ports
    auth: {
      user: smtpUser,
      pass: smtpPass
    }
  });

  console.log(`✅ Email transporter initialized with host: '${smtpHost}'`);
} catch (error) {
  console.error('❌ Failed to create email transporter:', error.message);
}

export const sendContactEmail = async ({ name, email, subject, message }) => {
  try {
    // Check if email is configured
    if (!transporter) {
      throw new Error('Email service is not configured. Please contact the administrator.');
    }

    // Email to admin
    const adminMailOptions = {
      from: `"${name}" <${process.env.EMAIL_FROM}>`,
      to: process.env.ADMIN_EMAIL,
      replyTo: email,
      subject: `Portfolio Contact: ${subject}`,
      html: `
        <div style="font-family: Arial, sans-serif;">
          <h2>New Contact Form Submission</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Subject:</strong> ${subject}</p>
          <p><strong>Message:</strong></p>
          <p>${message.replace(/\n/g, '<br>')}</p>
        </div>
      `
    };

    // Auto-reply to sender
    const autoReplyOptions = {
      from: `"Abdirashid Mohamed Haji" <${process.env.EMAIL_FROM}>`,
      to: email,
      subject: 'Thank you for contacting me!',
      html: `
        <div style="font-family: Arial, sans-serif;">
          <h2>Thank You for Your Message!</h2>
          <p>Dear ${name},</p>
          <p>I have received your message and will get back to you as soon as possible.</p>
          <p>Best regards,<br>Abdirashid Mohamed Haji<br>Full Stack Developer</p>
        </div>
      `
    };

    await transporter.sendMail(adminMailOptions);
    await transporter.sendMail(autoReplyOptions);

    return { success: true };
  } catch (error) {
    console.error('Email sending error:', error);
    throw new Error('Failed to send email');
  }
};