"use client"
import React, { useContext } from 'react'
import { OffCanvasContext } from '@/Context/canvas'
import { CartContext } from '@/Context/cart'
import { X, Trash2 } from 'lucide-react'

function Cart() {
    const { isOpenCanvas, setOpenCanvas } = useContext(OffCanvasContext)
    const { cartItems, dispatch } = useContext(CartContext)
    
    function setDrawerClose() {
        setOpenCanvas(false)
    }

    function getSubTotal() {
        const price = cartItems?.reduce((acc, item) => {
            return acc + (item.price * item.quantity)
        }, 0) || 0
        
        return price
    }

    // FIXED: Changed payload from 'productData' (which was undefined) to 'data'
    function deleteData(data) {
        dispatch({
            type: "deleteProduct",
            payload: data
        })
    }

    function deleteAllProduct(){
        dispatch({
            type: "deleteAllProduct"
        })
    }

    return (
        <div className={`fixed top-0 right-0 w-full md:w-[400px] h-screen bg-white shadow-lg transform ${isOpenCanvas ? 'translate-x-0' : 'translate-x-full'} transition-transform duration-300 ease-in-out z-50 flex flex-col`}>
            
            {/* Header */}
            <div className="flex justify-between items-center p-4 border-b text-gray-800">
                <h2 className="text-lg font-bold">Your Cart</h2>
                <button onClick={setDrawerClose} className="text-gray-600 hover:text-gray-800 hover:cursor-pointer">
                    <X size={24} />
                </button>
            </div>

            {/* Cart Items (Scrollable) */}
            <div className="flex-grow overflow-y-auto">
                {cartItems?.length === 0 ? (
                    <p className="p-4 text-gray-600">Your cart is empty.</p>
                ) : (
                    <div className="p-4">
                        {cartItems?.map((item) => (
                            <div key={item.id} className="flex items-center justify-between border-b py-3">
                                <div>
                                    {/* FIXED: Changed item.name to item.productName to match your Supabase data */}
                                    <h3 className="font-medium text-gray-800">{item.productName}</h3>
                                    <p className="text-green-500 font-bold">${item.price.toFixed(2)}</p>
                                </div>
                                <div className="flex items-center gap-4">
                                    <p className="font-bold text-gray-600">Qty: {item.quantity}</p>
                                    
                                    {/* Swapped X for Trash2 for a better UI experience */}
                                    <button 
                                        onClick={() => deleteData(item)} 
                                        className="text-red-400 hover:text-red-600 transition-colors"
                                        title="Remove item"
                                    >
                                        <Trash2 size={20} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Cart Footer (Subtotal & Clear Cart) */}
            {cartItems?.length > 0 && (
                <div className="p-4 border-t bg-gray-50">
                    <div className="flex justify-between items-center mb-4">
                        <span className="font-bold text-gray-800 text-lg">Subtotal:</span>
                        <span className="font-bold text-green-600 text-lg">
                            ${getSubTotal().toFixed(2)}
                        </span>
                    </div>
                    <button 
                        onClick={deleteAllProduct}
                        className="w-full bg-red-50 text-red-600 border border-red-200 font-medium py-2 rounded hover:bg-red-100 transition-colors"
                    >
                        Clear Cart
                    </button>
                </div>
            )}
        </div>
    )
}

export default Cart