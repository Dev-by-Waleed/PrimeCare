"use client"
import { useState, createContext } from "react";

export const OffCanvasContext = createContext()

export function OffCanvasProvider({ children }) {
    const [isOpenCanvas, setOpenCanvas] = useState(false)
    return (
        <OffCanvasContext.Provider value={{ isOpenCanvas, setOpenCanvas }}>
            {children}
        </OffCanvasContext.Provider>
    )
}   