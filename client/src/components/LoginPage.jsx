import React, { useState } from 'react';
import {
  Lock,
  User,
  Eye,
  EyeOff,
  ArrowRight,
  AlertCircle,
  Sparkles,
  ShieldCheck
} from 'lucide-react';
import starbucksTM from '../assets/starbucks_tm.png';
import { loginUser } from '../services/api';

const LoginPage = ({ onAuthSuccess }) => {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!identifier.trim() || !password) {
      setError('Please enter your User ID and password.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await loginUser({ identifier: identifier.trim(), password });
      if (res && res.success) {
        onAuthSuccess(res.user, res.message || `Welcome back, ${res.user.name}!`);
      }
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        (err.code === 'ERR_NETWORK'
          ? 'Cannot reach backend API on port 5000. Make sure the server is running.'
          : 'Login failed. Please verify your User ID and password.');
      setError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F2F0EB] flex flex-col justify-center py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl w-full mx-auto grid grid-cols-1 lg:grid-cols-12 rounded-3xl overflow-hidden shadow-2xl border border-gray-200 bg-white">
        {/* Left Branded Panel */}
        <div className="lg:col-span-5 relative bg-gradient-to-br from-sb-dark via-[#142A24] to-[#004A31] text-white p-8 sm:p-10 flex flex-col justify-between overflow-hidden">
          <div className="absolute -right-20 -top-20 w-72 h-72 rounded-full bg-sb-green/25 blur-3xl pointer-events-none" />
          <div className="absolute -left-20 -bottom-24 w-72 h-72 rounded-full bg-sb-light/10 blur-2xl pointer-events-none" />

          <div className="relative space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-white/15 backdrop-blur-md border border-white/20 flex items-center justify-center p-1.5">
                <img src={starbucksTM} alt="Starbucks Logo" className="w-9 h-9 object-contain" />
              </div>
              <div>
                <p className="font-extrabold tracking-tight text-lg leading-none">STARBUCKS®</p>
                <p className="text-[11px] uppercase tracking-widest text-sb-light font-semibold mt-1">
                  Branch Inventory Portal
                </p>
              </div>
            </div>

            <div className="space-y-3 pt-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 border border-white/10 text-sb-light text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5 text-sb-gold" />
                <span>Single-Branch Access</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight leading-tight">
                Sign in to manage store stock & recipes.
              </h1>
              <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
                Access live branch inventory levels, update beverage counts, and maintain store recipes securely.
              </p>
            </div>
          </div>

          <div className="relative mt-8 pt-6 border-t border-white/10 flex items-center gap-2.5 text-xs text-sb-light">
            <ShieldCheck className="w-4 h-4 text-sb-gold flex-shrink-0" />
            <span>Authorized branch credentials required.</span>
          </div>
        </div>

        {/* Right Login Form Panel */}
        <div className="lg:col-span-7 p-8 sm:p-10 flex flex-col justify-center">
          <div className="mb-6">
            <h2 className="text-2xl font-extrabold text-gray-900">Branch Partner Sign In</h2>
            <p className="text-xs text-gray-500 mt-1">
              Enter your assigned User ID and password to open the inventory system.
            </p>
          </div>

          {error && (
            <div className="mb-5 p-3.5 rounded-xl bg-red-50 border border-red-200 flex items-start gap-2.5 text-red-800 text-xs">
              <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
              <span className="font-medium leading-relaxed">{error}</span>
            </div>
          )}

          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-gray-700">User ID</label>
              <div className="relative">
                <User className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="Enter your User ID"
                  autoComplete="username"
                  className="w-full text-sm pl-10 pr-4 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-sb-green focus:border-transparent"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-gray-700">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  className="w-full text-sm pl-10 pr-10 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-sb-green focus:border-transparent"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600 p-0.5"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full mt-2 py-3 px-4 rounded-xl bg-sb-green hover:bg-sb-hover text-white font-bold text-sm shadow-md hover:shadow-lg transition flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {isSubmitting ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Signing In...</span>
                </>
              ) : (
                <>
                  <span>Sign In to Inventory</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
