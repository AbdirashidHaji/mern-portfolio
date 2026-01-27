import { sendContactEmail } from '../utils/email.js';
import validator from 'validator';

export const sendContact = async (req, res, next) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      return res.status(400).json({
        success: false,
        error: 'All fields are required'
      });
    }

    if (!validator.isEmail(email)) {
      return res.status(400).json({
        success: false,
        error: 'Please provide a valid email address'
      });
    }

    if (message.length < 10) {
      return res.status(400).json({
        success: false,
        error: 'Message must be at least 10 characters long'
      });
    }

    await sendContactEmail({
      name: validator.escape(name),
      email,
      subject: validator.escape(subject),
      message: validator.escape(message)
    });

    res.status(200).json({
      success: true,
      message: 'Email sent successfully! Thank you for your message.'
    });
  } catch (error) {
    next(error);
  }
};