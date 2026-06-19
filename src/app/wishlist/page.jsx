"use client"
import React, { useEffect, useState, useContext } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import supabase from '@/Config/Supabase'
// I added the missing icons that your HTML was asking for (ShoppingBag, Trash2, etc.)
import { HeartCrack, Loader2, UserCheck, ShoppingBag, Trash2, ArrowLeft } from 'lucide-react' 
import { CartContext } from '@/Context/cart'
import toast from 'react-hot-toast'

export default function WishlistPage() {
  // Matched exactly to what your HTML needs:
  const [wishlistItems, setWishlistItems] = useState([])
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true) 
  
  const { dispatch } = useContext(CartContext)

  useEffect(() => {
    fetchWishlist()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser(session.user)
        fetchWishlist()
      } else {
        setUser(null)
        setWishlistItems([])
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  // 1. Fetch Wishlist Items (Joined with Products)
  const fetchWishlist = async () => {
    try {
      setIsLoading(true)
      const { data: { session } } = await supabase.auth.getSession()
      
      if (!session?.user) {
        setUser(null)
        setIsLoading(false)
        return
      }

      setUser(session.user)
      
      // We fetch the wishlist items AND the product details at the same time
      const { data, error } = await supabase
        .from('wishlist_items')
        .select(`
          id,
          product_id,
          products (*)
        `)
        .eq('user_id', session.user.id)
        
      if (error) throw error;

      if (data) {
        setWishlistItems(data)
      }
    } catch (error) {
      console.error("Error fetching wishlist:", error.message)
      toast.error("Failed to load your wishlist.")
    } finally {
      setIsLoading(false)
    }
  }

  // 2. Handle Remove from Wishlist (Optimistic UI)
  const handleRemove = async (wishlistItemId) => {
    const previousItems = [...wishlistItems]
    
    // Instantly remove from UI
    setWishlistItems(prev => prev.filter(item => item.id !== wishlistItemId))

    try {
      const { error } = await supabase
        .from('wishlist_items')
        .delete()
        .eq('id', wishlistItemId)
      
      if (error) throw error;
      toast.success("Removed from wishlist")
    } catch (error) {
      // Revert if DB fails
      setWishlistItems(previousItems)
      toast.error("Failed to remove item.")
    }
  }

  // 3. Add to Cart
  const addToCart = (event, productData) => {
    event.stopPropagation()
    try {
      dispatch({
        type: "addProduct",
        payload: { ...productData, quantity: 1 } 
      })
      toast.success(`${productData.productName || 'Item'} added to cart!`)
    } catch (error) {
      toast.error("Failed to add item to cart.")
    }
  }

  // ================= STATE 1: LOADING =================
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#f9f9f9] flex flex-col items-center justify-center gap-4">
        <Loader2 className="animate-spin text-[#00b207]" size={40} />
        <p className="text-gray-500 font-medium">Loading your fresh selections...</p>
      </div>
    );
  }

  // ================= STATE 2: NOT LOGGED IN =================
  if (!user) {
    return (
      <div className="min-h-screen bg-[#f9f9f9] py-20 px-4">
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-16 text-center max-w-2xl mx-auto">
          <UserCheck size={64} className="text-gray-300 mx-auto mb-6" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Please Log In</h2>
          <p className="text-gray-500 mb-8 leading-relaxed">
            You need to be logged into your PrimeCare account to view, save, and manage your permanent wishlist items.
          </p>
          <Link
            href="/login"
            className="inline-flex items-center gap-2 bg-[#00b207] text-white px-8 py-4 rounded-full font-semibold hover:bg-[#009906] transition-colors shadow-md"
          >
            Go to Login Page
          </Link>
        </div>
      </div>
    );
  }

  // ================= MAIN UI =================
  return (
    <div className="min-h-screen bg-[#f9f9f9] pb-20">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 py-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Your Wishlist</h1>
          <p className="text-gray-600">Your curated collection of premium organic items.</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">

        {/* ================= STATE 3: LOGGED IN BUT EMPTY ================= */}
        {wishlistItems.length === 0 ? (
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-16 text-center max-w-2xl mx-auto">
            <HeartCrack size={64} className="text-gray-300 mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Your wishlist is empty</h2>
            <p className="text-gray-500 mb-8">
              Looks like you haven't saved any fresh produce yet. Tap the heart icons on our shop page!
            </p>
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 bg-[#00b207] text-white px-8 py-4 rounded-full font-semibold hover:bg-[#009906] transition-colors"
            >
              <ArrowLeft size={20} />
              Browse the Shop
            </Link>
          </div>
        ) : (

          /* ================= STATE 4: LOGGED IN & HAS ITEMS ================= */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {wishlistItems.map((item) => {
              // Safety catch: Make sure the product join exists
              const product = item.products;
              if (!product) return null;

              return (
                <div key={item.id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-lg transition-all group">

                  {/* Image Container */}
                  <div className="relative h-64 bg-gray-50 p-6 flex items-center justify-center">
                    <Image
                      src={product.productImg || '/logo.png'}
                      alt={product.productName}
                      width={200}
                      height={200}
                      className="object-contain group-hover:scale-105 transition-transform duration-300"
                    />
                    {/* Out of Stock Badge */}
                    {!product.stockQty && (
                      <span className="absolute top-4 left-4 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                        Out of Stock
                      </span>
                    )}
                  </div>

                  {/* Details */}
                  <div className="p-6">
                    <h3 className="font-bold text-lg text-gray-900 mb-1 truncate">{product.productName}</h3>
                    <p className="text-[#00b207] font-bold text-xl mb-4">${Number(product.price).toFixed(2)}</p>

                    {/* Action Panel */}
                    <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                      <button
                        onClick={(e) => addToCart(e, product)}
                        disabled={!product.stockQty}
                        className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-full font-semibold transition-colors ${product.stockQty
                          ? 'bg-[#00b207] text-white hover:bg-[#009906]'
                          : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          }`}
                      >
                        <ShoppingBag size={18} />
                        {product.stockQty ? 'Add to Cart' : 'Unavailable'}
                      </button>

                      <button
                        onClick={() => handleRemove(item.id)}
                        className="p-3 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                        title="Remove item"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </div>

                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}