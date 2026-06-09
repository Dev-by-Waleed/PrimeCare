"use client"
import React, { useState } from 'react';
import { Mail, Lock, Leaf, ArrowRight, Loader2, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import supabase from '@/Config/Supabase';


export default function LoginPage() {
  const router = useRouter();

  // Form State
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  });

  // UI States
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Handle Input Changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Handle Login Submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // Supabase Authentication SignIn
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      if (signInError) throw signInError;

      // On successful login, redirect to home page or dashboard
      router.push('/');
      router.refresh(); // Optional: Refreshes the server components to update auth state

    } catch (err) {
      setError(err.message || "Invalid login credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  // Improved Google Sign-In Logic
  const signInWithGoogle = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Dynamically get current site URL so it works in both local development and production environments
      const origin = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000';
      
      const { data, error: oauthError } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${origin}/auth/callback`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      });

      if (oauthError) throw oauthError;

    } catch (err) {
      setError(err.message || "Failed to sign in with Google.");
      setIsLoading(false); // Only turn off loading if the redirection failed
    }
  };

  return (
    <div className="min-h-screen bg-[#f9f9f9] flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans text-[#1a1a1a] antialiased">

      {/* ================= BRAND LOGO ================= */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md flex flex-col items-center mb-6">
        <div className="w-16 h-16 rounded-full flex items-center justify-center shadow-md shadow-[#00b207]/20 mb-4">
          <Image src="/logo.png" alt="PrimeCare Logo" width={100} height={50} />
        </div>
        <h2 className="text-center text-3xl font-bold tracking-tight text-gray-900">
          Welcome back
        </h2>
        <p className="mt-2 text-center text-sm text-gray-500">
          Sign in to access your fresh orders and details.
        </p>
      </div>

      {/* ================= LOGIN CARD ================= */}
      <div className="sm:mx-auto sm:w-full sm:max-w-[450px]">
        <div className="bg-white py-10 px-8 shadow-sm border border-gray-100 rounded-3xl sm:px-10">

          {/* Status Message */}
          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-100 flex items-start gap-3">
              <AlertCircle size={20} className="text-red-500 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-700 font-medium">{error}</p>
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>

            {/* Email Input */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1.5 ml-1">
                Email address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail size={18} className="text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={isLoading}
                  className="block w-full pl-11 pr-4 py-3.5 border border-gray-200 rounded-full text-sm placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#00b207] focus:border-[#00b207] transition-colors bg-gray-50/50 focus:bg-white disabled:opacity-60"
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1.5 ml-1">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock size={18} className="text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  disabled={isLoading}
                  className="block w-full pl-11 pr-4 py-3.5 border border-gray-200 rounded-full text-sm placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#00b207] focus:border-[#00b207] transition-colors bg-gray-50/50 focus:bg-white disabled:opacity-60"
                />
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between px-1">
              <div className="flex items-center">
                <input
                  id="rememberMe"
                  name="rememberMe"
                  type="checkbox"
                  checked={formData.rememberMe}
                  onChange={handleChange}
                  disabled={isLoading}
                  className="h-4 w-4 text-[#00b207] focus:ring-[#00b207] border-gray-300 rounded cursor-pointer accent-[#00b207]"
                />
                <label htmlFor="rememberMe" className="ml-2 block text-sm text-gray-600 cursor-pointer">
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <a href="#" className="font-medium text-gray-500 hover:text-[#00b207] transition-colors">
                  Forgot your password?
                </a>
              </div>
            </div>

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center items-center gap-2 py-3.5 px-4 border border-transparent rounded-full shadow-md shadow-[#00b207]/10 text-sm font-semibold text-white bg-[#00b207] hover:bg-[#009906] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#00b207] transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Signing in...
                  </>
                ) : (
                  <>
                    Sign In
                    <ArrowRight size={16} />
                  </>
                )}
              </button>
            </div>
          </form>

          {/* ================= SOCIAL LOGIN DIVIDER ================= */}
          <div className="mt-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-100" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-400">Or continue with</span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-4">
              <button 
                onClick={signInWithGoogle} 
                disabled={isLoading}
                className="w-full inline-flex justify-center items-center py-3 px-4 border border-gray-200 rounded-full bg-white text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <Loader2 size={18} className="animate-spin mr-2 text-gray-400" />
                ) : (
                  <img className="h-5 w-5 mr-2" src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" />
                )}
                Google
              </button>
            </div>
          </div>

        </div>

        {/* ================= BOTTOM REGISTRATION LINK ================= */}
        <p className="mt-8 text-center text-sm text-gray-600">
          Don't have an account yet?{' '}
          <Link href="/sign-up" className="font-bold text-[#00b207] hover:text-[#009906] transition-colors hover:underline">
            Create an Account
          </Link>
        </p>
      </div>
    </div>
  );
}