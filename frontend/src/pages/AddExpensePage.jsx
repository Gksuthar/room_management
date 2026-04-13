import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/useAuth';

const AddExpensePage = () => {
  const { users, currentUser } = useAuth();
  const navigate = useNavigate();

  const today = useMemo(() => new Date().toISOString().slice(0, 10), []);
  const [form, setForm] = useState({
    title: '',
    amount: '',
    paidBy: currentUser?._id || '',
    splitType: 'equal',
    date: today,
  });
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!form.title || !form.amount || !form.paidBy) {
      setError('Title, amount and paid by are required.');
      return;
    }

    try {
      setSaving(true);
      setError('');

      await api.post('/expenses', {
        ...form,
        amount: Number(form.amount),
      });

      navigate('/dashboard');
    } catch (requestError) {
      setError(requestError?.response?.data?.message || 'Unable to add expense');
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="animate-fade-in-up">
      <div className="mb-6">
        <h1 className="text-3xl font-black text-slate-900">Add Expense</h1>
        <p className="text-slate-600">Record a room expense and split it equally.</p>
      </div>

      <form
        className="max-w-2xl space-y-4 rounded-2xl border border-slate-200 bg-white/80 p-6 shadow-sm backdrop-blur-md"
        onSubmit={handleSubmit}
      >
        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-700" htmlFor="title">
            Expense Title
          </label>
          <input
            id="title"
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="Rent, Milk, Electricity"
            className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none ring-amber-400 focus:ring-2"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-700" htmlFor="amount">
            Amount
          </label>
          <input
            id="amount"
            name="amount"
            type="number"
            min="0"
            step="0.01"
            value={form.amount}
            onChange={handleChange}
            placeholder="1000"
            className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none ring-amber-400 focus:ring-2"
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700" htmlFor="paidBy">
              Paid By
            </label>
            <select
              id="paidBy"
              name="paidBy"
              value={form.paidBy}
              onChange={handleChange}
              className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none ring-amber-400 focus:ring-2"
            >
              <option value="">Select User</option>
              {users.map((user) => (
                <option key={user._id} value={user._id}>
                  {user.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700" htmlFor="date">
              Date
            </label>
            <input
              id="date"
              name="date"
              type="date"
              value={form.date}
              onChange={handleChange}
              className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none ring-amber-400 focus:ring-2"
            />
          </div>
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-700" htmlFor="splitType">
            Split Type
          </label>
          <input
            id="splitType"
            name="splitType"
            value="equal"
            disabled
            className="w-full rounded-xl border border-slate-300 bg-slate-100 px-4 py-3 text-slate-500"
          />
        </div>

        {error ? <p className="text-sm text-rose-600">{error}</p> : null}

        <button
          type="submit"
          disabled={saving}
          className="rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {saving ? 'Saving...' : 'Save Expense'}
        </button>
      </form>
    </section>
  );
};

export default AddExpensePage;
