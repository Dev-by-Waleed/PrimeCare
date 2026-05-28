import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/Components/navbar/Navbar";
import { OffCanvasProvider } from "@/Context/canvas";
import { CartProvider } from "@/Context/cart";
import Cart from "@/Components/Cart";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"], 
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "PrimeCare",
  description: "Your trusted local pharmacy for prescription medications, health products, and fast delivery in Hyderabad and beyond. Order online securely",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <CartProvider>
          <OffCanvasProvider>
            <Navbar />
            {children}
            <Cart />
          </OffCanvasProvider>
        </CartProvider>
      </body>
    </html>
  );
}
