import { formatCurrency, formatDate } from '../utils/formatters';

const ExpenseTable = ({ expenses, onDelete }) => {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white/80 shadow-sm backdrop-blur-md">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-100">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wide text-slate-600">Title</th>
              <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wide text-slate-600">Paid By</th>
              <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wide text-slate-600">Amount</th>
              <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wide text-slate-600">Date</th>
              <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wide text-slate-600">Split</th>
              {onDelete ? (
                <th className="px-4 py-3 text-right text-xs font-bold uppercase tracking-wide text-slate-600">Actions</th>
              ) : null}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {expenses.length === 0 ? (
              <tr>
                <td
                  colSpan={onDelete ? 6 : 5}
                  className="px-4 py-8 text-center text-sm text-slate-500"
                >
                  No expenses found.
                </td>
              </tr>
            ) : (
              expenses.map((expense) => (
                <tr key={expense._id} className="hover:bg-slate-50/70">
                  <td className="px-4 py-3 text-sm font-medium text-slate-900">{expense.title}</td>
                  <td className="px-4 py-3 text-sm text-slate-700">{expense.paidBy?.name}</td>
                  <td className="px-4 py-3 text-sm font-semibold text-slate-900">
                    {formatCurrency(expense.amount)}
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-700">{formatDate(expense.date)}</td>
                  <td className="px-4 py-3 text-sm text-slate-700 capitalize">{expense.splitType}</td>
                  {onDelete ? (
                    <td className="px-4 py-3 text-right">
                      <button
                        type="button"
                        onClick={() => onDelete(expense._id)}
                        className="rounded-lg border border-rose-200 px-3 py-1 text-sm font-medium text-rose-600 hover:bg-rose-50"
                      >
                        Delete
                      </button>
                    </td>
                  ) : null}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ExpenseTable;
