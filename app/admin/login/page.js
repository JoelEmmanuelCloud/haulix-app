'use client';

import { useState } from 'react';
import { signIn, getSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Lock, Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function AdminLogin() {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const result = await signIn('credentials', {
        password,
        redirect: false
      });

      if (result?.error) {
        setError('Invalid password. Please try again.');
      } else {
        // Check if login was successful
        const session = await getSession();
        if (session) {
          router.push('/admin/dashboard');
        } else {
          setError('Login failed. Please try again.');
        }
      }
    } catch (error) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-blue-50 to-indigo-100 flex items-center justify-center p-3 sm:p-4">
      {/* Mobile-Optimized Background Pattern */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-200/20 to-blue-200/20"></div>
      </div>

      {/* Mobile-Optimized Login Card */}
      <div className="relative w-full max-w-sm sm:max-w-md">
        {/* Mobile-Optimized Header */}
        <div className="text-center mb-6 sm:mb-8">
          <Link href="/" className="inline-flex items-center mb-3 sm:mb-4">
            <Image
              src="/images/logo.svg"
              alt="Haulix Logo"
              width={180}
              height={24}
              className="w-auto h-12 sm:h-16 md:h-20 lg:h-24"
            />
          </Link>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1 sm:mb-2">Admin Login</h1>
          <p className="text-sm sm:text-base text-gray-600">Access the admin dashboard</p>
        </div>

        {/* Mobile-Optimized Login Form */}
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl p-5 sm:p-6 md:p-8">
          <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
            {/* Mobile-Optimized Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Admin Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 sm:pl-11 pr-10 sm:pr-11 py-3 sm:py-3.5 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-colors"
                  placeholder="Enter admin password"
                  required
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center touch-manipulation"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 hover:text-gray-600 transition-colors" />
                  ) : (
                    <Eye className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 hover:text-gray-600 transition-colors" />
                  )}
                </button>
              </div>
            </div>

            {/* Mobile-Optimized Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-red-800 text-sm leading-relaxed">{error}</p>
              </div>
            )}

            {/* Mobile-Optimized Submit Button */}
            <button
              type="submit"
              disabled={loading || !password}
              className="w-full bg-cyan-700 hover:bg-cyan-800 disabled:bg-gray-400 text-white py-3 sm:py-3.5 px-4 rounded-lg font-semibold transition-colors focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 flex items-center justify-center touch-manipulation min-h-[48px] text-base"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          {/* Mobile-Optimized Footer */}
          <div className="mt-5 sm:mt-6 pt-5 sm:pt-6 border-t border-gray-200">
            <p className="text-center text-xs sm:text-sm text-gray-500 leading-relaxed">
              Need help? Contact system administrator
            </p>
          </div>
        </div>

        {/* Mobile-Optimized Back to Home */}
        <div className="text-center mt-4 sm:mt-6">
          <Link 
            href="/" 
            className="text-cyan-700 hover:text-cyan-800 text-sm font-medium transition-colors touch-manipulation inline-flex items-center py-2 px-1"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}