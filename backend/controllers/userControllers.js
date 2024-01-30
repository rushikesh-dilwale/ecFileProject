const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const User = require('../models/user');

// Nodemailer Configuration
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'john.doe@example.com', // Replace with your email for sending verification emails
    pass: '2b$10$yuuzOu8vWPHnS1JyU30Vu.UoMf1Cm56R0abk9GwEkjTVbD3qZgYzS',  // Replace with your email password
  },
});

// Base URL for verification link
const baseURL = 'http://localhost:3001'; // Replace with your actual base URL

const sendVerificationEmail = async (email, verificationToken) => {
  // Email Content
  const mailOptions = {
    from: 'your_email@gmail.com',  // Replace with your email for sending verification emails
    to: email,
    subject: 'Email Verification',
    text: `Please verify your email by clicking on the link: ${baseURL}/verify/${verificationToken}`,
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

    // Generate Verification Token
    const verificationToken = crypto.randomBytes(20).toString('hex');

    // Save User to MongoDB with Verification Token
    const user = new User({
      name,
      email,
      mobile,
      password: hashedPassword,
      verificationToken,
      verified: false,
    });

    await user.save();

    // Send Verification Email
    await sendVerificationEmail(email, verificationToken);

    res.json({ message: 'User created successfully. Please check your email for verification.' });
  },

  verifyEmail: async (req, res) => {
    const { token } = req.params;

    // Find User in MongoDB and Update Verification Status
    const user = await User.findOne({ verificationToken: token });

    if (user) {
      user.verified = true;
      user.verificationToken = undefined; // Clear the token after verification
      await user.save();
      res.json({ message: 'Email verified successfully.' });
    } else {
      res.status(404).json({ error: 'Invalid or expired token.' });
    }
  },

  login: async (req, res) => {
    const { mobile, password } = req.body;

    // Check User Credentials (In production, validate against hashed password)
    const user = await User.findOne({ mobile });

    if (user && (await bcrypt.compare(password, user.password)) && user.verified) {
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
