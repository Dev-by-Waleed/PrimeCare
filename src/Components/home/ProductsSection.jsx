"use client"
import React, { useEffect, useState, useContext } from 'react'
import Image from 'next/image'
import supabase from '@/Config/Supabase'
import { Heart } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { CartContext } from '@/Context/cart'

function ProductsSection() {
    const [products, setProducts] = useState([])
    const [user, setUser] = useState(null)
    const [wishlistIds, setWishlistIds] = useState([]) // Tracks which products are wishlisted
    
    const router = useRouter()
    const { dispatch } = useContext(CartContext)

    useEffect(() => {
        getProducts()
        checkAuthAndWishlist()
    }, [])

    // 1. Fetch Products
    const getProducts = async () => {
        const { data, error } = await supabase.from("products").select("*")
        if (data) {
            setProducts(data)
        } else if (error) {
            console.error("Error fetching products:", error)
        }
    }

    // 2. Check Login Status & Fetch their Wishlist
    const checkAuthAndWishlist = async () => {
        const { data: { session } } = await supabase.auth.getSession()
        if (session?.user) {
            setUser(session.user)
            
            // Get all product_ids this user has saved
            const { data, error } = await supabase
                .from('wishlist_items')
                .select('product_id')
                .eq('user_id', session.user.id)
                
            if (data) {
                // Extract just the IDs into an array for easy checking
                const ids = data.map(item => item.product_id)
                setWishlistIds(ids)
            }
        }
    }

    // 3. Handle Heart Click (Add/Remove from DB)
    const toggleWishlist = async (event, productId) => {
        event.stopPropagation() // Stops the click from redirecting to the product page

        if (!user) {
            alert("Please log in to save items to your wishlist!")
            return
        }

        const isWishlisted = wishlistIds.includes(productId)

        if (isWishlisted) {
            // OPTIMISTIC UI: Remove from local state immediately
            setWishlistIds(wishlistIds.filter(id => id !== productId))
            
            // Remove from Supabase
            await supabase
                .from('wishlist_items')
                .delete()
                .match({ user_id: user.id, product_id: productId })
        } else {
            // OPTIMISTIC UI: Add to local state immediately
            setWishlistIds([...wishlistIds, productId])
            
            // Add to Supabase
            await supabase
                .from('wishlist_items')
                .insert({ user_id: user.id, product_id: productId })
        }
    }

    const addToCart = (event, productData) => {
        event.stopPropagation()
        dispatch({
            type: "addProduct",
            payload: productData // Standardized to match the reducer's action.payload
        })
    }

    return (
        <div className='bg-background max-w-[1200px] mx-auto p-4'>
            <h3 className='text-xl font-bold py-5'>Popular Products</h3>
            <div className='products-container grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4'>
                {Array.isArray(products) &&
                    products.slice(0, 10).map((item) => {
                        // Check if this specific item is in the user's wishlist array
                        const isSaved = wishlistIds.includes(item.id)

                        return (
                            <div onClick={() => { router.push(`/product-page/${item.id}`) }} key={item.id}
                                className='relative product-item bg-white text-black rounded-lg shadow-md p-2 lg:p-4 flex flex-col justify-between items-center border-2 border-green-500 hover:cursor-pointer hover:opacity-80 transition-opacity text-center'>
                                <div className='relative w-full h-48 rounded-lg overflow-hidden'>
                                    <Image src={item.productImg} alt={item.productName} fill className='object-cover' />
                                </div>
                                
                                <div className='absolute top-0 left-0 flex items-center gap-2'>
                                    <div className='flex items-center justify-center w-full mt-2'>
                                        {item.isBestseller && <span className='bg-yellow-400 text-black text-sm font-bold px-2 py-1 rounded'>Bestseller</span>}
                                        {item.isNew && <span className='bg-blue-400 text-white text-sm font-bold px-2 py-1 rounded ml-2'>New</span>}
                                    </div>
                                </div>
                                
                                <div className='flex flex-col items-center justify-center w-full py-2'>
                                    <h4 className='text-lg font-semibold py-2'>{item.productName}</h4>
                                    <p className='text-gray-600 text-sm py-1 hidden md:block'>{item.shortDesc}</p>
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
                                    <button onClick={(e) => addToCart(e, item)} className='bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition-colors'>
                                        Add to Cart
                                    </button>
                                    
                                    {/* UPDATED HEART BUTTON */}
                                    <button onClick={(e) => toggleWishlist(e, item.id)}>
                                        <Heart 
                                            className={`w-6 h-6 transition-colors ml-2 ${
                                                isSaved 
                                                ? 'text-red-500 fill-red-500' 
                                                : 'text-gray-500 hover:text-red-500'
                                            }`} 
                                        />
                                    </button>
                                </div>
                            </div>
                        )
                    })}
            </div>
        </div>
    )
}

export default ProductsSection