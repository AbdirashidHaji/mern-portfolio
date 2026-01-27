import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

export const sendContactEmail = async ({ name, email, subject, message }) => {
  try {
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