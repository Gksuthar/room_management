const Expense = require('../models/Expense');
const User = require('../models/User');
const { calculateSummary } = require('../services/summaryService');

const getSummary = async (req, res) => {
  try {
    const users = await User.find().sort({ name: 1 });
    const expenses = await Expense.find().sort({ date: 1, createdAt: 1 });

    const summary = calculateSummary(users, expenses);
    return res.json(summary);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getSummary,
};
