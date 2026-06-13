import React from 'react';
import supabase from '@/Config/Supabase';
import SearchResultsGrid from './SearchResultsGrid';

export default async function SearchPage({ searchParams }) {
    const resolvedParams = await searchParams;
    const searchQuery = resolvedParams?.query || "";

    let products = [];

    // Only fetch if a query exists
    if (searchQuery) {
        // .ilike() searches for the query anywhere inside the productName
        const { data, error } = await supabase
            .from('products')
            .select('*')
            .ilike('productName', `%${searchQuery}%`)
            .order('created_at', { ascending: false });

        if (error) {
            console.error("Error fetching search results:", error.message);
        } else {
            products = data || [];
        }
    }

    return (
        <div className="min-h-screen font-sans bg-background text-foreground antialiased py-10 bg-side-background">
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 bg-background p-10 rounded-lg">
                
                {/* Page Header */}
                <div className="mb-10 text-center md:text-left border-b border-border-ui pb-6">
                    <h1 className="text-4xl font-bold tracking-tight mb-2">Search Results</h1>
                    <p className="text-text-muted">
                        Showing results for: <strong className="text-foreground">"{searchQuery || "None"}"</strong>
                    </p>
                </div>

                {/* Pass the server-fetched data to our interactive client grid */}
                <SearchResultsGrid products={products} searchQuery={searchQuery} />
                
            </main>
        </div>
    );
}