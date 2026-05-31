"use client"
import React, { useState, useContext } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Heart, Handbag, Phone, Menu, X } from 'lucide-react';
import NavLinks from './NavLinks';
import { OffCanvasContext } from '@/Context/canvas';
import { CartContext } from '@/Context/cart'; // 1. Imported CartContext

export default function Navbar() {
  const { isOpenCanvas, setOpenCanvas } = useContext(OffCanvasContext);
  const { cartItems } = useContext(CartContext); // 2. Hooked into cartItems
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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

  return (
    <nav className=" z-50 w-full border-b">
      {/* 1. Top bar → Hidden on mobile, visible on medium+ screens */}
      <div className="sticky top-0 hidden md:flex text-foreground py-2 px-4 justify-between items-center mx-auto max-w-7xl border-b">
        <p className="text-sm">Store Location: Lincoln- 344, Illinois, Chicago, USA</p>
        <div className="flex items-center gap-3">
          <Link href="/login" className="text-sm text-foreground hover:text-green-500">
            Login
          </Link>
          <Link href="/register" className="text-sm bg-green-500 px-4 py-1.5 rounded text-white hover:bg-green-600 transition-colors">
            Register
          </Link>
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
          <input
            type="text"
            placeholder="Search..."
            className="w-full border border-gray-300 rounded-l py-2 px-4 focus:outline-none focus:border-green-500"
          />
          <button className="bg-green-500 px-6 py-2 rounded-r text-white hover:bg-green-600 transition-colors">
            Search
          </button>
        </div>

        {/* Right side: Icons */}
        <div className="flex items-center gap-4">
          <Link href="/wishlist">
            <Heart className="text-text-muted hover:text-green-500 transition-colors" size={24} />
          </Link>
          
          <div className="w-px h-6 bg-gray-300" />
          
          {/* UPDATED: Cart Section */}
          <div
            onClick={() => setOpenCanvas(!isOpenCanvas)}
            className="flex items-center gap-3 group cursor-pointer"
          >
            <div className="relative">
              <Handbag className="text-text-muted group-hover:text-green-500 transition-colors" size={24} />
              
              {/* Added a notification badge for item quantity */}
              {getTotalItems() > 0 && (
                <span className="absolute -top-2 -right-2 bg-green-500 text-foreground text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {getTotalItems()}
                </span>
              )}
            </div>

            <div>
              <p className="text-text-muted text-sm">Shopping cart:</p>
              {/* Wired up the dynamic subtotal */}
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
          <div className="flex items-center w-full ">
            <input
              type="text"
              placeholder="Search..."
              className="w-full border border-gray-700 bg-gray-800 text-white rounded-l py-2 px-4 focus:outline-none focus:border-green-500"
            />
            <button className="bg-green-500 px-4 py-2 rounded-r text-white">
              Search
            </button>
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
        </div>
      )}
    </nav>
  );
}