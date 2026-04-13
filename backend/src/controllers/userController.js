const User = require('../models/User');

const getUsers = async (req, res) => {
  try {
    const users = await User.find().sort({ name: 1 });
    return res.json(users);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getUsers,
};
