"use client";

import { useState } from "react";
import { ShieldCheck, Compass, Heart, Users, Check, PlaneTakeoff } from "lucide-react";
import { motion } from "framer-motion";
import EnquiryModal from "@/components/EnquiryModal";

const values = [
  {
    icon: Compass,
    title: "Tailor-Made Journeys",
    description: "Every itinerary is handcrafted by our travel specialists to match your unique interests, pace, and accommodation desires."
  },
  {
    icon: ShieldCheck,
    title: "Absolute Safety & Support",
    description: "Enjoy stress-free travels with our dedicated 24/7 on-tour customer assistance and trusted local ground partners."
  },
  {
    icon: Heart,
    title: "Luxury Within Reach",
    description: "We secure premium partnerships with global luxury hotel chains to offer you top-tier rooms, transfers, and dinners at the best prices."
  },
  {
    icon: Users,
    title: "Customer First Mentality",
    description: "From our quick documentation filings to our warm flight bookings, our clients are at the center of everything we do."
  }
];

export default function AboutPage() {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <div className="min-h-screen pt-28 pb-20 relative bg-navy-950">
      {/* Background Glows */}
      <div className="absolute top-0 left-0 w-full h-[600px] overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-15%] w-[60%] h-[50%] bg-blue-500/10 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[10%] right-[-10%] w-[50%] h-[50%] bg-yellow-500/5 rounded-full blur-[100px]"></div>
      </div>

      <div className="container mx-auto px-4 md:px-6 relative z-10 max-w-5xl">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-yellow-400 font-bold uppercase tracking-widest text-xs px-3 py-1.5 rounded-full bg-white/5 border border-white/10">
              Our Journey & Passion
            </span>
            <h1 className="text-4xl md:text-5xl font-black text-white mt-6 leading-tight">
              About <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 via-yellow-400 to-yellow-600 glow-text">MHM Travels</span>
            </h1>
            <p className="text-slate-400 mt-4 text-base">
              Discover the history, values, and experts behind Make Holidays Memorable. We curate premium holidays for discerning travelers.
            </p>
          </motion.div>
        </div>

        {/* Company Bio */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-20">
          <div className="lg:col-span-6 space-y-6">
            <h2 className="text-3xl font-black text-white">Crafting Memories Since <span className="text-yellow-400">2014</span></h2>
            <p className="text-slate-300 text-sm leading-relaxed">
              Founded on the belief that travel should be inspiring, immersive, and custom-designed, Make Holidays Memorable (MHM Travels) has spent over a decade delivering extraordinary journeys across 50+ countries. 
            </p>
            <p className="text-slate-300 text-sm leading-relaxed">
              We specialize in custom holiday packages, luxury honeymoons, easy visa consultations, and premium corporate travel plans. Our global network of handpicked accommodations, private tour guides, and elite ground handlers ensures that you experience destinations like an insider.
            </p>
            
            <div className="grid grid-cols-2 gap-6 pt-4">
              <div>
                <span className="text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-yellow-600">12+ Years</span>
                <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider mt-1">Experience</p>
              </div>
              <div>
                <span className="text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-yellow-600">10,000+</span>
                <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider mt-1">Happy Clients</p>
              </div>
              <div>
                <span className="text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-yellow-600">99.2%</span>
                <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider mt-1">Visa Approvals</p>
              </div>
              <div>
                <span className="text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-yellow-600">24/7</span>
                <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider mt-1">On-Trip Support</p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 relative">
            <div className="glass-card overflow-hidden border border-white/10 p-8 relative flex flex-col justify-center min-h-[300px]">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-[80px] pointer-events-none"></div>
              
              <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-yellow-400 to-yellow-600 flex items-center justify-center text-slate-950 mb-6 shadow-lg">
                <PlaneTakeoff size={28} />
              </div>
              
              <h3 className="text-2xl font-bold text-white mb-4">Our Core Mission</h3>
              <p className="text-slate-300 text-sm leading-relaxed mb-6">
                "To inspire people to discover the world's most breathtaking sites through luxury, convenience, and custom-made holidays, turning ordinary travels into lifetime memories."
              </p>
              <span className="text-xs font-bold text-yellow-400 uppercase tracking-widest">— Team MHM Travels</span>
            </div>
          </div>
        </div>

        {/* Values Section */}
        <div className="mb-20">
          <h2 className="text-3xl font-black text-white text-center mb-12">The Principles That <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-600">Guide Us</span></h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {values.map((val, idx) => (
              <div 
                key={idx} 
                className="glass-card p-6 border border-white/10 hover:border-yellow-400/20 transition-all hover:shadow-[0_0_20px_rgba(250,204,21,0.05)] group"
              >
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-yellow-400 group-hover:bg-yellow-400/20 transition-colors shrink-0">
                    <val.icon size={22} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white mb-2 group-hover:text-yellow-400 transition-colors">{val.title}</h3>
                    <p className="text-xs text-slate-400 leading-relaxed">{val.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="glass-card p-8 md:p-12 border border-white/10 text-center relative overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-yellow-500/5 rounded-full blur-[80px] pointer-events-none"></div>
          
          <h2 className="text-3xl font-black text-white mb-4">Start Planning Your Next Escapade</h2>
          <p className="text-sm text-slate-400 max-w-lg mx-auto mb-8">
            Tell us where you want to travel, and our destination specialists will handle the rest. Flights, boutique lodging, custom touring, and visas.
          </p>
          <button
            onClick={() => setModalOpen(true)}
            className="bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-300 hover:to-yellow-500 text-slate-950 font-bold px-8 py-4 rounded-xl text-sm transition-all shadow-md active:scale-95"
          >
            Connect with a Planner
          </button>
        </div>
      </div>

      <EnquiryModal 
        isOpen={modalOpen} 
        onClose={() => setModalOpen(false)} 
        defaultDestination="General Trip Planning"
      />
    </div>
  );
}
