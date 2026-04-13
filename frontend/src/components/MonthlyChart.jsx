import {
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  AreaChart,
  Area,
} from 'recharts';
import { formatCurrency } from '../utils/formatters';

const MonthlyChart = ({ data }) => {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white/80 p-5 shadow-sm backdrop-blur-md">
      <h3 className="text-base font-semibold text-slate-900">Monthly Spend Trend</h3>
      <p className="mb-4 text-sm text-slate-500">Aggregated total spent each month</p>

      <div className="h-72 w-full">
        <ResponsiveContainer>
          <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="monthlyGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.35} />
                <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.05} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="4 4" stroke="#cbd5e1" />
            <XAxis dataKey="month" stroke="#475569" />
            <YAxis stroke="#475569" />
            <Tooltip formatter={(value) => formatCurrency(value)} />
            <Area
              type="monotone"
              dataKey="total"
              stroke="#f59e0b"
              fill="url(#monthlyGradient)"
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default MonthlyChart;
