"use client"
import React from 'react';
import { PackageX, ArrowLeft, Search, Filter } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function page() {
  const router = useRouter();

  return (
    <div className="min-h-screen font-sans text-[#1a1a1a] antialiased">
      
      {/* ================= PAGE HEADER ================= */}
      <div className=" border-b border-gray-200 py-8 lg:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl lg:text-4xl font-bold text-foreground tracking-tight">All Products</h1>
          <p className="text-sm text-text-muted mt-2">Browse our collection of fresh, organic produce.</p>
        </div>
      </div>

      {/* ================= MAIN LAYOUT AREA ================= */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="bg-background flex flex-col lg:flex-row gap-8">
          
          {/* Fake Sidebar / Filters Skeleton (Establishes the theme) */}
          <div className="w-full lg:w-64 flex-shrink-0 space-y-6 hidden lg:block opacity-50 select-none">
            <div className=" p-6 rounded-xl border border-gray-100 shadow-sm">
              <div className="flex items-center gap-2 mb-6 text-gray-800 font-bold border-b border-gray-100 pb-4">
                <Filter size={18} /> Filters
              </div>
              <div className="space-y-4">
                <div className="h-3 w-3/4 bg-gray-200 rounded-full"></div>
                <div className="h-3 w-1/2 bg-gray-200 rounded-full"></div>
                <div className="h-3 w-2/3 bg-gray-200 rounded-full"></div>
                <div className="h-3 w-5/6 bg-gray-200 rounded-full"></div>
                <div className="h-3 w-1/3 bg-gray-200 rounded-full"></div>
              </div>
            </div>
            
            <div className=" p-6 rounded-xl border border-gray-100 shadow-sm">
              <div className="h-4 w-1/3 bg-gray-200 rounded-full mb-6"></div>
              <div className="space-y-4">
                <div className="h-3 w-full bg-gray-200 rounded-full"></div>
                <div className="h-3 w-4/5 bg-gray-200 rounded-full"></div>
              </div>
            </div>
          </div>

          {/* ================= EMPTY STATE CONTAINER ================= */}
          <div className="flex-1 border border-gray-100 rounded-2xl shadow-sm flex flex-col items-center justify-center py-32 px-4 text-center">
            
            {/* Visual Illustration */}
            <div className="w-24 h-24 bg-[#fbeae9] rounded-full flex items-center justify-center mb-6 shadow-inner relative">
              <PackageX size={40} className="text-[#ea4335] relative z-10" />
              {/* Decorative background circle */}
              <div className="absolute inset-0 border-4 border-white rounded-full scale-110 opacity-50"></div>
            </div>
            
            {/* Text Content */}
            <h2 className="text-3xl font-bold text-foreground mb-3 tracking-tight">
              Nothing to see here
            </h2>
            
            <p className="text-text-muted max-w-md mx-auto mb-10 leading-relaxed text-sm">
              We couldn't find any products matching your current criteria. The inventory might be updating, or try adjusting your filters.
            </p>
            
            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <button 
                onClick={() => router.push('/')}
                className="flex items-center justify-center gap-2 bg-[#00b207] hover:bg-[#009906] text-white font-semibold py-3 px-8 rounded-full shadow-md shadow-[#00b207]/20 transition-transform active:scale-95"
              >
                <ArrowLeft size={18} />
                Return to Home
              </button>
              
              <button 
                className="flex items-center justify-center gap-2 bg-white border border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-gray-700 font-semibold py-3 px-8 rounded-full transition-colors active:scale-95"
              >
                <Search size={18} />
                Clear Filters
              </button>
            </div>
            
          </div>

        </div>
      </div>
    </div>
  );
}