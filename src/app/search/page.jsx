import React from 'react'

async function page({ searchParams }) {
    const resolvedParams = await searchParams
    const searchQuery = resolvedParams?.query || "";


    return (
        <div className='min-h-screen'>
            <div className='max-w-7xl mx-auto py-8 lg:py-12'>
                <h1>Search Results</h1>
            <p>Showing results for: <strong>{searchQuery || "None"}</strong></p>

            {/* Loop through results here */}
            {searchQuery ? (
                <ul>
                    <li>Result item 1 matching "{searchQuery}"</li>
                    <li>Result item 2 matching "{searchQuery}"</li>
                </ul>
            ) : (
                <p>Please enter a search term.</p>
            )}
            </div>
        </div>)
}

export default page