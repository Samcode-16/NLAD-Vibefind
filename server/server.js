require('dotenv').config();
const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Basic health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Send feedback endpoint
app.post('/send-feedback', async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Create transporter using SMTP credentials from .env
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: Number(process.env.SMTP_PORT) || 465,
      secure: process.env.SMTP_SECURE !== 'false', // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const toAddress = process.env.FEEDBACK_TO || 'artappreciating@gmail.com';

    const mailOptions = {
      from: `VibeFind Contact Form <${process.env.SMTP_USER}>`,
      to: toAddress,
      subject: subject || `New feedback from ${name}`,
      text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
      html: `<p><strong>Name:</strong> ${name}</p><p><strong>Email:</strong> ${email}</p><hr/><p>${message.replace(/\n/g, '<br/>')}</p>`,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Feedback email sent:', info.messageId);

    res.json({ ok: true, messageId: info.messageId });
  } catch (err) {
    console.error('Error sending feedback email', err);
    res.status(500).json({ error: 'Failed to send feedback' });
  }
});

app.listen(PORT, () => {
  console.log(`Feedback server listening on port ${PORT}`);
});
