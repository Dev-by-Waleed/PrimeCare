"use client"
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ShoppingBag, Users, UserCircle } from 'lucide-react';
import supabase from '@/Config/Supabase'; // Adjust this path if needed

export default function AboutCTA() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setIsLoggedIn(!!session);
    };
    checkAuth();
  }, []);

  return (
    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
      <Link 
        href="/products-page" 
        className="w-full sm:w-auto px-8 py-4 bg-[#00b207] text-white rounded-full font-semibold hover:bg-[#009906] transition-colors flex items-center justify-center gap-2"
      >
        <ShoppingBag size={20} />
        Start Shopping
      </Link>
      
      {isLoggedIn ? (
        <Link 
          href="/profile" 
          className="w-full sm:w-auto px-8 py-4 bg-white text-[#00b207] border-2 border-[#00b207] rounded-full font-semibold hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
        >
          <UserCircle size={20} />
          Go to Profile
        </Link>
      ) : (
        <Link 
          href="/sign-up" 
          className="w-full sm:w-auto px-8 py-4 bg-white text-[#00b207] border-2 border-[#00b207] rounded-full font-semibold hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
        >
          <Users size={20} />
          Create an Account
        </Link>
      )}
    </div>
  );
}