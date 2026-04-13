const Expense = require('../models/Expense');
const User = require('../models/User');

const buildDateRangeFilter = ({ date, dateFrom, dateTo }) => {
  if (!date && !dateFrom && !dateTo) {
    return null;
  }

  const dateFilter = {};

  if (date) {
    const start = new Date(date);
    start.setHours(0, 0, 0, 0);

    const end = new Date(date);
    end.setHours(23, 59, 59, 999);

    dateFilter.$gte = start;
    dateFilter.$lte = end;
    return dateFilter;
  }

  if (dateFrom) {
    dateFilter.$gte = new Date(dateFrom);
  }

  if (dateTo) {
    const end = new Date(dateTo);
    end.setHours(23, 59, 59, 999);
    dateFilter.$lte = end;
  }

  return dateFilter;
};

const addExpense = async (req, res) => {
  try {
    const { title, amount, paidBy, splitType, date } = req.body;

    if (!title || !amount || !paidBy) {
      return res.status(400).json({ message: 'title, amount and paidBy are required' });
    }

    if (Number(amount) <= 0) {
      return res.status(400).json({ message: 'amount must be greater than 0' });
    }

    const payer = await User.findById(paidBy);
    if (!payer) {
      return res.status(404).json({ message: 'Payer not found' });
    }

    const users = await User.find().select('_id');
    const splitBetween = users.map((user) => user._id);

    const expense = await Expense.create({
      title,
      amount: Number(amount),
      paidBy,
      splitBetween,
      splitType: splitType || 'equal',
      date: date || new Date(),
    });

    const populatedExpense = await Expense.findById(expense._id)
      .populate('paidBy', 'name')
      .populate('splitBetween', 'name');

    return res.status(201).json(populatedExpense);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getExpenses = async (req, res) => {
  try {
    const { paidBy, date, dateFrom, dateTo } = req.query;
    const filter = {};

    if (paidBy && paidBy !== 'all') {
      filter.paidBy = paidBy;
    }

    const dateRangeFilter = buildDateRangeFilter({ date, dateFrom, dateTo });
    if (dateRangeFilter) {
      filter.date = dateRangeFilter;
    }

    const expenses = await Expense.find(filter)
      .populate('paidBy', 'name')
      .populate('splitBetween', 'name')
      .sort({ date: -1, createdAt: -1 });

    return res.json(expenses);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const deleteExpense = async (req, res) => {
  try {
    const { id } = req.params;
    const expense = await Expense.findByIdAndDelete(id);

    if (!expense) {
      return res.status(404).json({ message: 'Expense not found' });
    }

    return res.json({ message: 'Expense deleted successfully' });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  addExpense,
  getExpenses,
  deleteExpense,
};
