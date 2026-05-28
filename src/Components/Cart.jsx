"use client"
import React, { useContext } from 'react'
import { OffCanvasContext } from '@/Context/canvas'
import { CartContext } from '@/Context/cart'
import { X } from 'lucide-react'
function Cart() {
    const { isOpenCanvas, setOpenCanvas } = useContext(OffCanvasContext)
    const { cartItems, dispatch } = useContext(CartContext)
    // console.log(cartItems)
    // const getSubTotal = () => {
    //     let total = 0;
    //     cartItems.forEach((item) => {
    //         total += item.price * item.quantity;
    //     });
    //     return total;
    // };
    // const deleteAllProduct = () => {
    //     dispatch({ type: "DELETE_ALL" })
    // }
    // const deleteData = (v) => {
    //     dispatch({ type: "DELETE_ITEM", payload: v })
    // }
    return (
        <div className={`fixed top-0 right-0 w-full md:w-[400px] h-full bg-white shadow-lg transform ${isOpenCanvas ? 'translate-x-0' : 'translate-x-full'} transition-transform duration-300 ease-in-out z-50`}>
            <div className="flex justify-between items-center p-4 border-b text-gray-800">
                <h2 className="text-lg font-bold">Your Cart</h2>
                <button onClick={() => setOpenCanvas(false)} className="text-gray-600 hover:text-gray-800">
                    <X size={24} />
                </button>
            </div>
            <div>
                {cartItems.length === 0 ? (
                    <p className="p-4 text-gray-600">Your cart is empty.</p>
                ) : (
                    <div className="p-4">
                        {cartItems.map((item) => (
                            <div key={item.id} className="flex items-center justify-between border-b py-2">
                                <div>
                                    <h3 className="font-medium">{item.name}</h3>
                                    <p className="text-green-500 font-bold">${item.price.toFixed(2)}</p>
                                </div>
                                <p className="font-bold">Qty: {item.quantity}</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

export default Cart