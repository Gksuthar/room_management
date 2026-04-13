import { useCallback, useEffect, useState } from 'react';
import api from '../services/api';
import { useAuth } from '../context/useAuth';
import ExpenseTable from '../components/ExpenseTable';

const initialFilter = {
  paidBy: 'all',
  date: '',
};

const ExpenseListPage = () => {
  const { users } = useAuth();
  const [expenses, setExpenses] = useState([]);
  const [filter, setFilter] = useState(initialFilter);
  const [error, setError] = useState('');

  const fetchExpenses = useCallback(async (activeFilter) => {
    try {
      setError('');
      const params = {};

      if (activeFilter.paidBy && activeFilter.paidBy !== 'all') {
        params.paidBy = activeFilter.paidBy;
      }

      if (activeFilter.date) {
        params.date = activeFilter.date;
      }

      const response = await api.get('/expenses', { params });
      setExpenses(response.data);
    } catch (requestError) {
      setError(requestError?.response?.data?.message || 'Unable to fetch expenses');
    }
  }, []);

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      fetchExpenses(initialFilter);
    });

    return () => cancelAnimationFrame(frame);
  }, [fetchExpenses]);

  const handleFilterChange = (event) => {
    const { name, value } = event.target;
    const updatedFilter = { ...filter, [name]: value };
    setFilter(updatedFilter);
    fetchExpenses(updatedFilter);
  };

  const handleDelete = async (expenseId) => {
    try {
      await api.delete(`/expenses/${expenseId}`);
      fetchExpenses(filter);
    } catch (requestError) {
      setError(requestError?.response?.data?.message || 'Unable to delete expense');
    }
  };

  return (
    <section className="space-y-5 animate-fade-in-up">
      <div>
        <h1 className="text-3xl font-black text-slate-900">Expense List</h1>
        <p className="text-slate-600">Filter room expenses by payer and date.</p>
      </div>

      <div className="grid gap-4 rounded-2xl border border-slate-200 bg-white/80 p-4 shadow-sm backdrop-blur-md sm:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-700" htmlFor="paidBy">
            Filter By User
          </label>
          <select
            id="paidBy"
            name="paidBy"
            value={filter.paidBy}
            onChange={handleFilterChange}
            className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none ring-amber-400 focus:ring-2"
          >
            <option value="all">All</option>
            {users.map((user) => (
              <option key={user._id} value={user._id}>
                {user.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-700" htmlFor="date">
            Filter By Date
          </label>
          <input
            id="date"
            name="date"
            type="date"
            value={filter.date}
            onChange={handleFilterChange}
            className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none ring-amber-400 focus:ring-2"
          />
        </div>
      </div>

      {error ? (
        <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</div>
      ) : null}

      <ExpenseTable expenses={expenses} onDelete={handleDelete} />
    </section>
  );
};

export default ExpenseListPage;
