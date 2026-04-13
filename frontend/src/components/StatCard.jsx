import { formatCurrency } from '../utils/formatters';

const StatCard = ({ title, amount, accent }) => {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white/80 p-5 shadow-sm backdrop-blur-md">
      <p className="text-sm font-medium text-slate-500">{title}</p>
      <p className={`mt-3 text-2xl font-semibold ${accent || 'text-slate-900'}`}>
        {formatCurrency(amount)}
      </p>
    </article>
  );
};

export default StatCard;
