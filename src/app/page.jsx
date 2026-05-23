import Image from "next/image";
import HeroSection from "@/Components/home/HeroSection";
import CategoriesSection from "@/Components/home/CategoriesSection";
import ProductsSection from "@/Components/home/ProductsSection";
import Banners from "@/Components/home/Banners";
import Footer from "@/Components/Footer";
export default function Home() {
  return (
    <>
    <HeroSection/>
    <CategoriesSection/>
    <ProductsSection/>
    <Banners/>
    <Footer />
    </>
  );
}
