import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth';

const LoginPage = () => {
  const { users, login, loading } = useAuth();
  const [selectedUser, setSelectedUser] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!selectedUser) {
      setError('Please select a user to continue.');
      return;
    }

    try {
      setError('');
      await login(selectedUser);
      navigate('/dashboard');
    } catch (requestError) {
      setError(requestError?.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top,#fde68a,#f1f5f9_55%,#e2e8f0)] p-4">
      <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white/80 p-8 shadow-xl backdrop-blur-md animate-fade-in-up">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-amber-600">Room Expense Manager</p>
        <h1 className="mt-2 text-3xl font-black text-slate-900">Welcome Back</h1>
        <p className="mt-1 text-sm text-slate-500">Select your profile to continue</p>

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <label className="block text-sm font-semibold text-slate-700" htmlFor="userSelect">
            Choose User
          </label>
          <select
            id="userSelect"
            value={selectedUser}
            onChange={(event) => setSelectedUser(event.target.value)}
            disabled={loading}
            className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-800 outline-none ring-amber-400 focus:ring-2"
          >
            <option value="">Select</option>
            {users.map((user) => (
              <option key={user._id} value={user._id}>
                {user.name}
              </option>
            ))}
          </select>

          {error ? <p className="text-sm text-rose-600">{error}</p> : null}

          <button
            type="submit"
            className="w-full rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-slate-800"
          >
            Continue
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
