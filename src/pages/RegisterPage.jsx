import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, UserPlus, Eye, EyeOff, MapPin } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { validateEmail, validatePassword } from '../utils/helpers';

export default function RegisterPage() {
  const navigate = useNavigate();
  const { register, loading } = useAuth();
  const toast = useToast();

  const [form, setForm] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const errs = {};
    if (!form.fullName.trim()) errs.fullName = 'Full name is required';
    if (!form.email) errs.email = 'Email is required';
    else if (!validateEmail(form.email)) errs.email = 'Invalid email address';
    if (!form.password) errs.password = 'Password is required';
    else if (!validatePassword(form.password)) errs.password = 'Password must be at least 6 characters';
    if (form.password !== form.confirmPassword) errs.confirmPassword = 'Passwords do not match';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    const result = await register(form.fullName, form.email, form.password);
    if (result.success) {
      toast.success('Account created successfully!');
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
          <h1 className="text-2xl font-bold text-surface-900">Create Account</h1>
          <p className="text-surface-500 mt-1">Join your campus community</p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-2xl border border-surface-200/80 p-6 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name */}
            <div className="form-group">
              <label className="form-label" htmlFor="reg-name">Full Name</label>
              <div className="relative">
                <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-surface-400" />
                <input
                  type="text"
                  id="reg-name"
                  className={`form-input pl-10 ${errors.fullName ? 'border-red-400' : ''}`}
                  placeholder="John Doe"
                  value={form.fullName}
                  onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                />
              </div>
              {errors.fullName && <p className="form-error">{errors.fullName}</p>}
            </div>

            {/* Email */}
            <div className="form-group">
              <label className="form-label" htmlFor="reg-email">Student Email</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-surface-400" />
                <input
                  type="email"
                  id="reg-email"
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
              <label className="form-label" htmlFor="reg-password">Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-surface-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="reg-password"
                  className={`form-input pl-10 pr-10 ${errors.password ? 'border-red-400' : ''}`}
                  placeholder="Min. 6 characters"
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

            {/* Confirm Password */}
            <div className="form-group">
              <label className="form-label" htmlFor="reg-confirm">Confirm Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-surface-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="reg-confirm"
                  className={`form-input pl-10 ${errors.confirmPassword ? 'border-red-400' : ''}`}
                  placeholder="Re-enter password"
                  value={form.confirmPassword}
                  onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                />
              </div>
              {errors.confirmPassword && <p className="form-error">{errors.confirmPassword}</p>}
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="btn btn-primary w-full btn-lg"
              disabled={loading}
              id="register-submit"
            >
              {loading ? (
                <span className="animate-pulse">Creating account...</span>
              ) : (
                <>
                  <UserPlus size={18} />
                  Create Account
                </>
              )}
            </button>
          </form>
        </div>

        {/* Login Link */}
        <p className="text-center text-sm text-surface-500 mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-primary-600 hover:text-primary-700 font-medium">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
