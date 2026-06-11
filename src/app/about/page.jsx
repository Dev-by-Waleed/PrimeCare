import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Leaf, ShieldCheck, Zap, Server, ShoppingBag, Users } from 'lucide-react';

export const metadata = {
  title: 'About Us | PrimeCare',
  description: 'Learn more about PrimeCare, our mission, and the technology powering our organic delivery platform.',
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#f9f9f9] text-[#1a1a1a] font-sans pb-20">
      
      {/* ================= HERO SECTION ================= */}
      <div className="bg-white border-b border-gray-200 py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-[#e6f7e7] rounded-full inline-block">
              <Image src={"/logo.png"} alt='PrimeCare' width={100} height={100}></Image>
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Nourishing Communities, <br />
            <span className="text-[#00b207]">Powered by Modern Tech</span>
          </h1>
          <p className="text-lg text-gray-600 leading-relaxed max-w-2xl mx-auto">
            At PrimeCare, we believe everyone deserves access to the freshest organic produce. 
            We've built a seamless, secure, and blazing-fast platform to bridge the gap between 
            local farms and your kitchen table.
          </p>
        </div>
      </div>

      {/* ================= THE MISSION ================= */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
            <p className="text-gray-600 mb-4 leading-relaxed">
              Eating healthy shouldn't be a hassle. We started PrimeCare to eliminate the friction of 
              grocery shopping for high-quality, organic foods. By cutting out the middleman, we ensure 
              that our produce spends less time in transit and more time in your fridge.
            </p>
            <p className="text-gray-600 leading-relaxed">
              But a great mission requires a great foundation. That's why we invested heavily in creating 
              a digital storefront that respects your time, protects your data, and provides an effortless 
              shopping experience from browsing to checkout.
            </p>
          </div>
          <div className="relative h-[400px] w-full rounded-3xl overflow-hidden shadow-lg bg-gray-200">
            {/* Replace this with a real image of a farm, produce, or your team later! */}
            <Image src="/Hero3.png" alt="Image" width={600} height={600}/>
          </div>
        </div>
      </div>

      {/* ================= THE TECHNOLOGY ================= */}
      <div className="bg-white py-20 border-y border-gray-200">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Under the Hood</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              PrimeCare isn't just another template. It's a custom-built, full-stack application utilizing 
              the latest advancements in web development to ensure speed, security, and scalability.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Tech Card 1 */}
            <div className="p-8 rounded-3xl bg-gray-50 border border-gray-100 hover:shadow-md transition-shadow">
              <Zap size={32} className="text-[#00b207] mb-6" />
              <h3 className="text-xl font-bold mb-3">Next.js & React</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Built on the Next.js App Router for server-side rendering and lightning-fast page loads. 
                We use React Context API to manage complex application states—like our real-time shopping cart 
                and dynamic navigation canvases.
              </p>
            </div>

            {/* Tech Card 2 */}
            <div className="p-8 rounded-3xl bg-gray-50 border border-gray-100 hover:shadow-md transition-shadow">
              <Server size={32} className="text-[#00b207] mb-6" />
              <h3 className="text-xl font-bold mb-3">Supabase Backend</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Our data is powered by a robust PostgreSQL database managed through Supabase. 
                This allows us to fetch products instantly while maintaining strict Row Level Security (RLS) 
                to ensure data integrity.
              </p>
            </div>

            {/* Tech Card 3 */}
            <div className="p-8 rounded-3xl bg-gray-50 border border-gray-100 hover:shadow-md transition-shadow">
              <ShieldCheck size={32} className="text-[#00b207] mb-6" />
              <h3 className="text-xl font-bold mb-3">Enterprise-Grade Auth</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Security is paramount. We use secure JSON Web Tokens (JWT) and a custom user profile schema. 
                Our system features strict route protection, separating regular shoppers from a fully-featured, 
                gated Administrative Dashboard.
              </p>
            </div>

          </div>
        </div>
      </div>

      {/* ================= CTA SECTION ================= */}
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <h2 className="text-3xl font-bold mb-6">Ready to taste the difference?</h2>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link 
            href="/products-page" 
            className="w-full sm:w-auto px-8 py-4 bg-[#00b207] text-white rounded-full font-semibold hover:bg-[#009906] transition-colors flex items-center justify-center gap-2"
          >
            <ShoppingBag size={20} />
            Start Shopping
          </Link>
          <Link 
            href="/sign-up" 
            className="w-full sm:w-auto px-8 py-4 bg-white text-[#00b207] border-2 border-[#00b207] rounded-full font-semibold hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
          >
            <Users size={20} />
            Create an Account
          </Link>
        </div>
      </div>

    </div>
  );
}