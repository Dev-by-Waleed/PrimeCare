import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
function Footer() {
    return (
        <div className='footer-section bg-gray-800 text-white py-6 mt-10 '>
            <div className='flex flex-col md:flex-row justify-between items-center gap-4 max-w-[1200px] mx-auto px-4 text-center md:text-left text-sm md:text-base'>
                <div className='flex flex-col items-center md:items-start gap-2'>
                    <div className=' flex items-center gap-2'>
                        <Image src='/logo.png' alt='PrimeCare Logo' height={40} width={40} />
                        <span className='text-green-500 font-bold'>PrimeCare</span>
                    </div>
                    <div className='w-full h-1 bg-green-500 my-2'></div>
                    <p className='text-sm text-gray-400'>Your one-stop shop for fresh groceries delivered to your door.</p>
                </div>

                <div className='flex md:flex-row gap-10 justify-center text-center md:text-left place-items-center'>
                    <div className='flex flex-col gap-2 text-center md:text-left'>
                        <p className='font-bold'>Customer Service</p>
                        <p>Help Center</p>
                        <p>Returns</p>
                    </div>
                    <div className='flex flex-col gap-2 text-center md:text-left'>
                        <p className='font-bold'>Contact Us</p>
                        <p>Email: info@primecare.com</p>
                        <p>Phone: (123) 456-7890</p>
                    </div>
                    <div className='flex flex-col gap-2 text-center md:text-left'>
                        <p className='font-bold'>Follow Us</p>
                        <p><Link href={"#"}>Facebook</Link></p>
                        <p><Link href={"#"}>Twitter</Link></p>
                        <p><Link href={"#"}>Instagram</Link></p>
                    </div>
                </div>
            </div>
            <div className='max-w-[1200px] mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4 mt-6'>
                <p>&copy; {new Date().getFullYear()} PrimeCare. All rights reserved.</p>
            </div>
        </div>
    )
}

export default Footer