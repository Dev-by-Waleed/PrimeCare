"use client"
import React, { useEffect, useState, useCallback, useContext } from 'react';
import Image from 'next/image';
import supabase from '@/Config/Supabase';
import { Star, Heart, Eye, ShoppingBag, Minus, Plus, Check } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { CartContext } from '@/Context/cart';
import toast from 'react-hot-toast'; // <-- Added toast

export default function ProductPage() {
  const { slug } = useParams();
  const router = useRouter();
  const { dispatch } = useContext(CartContext)

  // State Management
  const [productDetails, setProductDetails] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('descriptions');
  const [isLoading, setIsLoading] = useState(true);
  
  // Wishlist State
  const [user, setUser] = useState(null)
  const [wishlistIds, setWishlistIds] = useState([]) 

  // Fetch Data Callback
  const fetchProductData = useCallback(async () => {
    if (!slug) return;
    setIsLoading(true);

    try {
      // Fetch Main Product
      const { data: productData, error: productError } = await supabase
        .from("products")
        .select("*")
        .eq("id", slug)
        .single();

      if (productError) throw productError;
      setProductDetails(productData);

      // Fetch Related Products
      const { data: relatedData, error: relatedError } = await supabase
        .from("products")
        .select("*")
        .neq("id", slug)
        .limit(4);

      if (relatedError) throw relatedError;
      setRelatedProducts(relatedData || []);

    } catch (error) {
      console.error("Error fetching product data:", error.message);
      toast.error("Could not load product data."); // <-- Added Toast
    } finally {
      setIsLoading(false);
    }
  }, [slug]);

  // Check Login Status & Fetch Wishlist
  const checkAuthAndWishlist = async () => {
    try {
        const { data: { session } } = await supabase.auth.getSession()
        if (session?.user) {
            setUser(session.user)
            
            const { data, error } = await supabase
                .from('wishlist_items')
                .select('product_id')
                .eq('user_id', session.user.id)
                
            if (error) throw error;
            
            if (data) {
                setWishlistIds(data.map(item => item.product_id))
            }
        }
    } catch (error) {
        console.error("Auth check failed:", error.message);
    }
  }

  // Toggle Wishlist Function (Improved with Optimistic UI & Rollback)
  const toggleWishlist = async (event, productId) => {
    event.stopPropagation() // Stops click bubbling

    if (!user) {
        toast.error("Please log in to save items to your wishlist!") // <-- Changed to Toast
        return
    }

    const isWishlisted = wishlistIds.includes(productId)

    // 1. Optimistic Update (Instant UI change)
    if (isWishlisted) {
        setWishlistIds(prev => prev.filter(id => id !== productId))
    } else {
        setWishlistIds(prev => [...prev, productId])
    }

    // 2. Database Operation
    try {
        if (isWishlisted) {
            const { error } = await supabase
                .from('wishlist_items')
                .delete()
                .match({ user_id: user.id, product_id: productId })
            if (error) throw error;
            toast.success("Removed from wishlist");
        } else {
            const { error } = await supabase
                .from('wishlist_items')
                .insert({ user_id: user.id, product_id: productId })
            if (error) throw error;
            toast.success("Added to wishlist");
        }
    } catch (error) {
        // 3. Rollback if DB fails
        if (isWishlisted) {
            setWishlistIds(prev => [...prev, productId]);
        } else {
            setWishlistIds(prev => prev.filter(id => id !== productId));
        }
        toast.error("Failed to update wishlist.");
    }
  }

  // Add to Cart (Fixed Bug: Specific quantity parameter added so related products don't copy main product's quantity)
  const AddtoCart = (event, productData, qty = 1) => {
    event.stopPropagation()
    dispatch({
      type: "addProduct",
      payload: { ...productData, quantity: qty } 
    })
    toast.success(`${qty}x ${productData.productName} added to cart!`) // <-- Added Toast
  }

  // Trigger Fetch
  useEffect(() => {
    fetchProductData();
    checkAuthAndWishlist();
  }, [fetchProductData]);

  // Loading Screen Fallback
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#00b207]"></div>
      </div>
    );
  }

  // Not Found Fallback
  if (!productDetails) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <h1 className="text-3xl font-bold text-foreground mb-4">Product Not Found</h1>
        <button
          onClick={() => router.push('/')}
          className="text-green-500 hover:underline font-medium"
        >
          Return to Shop
        </button>
      </div>
    );
  }

  // Dynamic price calculation
  const finalPrice = productDetails.discount > 0
    ? (productDetails.price - (productDetails.price * (productDetails.discount / 100))).toFixed(2)
    : productDetails.price.toFixed(2);

  // Check if main product is saved
  const isMainProductSaved = wishlistIds.includes(productDetails.id);

  return (
    <div className="min-h-screen font-sans text-[#1a1a1a] antialiased">
      <main className="bg-background max-w-7xl mx-auto px-4 py-10 sm:px-6 lg:px-8">

        {/* ================= PRIMARY PRODUCT SECTION ================= */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start mb-16">

          {/* LEFT: Single Image View */}
          <div className="relative border border-gray-100 rounded-2xl overflow-hidden bg-[#f9f9f9] flex items-center justify-center p-8 h-[450px] lg:h-[550px]">
            {productDetails.productImg && (
              <Image
                src={productDetails.productImg}
                alt={productDetails.productName || "Product Image"}
                width={500}
                height={500}
                priority
                className="max-h-full max-w-full object-contain mix-blend-multiply transform hover:scale-105 transition-transform duration-300"
              />
            )}
            {productDetails.isBestseller && (
              <span className="absolute top-6 left-6 bg-amber-400 text-white text-xs font-bold px-3 py-1 rounded-md shadow-sm">
                Bestseller
              </span>
            )}
            {productDetails.isNew && (
              <span className="absolute top-6 left-6 bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-md shadow-sm">
                New
              </span>
            )}
          </div>

          {/* RIGHT: Product Meta Details */}
          <div className="flex flex-col justify-between pt-4">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <h1 className="text-3xl font-semibold text-foreground tracking-tight">{productDetails.productName}</h1>
                {productDetails.status ? (
                  <span className="bg-[#e6f7e7] text-green-500 text-xs font-medium px-2.5 py-1 rounded-md">In Stock</span>
                ) : (
                  <span className="bg-red-50 text-red-500 text-xs font-medium px-2.5 py-1 rounded-md">Out of Stock</span>
                )}
              </div>

              {/* Ratings & ID */}
              <div className="flex items-center gap-4 text-sm text-text-muted mb-5">
                <div className="flex items-center text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={16} fill={i < 4 ? "currentColor" : "none"} className={i < 4 ? "text-amber-400" : "text-gray-300"} />
                  ))}
                  <span className="text-text-muted font-medium ml-2">4 Reviews</span>
                </div>
                <span className="text-gray-300">•</span>
                <p>Product ID: <span className="text-foreground font-medium">{productDetails.id}</span></p>
              </div>

              {/* Price Grouping */}
              <div className="flex items-center gap-3 pb-6 border-b border-gray-100 mb-6">
                {productDetails.discount > 0 && (
                  <span className="text-gray-400 line-through text-xl">${productDetails.price.toFixed(2)}</span>
                )}
                <span className="text-2xl font-bold text-green-500">${finalPrice}</span>
                {productDetails.discount > 0 && (
                  <span className="bg-[#fbeae9] text-[#ea4335] text-xs font-semibold px-2 py-0.5 rounded-full">
                    {productDetails.discount}% Off
                  </span>
                )}
              </div>

              {/* Meta Branding Row */}
              <div className="flex flex-wrap items-center justify-between gap-4 text-sm text-foreground mb-6">
                <div className="flex items-center gap-2">
                  <span>Brand:</span>
                  <div className="flex items-center gap-1.5 border border-gray-200 rounded px-2 py-0.5 bg-white shadow-sm">
                    <span className="w-2 h-2 rounded-full bg-green-500"></span>
                    <span className="font-semibold text-xs tracking-tight text-text-muted">{productDetails.brand}</span>
                  </div>
                </div>
              </div>

              {/* Short Teaser Text */}
              <p className="text-text-muted text-sm leading-relaxed mb-8">
                {productDetails.shortDesc}
              </p>

              {/* Controls: Quantity Selector + Add To Cart Actions */}
              <div className="flex flex-col sm:flex-row gap-4 items-center pb-8 border-b border-gray-100 mb-6">
                <div className="flex items-center border border-gray-200 rounded-full p-1 shadow-sm w-full sm:w-auto justify-between">
                  <button
                    aria-label="Decrease quantity"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-2 hover:bg-gray-100 rounded-full text-text-muted transition-colors disabled:opacity-50"
                    disabled={!productDetails.status || quantity <= 1}
                  >
                    <Minus size={16} />
                  </button>
                  <span className="px-6 font-medium text-foreground text-base">{quantity}</span>
                  <button
                    aria-label="Increase quantity"
                    onClick={() => setQuantity(Math.min(productDetails.stockQty || 99, quantity + 1))}
                    className="p-2 hover:bg-gray-100 rounded-full text-text-muted transition-colors disabled:opacity-50"
                    disabled={!productDetails.status || quantity >= (productDetails.stockQty || 99)}
                  >
                    <Plus size={16} />
                  </button>
                </div>

                <button
                  // Fixed: Passing exact quantity state for main product
                  onClick={(event) => { AddtoCart(event, productDetails, quantity) }}
                  disabled={!productDetails.status}
                  className="flex-1 w-full flex items-center justify-center gap-3 bg-green-500 hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold py-3.5 px-8 rounded-full shadow-md shadow-[#00b207]/10 transition-colors"
                >
                  Add to Cart
                  <ShoppingBag size={18} />
                </button>

                {/* UPDATED HEART BUTTON (MAIN PRODUCT) */}
                <button 
                  onClick={(e) => toggleWishlist(e, productDetails.id)}
                  aria-label="Add to wishlist" 
                  className={`p-3.5 border border-gray-200 rounded-full hover:bg-gray-50 transition-all shadow-sm group ${isMainProductSaved ? 'text-red-500' : 'text-text-muted hover:text-red-500'}`}
                >
                  <Heart size={20} className={isMainProductSaved ? 'fill-red-500' : 'group-hover:fill-red-500/20'} />
                </button>
              </div>
            </div>

            {/* Bottom Taxonomy Tags */}
            <div className="space-y-2 text-sm text-text-muted">
              <p><span className="text-foreground font-medium">Category:</span> {productDetails.category}</p>
              <p><span className="text-foreground font-medium">Availability:</span> {productDetails.stockQty} units in stock</p>
            </div>
          </div>
        </div>

        {/* ================= DETAILED INFORMATION TABS SECTION ================= */}
        <div className="border-t border-gray-100 pt-10 mb-20">
          {/* Tab Navigation Bars */}
          <div className="flex justify-center gap-8 border-b border-gray-100 mb-10">
            {['descriptions', 'additional information', 'customer feedback'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-4 text-sm font-semibold capitalize transition-all relative ${activeTab === tab ? 'text-text-muted font-bold' : 'text-gray-400 hover:text-text-muted'
                  }`}
              >
                {tab}
                {activeTab === tab && (
                  <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-green-500" />
                )}
              </button>
            ))}
          </div>

          {/* Dynamic Tab Body Container */}
          {activeTab === 'descriptions' && (
            <div className="max-w-4xl mx-auto">
              {/* Full Description Centered & Wide */}
              <div className="space-y-5 text-sm text-text-muted leading-relaxed whitespace-pre-line">
                {productDetails.desc}

                {/* Visual Verification Checks */}
                <ul className="space-y-3 pt-4">
                  {[
                    "100 g of fresh leaves provides.",
                    "Aliquam ac est at augue volutpat elementum.",
                    "Quisque nec enim eget sapien molestie.",
                    "Proin convallis odio volutpat finibus posuere."
                  ].map((text, i) => (
                    <li key={i} className="flex items-center gap-3 text-text-muted font-medium">
                      <span className="p-0.5 bg-[#e6f7e7] text-green-500 rounded-full">
                        <Check size={14} strokeWidth={3} />
                      </span>
                      {text}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* ================= RELATED PRODUCTS COMPONENT GRID ================= */}
        {relatedProducts.length > 0 && (
          <div className="border-t border-gray-100 pt-16 mb-12">
            <h2 className="text-3xl font-semibold text-center text-text-muted mb-10">Related Products</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              {relatedProducts.map((product) => {
                const itemFinalPrice = product.discount > 0
                  ? (product.price - (product.price * (product.discount / 100))).toFixed(2)
                  : product.price.toFixed(2);
                
                // Check if this related product is saved
                const isRelatedSaved = wishlistIds.includes(product.id);

                return (
                  <div
                    key={product.id}
                    onClick={() => router.push(`/product-page/${product.id}`)}
                    className="border border-gray-100 rounded-xl overflow-hidden p-4 group hover:border-gray-200 hover:shadow-md transition-all relative flex flex-col justify-between cursor-pointer"
                  >
                    {/* Sale Dynamic Badge */}
                    {product.discount > 0 && (
                      <span className="absolute top-3 left-3 bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded z-10">
                        Sale {product.discount}%
                      </span>
                    )}

                    {/* Hover Actions */}
                    <div className="absolute top-3 right-3 flex flex-col gap-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                      {/* UPDATED HEART BUTTON (RELATED PRODUCTS) */}
                      <button 
                        onClick={(e) => toggleWishlist(e, product.id)}
                        aria-label="Add to wishlist" 
                        className="p-2 bg-white border border-gray-100 rounded-full text-text-muted hover:bg-green-500 hover:text-white hover:border-[#00b207] shadow-sm transition-all flex items-center justify-center"
                      >
                        <Heart size={14} className={isRelatedSaved ? "text-red-500 fill-red-500 group-hover:text-white group-hover:fill-white" : ""} />
                      </button>
                      <button aria-label="Quick view" className="p-2 bg-white border border-gray-100 rounded-full text-text-muted hover:bg-green-500 hover:text-white hover:border-[#00b207] shadow-sm transition-all">
                        <Eye size={14} />
                      </button>
                    </div>

                    {/* Product Box Image Content */}
                    <div className="h-44 w-full flex items-center justify-center p-2 mb-4 bg-[#f9f9f9] rounded-lg">
                      <Image
                        src={product.productImg}
                        alt={product.productName}
                        width={500}
                        height={500}
                        className="max-h-full max-w-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform"
                      />
                    </div>

                    {/* Title & Pricing */}
                    <div>
                      <h3 className="text-sm font-medium text-foreground group-hover:text-green-500 transition-colors mb-2 line-clamp-1">
                        {product.productName}
                      </h3>

                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-baseline gap-1.5">
                          <span className="text-sm font-bold text-foreground">${itemFinalPrice}</span>
                          {product.discount > 0 && (
                            <span className="text-xs text-gray-400 line-through">${product.price.toFixed(2)}</span>
                          )}
                        </div>
                        <button
                          aria-label="Add to Cart"
                          // Fixed: Hardcoded to 1 so it doesn't copy the main product's quantity
                          onClick={(event) => { AddtoCart(event, product, 1) }}
                          className="w-8 h-8 flex items-center justify-center rounded-full text-text-muted hover:bg-green-500 hover:text-white transition-colors"
                        >
                          <ShoppingBag size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )
        }

      </main >

      {/* ================= FOOTER NEWSLETTER CAPTURE BAR ================= */}
      < footer className="bg-[#f2f2f2] border-t border-gray-200 py-8" >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">

          <div className="max-w-md text-center md:text-left">
            <h3 className="text-xl font-bold text-gray-800 mb-1">Subscribe to our Newsletter</h3>
            <p className="text-xs text-text-muted leading-normal">
              Stay updated with the latest fresh produce and exclusive discounts sent directly to your inbox.
            </p>
          </div>

          <div className="relative flex items-center w-full md:max-w-md">
            <input
              type="email"
              aria-label="Email address"
              placeholder="Your email address..."
              className="w-full bg-white border border-gray-300 rounded-full px-5 py-3 text-sm focus:outline-none focus:border-[#00b207] text-text-muted shadow-sm"
            />
            <button className="absolute right-1 top-1 bottom-1 bg-green-500 hover:bg-green-600 text-white text-xs font-semibold px-6 rounded-full shadow-sm transition-colors">
              Subscribe
            </button>
          </div>

        </div>
      </footer >
    </div >
  );
}