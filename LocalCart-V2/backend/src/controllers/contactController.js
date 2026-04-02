import Message from '../models/Message.js';
import { sendContactEmail } from '../utils/emailService.js';

/**
 * @desc    Submit a contact message
 * @route   POST /api/contact-us
 * @access  Public
 */
export const submitMessage = async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const newMessage = await Message.create({
      name,
      email,
      message
    });

    // NOTIFICATION LOGIC
    console.log('\n' + '='.repeat(50));
    console.log('🔔 NOTIFICATION: New Contact Form Message!');
    console.log(`From: ${name} (${email})`);
    console.log(`Message: ${message}`);
    console.log('='.repeat(50) + '\n');

    // SEND EMAIL NOTIFICATION
    await sendContactEmail({ name, email, message });

    res.status(201).json({
      success: true,
      message: 'Message sent successfully!',
      data: newMessage
    });
  } catch (error) {
    console.error('Error submitting message:', error);
    res.status(500).json({ message: 'Server error, please try again later' });
  }
};
