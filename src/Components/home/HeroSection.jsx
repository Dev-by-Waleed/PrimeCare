import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Van, Headset, Handbag, Package } from 'lucide-react';
function HeroSection() {
    return (
        // Added a container to keep it nicely centered with some padding
        <div className="bg-background w-full max-w-[1200px] mx-auto p-4">
            {/* GRID CONTAINER: 
        - grid-cols-1: 1 column on mobile (stack vertically)
        - md:grid-cols-3: 3 columns on medium screens and up
        - auto-rows-[265px]: Sets a fixed height for the grid rows 
        - gap-4: Adds consistent spacing between the images
      */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 auto-rows-[265px]">

                {/* Large Left Image */}
                {/* md:col-span-2 makes it 2 columns wide, md:row-span-2 makes it 2 rows tall */}
                <div className="relative w-full h-full md:col-span-2 md:row-span-2 rounded-2xl overflow-hidden">
                    <Image
                        src="/Hero1.png"
                        alt="Fresh & Healthy Organic Food"
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 66vw"
                        priority // Good practice for above-the-fold LCP images
                    />
                    <div className="absolute inset-0 bg-black/40 text-white p-6 flex flex-col justify-center rounded-2xl">
                        <h2 className='text-2xl md:text-5xl font-bold p-2'> Certified Pharmacy <br /> Quality You Can Trust
                        </h2>
                        <div>
                            <span className='p-2 text-bold'>Sale up to</span>
                            <span className='bg-orange-400 p-2 rounded-md'>30% OFF</span>
                            <p className='p-2 text-sm text-gray-300'>Free shipping on all your order.</p>
                        </div>
                        <button className="w-max bg-white/80 text-green-500 px-12 py-4 m-2 text-bold rounded-4xl hover:bg-black transition-colors duration-300 ease-in-out">
                            <Link href={"products-page"}>
                                Shop Now <ArrowRight className='inline-block ml-2' size={20} />
                            </Link>
                        </button>
                    </div>
                </div>

                {/* Top Right Image */}
                <div className="relative w-full h-full rounded-2xl overflow-hidden">
                    <Image
                        src="/Hero2.png"
                        alt="Summer Sale 75% Off"
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-opacity-40 text-black p-6 flex flex-col justify-start rounded-2xl">
                        <p>Summer Sale 75% Off</p>
                        <h1 className='text-3xl'>75% OFF</h1>
                        <p className='text-sm text-gray-500'>Only Fruit & Vegetable</p>
                        <button className=" text-green-500 px-4 py-2 rounded-md text-bold hover:text-black">
                            <Link href={"products-page"}>
                                Shop Now <ArrowRight className='inline-block ml-2' size={20} />
                            </Link>                        </button>
                    </div>
                </div>

                {/* Bottom Right Image */}
                <div className="relative w-full h-full rounded-2xl overflow-hidden">
                    <Image
                        src="/Hero3.png"
                        alt="Special Products Deal of the Month"
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-black/40 text-white px-10 flex flex-col place-items-center justify-center rounded-2xl">
                        <p>Best Deal</p>
                        <h2 className='text-4xl text-bold'>Special Products Deal of the Month</h2>
                        <button className=" text-green-500 px-4 py-4 rounded-md text-bold hover:text-black">
                            <Link href={"products-page"}>
                                Shop Now <ArrowRight className='inline-block ml-2' size={20} />
                            </Link>                        </button>
                    </div>
                </div>

            </div>

            <div className='flex w-full lg:flex-row flex-col justify-between gap-10 mt-10'>
                <div className='flex place-items-center'>
                    <Van size={24} className='text-green-500' />
                    <div className='ml-2'>
                        <p>Free Shipping</p>
                        <p className='text-text-muted'>Free shipping on all your order</p>
                    </div>
                </div>
                <div className='flex place-items-center'>
                    <Headset size={24} className='text-green-500' />
                    <div className='ml-2'>
                        <p>24/7 Support</p>
                        <p className='text-text-muted'>Instant access to Support</p>
                    </div>
                </div>
                <div className='flex place-items-center'>
                    <Handbag size={24} className='text-green-500' />
                    <div className='ml-2'>
                        <p>Easy Returns</p>
                        <p className='text-text-muted'>30-day return policy</p>
                    </div>
                </div>
                <div className='flex place-items-center'>
                    <Package size={24} className='text-green-500' />
                    <div className='ml-2'>
                        <p>Quality Guarantee</p>
                        <p className='text-text-muted'>High-quality products guaranteed</p>
                    </div>
                </div>

            </div>
        </div>
    );
}

export default HeroSection;