// backend/controllers/userController.js
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const User = require('../models/user');

const sendVerificationEmail = async (email) => {
  // Nodemailer Configuration (replace with your email service credentials)
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'rushidilwale19@gmail.com',
      pass: 'rushikesh',
    },
  });

  // Email Content
  const mailOptions = {
    from: 'your-email@gmail.com',
    to: email,
    subject: 'Email Verification',
    text: 'Please verify your email by clicking on the link: http://localhost:3001/verify',
  };

  // Send Email
  await transporter.sendMail(mailOptions);
};

const userController = {
  signup: async (req, res) => {
    const { name, email, mobile, password } = req.body;

    // Validate Mobile Number
    const isValidMobile = /^[6-9]\d{9}$/.test(mobile);

    // Validate Email
    const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    if (!isValidMobile || !isValidEmail) {
      return res.status(400).json({ error: 'Invalid Mobile Number or Email' });
    }

    // Hash Password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Save User to MongoDB
    const user = new User({
      name,
      email,
      mobile,
      password: hashedPassword,
      file: req.file.filename,
      verified: false,
    });

    await user.save();

    // Send Verification Email
    await sendVerificationEmail(email);

    res.json({ message: 'User created successfully. Please check your email for verification.' });
  },

  verifyEmail: async (req, res) => {
    // Find User in MongoDB and Update Verification Status
    const user = await User.findOne({ email: req.body.email });
    if (user) {
      user.verified = true;
      await user.save();
      res.json({ message: 'Email verified successfully.' });
    } else {
      res.status(404).json({ error: 'User not found.' });
    }
  },

  login: async (req, res) => {
    const { mobile, password } = req.body;

    // Check User Credentials (In production, validate against hashed password)
    const user = await User.findOne({ mobile });

    if (user && bcrypt.compareSync(password, user.password) && user.verified) {
      res.json({ message: 'Login successful' });
    } else {
      res.status(401).json({ error: 'Invalid credentials or email not verified' });
    }
  },

  getAllUsers: async (req, res) => {
    try {
      const allUsers = await User.find();
      res.json(allUsers);
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },
};

module.exports = userController;
