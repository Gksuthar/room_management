import { useCallback, useEffect, useState } from 'react';
import api from '../services/api';
import StatCard from '../components/StatCard';
import BalanceBanner from '../components/BalanceBanner';
import MonthlyChart from '../components/MonthlyChart';
import ExpenseTable from '../components/ExpenseTable';

const DashboardPage = () => {
  const [summary, setSummary] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const [error, setError] = useState('');

  const loadData = useCallback(async () => {
    try {
      setError('');
      const [summaryResponse, expensesResponse] = await Promise.all([
        api.get('/summary'),
        api.get('/expenses'),
      ]);
      setSummary(summaryResponse.data);
      setExpenses(expensesResponse.data);
    } catch (requestError) {
      setError(requestError?.response?.data?.message || 'Unable to load dashboard data');
    }
  }, []);

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      loadData();
    });

    return () => cancelAnimationFrame(frame);
  }, [loadData]);

  const spentByGanesh = summary?.perUser?.find((item) => item.name === 'Ganesh')?.paid || 0;
  const spentByAditya = summary?.perUser?.find((item) => item.name === 'Aditya')?.paid || 0;

  return (
    <section className="space-y-6 animate-fade-in-up">
      <div>
        <h1 className="text-3xl font-black text-slate-900">Dashboard</h1>
        <p className="text-slate-600">Track totals, payer split, and final settlement.</p>
      </div>

      {error ? (
        <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</div>
      ) : null}

      <div className="grid gap-4 md:grid-cols-3">
        <StatCard title="Total Expenses" amount={summary?.totalExpenses || 0} accent="text-slate-900" />
        <StatCard title="Total Spent by Ganesh" amount={spentByGanesh} accent="text-blue-700" />
        <StatCard title="Total Spent by Aditya" amount={spentByAditya} accent="text-emerald-700" />
      </div>

      <BalanceBanner settlement={summary?.settlement} />

      <MonthlyChart data={summary?.monthlyTotals || []} />

      <div>
        <h2 className="mb-3 text-xl font-bold text-slate-900">All Expenses</h2>
        <ExpenseTable expenses={expenses} />
      </div>
    </section>
  );
};

export default DashboardPage;
