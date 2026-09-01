const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^[\d\s+\-()]{7,20}$/;

/**
 * Middleware: Validate User Registration Input
 */
export function validateRegister(req, res, next) {
  const { name, email, password } = req.body;

  if (!name || typeof name !== 'string' || name.trim().length < 2) {
    return res.status(400).json({
      success: false,
      message: 'Full Name is required and must be at least 2 characters.'
    });
  }

  if (!email || typeof email !== 'string' || !EMAIL_REGEX.test(email.trim())) {
    return res.status(400).json({
      success: false,
      message: 'A valid email address is required.'
    });
  }

  if (!password || typeof password !== 'string' || password.length < 6) {
    return res.status(400).json({
      success: false,
      message: 'Password must be at least 6 characters long.'
    });
  }

  // Clean inputs
  req.body.name = name.trim();
  req.body.email = email.trim().toLowerCase();
  next();
}

/**
 * Middleware: Validate User Login Input
 */
export function validateLogin(req, res, next) {
  const { email, password } = req.body;

  if (!email || typeof email !== 'string' || !EMAIL_REGEX.test(email.trim())) {
    return res.status(400).json({
      success: false,
      message: 'Please provide a valid email address.'
    });
  }

  if (!password || typeof password !== 'string' || password.length === 0) {
    return res.status(400).json({
      success: false,
      message: 'Password is required.'
    });
  }

  req.body.email = email.trim().toLowerCase();
  next();
}

/**
 * Middleware: Validate Demo Class Booking Input
 */
export function validateBooking(req, res, next) {
  const { studentName, phone, course, timeSlot } = req.body;

  if (!studentName || typeof studentName !== 'string' || studentName.trim().length < 2) {
    return res.status(400).json({
      success: false,
      message: 'Student Name is required and must be at least 2 characters.'
    });
  }

  if (!phone || typeof phone !== 'string' || !PHONE_REGEX.test(phone.trim())) {
    return res.status(400).json({
      success: false,
      message: 'Please provide a valid mobile or WhatsApp phone number.'
    });
  }

  req.body.studentName = studentName.trim();
  req.body.phone = phone.trim();
  req.body.course = (course && typeof course === 'string') ? course.trim() : 'Class 5th to 10th Academics';
  req.body.timeSlot = (timeSlot && typeof timeSlot === 'string') ? timeSlot.trim() : 'Morning (8:00 AM - 11:00 AM)';
  next();
}

/**
 * Middleware: Validate Student Review Input
 */
export function validateReview(req, res, next) {
  const { name, comment, rating, course } = req.body;

  if (!name || typeof name !== 'string' || name.trim().length < 2) {
    return res.status(400).json({
      success: false,
      message: 'Name is required and must be at least 2 characters.'
    });
  }

  if (!comment || typeof comment !== 'string' || comment.trim().length < 3) {
    return res.status(400).json({
      success: false,
      message: 'Feedback comment must be at least 3 characters long.'
    });
  }

  const numericRating = Number(rating);
  if (isNaN(numericRating) || numericRating < 1 || numericRating > 5) {
    return res.status(400).json({
      success: false,
      message: 'Rating must be a number between 1 and 5.'
    });
  }

  req.body.name = name.trim();
  req.body.comment = comment.trim();
  req.body.rating = numericRating;
  req.body.course = (course && typeof course === 'string') ? course.trim() : 'Class 5th to 10th Academics';
  next();
}

/**
 * Middleware: Validate Contact Form Submission Input
 */
export function validateContact(req, res, next) {
  const { name, email, phone, message } = req.body;

  if (!name || typeof name !== 'string' || name.trim().length < 2) {
    return res.status(400).json({
      success: false,
      message: 'Name is required and must be at least 2 characters.'
    });
  }

  if (!message || typeof message !== 'string' || message.trim().length < 5) {
    return res.status(400).json({
      success: false,
      message: 'Please write a message of at least 5 characters.'
    });
  }

  if (email && typeof email === 'string' && email.trim() && !EMAIL_REGEX.test(email.trim())) {
    return res.status(400).json({
      success: false,
      message: 'Please provide a valid email address.'
    });
  }

  if (phone && typeof phone === 'string' && phone.trim() && !PHONE_REGEX.test(phone.trim())) {
    return res.status(400).json({
      success: false,
      message: 'Please provide a valid phone number.'
    });
  }

  req.body.name = name.trim();
  req.body.email = email ? email.trim().toLowerCase() : '';
  req.body.phone = phone ? phone.trim() : '';
  req.body.message = message.trim();
  next();
}
