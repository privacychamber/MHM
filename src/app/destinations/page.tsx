"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Search, MapPin, Star, Clock, Compass, Shield, ArrowRight, Sparkles, Building, Calendar } from "lucide-react";
import { motion } from "framer-motion";
import { useData } from "@/context/DataContext";
import EnquiryModal from "@/components/EnquiryModal";

export default function DestinationsPage() {
  const { destinationList, getPackagesByDestinationId, isLoading } = useData();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRegion, setSelectedRegion] = useState("All");
  const [modalOpen, setModalOpen] = useState(false);
  const [activeDestination, setActiveDestination] = useState("");

  const filtered = destinationList.filter((dest) => {
    // Only published
    if (dest.published === false) return false;

    const nameMatch = dest.name.toLowerCase().includes(searchQuery.toLowerCase());
    const citiesMatch = (dest.topCities || "").toLowerCase().includes(searchQuery.toLowerCase());
    const attractionsMatch = (dest.topAttractions || "").toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSearch = nameMatch || citiesMatch || attractionsMatch;

    if (!matchesSearch) return false;

    if (selectedRegion === "All") return true;
    if (selectedRegion === "Asia") {
      return ["japan", "thailand", "singapore", "bali", "india", "dubai", "maldives"].includes(dest.id);
    }
    if (selectedRegion === "Europe") {
      return ["switzerland", "france", "italy", "united-kingdom", "turkey"].includes(dest.id);
    }
    if (selectedRegion === "Other") {
      return ["new-zealand", "australia", "united-states", "egypt"].includes(dest.id);
    }
    return true;
  });

  const triggerEnquiry = (e: React.MouseEvent, name: string) => {
    e.preventDefault();
    e.stopPropagation();
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
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-yellow-400 font-bold uppercase tracking-widest text-xs px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 shadow-[0_0_15px_rgba(250,204,21,0.1)]">
              Curated World Destinations
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mt-6 leading-tight">
              Explore Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 via-yellow-400 to-yellow-600 glow-text">Destinations</span>
            </h1>
            <p className="text-slate-400 mt-4 text-base md:text-lg">
              Discover unique itineraries, visa guidelines, seasonal highlights, and handpicked luxury tour packages across the globe.
            </p>
          </motion.div>
        </div>

        {/* Filters and Search Bar */}
        <div className="glass-card p-6 mb-12 flex flex-col md:flex-row gap-4 items-center justify-between rounded-2xl border border-white/10">
          {/* Tabs */}
          <div className="flex gap-2 p-1 bg-white/5 rounded-xl border border-white/5 w-full md:w-auto overflow-x-auto">
            {["All", "Asia", "Europe", "Other"].map((tab) => (
              <button
                key={tab}
                onClick={() => setSelectedRegion(tab)}
                className={`px-5 py-2.5 rounded-lg text-sm font-semibold transition-all cursor-pointer ${
                  selectedRegion === tab 
                    ? "bg-gradient-to-r from-yellow-400 to-yellow-600 text-slate-900 shadow-md font-bold" 
                    : "text-slate-400 hover:text-white hover:bg-white/5"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-80 flex items-center bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 transition-all hover:border-yellow-400/50">
            <Search size={18} className="text-slate-400 mr-2 flex-shrink-0" />
            <input 
              type="text" 
              placeholder="Search country, city or attraction..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-transparent border-none outline-none text-white text-sm placeholder:text-slate-500"
            />
          </div>
        </div>

        {/* Grid */}
        {isLoading ? (
          <div className="py-20 flex justify-center">
            <div className="w-12 h-12 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : filtered.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filtered.map((dest, index) => {
              const packages = getPackagesByDestinationId(dest.id);
              const pkgCount = packages.length;
              const slug = dest.slug || dest.id;

              return (
                <motion.div
                  key={dest.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.04, duration: 0.4 }}
                  whileHover={{ y: -6 }}
                  className="glass-card rounded-3xl overflow-hidden border border-white/10 hover:border-yellow-400/50 transition-all flex flex-col group"
                >
                  {/* Card Cover Image */}
                  <Link href={`/destinations/${slug}`} className="relative h-64 w-full overflow-hidden block">
                    <Image 
                      src={dest.image} 
                      alt={dest.name} 
                      fill 
                      className="object-cover group-hover:scale-108 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-navy-950/40 to-transparent"></div>
                    
                    <div className="absolute top-4 left-4 flex items-center gap-2">
                      <span className="text-xl bg-black/50 backdrop-blur-md p-1.5 rounded-full border border-white/10">
                        {dest.flag}
                      </span>
                      <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-black/60 backdrop-blur-md text-yellow-400 border border-yellow-400/30">
                        {dest.type || "Country"}
                      </span>
                    </div>

                    <div className="absolute top-4 right-4">
                      <span className="px-3 py-1 rounded-full text-xs font-bold bg-navy-950/80 backdrop-blur-md text-white border border-white/10 flex items-center gap-1 text-yellow-400">
                        <Star size={13} className="fill-yellow-400" />
                        {dest.rating || 4.8}
                      </span>
                    </div>

                    <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-xs text-white">
                      <span className="px-2.5 py-1 rounded-lg bg-black/60 backdrop-blur-md text-yellow-300 font-medium">
                        {pkgCount > 0 ? `${pkgCount} Tour Package${pkgCount > 1 ? 's' : ''}` : 'Bespoke Itinerary'}
                      </span>
                      <span className="flex items-center gap-1 text-slate-300 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-lg">
                        <Calendar size={12} className="text-yellow-400" />
                        {dest.bestTime || "Year-Round"}
                      </span>
                    </div>
                  </Link>

                  {/* Card Body */}
                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <Link href={`/destinations/${slug}`}>
                          <h3 className="text-2xl font-black text-white group-hover:text-yellow-400 transition-colors">
                            {dest.name}
                          </h3>
                        </Link>
                      </div>

                      <p className="text-xs md:text-sm text-slate-300 line-clamp-2 mb-4 leading-relaxed">
                        {dest.shortDescription || dest.description || `Explore luxury travel packages, top attractions and visa guidance for ${dest.name}.`}
                      </p>

                      <div className="space-y-2 mb-6">
                        <div className="flex items-center gap-2 text-xs text-slate-400">
                          <Building size={14} className="text-yellow-400 flex-shrink-0" />
                          <span className="truncate">Top Hubs: {dest.topCities || "Major Cities"}</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-slate-400">
                          <Shield size={14} className="text-yellow-400 flex-shrink-0" />
                          <span className="truncate">Visa: {dest.visa || "Guidance Available"}</span>
                        </div>
                      </div>
                    </div>

                    {/* Action Bar */}
                    <div className="pt-4 border-t border-white/10 flex items-center justify-between gap-3">
                      <button
                        onClick={(e) => triggerEnquiry(e, dest.name)}
                        className="text-xs font-bold text-slate-400 hover:text-white transition-colors cursor-pointer"
                      >
                        Enquire
                      </button>
                      <Link
                        href={`/destinations/${slug}`}
                        className="px-4 py-2.5 rounded-xl bg-yellow-400/10 hover:bg-yellow-400 text-yellow-300 hover:text-slate-950 font-bold text-xs border border-yellow-400/30 transition-all flex items-center gap-1.5 group-hover:bg-yellow-400 group-hover:text-slate-950"
                      >
                        <span>Explore</span>
                        <ArrowRight size={14} />
                      </Link>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        ) : (
          <div className="glass-card rounded-3xl p-12 text-center max-w-md mx-auto border border-white/10">
            <Compass size={48} className="text-yellow-400 mx-auto mb-4 opacity-60" />
            <h3 className="text-xl font-bold text-white mb-2">No Destinations Found</h3>
            <p className="text-sm text-slate-400 mb-6">
              We couldn't find any destinations matching &quot;{searchQuery}&quot;. Try adjusting your search query or region filter.
            </p>
            <button
              onClick={() => { setSearchQuery(""); setSelectedRegion("All"); }}
              className="px-6 py-2.5 rounded-full bg-yellow-400 text-slate-950 font-bold text-xs hover:bg-yellow-300 transition-all"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>

      <EnquiryModal 
        isOpen={modalOpen} 
        onClose={() => setModalOpen(false)} 
        defaultDestination={activeDestination} 
      />
    </div>
  );
}
