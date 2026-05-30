"use client"
import { createContext, useReducer } from "react";
import cartReducer from "@/Reducers/Cart";

const CartContext = createContext()
function CartProvider({ children }) {
    const [cartItems, dispatch] = useReducer(cartReducer, [])

    return (
        <CartContext.Provider value={{ cartItems, dispatch }}>
            {children}
        </CartContext.Provider>
    )
}

export {CartContext, CartProvider}