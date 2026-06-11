"use client"
import React, { useState, useContext, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Heart, Handbag, Phone, Menu, X, LogOut } from 'lucide-react';
import NavLinks from './NavLinks';
import NavSearch from './NavSearch';
import { OffCanvasContext } from '@/Context/canvas';
import { CartContext } from '@/Context/cart';
import supabase from '@/Config/Supabase'; // <-- Added Supabase import

export default function Navbar() {
  const { isOpenCanvas, setOpenCanvas } = useContext(OffCanvasContext);
  const { cartItems } = useContext(CartContext);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  // 1. Added State for Auth
  const [session, setSession] = useState(null);

  // 2. Listen for Login/Logout events
  useEffect(() => {
    // Get the current session on load
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    // Listen for any auth changes (login, logout)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    // Cleanup subscription on unmount
    return () => subscription.unsubscribe();
  }, []);

  // 3. Helper to calculate total price
  const getSubTotal = () => {
    return cartItems?.reduce((acc, item) => {
      return acc + (item.price * item.quantity);
    }, 0) || 0;
  };

  // 4. Helper to calculate total number of items
  const getTotalItems = () => {
    return cartItems?.reduce((acc, item) => acc + item.quantity, 0) || 0;
  };

  // 5. Logout Function
  const handleLogout = async () => {
    await supabase.auth.signOut();
    // The onAuthStateChange listener will automatically update the UI!
  };

  return (
    <nav className=" z-50 w-full border-b">
      {/* 1. Top bar → Hidden on mobile, visible on medium+ screens */}
      <div className="sticky top-0 hidden md:flex text-foreground py-2 px-4 justify-between items-center mx-auto max-w-7xl border-b">
        <p className="text-sm">Store Location: Lincoln- 344, Illinois, Chicago, USA</p>
        <div className="flex items-center gap-3">
          
          {/* CONDITIONAL RENDERING: Login/Register vs Logout */}
          {session ? (
            <div className="flex items-center gap-4">
               <Link href="/profile" className="text-sm font-medium text-green-600 hover:underline">
                 My Profile
               </Link>
               <button 
                 onClick={handleLogout} 
                 className="flex items-center gap-1 text-sm bg-gray-100 px-4 py-1.5 rounded text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors"
               >
                 <LogOut size={14} />
                 Logout
               </button>
            </div>
          ) : (
            <>
              <Link href="/login" className="text-sm text-foreground hover:text-green-500">
                Login
              </Link>
              <Link href="/sign-up" className="text-sm bg-green-500 px-4 py-1.5 rounded text-white hover:bg-green-600 transition-colors">
                Register
              </Link>
            </>
          )}

        </div>
      </div>

      {/* 2. Main Navbar */}
      <div className="sticky top-0 flex justify-between items-center text-black py-2 px-4 mx-auto max-w-7xl">
        {/* Left side: Logo & Mobile Menu Icon */}
        <div className="flex items-center gap-4">
          <button
            className="block lg:hidden text-gray-800 p-1"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle Menu"
          >
            {isMenuOpen ? <X className='text-white' size={26} /> : <Menu className='text-white' size={26} />}
          </button>

          <Link href="/" className="flex items-center gap-2">
            <Image src="/logo.png" alt="PrimeCare Logo" width={100} height={50} className="w-auto h-12 lg:h-16" />
            <h1 className="font-bold text-xl hidden sm:block text-green-500">PrimeCare</h1>
          </Link>
        </div>

        {/* Center: Search bar */}
        <div className="hidden lg:flex flex-1 max-w-2xl mx-8 items-center">
          <NavSearch />
        </div>

        {/* Right side: Icons */}
        <div className="flex items-center gap-4">
          <Link href="/wishlist">
            <Heart className="text-text-muted hover:text-green-500 transition-colors" size={24} />
          </Link>

          <div className="w-px h-6 bg-gray-300" />

          {/* Cart Section */}
          <div
            onClick={() => setOpenCanvas(!isOpenCanvas)}
            className="flex items-center gap-3 group cursor-pointer"
          >
            <div className="relative">
              <Handbag className="text-text-muted group-hover:text-green-500 transition-colors" size={24} />

              {getTotalItems() > 0 && (
                <span className="absolute -top-2 -right-2 bg-green-500 text-foreground text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {getTotalItems()}
                </span>
              )}
            </div>

            <div>
              <p className="text-text-muted text-sm">Shopping cart:</p>
              <p className="font-bold text-foreground group-hover:text-green-500 transition-colors">
                ${getSubTotal().toFixed(2)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Bottom Nav Bar (Desktop Only) */}
      <div className="sticky top-0 hidden lg:block bg-gray-800 text-white">
        <div className="max-w-[1200px] mx-auto px-4 justify-between items-center py-3 flex">
          <NavLinks
            className="flex items-center gap-8"
            linkClassName="hover:text-green-400 transition-colors"
          />
          <div className="flex items-center gap-2 text-sm">
            <Phone size={18} />
            <p>(219) 555-0114</p>
          </div>
        </div>
      </div>

      {/* 4. Mobile Dropdown Menu */}
      {isMenuOpen && (
        <div className="lg:hidden bg-gray-800 text-white px-4 py-6 space-y-6">
          <div className="w-full ">
            <NavSearch />
          </div>

          <NavLinks
            className="flex flex-col gap-4"
            linkClassName="block w-full hover:text-green-400 transition-colors text-lg"
            onClick={() => setIsMenuOpen(false)}
          />

          <div className="flex items-center gap-2 pt-4 border-t border-zinc-700">
            <Phone size={20} />
            <p>(219) 555-0114</p>
          </div>
          
          {/* Mobile Auth Links */}
          <div className="flex flex-col gap-3 pt-4 border-t border-zinc-700">
            {session ? (
               <button 
                 onClick={handleLogout} 
                 className="flex items-center justify-center gap-2 w-full py-2 bg-red-500 text-white rounded hover:bg-red-600"
               >
                 <LogOut size={18} />
                 Logout
               </button>
            ) : (
              <>
                <Link href="/login" onClick={() => setIsMenuOpen(false)} className="w-full text-center py-2 border border-green-500 text-green-400 rounded">
                  Login
                </Link>
                <Link href="/sign-up" onClick={() => setIsMenuOpen(false)} className="w-full text-center py-2 bg-green-500 text-white rounded">
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}