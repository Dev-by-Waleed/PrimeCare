import React from 'react'
import Image from 'next/image'
import { ArrowRight } from 'lucide-react'
function Banners() {
    return (
        <div className='banners-section max-w-[1200px] grid grid-1 md:grid-cols-3 gap-5 mx-auto p-4'>
            <div className='relative rounded-2xl overflow-hidden'>
                <Image src="/VegeBanner.png" alt="Vegetable Banner" width={1200} height={400} />
                <div className="absolute inset-0 bg-black/10 text-white p-6 flex flex-col justify-start items-center rounded-2xl">
                    <p className='text-sm text-gray-300'>Best Deals</p>
                    <h2 className='text-3xl text-bold'>Sale of the Month</h2>
                    <div className="w-full h-1 bg-gray-300 my-4"></div>
                    <div className='flex gap-4 text-center mb-4'>
                        <div>
                            <p>00</p>
                            <p>Days</p>
                        </div>
                        :
                        <div>
                            <p>02</p>
                            <p>Hours</p>
                        </div>
                        :
                        <div>
                            <p>18</p>
                            <p>Minutes</p>
                        </div>
                    </div>
                    <button className="w-max bg-white text-green-500 px-12 py-2 m-2 text-bold rounded-4xl hover:bg-gray-200 transition-colors hover:cursor-pointer">
                        Shop Now <ArrowRight className='inline-block ml-2' size={20} />
                    </button>
                </div>
            </div>
            <div className='relative rounded-2xl overflow-hidden'>
                <Image src="/MeatBanner.png" alt="Meat Banner" width={1200} height={400} />
                <div className="absolute inset-0 bg-black/10 text-white p-6 flex flex-col justify-start items-center rounded-2xl">
                    <p className='text-sm text-gray-300'>85% Fat Free</p>
                    <h2 className='text-3xl text-bold'>Low-Fat Meat</h2>
                    <div className="w-full h-1 bg-gray-300 my-4"></div>
                    <div className='flex gap-4 text-center mb-8'>
                        <span>Started at</span>
                        <span className='text-green-500 text-xl font-bold'>$79.99</span>
                    </div>
                    <button className="w-max bg-white text-green-500 px-12 py-2 m-2 text-bold rounded-4xl hover:bg-gray-200 transition-colors hover:cursor-pointer">
                        Shop Now <ArrowRight className='inline-block ml-2' size={20} />
                    </button>
                </div>
            </div>
            <div className='relative rounded-2xl overflow-hidden'>
                <Image src="/FruitBanner.png" alt="FruitBanner" width={1200} height={400} />
                <div className="absolute inset-0 bg-black/10 text-white p-6 flex flex-col justify-start items-center rounded-2xl">
                    <p className='text-sm text-gray-300'>Summer Sale</p>
                    <h2 className='text-3xl text-bold'>100% Fresh Fruit</h2>
                    <div className="w-full h-1 bg-gray-300 my-4"></div>
                    <div className='flex gap-4 text-center mb-8'>
                        <span>Up to</span>
                        <span className='bg-black rounded text-yellow-400 text-xl font-bold px-2'>64% OFF</span>
                    </div>
                    <button className="w-max bg-white text-green-500 px-12 py-2 m-2 text-bold rounded-4xl hover:bg-gray-200 transition-colors hover:cursor-pointer">
                        Shop Now <ArrowRight className='inline-block ml-2' size={20} />
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Banners