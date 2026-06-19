"use client"
import React, { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import supabase from '@/Config/Supabase';
import toast from 'react-hot-toast';

export default function ProtectedRoute({ children, adminOnly = false }) {
  const router = useRouter();
  const ran = useRef(false);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (ran.current) return;
    ran.current = true;
    const checkAuth = async () => {
      // 1. Get the current user
      const { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        router.push('/login');
        return;
      }

      // 2. If we need to check for Admin role
      if (adminOnly) {
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', session.user.id)
          .single();

        if (error || profile?.role !== 'admin') {
          toast.error('Unauthorized access. Admins only.');

          router.push('/'); // Kick them out if not admin
          return;
        }
      }

      // 3. Passed all checks
      setIsAuthorized(true);
      setIsLoading(false);
    };

    checkAuth();
  }, [router, adminOnly]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 size={40} className="animate-spin text-[#00b207]" />
      </div>
    );
  }

  return <>{children}</>;
}