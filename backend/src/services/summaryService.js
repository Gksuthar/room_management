const getMonthlyTotals = (expenses) => {
  const monthlyMap = new Map();

  expenses.forEach((expense) => {
    const monthKey = new Date(expense.date).toISOString().slice(0, 7);
    const currentTotal = monthlyMap.get(monthKey) || 0;
    monthlyMap.set(monthKey, currentTotal + expense.amount);
  });

  return Array.from(monthlyMap.entries())
    .map(([month, total]) => ({ month, total }))
    .sort((a, b) => a.month.localeCompare(b.month));
};

const calculateSummary = (users, expenses) => {
  const totalsByUser = users.reduce((acc, user) => {
    acc[user._id.toString()] = {
      userId: user._id,
      name: user.name,
      paid: 0,
      shouldPay: 0,
      netBalance: 0,
    };
    return acc;
  }, {});

  let totalExpenses = 0;

  expenses.forEach((expense) => {
    totalExpenses += expense.amount;
    const paidByKey = expense.paidBy.toString();

    if (totalsByUser[paidByKey]) {
      totalsByUser[paidByKey].paid += expense.amount;
    }

    const participants = expense.splitBetween?.length ? expense.splitBetween : users.map((user) => user._id);
    const equalShare = expense.amount / participants.length;

    participants.forEach((userId) => {
      const key = userId.toString();
      if (totalsByUser[key]) {
        totalsByUser[key].shouldPay += equalShare;
      }
    });
  });

  Object.values(totalsByUser).forEach((entry) => {
    entry.netBalance = entry.paid - entry.shouldPay;
  });

  const sortedBalances = Object.values(totalsByUser).sort((a, b) => b.netBalance - a.netBalance);
  const creditor = sortedBalances.find((item) => item.netBalance > 0);
  const debtor = [...sortedBalances].reverse().find((item) => item.netBalance < 0);

  let settlement = null;

  if (creditor && debtor) {
    const amount = Math.min(creditor.netBalance, Math.abs(debtor.netBalance));
    if (amount > 0) {
      settlement = {
        from: debtor.name,
        to: creditor.name,
        amount,
      };
    }
  }

  return {
    totalExpenses,
    perUser: Object.values(totalsByUser),
    settlement,
    monthlyTotals: getMonthlyTotals(expenses),
    totalExpensesCount: expenses.length,
  };
};

module.exports = {
  calculateSummary,
};
