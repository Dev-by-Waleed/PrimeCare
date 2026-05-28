"use client"
import { createContext, useReducer } from "react";
import cartReducer from "@/Reducers/Cart";

export const CartContext = createContext()
export function CartProvider({ children }) {
    const [cartItems, dispatch] = useReducer(cartReducer, [])

    return (
        <CartContext.Provider value={{ cartItems, dispatch }}>
            {children}
        </CartContext.Provider>
    )
}

