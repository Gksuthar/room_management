const User = require('../models/User');

const login = async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ message: 'userId is required' });
    }

    const user = await User.findById(userId).select('name');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    req.session.userId = user._id.toString();

    return res.json({
      message: 'Login successful',
      user,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const logout = (req, res) => {
  req.session.destroy((error) => {
    if (error) {
      return res.status(500).json({ message: 'Logout failed' });
    }

    res.clearCookie('connect.sid');
    return res.json({ message: 'Logout successful' });
  });
};

const currentUser = async (req, res) => {
  try {
    if (!req.session.userId) {
      return res.status(401).json({ message: 'Not authenticated' });
    }

    const user = await User.findById(req.session.userId).select('name');
    if (!user) {
      return res.status(401).json({ message: 'Session user not found' });
    }

    return res.json({ user });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  login,
  logout,
  currentUser,
};
