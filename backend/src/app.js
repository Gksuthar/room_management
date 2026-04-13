const express = require('express');
const cors = require('cors');
const session = require('express-session');

const userRoutes = require('./routes/userRoutes');
const expenseRoutes = require('./routes/expenseRoutes');
const summaryRoutes = require('./routes/summaryRoutes');
const authRoutes = require('./routes/authRoutes');

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
  })
);
app.use(express.json());

app.use(
  session({
    secret: process.env.SESSION_SECRET || 'dev-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: false,
      maxAge: 1000 * 60 * 60 * 24,
    },
  })
);

const requireAuth = (req, res, next) => {
  if (!req.session.userId) {
    return res.status(401).json({ message: 'Please login first' });
  }
  return next();
};

app.get('/health', (req, res) => {
  res.json({ message: 'Room expense API is running' });
});

app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/expenses', requireAuth, expenseRoutes);
app.use('/summary', requireAuth, summaryRoutes);

module.exports = app;
