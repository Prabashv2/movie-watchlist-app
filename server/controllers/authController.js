const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');

// ============================================
// REGISTER NEW USER
// ============================================
exports.register = async (req, res) => {
  try {
    // 1. Get data from request body
    const { username, email, password } = req.body;

    // 2. Validate input (basic check)
    if (!username || !email || !password) {
      return res.status(400).json({ 
        message: 'Please provide username, email, and password' 
      });
    }

    // 3. Check if user already exists
    const [existingUsers] = await db.query(
      'SELECT * FROM users WHERE email = ?', 
      [email]
    );

    if (existingUsers.length > 0) {
      return res.status(400).json({ 
        message: 'User with this email already exists' 
      });
    }

    // 4. Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 5. Insert user into database
    const [result] = await db.query(
      'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
      [username, email, hashedPassword]
    );

    // 6. Create JWT token
    const token = jwt.sign(
      { id: result.insertId },           // Payload (user ID)
      process.env.JWT_SECRET,            // Secret key
      { expiresIn: '30d' }               // Token expires in 30 days
    );

    // 7. Send response
    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      token,
      user: {
        id: result.insertId,
        username,
        email
      }
    });

  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ 
      message: 'Server error during registration', 
      error: error.message 
    });
  }
};

// ============================================
// LOGIN EXISTING USER
// ============================================
exports.login = async (req, res) => {
  try {
    // 1. Get credentials from request
    const { email, password } = req.body;

    // 2. Validate input
    if (!email || !password) {
      return res.status(400).json({ 
        message: 'Please provide email and password' 
      });
    }

    // 3. Find user by email
    const [users] = await db.query(
      'SELECT * FROM users WHERE email = ?', 
      [email]
    );

    // 4. Check if user exists
    if (users.length === 0) {
      return res.status(400).json({ 
        message: 'Invalid email or password' 
      });
    }

    const user = users[0];

    // 5. Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ 
        message: 'Invalid email or password' 
      });
    }

    // 6. Create JWT token
    const token = jwt.sign(
      { id: user.id },
      process.env.JWT_SECRET,
      { expiresIn: '30d' }
    );

    // 7. Send response
    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      message: 'Server error during login', 
      error: error.message 
    });
  }
};