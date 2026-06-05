"use client"
import React, { useEffect, useState } from 'react'
import Link from 'next/link';
import supabase from '@/Config/Supabase';
import Image from 'next/image';

function Page() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  
  // 1. Pagination States
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; // Change this number to control items per page

  useEffect(() => {
    getProducts();
  }, []);

  // 2. Reset to page 1 whenever the user types a new search query
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  const getProducts = async () => {
    setIsLoading(true);
    await supabase.from("products").select("*")
      .then((resp) => {
        setProducts(resp.data || []);
      });
    setIsLoading(false);
  };

  // Filter products based on search
  const filteredProducts = products.filter((product) => {
    const query = searchQuery.toLowerCase();
    return (
      product.productName?.toLowerCase().includes(query) ||
      product.category?.toLowerCase().includes(query)
    );
  });

  // 3. Pagination Math
  const indexOfLastProduct = currentPage * itemsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - itemsPerPage;
  
  // Slice the filtered array so we only display the chunk for the active page
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#00b207]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-6xl mx-auto">

        {/* Top Control Bar */}
        <div className="bg-background p-4 rounded-lg flex flex-col sm:flex-row sm:items-center sm:justify-between pb-6 mb-6 gap-4 border-b border-gray-200">
          <div>
            <h1 className="text-2xl font-bold text-foreground tracking-tight">Products Inventory</h1>
            <p className="mt-1 text-sm text-text-muted">
              Manage your pharmacy & safe products storefront listings.
            </p>
          </div>

          <div className="bg-background flex flex-col sm:flex-row gap-3 w-full sm:w-auto self-end sm:self-auto">
            {/* Search Input */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search product Name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-64 pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#00B207] focus:border-[#00B207] transition-all"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>

            {/* Add Product Button */}
            <button
              type="button"
              className="px-4 py-2 border border-transparent rounded-lg text-sm font-medium text-white bg-[#00B207] hover:bg-[#009906] shadow-sm transition-colors flex items-center gap-1.5"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <Link href={"/admin/products/add-product"}>Add Product</Link>
            </button>
          </div>
        </div>

        {/* Filters Quick Row */}
        <div className="bg-background flex gap-2 mb-6 p-2 overflow-x-auto rounded-2xl">
          <button className="px-4 py-1.5 bg-[#00B207] text-white text-xs font-medium rounded-full">All Products</button>
          <button className="px-4 py-1.5 text-text-muted border-gray-200 hover:border-gray-300 text-xs font-medium rounded-full transition-colors">Active</button>
          <button className="px-4 py-1.5 text-text-muted border-gray-200 hover:border-gray-300 text-xs font-medium rounded-full transition-colors">Draft</button>
          <button className="px-4 py-1.5 text-text-muted border-gray-200 hover:border-gray-300 text-xs font-medium rounded-full transition-colors">Out of Stock</button>
        </div>

        {/* Main Data Table Card */}
        <div className="bg-background rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 text-left">
              <thead className="bg-gray-50 text-xs font-semibold text-text-muted uppercase tracking-wider border-b border-gray-200">
                <tr>
                  <th scope="col" className="px-6 py-4">Product Details</th>
                  <th scope="col" className="px-6 py-4">ID</th>
                  <th scope="col" className="px-6 py-4">Category</th>
                  <th scope="col" className="px-6 py-4">Price</th>
                  <th scope="col" className="px-6 py-4">Discount</th>
                  <th scope="col" className="px-6 py-4">Stock</th>
                  <th scope="col" className="px-6 py-4">Status</th>
                  <th scope="col" className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm text-text-muted">
                
                {/* 4. Map over currentProducts (the paginated chunk) instead of all filtered products */}
                {currentProducts.length > 0 ? (
                  currentProducts.map((product) => (
                    <tr key={product.id} className="hover:bg-gray-50/10 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-3">
                          <div className="h-12 w-12 flex-shrink-0 bg-gray-100 border border-gray-200 rounded-lg overflow-hidden flex items-center justify-center">
                            <Image src={product.productImg} alt={product.productName} width={500} height={500}></Image>
                          </div>
                          <div>
                            <div className="font-semibold text-foreground">{product.productName}</div>
                            <div className="text-xs text-gray-400 max-w-[180px] truncate">Fresh organic item description...</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-550 font-mono text-xs">{product.id}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2.5 py-1 text-xs font-medium rounded-md bg-gray-100 text-gray-700">
                          {product.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap font-medium">
                        {product.discount ? (
                          <div className="flex flex-col">
                            <span className="text-foreground">${(product.price - product.price * (product.discount / 100)).toFixed(2)}</span>
                            <span className="text-xs text-text-muted line-through font-normal">${product.price}</span>
                          </div>
                        ) : (
                          <span className="text-foreground">${product.price}</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap font-medium">
                        <span className="text-foreground">{product.discount ? `${product.discount}%` : '0%'}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`font-semibold ${product.stockQty === 0 ? 'text-red-500' : 'text-text-muted'}`}>{product.stockQty}</span>
                        <span className="text-xs text-gray-400 block">units</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {product.status && (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-green-50 text-[#00B207]">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#00B207]"></span>Active
                          </span>
                        )}
                        {!product.status && (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                            <span className="w-1.5 h-1.5 rounded-full bg-gray-400"></span>Draft
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end space-x-2">
                          <button className="p-1.5 text-gray-400 hover:text-[#00B207] hover:bg-gray-100 rounded-md transition-all" title="Edit Product">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                          </button>
                          <button className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-all" title="Delete Product">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" className="px-6 py-8 text-center text-gray-500">No products found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* 5. Dynamic Pagination Bar */}
          <div className="px-6 py-4 flex items-center justify-between border-t border-gray-100">
            <div className="text-xs text-text-muted">
              Showing <span className="font-medium">{filteredProducts.length === 0 ? 0 : indexOfFirstProduct + 1}</span> to{' '}
              <span className="font-medium">{Math.min(indexOfLastProduct, filteredProducts.length)}</span> of{' '}
              <span className="font-medium">{filteredProducts.length}</span> entries
            </div>
            
            <div className="flex space-x-2">
              {/* Previous Button */}
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className={`px-3 py-1 border rounded text-xs font-medium transition-colors ${
                  currentPage === 1
                    ? 'border-gray-200 text-gray-400 cursor-not-allowed bg-gray-50'
                    : 'border-gray-200 text-gray-700 hover:bg-gray-50'
                }`}
              >
                Previous
              </button>

              {/* Next Button */}
              <button
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages || totalPages === 0}
                className={`px-3 py-1 border rounded text-xs font-medium transition-colors ${
                  currentPage === totalPages || totalPages === 0
                    ? 'border-gray-200 text-gray-400 cursor-not-allowed bg-gray-50'
                    : 'border-gray-200 text-gray-700 hover:bg-gray-50'
                }`}
              >
                Next
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default Page;