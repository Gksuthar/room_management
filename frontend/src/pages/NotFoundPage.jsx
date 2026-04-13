import { Link } from 'react-router-dom';

const NotFoundPage = () => {
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-lg">
        <h1 className="text-3xl font-black text-slate-900">404</h1>
        <p className="mt-2 text-slate-600">Page not found.</p>
        <Link
          to="/dashboard"
          className="mt-5 inline-block rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white"
        >
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;
