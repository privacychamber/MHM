"use client";

import { useState } from "react";
import { Search, MapPin } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Globe from "@/components/Globe";
import DestinationCard from "@/components/DestinationCard";
import TrustSection from "@/components/TrustSection";
import CreativeExperience from "@/components/CreativeExperience";
import PackageSection from "@/components/PackageSection";
import EnquiryModal from "@/components/EnquiryModal";
import { destinationsData, Destination } from "@/data/destinations";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  // Set initial selected destination to India so the page looks stunning on load
  const [selectedDestination, setSelectedDestination] = useState<Destination | null>(destinationsData["India"]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalDest, setModalDest] = useState("");

  const filteredDestinations = Object.values(destinationsData).filter(d => 
    d.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelect = (destination: Destination) => {
    setSelectedDestination(destination);
    setSearchQuery(destination.name);
    setShowSuggestions(false);
  };

  const triggerEnquiry = (destName: string) => {
    setModalDest(destName);
    setModalOpen(true);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (filteredDestinations.length > 0) {
      handleSelect(filteredDestinations[0]);
    }
  };

  return (
    <div className="min-h-screen relative flex flex-col bg-navy-950">
      {/* Dynamic Background Elements */}
      <div className="absolute top-0 left-0 w-full h-screen overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-blue-500/10 rounded-full blur-[120px]"></div>
        <div className="absolute top-[20%] right-[-10%] w-[40%] h-[60%] bg-yellow-500/5 rounded-full blur-[100px]"></div>
      </div>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center pt-24 pb-12 z-10" id="home">
        <div className="container mx-auto px-4 md:px-6 h-full flex flex-col justify-center">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center min-h-[70vh]">
            
            {/* Left Content */}
            <div className="lg:col-span-5 flex flex-col justify-center z-20 order-2 lg:order-1">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
              >
                <div className="inline-block px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-yellow-400 text-sm font-semibold tracking-wider mb-6 backdrop-blur-md uppercase shadow-[0_0_15px_rgba(250,204,21,0.15)]">
                  Premium Travel Experience
                </div>
                
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-white leading-[1.1] mb-6 tracking-tight">
                  Explore the <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 via-yellow-400 to-yellow-600 glow-text">World.</span><br/>
                  Your Journey<br/>Starts Here.
                </h1>
                
                <p className="text-lg text-slate-300 mb-10 max-w-lg leading-relaxed">
                  Search any country or city and discover amazing destinations, travel packages, visa guidance, and unforgettable experiences.
                </p>

                {/* Search Bar wrapped in Form */}
                <div className="relative w-full max-w-md">
                  <form 
                    onSubmit={handleSearchSubmit}
                    className={`relative flex items-center bg-navy-900/50 backdrop-blur-xl border ${showSuggestions ? 'border-yellow-400/50' : 'border-white/20'} rounded-2xl p-2 transition-all duration-300 shadow-[0_0_30px_rgba(0,0,0,0.5)] group hover:border-yellow-400/50 hover:shadow-[0_0_20px_rgba(250,204,21,0.15)]`}
                  >
                    <div className="pl-4 pr-2 text-slate-400 group-hover:text-yellow-400 transition-colors">
                      <Search size={22} />
                    </div>
                    <input 
                      type="text" 
                      placeholder="Japan, Switzerland, Dubai..."
                      className="w-full bg-transparent border-none outline-none text-white text-lg px-2 py-3 placeholder:text-slate-500"
                      value={searchQuery}
                      onChange={(e) => {
                        setSearchQuery(e.target.value);
                        setShowSuggestions(true);
                      }}
                      onFocus={() => setShowSuggestions(true)}
                      onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                    />
                    <button 
                      type="submit"
                      className="bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-300 hover:to-yellow-500 text-navy-900 px-6 py-3 rounded-xl font-bold transition-all shadow-lg transform active:scale-95 shrink-0"
                    >
                      Explore
                    </button>
                  </form>

                  {/* Search Suggestions */}
                  <AnimatePresence>
                    {showSuggestions && searchQuery && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute top-full left-0 w-full mt-2 glass-card overflow-hidden z-50 border border-white/10 shadow-2xl"
                      >
                        {filteredDestinations.length > 0 ? (
                          filteredDestinations.map(dest => (
                            <div 
                              key={dest.id}
                              className="flex items-center gap-3 p-4 hover:bg-white/10 cursor-pointer transition-colors border-b border-white/5 last:border-none"
                              onMouseDown={() => handleSelect(dest)}
                            >
                              <span className="text-2xl">{dest.flag}</span>
                              <div className="flex-1">
                                <h4 className="text-white font-bold">{dest.name}</h4>
                                <p className="text-xs text-slate-400">{dest.topCities}</p>
                              </div>
                              <MapPin size={16} className="text-yellow-400" />
                            </div>
                          ))
                        ) : (
                          <div className="p-4 text-slate-400 text-sm">No destinations found. Try "Japan" or "Switzerland".</div>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            </div>

            {/* Center & Right: Globe & Card */}
            <div className="lg:col-span-7 relative h-[60vh] lg:h-full flex items-center justify-center order-1 lg:order-2">
              <div className="absolute inset-0 w-full h-full">
                <Globe selectedDestination={
                  (searchQuery.trim() !== "" && filteredDestinations.length > 0)
                    ? filteredDestinations[0].id
                    : (selectedDestination?.id || null)
                } />
              </div>
              
              <div className="absolute top-1/2 lg:top-auto lg:bottom-10 right-0 transform -translate-y-1/2 lg:translate-y-0 w-full md:w-auto px-4 md:px-0 pointer-events-none flex justify-end md:justify-center lg:justify-end z-30">
                <div className="pointer-events-auto">
                  <DestinationCard 
                    destination={
                      (searchQuery.trim() !== "" && filteredDestinations.length > 0)
                        ? filteredDestinations[0]
                        : selectedDestination
                    } 
                    onEnquire={triggerEnquiry} 
                  />
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Trust Section */}
      <TrustSection />

      {/* GSAP Creative Experience Showcase */}
      <CreativeExperience />

      {/* Package Section */}
      <PackageSection />

      {/* Sticky WhatsApp Enquire Button for Mobile */}
      <a 
        href="https://wa.me/918437770006?text=Hi%20MHM%20Travels!%20I%20am%20interested%20in%20enquiring%20about%20a%20luxury%20holiday%2520package."
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(16,185,129,0.4)] text-white hover:scale-110 transition-transform md:hidden animate-bounce"
      >
        <svg className="w-7 h-7" viewBox="0 0 24 24" fill="currentColor">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
        </svg>
      </a>

      {/* Global Enquiry Modal */}
      <EnquiryModal 
        isOpen={modalOpen} 
        onClose={() => setModalOpen(false)} 
        defaultDestination={modalDest} 
      />
    </div>
  );
}
