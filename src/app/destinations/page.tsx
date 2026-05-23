"use client";

import { useState } from "react";
import { Search, MapPin, Star, Clock, Compass, Shield } from "lucide-react";
import { motion } from "framer-motion";
import { destinationsData, Destination } from "@/data/destinations";
import EnquiryModal from "@/components/EnquiryModal";

export default function DestinationsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRegion, setSelectedRegion] = useState("All");
  const [modalOpen, setModalOpen] = useState(false);
  const [activeDestination, setActiveDestination] = useState("");

  const filtered = Object.values(destinationsData).filter((dest) => {
    const matchesSearch = dest.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          dest.topCities.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (selectedRegion === "All") return matchesSearch;
    if (selectedRegion === "Asia") return matchesSearch && ["japan", "thailand", "singapore", "bali", "india", "dubai", "maldives"].includes(dest.id);
    if (selectedRegion === "Europe") return matchesSearch && ["switzerland", "france", "italy", "united-kingdom", "turkey"].includes(dest.id);
    if (selectedRegion === "Other") return matchesSearch && ["australia", "united-states", "egypt"].includes(dest.id);
    return matchesSearch;
  });

  const triggerEnquiry = (name: string) => {
    setActiveDestination(name);
    setModalOpen(true);
  };

  return (
    <div className="min-h-screen pt-28 pb-20 relative bg-navy-950">
      {/* Background Glows */}
      <div className="absolute top-0 left-0 w-full h-[600px] overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-500/10 rounded-full blur-[120px]"></div>
        <div className="absolute top-[20%] right-[-10%] w-[45%] h-[55%] bg-yellow-500/5 rounded-full blur-[100px]"></div>
      </div>

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-yellow-400 font-bold uppercase tracking-widest text-xs px-3 py-1.5 rounded-full bg-white/5 border border-white/10 shadow-[0_0_15px_rgba(250,204,21,0.1)]">
              Curated World Tours
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mt-6 leading-tight">
              Explore Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 via-yellow-400 to-yellow-600 glow-text">Destinations</span>
            </h1>
            <p className="text-slate-400 mt-4 text-base md:text-lg">
              Discover unique itineraries, visa regulations, travel times, and luxury hotel packages across the globe.
            </p>
          </motion.div>
        </div>

        {/* Filters and Search Bar */}
        <div className="glass-card p-6 mb-12 flex flex-col md:flex-row gap-4 items-center justify-between">
          {/* Tabs */}
          <div className="flex gap-2 p-1 bg-white/5 rounded-xl border border-white/5 w-full md:w-auto overflow-x-auto">
            {["All", "Asia", "Europe", "Other"].map((tab) => (
              <button
                key={tab}
                onClick={() => setSelectedRegion(tab)}
                className={`px-5 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                  selectedRegion === tab 
                    ? "bg-gradient-to-r from-yellow-400 to-yellow-600 text-slate-900 shadow-md" 
                    : "text-slate-400 hover:text-white hover:bg-white/5"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-80 flex items-center bg-white/5 border border-white/10 rounded-xl px-4 py-2 transition-all hover:border-yellow-400/50">
            <Search size={18} className="text-slate-400 mr-2" />
            <input 
              type="text" 
              placeholder="Search country or city..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-transparent border-none outline-none text-white text-sm placeholder:text-slate-500"
            />
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filtered.map((dest, index) => (
            <motion.div
              key={dest.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05, duration: 0.5 }}
              whileHover={{ y: -8 }}
              className="glass-card overflow-hidden group flex flex-col h-full border border-white/10 hover:border-yellow-400/30 transition-all hover:shadow-[0_0_30px_rgba(250,204,21,0.1)]"
            >
              {/* Image */}
              <div className="h-56 relative w-full overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-transparent to-transparent z-10"></div>
                <div className="absolute inset-0 bg-navy-900/40 mix-blend-multiply z-0"></div>
                <img 
                  src={dest.image} 
                  alt={dest.name}
                  className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-500"
                />
                
                <span className="absolute top-4 left-4 z-20 bg-navy-950/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 flex items-center gap-2">
                  <span className="text-lg">{dest.flag}</span>
                  <span className="text-xs text-white font-bold">{dest.name}</span>
                </span>
                
                <span className="absolute bottom-4 right-4 z-20 bg-yellow-500 text-slate-950 text-xs font-black px-3 py-1.5 rounded-lg shadow-lg">
                  From {dest.price}
                </span>
              </div>

              {/* Body */}
              <div className="p-6 flex flex-col flex-1">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-white group-hover:text-yellow-400 transition-colors">{dest.name}</h3>
                    <p className="text-xs text-slate-400 flex items-center gap-1 mt-1">
                      <MapPin size={12} className="text-yellow-400" /> {dest.topCities}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 text-yellow-400 text-sm font-bold bg-white/5 border border-white/10 px-2.5 py-1 rounded-lg">
                    <Star size={14} fill="currentColor" />
                    <span>{dest.rating}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-6 bg-white/5 p-4 rounded-xl border border-white/5">
                  <div className="space-y-0.5">
                    <span className="text-[10px] uppercase font-bold text-slate-500">Best Season</span>
                    <p className="text-xs text-slate-200 font-medium truncate">{dest.bestTime}</p>
                  </div>
                  <div className="space-y-0.5">
                    <span className="text-[10px] uppercase font-bold text-slate-500">Visa Rule</span>
                    <p className="text-xs text-slate-200 font-medium truncate">{dest.visa}</p>
                  </div>
                  <div className="space-y-0.5">
                    <span className="text-[10px] uppercase font-bold text-slate-500">Currency</span>
                    <p className="text-xs text-slate-200 font-medium truncate">{dest.currency}</p>
                  </div>
                  <div className="space-y-0.5">
                    <span className="text-[10px] uppercase font-bold text-slate-500">Flight Duration</span>
                    <p className="text-xs text-slate-200 font-medium truncate">{dest.flightDuration}</p>
                  </div>
                </div>

                {/* Button */}
                <button 
                  onClick={() => triggerEnquiry(dest.name)}
                  className="w-full mt-auto bg-white/5 hover:bg-gradient-to-r hover:from-yellow-400 hover:to-yellow-600 hover:text-slate-900 text-white border border-white/10 hover:border-transparent py-3.5 rounded-xl font-bold transition-all text-sm flex items-center justify-center gap-2 shadow-lg"
                >
                  Enquire Packages
                </button>
              </div>
            </motion.div>
          ))}

          {filtered.length === 0 && (
            <div className="col-span-full text-center py-20 text-slate-500">
              <Compass size={48} className="mx-auto text-slate-600 mb-4 animate-spin" />
              <h3 className="text-lg font-bold text-white">No Destinations Found</h3>
              <p className="text-sm mt-1">Try searching for other popular tourist places.</p>
            </div>
          )}
        </div>
      </div>

      <EnquiryModal 
        isOpen={modalOpen} 
        onClose={() => setModalOpen(false)} 
        defaultDestination={activeDestination}
      />
    </div>
  );
}
