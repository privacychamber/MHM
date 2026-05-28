"use client";

import { motion } from "framer-motion";
import { ArrowRight, Plane, CheckCircle2, ShieldCheck, HelpCircle } from "lucide-react";
import Link from "next/link";

const WhatsAppIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
  </svg>
);

export default function PackageSection() {
  return (
    <section className="py-24 relative z-10 overflow-hidden">
      <div className="container mx-auto px-4 md:px-6">
        <div className="glass-card max-w-5xl mx-auto overflow-hidden relative border border-white/10 rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.4)] bg-[#ffffff]/4 dark:bg-black/35 backdrop-blur-2xl">
          {/* Decorative glow grids */}
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-yellow-500/10 rounded-full blur-[90px] pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-indigo-500/10 rounded-full blur-[90px] pointer-events-none" />
          
          <div className="flex flex-col lg:flex-row items-stretch">
            {/* Left Side: Fun 'Boarding Pass' Vibe Card */}
            <div className="w-full lg:w-7/12 p-8 lg:p-12 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-white/10 relative z-20">
              <div>
                <div className="inline-flex items-center gap-2 mb-6 px-3 py-1 rounded-full bg-gradient-to-r from-yellow-400/10 to-amber-500/10 border border-yellow-400/25">
                  <Plane size={12} className="text-yellow-400 rotate-[45deg]" />
                  <span className="text-yellow-400 text-[10px] font-black uppercase tracking-[0.12em]">Out of Office Generator</span>
                </div>
                
                <h3 className="text-3xl sm:text-4xl lg:text-[2.6rem] font-black text-white leading-[1.1] mb-5 tracking-tight">
                  Stop Staring at Spreadsheets.<br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-500">
                    Start Packing Bags.
                  </span>
                </h3>
                
                <p className="text-slate-300 text-[0.95rem] leading-relaxed mb-8 max-w-md">
                  Let&apos;s be real. Those 17 open tabs of travel blogs have been there for months. Flight prices are climbing, and your boss won&apos;t mind. Let&apos;s turn those tabs into boarding passes.
                </p>
              </div>

              {/* Vibe Checklist */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
                <div className="flex items-start gap-3">
                  <CheckCircle2 size={16} className="text-yellow-400 shrink-0 mt-0.5" />
                  <div>
                    <h5 className="text-white text-xs font-bold uppercase tracking-wider">Vibe-Checked Stays</h5>
                    <p className="text-slate-400 text-[11px] mt-0.5">Boutique, clean, 4-star+ hotels only.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 size={16} className="text-yellow-400 shrink-0 mt-0.5" />
                  <div>
                    <h5 className="text-white text-xs font-bold uppercase tracking-wider">Zero Logistics Stress</h5>
                    <p className="text-slate-400 text-[11px] mt-0.5">Flights, internal transits & stays booked.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <ShieldCheck size={16} className="text-yellow-400 shrink-0 mt-0.5" />
                  <div>
                    <h5 className="text-white text-xs font-bold uppercase tracking-wider">24/7 Concierge Support</h5>
                    <p className="text-slate-400 text-[11px] mt-0.5">Live WhatsApp help if you get lost.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <HelpCircle size={16} className="text-yellow-400 shrink-0 mt-0.5" />
                  <div>
                    <h5 className="text-white text-xs font-bold uppercase tracking-wider">No Hidden Fees</h5>
                    <p className="text-slate-400 text-[11px] mt-0.5">What you see is what you pay. Period.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side: High-Converting Pricing Pass */}
            <div className="w-full lg:w-5/12 p-8 lg:p-12 flex flex-col justify-center bg-black/15 backdrop-blur-md relative z-20">
              <div className="mb-8 text-center lg:text-left">
                <span className="text-slate-400 text-xs font-bold uppercase tracking-[0.15em] block mb-2">All-Inclusive Deal</span>
                <span className="text-slate-300 text-sm font-medium">Packages Start From Just</span>
                
                <div className="flex items-center justify-center lg:justify-start gap-2.5 mt-3 mb-1">
                  <h4 className="text-5xl lg:text-6xl font-black text-white tracking-tight drop-shadow-[0_0_20px_rgba(250,204,21,0.2)]">
                    ₹89,999
                  </h4>
                  <span className="text-slate-400 text-xs text-left leading-tight shrink-0 font-medium">
                    / person<br />
                    all taxes inc.
                  </span>
                </div>
                
                <p className="text-yellow-400/90 text-xs font-bold flex items-center justify-center lg:justify-start gap-1 mt-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-yellow-400 animate-pulse" />
                  Flights + Stays + Local Guided Tours Included
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-3">
                <a 
                  href="https://wa.me/918437770006?text=Hi%20MHM%20Travels!%20I'm%20done%20staring%20at%20spreadsheets.%20Tell%20me%20about%20packages%20starting%20at%2089999!"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full"
                >
                  <motion.button 
                    whileTap={{ scale: 0.98 }}
                    className="w-full group relative overflow-hidden rounded-2xl bg-gradient-to-r from-green-500 to-emerald-600 text-[#ffffff] font-bold py-4 px-6 transition-all shadow-[0_10px_20px_rgba(16,185,129,0.25)] hover:shadow-[0_12px_25px_rgba(16,185,129,0.45)] cursor-pointer"
                  >
                    <span className="relative z-10 flex items-center justify-center gap-2 text-sm uppercase tracking-wider">
                      <WhatsAppIcon className="w-5 h-5 animate-bounce" /> Get Boarding Pass on WhatsApp
                    </span>
                    <div className="absolute inset-0 bg-[#ffffff]/15 translate-y-[100%] group-hover:translate-y-0 transition-transform duration-300 ease-out z-0"></div>
                  </motion.button>
                </a>

                <Link href="/packages" className="w-full">
                  <motion.button 
                    whileTap={{ scale: 0.98 }}
                    className="w-full group relative overflow-hidden rounded-2xl bg-transparent border border-white/15 hover:border-white/40 text-white font-bold py-4 px-6 transition-all cursor-pointer"
                  >
                    <span className="relative z-10 flex items-center justify-center gap-2 text-sm uppercase tracking-wider">
                      Explore Vibes & Packages <ArrowRight size={16} className="group-hover:translate-x-1.5 transition-transform" />
                    </span>
                    <div className="absolute inset-0 bg-white/5 translate-y-[100%] group-hover:translate-y-0 transition-transform duration-300 ease-out z-0"></div>
                  </motion.button>
                </Link>
              </div>

              <div className="text-center mt-6">
                <span className="text-[10px] text-slate-500 font-medium uppercase tracking-wider">
                  ⚠️ warning: may cause severe cases of wanderlust.
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
