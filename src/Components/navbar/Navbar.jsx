"use client"
import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Heart, Handbag, Phone, Menu, X } from 'lucide-react';
import NavLinks from './NavLinks';
import { useContext } from 'react';
import { OffCanvasContext } from '@/Context/canvas';
export default function Navbar() {
  const { isOpenCanvas, setOpenCanvas } = useContext(OffCanvasContext);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  console.log(isOpenCanvas)

  return (
    <nav className="w-full border-b bg-white">
      {/* 1. Top bar → Hidden on mobile, visible on medium+ screens */}
      <div className="hidden md:flex bg-white text-gray-500 py-2 px-4 justify-between items-center mx-auto max-w-7xl border-b">
        <p className="text-sm">Store Location: Lincoln- 344, Illinois, Chicago, USA</p>
        <div className="flex items-center gap-3">
          <Link href="/login" className="text-sm text-gray-600 hover:text-black">
            Login
          </Link>
          <Link href="/register" className="text-sm bg-green-500 px-4 py-1.5 rounded text-white hover:bg-green-600 transition-colors">
            Register
          </Link>
        </div>
      </div>

      {/* 2. Main Navbar */}
      <div className="flex justify-between items-center bg-white text-black py-2 px-4 mx-auto max-w-7xl">
        {/* Left side: Logo & Mobile Menu Icon */}
        <div className="flex items-center gap-4">
          {/* Mobile Menu Icon (Right of logo, visible only on mobile) */}
          <button
            className="block lg:hidden text-gray-800 p-1"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle Menu"
          >
            {isMenuOpen ? <X size={26} /> : <Menu size={26} />}
          </button>

          <Link href="/" className="flex items-center gap-2">
            {/* Added standard dimensions for the placeholder */}
            <Image src="/logo.png" alt="PrimeCare Logo" width={100} height={50} className="w-auto h-12 lg:h-16" />
            <h1 className="font-bold text-xl hidden sm:block text-green-500">PrimeCare</h1>
          </Link>
        </div>

        {/* Center: Search bar → Hidden on mobile, visible on large screens */}
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
            <Heart className="text-gray-600 hover:text-green-500 transition-colors" size={24} />
          </Link>
          {/* divider */}
          <div className="w-px h-6 bg-gray-300" />
          <div
            onClick={() => setOpenCanvas(!isOpenCanvas)}
            className="flex items-center gap-5 group cursor-pointer"
          >
            <Handbag
              className="text-gray-600 group-hover:text-green-500 transition-colors"
              size={24}
            />

            <div>
              <p className="text-gray-500">Shopping cart:</p>
              <p className="group-hover:text-green-500 transition-colors">$</p>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Bottom Nav Bar (Desktop Only) */}
      <div className="hidden lg:block bg-gray-800 text-white">
        <div className="max-w-[1200px] mx-auto px-4 justify-between items-center py-3 flex">

          {/* Desktop NavLinks */}
          <NavLinks
            className="flex items-center gap-8"
            linkClassName="hover:text-green-400 transition-colors"
          />

          {/* Phone */}
          <div className="flex items-center gap-2 text-sm">
            <Phone size={18} />
            <p>(219) 555-0114</p>
          </div>
        </div>
      </div>

      {/* 4. Mobile Dropdown Menu (Opens below the main nav when clicked) */}
      {isMenuOpen && (
        <div className="lg:hidden bg-gray-800 text-white px-4 py-6 space-y-6">

          {/* Mobile Search Input */}
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

          {/* Mobile NavLinks */}
          <NavLinks
            className="flex flex-col gap-4"
            linkClassName="block w-full hover:text-green-400 transition-colors text-lg"
            onClick={() => setIsMenuOpen(false)}
          />

          {/* Mobile Phone Contact */}
          <div className="flex items-center gap-2 pt-4 border-t border-zinc-700">
            <Phone size={20} />
            <p>(219) 555-0114</p>
          </div>
        </div>
      )}
    </nav>
  );
}