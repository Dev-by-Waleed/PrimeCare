"use client"
import React, { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation';
function NavSearch() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [query, setQuery] = useState(searchParams.get('q') || '');

    const handleSearch = (e) => {

        e.preventDefault(); // Prevents full page reload

        if (!query.trim()) {
            router.push("/"); // Redirects to home or original page if query is empty
            return;
        }

        // Update the URL with the search query parameters
        router.push(`/search?query=${encodeURIComponent(query)}`);
    };
    return (
        <form onSubmit={handleSearch} className="flex flex-col md:flex-row flex-1 max-w-2xl w-full md:mx-8 items-center gap-2 md:gap-0">
  <input 
    type="search" 
    value={query} 
    onChange={(e) => setQuery(e.target.value)} 
    placeholder="Search..." 
    className="w-full border text-foreground border-gray-300 rounded md:rounded-l py-2 px-4 focus:outline-none focus:border-green-500" 
  /> 
  <button 
    type="submit" 
    className="bg-green-500 w-full md:w-auto px-6 py-2 rounded md:rounded-r text-white hover:bg-green-600 transition-colors"
  > 
    Search 
  </button> 
</form>

    )
}

export default NavSearch