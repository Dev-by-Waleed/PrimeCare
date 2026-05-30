"use client"
import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ChevronRight, ChevronLeft } from 'lucide-react'

// Extract data into an array so we can easily rotate it
const categoryData = [
    { id: 1, src: "/Accu-Chek_Instant_Blood_Glucose_Strips.png", alt: "Devices & Support" },
    { id: 2, src: "/Vegetables.png", alt: "Vegetables" },
    { id: 3, src: "/Fruits.png", alt: "Fruits" },
    { id: 4, src: "/Panadol_Tablets_500mg.png", alt: "Medicine" },
    { id: 5, src: "/Nutrilov_Protein_Peanut_Butter_&_Chocolate_Chip_Bar_50g.png", alt: "Protein" },
    { id: 6, src: "/Bonanza_Code_Green_30ml.png", alt: "Perfume" },
    { id: 7, src: "/Acnes_Creamy_Wash.png", alt: "Skincare" },
];

function CategoriesSection() {
    const [categories, setCategories] = useState(categoryData);

    // Moves the first item to the end of the array
    const handleNext = () => {
        setCategories((prev) => {
            const newArray = [...prev];
            const first = newArray.shift();
            newArray.push(first);
            return newArray;
        });
    };

    // Moves the last item to the start of the array
    const handlePrev = () => {
        setCategories((prev) => {
            const newArray = [...prev];
            const last = newArray.pop();
            newArray.unshift(last);
            return newArray;
        });
    };

    // Auto-scrolls the carousel every 3 seconds
    useEffect(() => {
        const timer = setInterval(() => {
            handleNext();
        }, 3000);

        // Cleanup the timer when the component unmounts
        return () => clearInterval(timer);
    }, []);

    return (
        <div className='bg-background categories-section p-4 max-w-[1200px] mx-auto'>
            <div className='flex justify-between'>
                <h3 className='text-xl font-bold py-5'>Popular Categories</h3>
                <div className='py-5 flex gap-2'>
                    <button
                        onClick={handlePrev}
                        className='p-2 bg-green-500 rounded-full hover:bg-green-600 transition-colors'
                    >
                        <ChevronLeft size={20} />
                    </button>
                    <button
                        onClick={handleNext}
                        className='p-2 bg-green-500 rounded-full hover:bg-green-600 transition-colors'
                    >
                        <ChevronRight size={20} />
                    </button>
                </div>
            </div>

            {/* We slice the array to exactly 6 items so the grid always stays perfect */}
            <div className='categories-container grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 justify-items-center'>
                {categories.slice(0, 6).map((item) => (
                    <div key={item.id} className='hover:cursor-pointer'>

                        <Link href={"products-page"}>
                        <div className='category-item relative w-36 h-36 sm:w-40 sm:h-40 lg:w-48 lg:h-48 bg-white rounded-lg shadow-md border-2 border-green-500 hover:opacity-80 transition-opacity overflow-hidden'>

                            <Image
                                src={item.src}
                                alt={item.alt}
                                fill
                                className='object-cover'
                            />
                        </div>

                        <div className='category-name text-center mt-2 text-sm sm:text-base font-semibold'>
                            {item.alt}
                        </div>
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    )
}
export default CategoriesSection