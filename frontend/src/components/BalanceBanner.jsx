import { formatCurrency } from '../utils/formatters';

const BalanceBanner = ({ settlement }) => {
  if (!settlement) {
    return (
      <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5 text-emerald-700">
        Both roommates are settled up. No pending dues.
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5 text-amber-900">
      <p className="text-sm font-medium">Final Balance</p>
      <p className="mt-2 text-lg font-semibold">
        {settlement.from} owes {settlement.to} {formatCurrency(settlement.amount)}
      </p>
    </div>
  );
};

export default BalanceBanner;
