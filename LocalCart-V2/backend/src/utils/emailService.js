import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure .env is loaded
dotenv.config({ path: path.join(__dirname, '../../.env') });

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

/**
 * @desc    Send contact form message via email
 * @param   {Object} data - { name, email, message }
 */
export const sendContactEmail = async (data) => {
  const { name, email, message } = data;

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: 'govind43898@gmail.com', // Your target email
    subject: `New Contact Message from ${name}`,
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #ddd; border-radius: 10px; overflow: hidden;">
        <div style="background-color: #714B67; color: #fff; padding: 20px; text-align: center;">
          <h2 style="margin: 0;">New Contact Form Submission</h2>
        </div>
        <div style="padding: 20px;">
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Message:</strong></p>
          <div style="background-color: #f9f9f9; padding: 15px; border-left: 5px solid #714B67; border-radius: 5px;">
            ${message}
          </div>
          <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
          <p style="font-size: 12px; color: #777;">This message was sent from the LocalCart Marketplace contact form.</p>
        </div>
      </div>
    `
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('📧 Email notification sent:', info.messageId);
    return info;
  } catch (error) {
    console.error('❌ Error sending email notification:', error);
    // We don't throw here to avoid failing the whole request if email fails
    return null;
  }
};
