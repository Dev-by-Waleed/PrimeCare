"use client"
import React, { useEffect, useState } from 'react';
import supabase from '@/Config/Supabase';
import { User, Mail, Shield, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
export default function ProfilePage() {

const [userData, setUserData] = useState(null);
const [userRole, setUserRole] = useState(null);
const [isLoading, setIsLoading] = useState(true);

useEffect(() => {
  const fetchProfile = async () => {
    // 1. Show a loading toast
    const loadingToast = toast.loading('Loading your profile...');

    try {
      const { data: { session }, error: authError } = await supabase.auth.getSession();
      
      if (authError) throw authError;
      
      if (session?.user) {
        setUserData(session.user);

        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', session.user.id)
          .single();

        if (profileError) throw profileError;

        if (profile) {
          setUserRole(profile.role);
          // 2. Success toast with role info
          toast.success(`Welcome back! Role: ${profile.role}`, { id: loadingToast });
        }
      } else {
        // 3. Inform user if no active session found
        toast('No active session. Please log in.', { id: loadingToast, icon: 'ℹ️' });
      }
    } catch (error) {
      console.error("Error loading profile:", error);
      // 4. Error toast if something fails
      toast.error('Failed to load profile data. Please try again.', { id: loadingToast });
    } finally {
      setIsLoading(false);
    }
  };

  fetchProfile();
}, []);

  // Show a spinner while we fetch the data
  if (isLoading) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-10 h-10 text-[#00b207] animate-spin" />
        <p className="text-gray-500 font-medium">Loading your profile...</p>
      </div>
    );
  }

  // Fallback just in case they aren't logged in
  if (!userData) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-red-500">Access Denied</h1>
        <p className="text-gray-600 mt-2">Please log in to view this page.</p>
      </div>
    );
  }

  // Extract the name we saved during registration
  const fullName = userData.user_metadata?.full_name || "Valued Customer";

  return (
    <div className="max-w-3xl mx-auto px-4 py-16">
      
      {/* Header */}
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold text-[#00b207] mb-4">Your Private Profile</h1>
        <p className="text-gray-600">
          Welcome back! Here are the details associated with your account.
        </p>
      </div>

      {/* Profile Card */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
        
        {/* Avatar/Initials Circle */}
        <div className="flex justify-center mb-6">
          <div className="w-24 h-24 bg-[#e6f7e7] text-[#00b207] rounded-full flex items-center justify-center text-3xl font-bold shadow-inner">
            {fullName.charAt(0).toUpperCase()}
          </div>
        </div>

        {/* User Details Grid */}
        <div className="space-y-6 max-w-md mx-auto">
          
          {/* Name */}
          <div className="flex items-center gap-4 p-4 rounded-2xl bg-gray-50/50 border border-gray-100">
            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm text-gray-500">
              <User size={20} />
            </div>
            <div>
              <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Full Name</p>
              <p className="text-gray-900 font-semibold">{fullName}</p>
            </div>
          </div>

          {/* Email */}
          <div className="flex items-center gap-4 p-4 rounded-2xl bg-gray-50/50 border border-gray-100">
            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm text-gray-500">
              <Mail size={20} />
            </div>
            <div>
              <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Email Address</p>
              <p className="text-gray-900 font-semibold">{userData.email}</p>
            </div>
          </div>

          {/* Role (With conditional styling for Admins!) */}
          <div className={`flex items-center gap-4 p-4 rounded-2xl border ${
            userRole === 'admin' 
              ? 'bg-[#00b207]/10 border-[#00b207]/20' 
              : 'bg-gray-50/50 border-gray-100'
          }`}>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center shadow-sm ${
              userRole === 'admin' ? 'bg-[#00b207] text-white' : 'bg-white text-gray-500'
            }`}>
              <Shield size={20} />
            </div>
            <div>
              <p className={`text-xs font-medium uppercase tracking-wider ${
                userRole === 'admin' ? 'text-[#008a05]' : 'text-gray-500'
              }`}>
                Account Role
              </p>
              <p className={`font-semibold capitalize ${
                userRole === 'admin' ? 'text-[#008a05]' : 'text-gray-900'
              }`}>
                {userRole || 'Loading...'}
              </p>
            </div>
          </div>

        </div>
      </div>
      
    </div>
  );
}