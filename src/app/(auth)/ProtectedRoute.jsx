"use client"
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import supabase from '@/Config/Supabase';

export default function ProtectedRoute({ children }) {
    const router = useRouter();
    const [isAuthorized, setIsAuthorized] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const checkAuth = async () => {
            // Check current session
            const { data: { session } } = await supabase.auth.getSession();

            if (!session) {
                // Not logged in? Kick them to the login page
                router.push('/login');
            } else {
                // Logged in? Let them see the page
                setIsAuthorized(true);
            }
            setIsLoading(false);
        };

        checkAuth();
    }, [router]);

    // Show a loading spinner while checking to prevent a "flash" of the protected page
    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#f9f9f9]">
                <Loader2 size={40} className="animate-spin text-[#00b207]" />
            </div>
        );
    }

    // If authorized, render the actual page content
    if (isAuthorized) {
        return <>{children}</>;
    }

    // Fallback (usually won't be seen because of the redirect)
    return null;
}