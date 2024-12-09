
const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const bodyParser = require('body-parser');
const session = require('express-session');
const cors = require('cors'); // Import CORS
require('dotenv').config();
require('./passport/passport'); // Import Passport configuration

const app = express();

// Middleware
app.use(cors({
  origin: 'https://subtle-pika-97a962.netlify.app/', // Allow requests from Angular app
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Specify allowed HTTP methods
  credentials: true, // If using cookies or credentials
}));
app.options('*', cors()); // Handle preflight requests
app.use(bodyParser.json());

// Session configuration should come before passport.session()
app.use(session({
    secret: process.env.SESSION_SECRET || '426f8dfd407ce94bcf0b069dcb55ac8efa56d0ae5aa18080e03cc901533903e9',
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false, // Use true if HTTPS is enabled
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000 // Session duration: 1 day
    }
  }));
  
// Initialize Passport
app.use(passport.initialize());
app.use(passport.session()); // Passport session should be initialized after session middleware

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Facebook Token Authentication Route
app.post('/auth/facebook/token',
  passport.authenticate('facebook-token', { session: true }), // Ensure session is true
  (req, res) => {
    if (req.user) {
      res.status(200).json({
        message: 'Login successful',
        user: req.user,
      });
    } else {
      res.status(401).json({ message: 'Unauthorized' });
    }
  }
);

// Facebook Token Authentication Route
app.post('/auth/facebook/token',
    passport.authenticate('facebook-token', { session: true }), // Make sure session is true
    (req, res) => {
      if (req.user) {
        res.status(200).json({
          message: 'Login successful user',
          user: req.user,
        });
      } else {
        res.status(401).json({ message: 'Unauthorized' });
      }
    }
  );

// Test Route
app.get('/', (req, res) => {
  res.send('Facebook Authentication API is running');
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));

