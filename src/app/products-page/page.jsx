"use client"
import React, { useEffect, useState, useContext } from 'react';
import Image from 'next/image';
import supabase from '@/Config/Supabase';
import { ShoppingBag, Heart, Eye, Search, SlidersHorizontal } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { CartContext } from '@/Context/cart';
import toast from 'react-hot-toast'; // Import toast

export default function ProductsPage() {
  const router = useRouter();
  const { dispatch } = useContext(CartContext);

  // State Management
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  // Wishlist State
  const [user, setUser] = useState(null);
  const [wishlistIds, setWishlistIds] = useState([]);

  // Sample Categories
  const categories = ["All", "Vegetables", "Fruits", "Meat", "Dairy", "Bakery"];

  // Fetch All Products
  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from("products")
          .select("*")
          .order('created_at', { ascending: false });

        if (error) throw error;
        setProducts(data || []);
      } catch (error) {
        console.error("Error fetching products:", error.message);
        toast.error("Failed to load products."); // Added error feedback
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
    checkAuthAndWishlist();
  }, []);

  // Check Login Status & Fetch Wishlist
  const checkAuthAndWishlist = async () => {
    try {
      const { data: { session }, error: authError } = await supabase.auth.getSession();
      if (authError) throw authError;

      if (session?.user) {
        setUser(session.user);
        
        const { data, error: wishlistError } = await supabase
            .from('wishlist_items')
            .select('product_id')
            .eq('user_id', session.user.id);
            
        if (wishlistError) throw wishlistError;

        if (data) {
            setWishlistIds(data.map(item => item.product_id));
        }
      }
    } catch (error) {
      console.error("Error fetching auth/wishlist:", error.message);
    }
  };

  // Toggle Wishlist Function (Improved with Rollback)
  const toggleWishlist = async (event, productId) => {
    event.stopPropagation(); // Stops click bubbling

    if (!user) {
        toast.error("Please log in to save items to your wishlist!");
        return;
    }

    const isWishlisted = wishlistIds.includes(productId);

    // 1. Optimistic UI Update (Instant feedback)
    if (isWishlisted) {
        setWishlistIds(prev => prev.filter(id => id !== productId));
    } else {
        setWishlistIds(prev => [...prev, productId]);
    }

    // 2. Database Operation
    try {
        if (isWishlisted) {
            const { error } = await supabase
              .from('wishlist_items')
              .delete()
              .match({ user_id: user.id, product_id: productId });
            
            if (error) throw error;
            toast.success("Removed from wishlist");
        } else {
            const { error } = await supabase
              .from('wishlist_items')
              .insert({ user_id: user.id, product_id: productId });
            
            if (error) throw error;
            toast.success("Added to wishlist");
        }
    } catch (error) {
        // 3. Rollback State if DB fails
        if (isWishlisted) {
            setWishlistIds(prev => [...prev, productId]); // Add it back
        } else {
            setWishlistIds(prev => prev.filter(id => id !== productId)); // Remove it again
        }
        toast.error("Could not update wishlist. Please try again.");
        console.error("Wishlist error:", error.message);
    }
  };

  // Add to Cart Logic
  const AddtoCart = (event, productData) => {
    event.stopPropagation();
    try {
        dispatch({
          type: "addProduct",
          payload: { ...productData, quantity: 1 } // Defaulting to 1 for the catalog grid
        });
        // Notify the user of success
        toast.success(`${productData.productName || 'Item'} added to cart!`);
    } catch (error) {
        toast.error("Failed to add item to cart.");
    }
  };

  // Filter Logic
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.productName?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === "All" || product.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  // Loading State
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen font-sans bg-background text-foreground antialiased py-10 bg-side-background">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 bg-background p-10 rounded-lg">
        
        {/* Page Header */}
        <div className="mb-10 text-center md:text-left">
          <h1 className="text-4xl font-bold tracking-tight mb-4">Shop Products</h1>
          <p className="text-text-muted">Browse our fresh collection and find exactly what you need.</p>
        </div>

        {/* Toolbar: Search and Filters */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-10 pb-6 border-b border-border-ui">
          
          {/* Categories */}
          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-hide">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  activeCategory === cat 
                    ? "bg-green-500 text-white shadow-sm" 
                    : "bg-side-background text-text-muted hover:bg-border-ui hover:text-foreground border border-border-ui"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search Bar & Mobile Filter Icon */}
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative w-full md:w-72">
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-side-background border border-border-ui rounded-full text-sm focus:outline-none focus:border-brand-blue text-foreground placeholder:text-text-muted transition-colors shadow-sm"
              />
              <Search className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-text-muted" size={16} />
            </div>
            <button className="md:hidden p-2.5 bg-side-background border border-border-ui rounded-full text-text-muted shadow-sm hover:text-green-500">
              <SlidersHorizontal size={18} />
            </button>
          </div>
        </div>

        {/* Product Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product) => {
              const itemFinalPrice = product.discount > 0
                ? (product.price - (product.price * (product.discount / 100))).toFixed(2)
                : product.price.toFixed(2);
                
              // Check if this specific product is in the user's wishlist
              const isSaved = wishlistIds.includes(product.id);

              return (
                <div
                  key={product.id}
                  onClick={() => router.push(`/product-page/${product.id}`)}
                  className="border border-border-ui bg-background rounded-xl overflow-hidden p-4 group hover:border-text-muted hover:shadow-md transition-all relative flex flex-col justify-between cursor-pointer"
                >
                  {/* Status / Discount Badges */}
                  <div className="absolute top-3 left-3 flex flex-col gap-1 z-10">
                    {product.discount > 0 && (
                      <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-sm">
                        Sale {product.discount}%
                      </span>
                    )}
                    {product.isNew && (
                      <span className="bg-green-500 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-sm">
                        New
                      </span>
                    )}
                  </div>

                  {/* Hover Actions */}
                  <div className="absolute top-3 right-3 flex flex-col gap-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    {/* UPDATED HEART BUTTON */}
                    <button 
                      aria-label={isSaved ? "Remove from wishlist" : "Add to wishlist"}
                      onClick={(e) => toggleWishlist(e, product.id)}
                      className="p-2 bg-side-background border border-border-ui rounded-full text-text-muted hover:bg-green-500 hover:text-white hover:border-brand-blue shadow-sm transition-all flex items-center justify-center"
                    >
                      <Heart size={14} className={isSaved ? "text-red-500 fill-red-500 group-hover:text-white group-hover:fill-white" : ""} />
                    </button>
                    <button 
                      aria-label="Quick view" 
                      onClick={(e) => e.stopPropagation()}
                      className="p-2 bg-side-background border border-border-ui rounded-full text-text-muted hover:bg-green-500 hover:text-white hover:border-brand-blue shadow-sm transition-all"
                    >
                      <Eye size={14} />
                    </button>
                  </div>

                  {/* Image Container */}
                  <div className="h-56 w-full flex items-center justify-center p-4 mb-4 bg-side-background rounded-lg">
                    {product.productImg ? (
                      <Image
                        src={product.productImg}
                        alt={product.productName}
                        width={500}
                        height={500}
                        className="max-h-full max-w-full object-contain dark:brightness-95 group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="text-border-ui">No Image</div>
                    )}
                  </div>

                  {/* Content & Pricing */}
                  <div className="flex flex-col flex-grow justify-end">
                    <span className="text-xs text-text-muted mb-1">{product.category}</span>
                    <h3 className="text-sm font-medium text-foreground group-hover:text-green-500 transition-colors mb-3 line-clamp-1">
                      {product.productName}
                    </h3>

                    <div className="flex items-center justify-between mt-auto">
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-base font-bold text-foreground">${itemFinalPrice}</span>
                        {product.discount > 0 && (
                          <span className="text-xs text-text-muted line-through">${product.price.toFixed(2)}</span>
                        )}
                      </div>
                      
                      {/* Add to Cart Button */}
                      <button
                        aria-label="Add to Cart"
                        onClick={(event) => AddtoCart(event, product)}
                        disabled={!product.status}
                        className="w-9 h-9 flex items-center justify-center rounded-full bg-side-background border border-border-ui text-text-muted hover:bg-green-500 hover:text-white hover:border-brand-blue disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
                      >
                        <ShoppingBag size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* Empty State */
          <div className="flex flex-col items-center justify-center py-20 text-center border border-border-ui border-dashed rounded-2xl bg-side-background">
            <Search className="text-border-ui mb-4" size={48} />
            <h3 className="text-xl font-semibold text-foreground mb-2">No products found</h3>
            <p className="text-text-muted">Try adjusting your search or category filters.</p>
            <button 
              onClick={() => {setSearchQuery(""); setActiveCategory("All");}}
              className="mt-6 px-6 py-2 bg-green-500 text-white rounded-full text-sm font-medium hover:bg-green-500/90 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        )}

      </main>
    </div>
  );
}