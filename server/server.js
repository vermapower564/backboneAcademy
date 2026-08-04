import express from 'express';
import cors from 'cors';
import { readDB, writeDB, initDB } from './db.js';

const app = express();
const PORT = process.env.PORT || 5000;

// Initialize Database File
initDB();

// Middleware
app.use(cors());
app.use(express.json());

// API Health Check Endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Backbone Academy Backend API Server is running smoothly!' });
});

// 🔐 Authentication: User Registration API
app.post('/api/auth/register', (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ success: false, message: 'Please fill in all fields (Name, Email, Password).' });
  }

  const db = readDB();
  const existingUser = db.users.find(u => u.email.toLowerCase() === email.toLowerCase());

  if (existingUser) {
    return res.status(400).json({ success: false, message: 'An account with this email already exists!' });
  }

  const newUser = {
    id: Date.now(),
    name,
    email,
    password, // In production, hash with bcrypt
    createdAt: new Date().toISOString()
  };

  db.users.push(newUser);
  writeDB(db);

  res.json({
    success: true,
    message: 'Account created successfully!',
    user: { id: newUser.id, name: newUser.name, email: newUser.email }
  });
});

// 🔐 Authentication: User Login API
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Email and password are required.' });
  }

  const db = readDB();
  const user = db.users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);

  if (!user) {
    return res.status(401).json({ success: false, message: 'Invalid email or password.' });
  }

  res.json({
    success: true,
    message: `Welcome back, ${user.name}!`,
    user: { id: user.id, name: user.name, email: user.email }
  });
});

// 🎁 3 Free Demo Classes Booking API (POST)
app.post('/api/demo-booking', (req, res) => {
  const { studentName, phone, course, timeSlot } = req.body;
  if (!studentName || !phone) {
    return res.status(400).json({ success: false, message: 'Student Name and Phone number are required.' });
  }

  const db = readDB();
  const newBooking = {
    id: Date.now(),
    studentName,
    phone,
    course: course || 'Class 5th to 10th Academics',
    timeSlot: timeSlot || 'Morning (8:00 AM - 11:00 AM)',
    bookedAt: new Date().toISOString()
  };

  db.demoBookings.push(newBooking);
  writeDB(db);

  res.json({
    success: true,
    message: '3 Free Demo Classes reserved successfully! Our team will contact you shortly.',
    booking: newBooking
  });
});

// 🎁 Get All Demo Bookings (GET)
app.get('/api/demo-bookings', (req, res) => {
  const db = readDB();
  res.json({ success: true, count: db.demoBookings.length, bookings: db.demoBookings });
});

// ⭐ Student Reviews API (GET)
app.get('/api/reviews', (req, res) => {
  const db = readDB();
  res.json({ success: true, reviews: db.reviews });
});

// ⭐ Student Reviews API (POST)
app.post('/api/reviews', (req, res) => {
  const { name, course, rating, comment } = req.body;
  if (!name || !comment) {
    return res.status(400).json({ success: false, message: 'Name and feedback comment are required.' });
  }

  const db = readDB();
  const newReview = {
    id: Date.now(),
    name,
    course: course || 'Class 5th to 10th Academics',
    rating: Number(rating) || 5,
    date: 'Just now',
    comment
  };

  db.reviews.unshift(newReview); // Add to top
  writeDB(db);

  res.json({
    success: true,
    message: 'Thank you for your feedback!',
    review: newReview
  });
});

// 📞 Contact Form Submission API (POST)
app.post('/api/contact', (req, res) => {
  const { name, email, phone, message } = req.body;
  const db = readDB();

  const newContact = {
    id: Date.now(),
    name,
    email,
    phone,
    message,
    receivedAt: new Date().toISOString()
  };

  db.contacts.push(newContact);
  writeDB(db);

  res.json({ success: true, message: 'Your message has been received by Backbone Academy!' });
});

// Start Express Server
app.listen(PORT, () => {
  console.log(`🚀 Backbone Academy Backend API Server listening on port ${PORT}`);
});
