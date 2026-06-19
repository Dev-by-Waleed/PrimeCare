"use client"
import React, { useState, useEffect } from 'react';
import { Mail, Lock, User, Leaf, ArrowRight, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import supabase from '@/Config/Supabase';

export default function page() {
  const router = useRouter();

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        router.push('/'); // Redirect to home if already logged in
      }
    };
    checkUser();
  }, [router]);

  // Form State
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    acceptTerms: false
  });

  // UI States
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // Handle Input Changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Handle Registration Submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    // Basic Validation
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      setIsLoading(false);
      return;
    }

    if (!formData.acceptTerms) {
      setError("You must accept the terms and conditions.");
      setIsLoading(false);
      return;
    }

    try {
      // 1. Supabase Authentication Signup
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.fullName,
          }
        }
      });

      if (signUpError) throw signUpError;

      // 2. Create the Role Profile in the Database
      if (data?.user) {
        const { error: profileError } = await supabase
          .from('profiles')
          .insert([
            {
              id: data.user.id,
              role: 'customer' // Automatically assigns 'customer'
            }
          ]);

        if (profileError) {
          console.error("Profile creation error:", profileError.message);
          throw new Error("Account created, but profile setup failed.");
        }
      }

      // Success State
      setSuccess(true);
      toast.success("Account created successfully! Please log in.");
      setTimeout(() => router.push('/login'), 3000);

    } catch (err) {
      setError(err.message || "An error occurred during registration.");
    } finally {
      setIsLoading(false);
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
          Create an Account
        </h2>
        <p className="mt-2 text-center text-sm text-gray-500">
          Join us to get the freshest organic produce delivered.
        </p>
      </div>

      {/* ================= REGISTER CARD ================= */}
      <div className="sm:mx-auto sm:w-full sm:max-w-[500px]">
        <div className="bg-white py-10 px-8 shadow-sm border border-gray-100 rounded-3xl sm:px-10">

          {/* Status Messages */}
          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-100 flex items-start gap-3">
              <AlertCircle size={20} className="text-red-500 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-700 font-medium">{error}</p>
            </div>
          )}

          {success && (
            <div className="mb-6 p-4 rounded-xl bg-[#e6f7e7] border border-[#00b207]/20 flex items-start gap-3">
              <CheckCircle2 size={20} className="text-[#00b207] flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="text-sm font-bold text-[#008a05]">Registration Successful!</h3>
                <p className="text-sm text-[#00b207] mt-1">Please check your email to verify your account.</p>
                <Link href="/login" className="text-sm font-semibold text-[#008a05] underline mt-2 inline-block">
                  Go to Login
                </Link>
              </div>
            </div>
          )}

          {/* Form */}
          {!success && (
            <form className="space-y-5" onSubmit={handleSubmit}>

              {/* Full Name Input */}
              <div>
                <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1.5 ml-1">
                  Full Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <User size={18} className="text-gray-400" />
                  </div>
                  <input
                    id="fullName"
                    name="fullName"
                    type="text"
                    required
                    placeholder="John Doe"
                    value={formData.fullName}
                    onChange={handleChange}
                    className="block w-full pl-11 pr-4 py-3.5 border border-gray-200 rounded-full text-sm placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#00b207] focus:border-[#00b207] transition-colors bg-gray-50/50 focus:bg-white"
                  />
                </div>
              </div>

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
                    className="block w-full pl-11 pr-4 py-3.5 border border-gray-200 rounded-full text-sm placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#00b207] focus:border-[#00b207] transition-colors bg-gray-50/50 focus:bg-white"
                  />
                </div>
              </div>

              {/* Grid for Passwords */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
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
                      required
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={handleChange}
                      className="block w-full pl-11 pr-4 py-3.5 border border-gray-200 rounded-full text-sm placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#00b207] focus:border-[#00b207] transition-colors bg-gray-50/50 focus:bg-white"
                    />
                  </div>
                </div>

                {/* Confirm Password Input */}
                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1.5 ml-1">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Lock size={18} className="text-gray-400" />
                    </div>
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      required
                      placeholder="••••••••"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className="block w-full pl-11 pr-4 py-3.5 border border-gray-200 rounded-full text-sm placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#00b207] focus:border-[#00b207] transition-colors bg-gray-50/50 focus:bg-white"
                    />
                  </div>
                </div>
              </div>

              {/* Terms & Conditions */}
              <div className="flex items-start px-1 pt-2">
                <div className="flex items-center h-5">
                  <input
                    id="acceptTerms"
                    name="acceptTerms"
                    type="checkbox"
                    checked={formData.acceptTerms}
                    onChange={handleChange}
                    className="h-4 w-4 text-[#00b207] focus:ring-[#00b207] border-gray-300 rounded cursor-pointer accent-[#00b207]"
                  />
                </div>
                <div className="ml-2 text-sm">
                  <label htmlFor="acceptTerms" className="text-gray-600 cursor-pointer">
                    I accept the{' '}
                    <a href="#" className="font-medium text-[#00b207] hover:underline">
                      Terms of Service
                    </a>{' '}
                    and{' '}
                    <a href="#" className="font-medium text-[#00b207] hover:underline">
                      Privacy Policy
                    </a>.
                  </label>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex justify-center items-center gap-2 py-3.5 px-4 border border-transparent rounded-full shadow-md shadow-[#00b207]/10 text-sm font-semibold text-white bg-[#00b207] hover:bg-[#009906] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#00b207] transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      Creating account...
                    </>
                  ) : (
                    <>
                      Create Account
                      <ArrowRight size={16} />
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

        </div>

        {/* ================= BOTTOM LOGIN LINK ================= */}
        <p className="mt-8 text-center text-sm text-gray-600">
          Already have an account?{' '}
          <Link href="/login" className="font-bold text-[#00b207] hover:text-[#009906] transition-colors hover:underline">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}