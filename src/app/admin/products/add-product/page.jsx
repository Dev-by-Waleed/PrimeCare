"use client"
import React, { useState, useEffect } from 'react'
import supabase from '@/Config/Supabase';
import ProductModal from '@/Components/ProductModal';
function page() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [products, setProducts] = useState([]);
    useEffect(() => {
        getProducts()
    }, [])
    const addProduct = () => {
        setIsModalOpen(true);
    }
    const closeModal = () => {
        setIsModalOpen(false);
    }

    const getProducts = async () => {
        const { data, error } = await supabase.from('products').select('*');
        if (error) {
            console.error('Error fetching products:', error);
        } else {
            setProducts(data);
            console.log(data)

        }
    }
    return (
        <div className='min-h-screen flex flex-col bg-gray-100'>
            <div className='max-w-7xl mx-auto px-4 py-10'>
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Add New Product</h1>
                    <p className="mt-1 text-sm text-gray-500">
                        Upload a new item to your pharmacy & safe products inventory.
                    </p>
                </div>
                <div>
                    <button
                        onClick={addProduct}
                        className="mt-6 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                    >
                        Add Product
                    </button>
                </div>
                <div className='mt-10'>
                    {/* Render products here */}
                </div>
                <ProductModal isModalOpen={isModalOpen} closeModal={closeModal} />
            </div>
        </div>
    );
}

export default page