"use client"
import React, { useContext, useEffect, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { ShoppingBag, Heart, Eye, Search } from 'lucide-react';
import { CartContext } from '@/Context/cart';
import supabase from '@/Config/Supabase';

export default function SearchResultsGrid({ products, searchQuery }) {
    const router = useRouter();
    const { dispatch } = useContext(CartContext);

    // Wishlist State (Reused from your ProductsPage)
    const [user, setUser] = useState(null);
    const [wishlistIds, setWishlistIds] = useState([]);

    // Check Auth & Wishlist on mount
    useEffect(() => {
        const checkAuthAndWishlist = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (session?.user) {
                setUser(session.user);
                const { data } = await supabase
                    .from('wishlist_items')
                    .select('product_id')
                    .eq('user_id', session.user.id);
                    
                if (data) {
                    setWishlistIds(data.map(item => item.product_id));
                }
            }
        };
        checkAuthAndWishlist();
    }, []);

    // Toggle Wishlist Function
    const toggleWishlist = async (event, productId) => {
        event.stopPropagation();
        if (!user) {
            alert("Please log in to save items to your wishlist!");
            return;
        }

        const isWishlisted = wishlistIds.includes(productId);

        if (isWishlisted) {
            setWishlistIds(wishlistIds.filter(id => id !== productId));
            await supabase.from('wishlist_items').delete().match({ user_id: user.id, product_id: productId });
        } else {
            setWishlistIds([...wishlistIds, productId]);
            await supabase.from('wishlist_items').insert({ user_id: user.id, product_id: productId });
        }
    };

    // Add to Cart Logic
    const AddtoCart = (event, productData) => {
        event.stopPropagation();
        dispatch({ type: "addProduct", payload: { ...productData, quantity: 1 } });
    };

    // Empty State
    if (products.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-center border border-border-ui border-dashed rounded-2xl bg-side-background">
                <Search className="text-border-ui mb-4" size={48} />
                <h3 className="text-xl font-semibold text-foreground mb-2">No products found</h3>
                <p className="text-text-muted">We couldn't find anything matching "{searchQuery}".</p>
                <button 
                    onClick={() => router.push('/products')}
                    className="mt-6 px-6 py-2 bg-green-500 text-white rounded-full text-sm font-medium hover:bg-green-600 transition-colors"
                >
                    Browse All Products
                </button>
            </div>
        );
    }

    // Grid Render
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => {
                const itemFinalPrice = product.discount > 0
                    ? (product.price - (product.price * (product.discount / 100))).toFixed(2)
                    : product.price.toFixed(2);
                    
                const isSaved = wishlistIds.includes(product.id);

                return (
                    <div
                        key={product.id}
                        onClick={() => router.push(`/product-page/${product.id}`)}
                        className="border border-border-ui bg-background rounded-xl overflow-hidden p-4 group hover:border-text-muted hover:shadow-md transition-all relative flex flex-col justify-between cursor-pointer"
                    >
                        {/* Hover Actions */}
                        <div className="absolute top-3 right-3 flex flex-col gap-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
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
    );
}