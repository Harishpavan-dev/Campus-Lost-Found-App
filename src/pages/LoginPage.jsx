import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, LogIn, Eye, EyeOff, MapPin } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { validateEmail } from '../utils/helpers';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login, loading } = useAuth();
  const toast = useToast();

  const [form, setForm] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const errs = {};
    if (!form.email) errs.email = 'Email is required';
    else if (!validateEmail(form.email)) errs.email = 'Invalid email address';
    if (!form.password) errs.password = 'Password is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    const result = await login(form.email, form.password);
    if (result.success) {
      toast.success('Welcome back!');
      navigate('/dashboard');
    } else {
      toast.error(result.error);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 animate-fade-in">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-4">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-primary-600 to-secondary-500 flex items-center justify-center">
              <MapPin size={24} className="text-white" />
            </div>
          </Link>
          <h1 className="text-2xl font-bold text-surface-900">Welcome Back</h1>
          <p className="text-surface-500 mt-1">Sign in to your account</p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-2xl border border-surface-200/80 p-6 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div className="form-group">
              <label className="form-label" htmlFor="login-email">Email Address</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-surface-400" />
                <input
                  type="email"
                  id="login-email"
                  className={`form-input pl-10 ${errors.email ? 'border-red-400' : ''}`}
                  placeholder="you@campus.edu"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
              </div>
              {errors.email && <p className="form-error">{errors.email}</p>}
            </div>

            {/* Password */}
            <div className="form-group">
              <label className="form-label" htmlFor="login-password">Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-surface-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="login-password"
                  className={`form-input pl-10 pr-10 ${errors.password ? 'border-red-400' : ''}`}
                  placeholder="••••••••"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-surface-400 hover:text-surface-600"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && <p className="form-error">{errors.password}</p>}
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="btn btn-primary w-full btn-lg"
              disabled={loading}
              id="login-submit"
            >
              {loading ? (
                <span className="animate-pulse">Signing in...</span>
              ) : (
                <>
                  <LogIn size={18} />
                  Sign In
                </>
              )}
            </button>
          </form>

          {/* Demo Credentials */}
          <div className="mt-5 p-3 rounded-xl bg-surface-50 border border-surface-200">
            <p className="text-xs font-semibold text-surface-500 uppercase tracking-wider mb-2">Demo Accounts</p>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setForm({ email: 'student@campus.edu', password: 'student123' })}
                className="text-xs text-left p-2 rounded-lg hover:bg-surface-100 transition-colors"
              >
                <p className="font-medium text-surface-700">Student</p>
                <p className="text-surface-500">student@campus.edu</p>
              </button>
              <button
                type="button"
                onClick={() => setForm({ email: 'admin@campus.edu', password: 'admin123' })}
                className="text-xs text-left p-2 rounded-lg hover:bg-surface-100 transition-colors"
              >
                <p className="font-medium text-surface-700">Admin</p>
                <p className="text-surface-500">admin@campus.edu</p>
              </button>
            </div>
          </div>
        </div>

        {/* Register Link */}
        <p className="text-center text-sm text-surface-500 mt-6">
          Don't have an account?{' '}
          <Link to="/register" className="text-primary-600 hover:text-primary-700 font-medium">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
