import React, { useState } from 'react';
import { useBooking } from '../context/BookingContext';
import { X, Eye, EyeOff, Lock, Mail, User, Phone, CheckCircle2, ArrowRight } from 'lucide-react';

export const AuthModal: React.FC = () => {
  const { 
    authModalOpen, 
    setAuthModalOpen, 
    authMode, 
    setAuthMode, 
    setRole, 
    showToast,
    setSelectedCustomerId 
  } = useBooking();

  const [email, setEmail] = useState('sarah.jenkins@gmail.com');
  const [password, setPassword] = useState('Password123!');
  const [name, setName] = useState('Sarah Jenkins');
  const [phone, setPhone] = useState('+1 (555) 781-3094');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [loading, setLoading] = useState(false);
  const [resetSent, setResetSent] = useState(false);

  if (!authModalOpen) return null;

  // Password strength calculator
  const getPasswordStrength = (pwd: string) => {
    if (pwd.length === 0) return { score: 0, label: 'Empty', color: 'bg-slate-200' };
    if (pwd.length < 6) return { score: 1, label: 'Weak', color: 'bg-rose-500' };
    if (pwd.length < 10) return { score: 2, label: 'Fair', color: 'bg-amber-500' };
    return { score: 3, label: 'Strong', color: 'bg-emerald-500' };
  };

  const strength = getPasswordStrength(password);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      if (authMode === 'login') {
        setRole('customer');
        setSelectedCustomerId('cust-1');
        showToast('Signed in successfully as Sarah Jenkins', 'success');
        setAuthModalOpen(false);
      } else if (authMode === 'register') {
        setRole('customer');
        showToast('Account created successfully! Welcome to Calenova.', 'success');
        setAuthModalOpen(false);
      } else if (authMode === 'forgot') {
        setResetSent(true);
        showToast('Password reset instructions dispatched to your email.', 'info');
      }
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-800 rounded-2xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-200 dark:border-slate-700 relative animate-in fade-in duration-200">
        
        {/* Close Button */}
        <button
          onClick={() => {
            setAuthModalOpen(false);
            setResetSent(false);
          }}
          className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center mb-6">
          <div className="w-10 h-10 rounded-xl bg-[#0F6CBD]/10 text-[#0F6CBD] flex items-center justify-center mx-auto mb-3 font-bold text-lg">
            C
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            {authMode === 'login' && 'Welcome Back'}
            {authMode === 'register' && 'Create Your Account'}
            {authMode === 'forgot' && 'Reset Password'}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {authMode === 'login' && 'Sign in to access your appointments and self-service calendar.'}
            {authMode === 'register' && 'Book in seconds, save preferences, and reschedule easily.'}
            {authMode === 'forgot' && "Enter your email address and we'll send a recovery link."}
          </p>
        </div>

        {resetSent ? (
          <div className="text-center py-4 space-y-4">
            <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-950/40 text-[#22A06B] rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300">
              Check your inbox at <strong>{email}</strong> for instructions to reset your password.
            </p>
            <button
              onClick={() => {
                setResetSent(false);
                setAuthMode('login');
              }}
              className="w-full py-2.5 text-xs font-semibold text-white bg-[#0F6CBD] hover:bg-[#0B5394] rounded-lg transition-colors"
            >
              Back to Sign In
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {authMode === 'register' && (
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="Sarah Jenkins"
                    className="w-full text-xs pl-9 pr-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg dark:bg-slate-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0F6CBD]"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full text-xs pl-9 pr-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg dark:bg-slate-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0F6CBD]"
                />
              </div>
            </div>

            {authMode === 'register' && (
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Mobile Phone (For 2h SMS Reminders)
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    placeholder="+1 (555) 000-0000"
                    className="w-full text-xs pl-9 pr-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg dark:bg-slate-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0F6CBD]"
                  />
                </div>
              </div>
            )}

            {authMode !== 'forgot' && (
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Password
                  </label>
                  {authMode === 'login' && (
                    <button
                      type="button"
                      onClick={() => setAuthMode('forgot')}
                      className="text-xs text-[#0F6CBD] hover:underline"
                    >
                      Forgot password?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full text-xs pl-9 pr-9 py-2 border border-slate-300 dark:border-slate-600 rounded-lg dark:bg-slate-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0F6CBD]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                {authMode === 'register' && (
                  <div className="mt-2 space-y-1">
                    <div className="flex items-center gap-1.5 h-1.5 w-full bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                      <div className={`h-full ${strength.color}`} style={{ width: `${(strength.score / 3) * 100}%` }} />
                    </div>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400">
                      Password strength: <strong className="font-semibold">{strength.label}</strong>
                    </span>
                  </div>
                )}
              </div>
            )}

            {authMode === 'login' && (
              <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-400">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={e => setRememberMe(e.target.checked)}
                    className="rounded text-[#0F6CBD] focus:ring-[#0F6CBD]"
                  />
                  <span>Remember me for 30 days</span>
                </label>
              </div>
            )}

            {authMode === 'register' && (
              <div className="text-xs text-slate-600 dark:text-slate-400">
                <label className="flex items-start gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    required
                    checked={agreeTerms}
                    onChange={e => setAgreeTerms(e.target.checked)}
                    className="mt-0.5 rounded text-[#0F6CBD] focus:ring-[#0F6CBD]"
                  />
                  <span>I agree to the Terms of Service and Privacy Policy</span>
                </label>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 text-xs font-semibold text-white bg-[#0F6CBD] hover:bg-[#0B5394] rounded-lg transition-colors shadow-xs flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <span>Please wait...</span>
              ) : (
                <>
                  <span>
                    {authMode === 'login' && 'Sign In'}
                    {authMode === 'register' && 'Create Account'}
                    {authMode === 'forgot' && 'Send Recovery Email'}
                  </span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>

            {/* Social Logins */}
            {authMode !== 'forgot' && (
              <div className="pt-3 border-t border-slate-200 dark:border-slate-700">
                <div className="text-center text-[11px] text-slate-400 mb-3">
                  Or continue with
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setRole('customer');
                      setSelectedCustomerId('cust-1');
                      setAuthModalOpen(false);
                      showToast('Connected with Google Account', 'success');
                    }}
                    className="py-1.5 px-3 border border-slate-300 dark:border-slate-600 rounded-lg text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors flex items-center justify-center gap-2"
                  >
                    <span>Google</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setRole('customer');
                      setSelectedCustomerId('cust-1');
                      setAuthModalOpen(false);
                      showToast('Connected with Apple ID', 'success');
                    }}
                    className="py-1.5 px-3 border border-slate-300 dark:border-slate-600 rounded-lg text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors flex items-center justify-center gap-2"
                  >
                    <span>Apple</span>
                  </button>
                </div>
              </div>
            )}

            {/* Toggle Modes */}
            <div className="text-center pt-2 text-xs text-slate-600 dark:text-slate-400">
              {authMode === 'login' ? (
                <>
                  Don't have an account?{' '}
                  <button
                    type="button"
                    onClick={() => setAuthMode('register')}
                    className="font-semibold text-[#0F6CBD] hover:underline"
                  >
                    Register now
                  </button>
                </>
              ) : (
                <>
                  Already registered?{' '}
                  <button
                    type="button"
                    onClick={() => setAuthMode('login')}
                    className="font-semibold text-[#0F6CBD] hover:underline"
                  >
                    Sign in here
                  </button>
                </>
              )}
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
