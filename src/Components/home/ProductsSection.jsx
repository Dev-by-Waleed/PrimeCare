import React from 'react'
import Image from 'next/image'
import categoryData from '@/data/products'
import { Heart } from 'lucide-react'
function ProductsSection() {
    return (
        <div className='max-w-[1200px] mx-auto p-4'>
            <h3 className='text-xl font-bold py-5'>Popular Products</h3>
            <div className='products-container grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4'>
                {Array.isArray(categoryData) &&
                    categoryData.slice(0, 10).map((item) => (
                        <div key={item.id} className='relative product-item bg-white text-black rounded-lg shadow-md p-2 lg:p-4 flex flex-col justify-between items-center border-2 border-green-500 hover:cursor-pointer hover:opacity-80 transition-opacity text-center'>  {/*  hover:bg-black/40 hover:opacity-100 transition-opacity  hover:text-white text-center*/}
                            <div className='relative w-full h-48 rounded-lg overflow-hidden'>
                                <Image src={item.image} alt={item.alt} fill className='object-cover' />
                            </div>
                            <div className='absolute top-0 left-0 flex items-center gap-2'>
                                <div className='flex items-center justify-center w-full mt-2'>
                                    {item.isBestseller && <span className='bg-yellow-400 text-black text-sm font-bold px-2 py-1 rounded'>Bestseller</span>}
                                    {item.isNew && <span className='bg-blue-400 text-white text-sm font-bold px-2 py-1 rounded ml-2'>New</span>}
                                </div>
                            </div>
                            <div className='flex flex-col items-center justify-center w-full py-2'>
                                <h4 className='text-lg font-semibold py-2'>{item.name}</h4>
                                <p className='text-gray-600 text-sm py-1 hidden md:block'>{item.shortDescription}</p>
                            </div>
                            <div className='flex items-center justify-between w-full py-2 lg:flex-row flex-col gap-2'>
                                <span className='text-xl font-bold'>${item.price.toFixed(2)}</span>
                                {item.discount > 0 && (
                                    <span className='bg-red-500 text-white text-sm font-bold px-2 py-1 rounded'>
                                        Save {item.discount}%
                                    </span>
                                )}
                            </div>
                            <div className='flex items-center justify-center w-full'>
                                <button className='bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition-colors'>
                                    Add to Cart
                                </button>
                                <button>
                                    <Heart className="w-6 h-6 text-gray-500 hover:text-red-500 transition-colors ml-2" />
                                </button>
                            </div>
                        </div>
                    ))}
            </div>

        </div>
    )
}

export default ProductsSection