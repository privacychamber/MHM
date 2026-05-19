"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Image from "next/image";

// Import WhatsApp icon or use a generic one if not available.
// We'll just create an SVG for WhatsApp inside the component.
const WhatsAppIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
  </svg>
);

export default function PackageSection() {
  return (
    <section className="py-24 relative z-10">
      <div className="container mx-auto px-4 md:px-6">
        <div className="glass-card max-w-5xl mx-auto overflow-hidden relative">
          <div className="absolute top-0 right-0 w-96 h-96 bg-yellow-500/10 rounded-full blur-[80px] pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/10 rounded-full blur-[80px] pointer-events-none"></div>
          
          <div className="flex flex-col lg:flex-row items-center">
            {/* Left Image Side */}
            <div className="w-full lg:w-1/2 h-64 lg:h-auto relative min-h-[400px]">
              <div className="absolute inset-0 bg-gradient-to-r from-navy-900/50 to-navy-900 z-10"></div>
              {/* Using CSS gradient as fallback for missing image */}
              <div className="absolute inset-0 bg-gradient-to-tr from-[#1a233a] to-[#0a0f1c]"></div>
              
              <div className="absolute inset-0 z-20 flex flex-col justify-center p-10">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                >
                  <span className="text-yellow-400 font-bold tracking-widest text-sm uppercase mb-2 block">Premium Experience</span>
                  <h3 className="text-4xl md:text-5xl font-bold text-white mb-4 glow-text leading-tight">Your Dream<br/>Vacation Awaits</h3>
                  <p className="text-slate-300 text-lg">Curated luxury itineraries tailored to your unique preferences.</p>
                </motion.div>
              </div>
            </div>

            {/* Right Content Side */}
            <div className="w-full lg:w-1/2 p-10 lg:p-16 relative z-20">
              <div className="mb-8">
                <p className="text-slate-400 text-sm font-medium uppercase tracking-wider mb-2">All-Inclusive Packages</p>
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-2xl text-slate-300">Starting From</span>
                </div>
                <h4 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-yellow-600 tracking-tight">₹89,999</h4>
                <p className="text-slate-400 text-sm mt-1">Per Person • Flights Included • 4-Star+ Stays</p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 mt-10">
                <button className="flex-1 group relative overflow-hidden rounded-xl bg-transparent border border-white/20 text-white font-bold py-4 px-6 transition-all hover:border-white">
                  <span className="relative z-10 flex items-center justify-center gap-2 group-hover:gap-3 transition-all">
                    View Packages <ArrowRight size={18} />
                  </span>
                  <div className="absolute inset-0 bg-white/5 translate-y-[100%] group-hover:translate-y-0 transition-transform duration-300 ease-out z-0"></div>
                </button>
                
                <button className="flex-1 group relative overflow-hidden rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold py-4 px-6 transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[0_0_30px_rgba(16,185,129,0.5)]">
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    <WhatsAppIcon className="w-5 h-5 animate-pulse" /> Enquire on WhatsApp
                  </span>
                  <div className="absolute inset-0 bg-white/20 translate-y-[100%] group-hover:translate-y-0 transition-transform duration-300 ease-out z-0"></div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
