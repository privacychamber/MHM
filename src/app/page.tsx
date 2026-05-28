"use client";

import { useState } from "react";
import { Search, MapPin, Package, BarChart3, Tag, MousePointer2, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Globe from "@/components/Globe";
import DestinationCard from "@/components/DestinationCard";
import TrustSection from "@/components/TrustSection";
import CreativeExperience from "@/components/CreativeExperience";
import TestimonialSection from "@/components/TestimonialSection";
import PackageSection from "@/components/PackageSection";
import EnquiryModal from "@/components/EnquiryModal";
import { destinationsData, Destination } from "@/data/destinations";

const heroFeatures = [
  { icon: Search,   label: "Search Destination" },
  { icon: Package,  label: "Explore Packages" },
  { icon: BarChart3,label: "Compare Prices" },
  { icon: Tag,      label: "Best Price Guarantee" },
];

export default function Home() {
  const [searchQuery, setSearchQuery]           = useState("");
  const [selectedDestination, setSelectedDestination] =
    useState<Destination | null>(destinationsData["World Tour"]);
  const [showSuggestions, setShowSuggestions]   = useState(false);
  const [modalOpen, setModalOpen]               = useState(false);
  const [modalDest, setModalDest]               = useState("");
  const [isCardClosed, setIsCardClosed]         = useState(false);

  const filteredDestinations = Object.values(destinationsData).filter((d) =>
    d.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelect = (destination: Destination) => {
    setSelectedDestination(destination);
    setSearchQuery(destination.name);
    setShowSuggestions(false);
    setIsCardClosed(false);
  };

  const triggerEnquiry = (destName: string) => {
    setModalDest(destName);
    setModalOpen(true);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (filteredDestinations.length > 0) handleSelect(filteredDestinations[0]);
  };

  const activeDestId =
    searchQuery.trim() !== "" && filteredDestinations.length > 0
      ? filteredDestinations[0].id
      : selectedDestination?.id ?? null;

  // For the globe: world-tour has lat/lng 0,0 so we pass null to keep auto-rotation
  const globeDestId =
    activeDestId === "world-tour" ? null : activeDestId;


  const activeDestination =
    searchQuery.trim() !== "" && filteredDestinations.length > 0
      ? filteredDestinations[0]
      : selectedDestination;

  return (
    <div suppressHydrationWarning className="bg-transparent min-h-screen overflow-x-hidden">

      {/* ═══════════════════════════════════════════════════════════
          HERO SECTION — full-viewport immersive globe experience
      ═══════════════════════════════════════════════════════════ */}
      <section suppressHydrationWarning id="home" className="relative min-h-screen md:h-screen overflow-hidden md:overflow-hidden pb-10 md:pb-0 flex flex-col md:block">

        {/* Ambient background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#ffffff] via-[#f1f5f9] to-[#e2e8f0] dark:from-[#0c1133] dark:via-[#020817] dark:to-[#00040f]" />

        {/* Ambient glow blobs */}
        <div className="absolute top-[-15%] left-[-8%] w-[45%] h-[50%] bg-blue-700/12 rounded-full blur-[130px] pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[8%]  w-[35%] h-[50%] bg-yellow-500/6 rounded-full blur-[110px] pointer-events-none" />
        <div className="absolute top-[35%]  left-[38%]  w-[28%] h-[32%] bg-cyan-500/6  rounded-full blur-[90px]  pointer-events-none" />

        {/* ── Globe fills entire hero ──────────────── */}
        <div className="relative md:absolute md:top-24 md:bottom-8 md:left-0 md:right-0 w-full h-[40vh] md:h-auto z-0 order-3 md:order-none my-6 md:my-0">
          <Globe
            selectedDestination={globeDestId}
            className="w-full h-full"
          />
        </div>

        {/* ── Search bar (top-center, below navbar) ── */}
        <div className="relative md:absolute md:top-20 md:left-1/2 md:-translate-x-1/2 w-full md:max-w-2xl px-4 pt-24 md:pt-0 pb-4 md:pb-0 z-30 order-1 md:order-none">
          <div className="relative">
            <form
              onSubmit={handleSearchSubmit}
              className={`flex items-center gap-3 bg-[#ffffff]/60 dark:bg-black/55 backdrop-blur-2xl border ${
                showSuggestions ? "border-yellow-400/70" : "border-[#0f172a]/15 dark:border-white/25"
              } rounded-2xl px-5 py-3.5 shadow-[0_4px_40px_rgba(0,0,0,0.75)] transition-all duration-300 hover:border-white/40`}
            >
              <Search size={19} className="text-yellow-400 shrink-0" />
              <input
                id="hero-search"
                type="text"
                placeholder="Search Japan, Switzerland, Dubai, Thailand..."
                className="flex-1 bg-transparent border-none outline-none text-white text-[0.95rem] font-medium placeholder:text-slate-400 dark:placeholder:text-white/50"
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setShowSuggestions(true); }}
                onFocus={() => setShowSuggestions(true)}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 180)}
                autoComplete="off"
              />
              <button
                type="submit"
                className="bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-300 hover:to-amber-400 active:scale-95 text-black px-6 py-2.5 rounded-xl font-bold text-sm transition-all shrink-0 shadow-[0_0_20px_rgba(245,184,65,0.4)]"
              >
                Search
              </button>
            </form>

            {/* Suggestions */}
            <AnimatePresence>
              {showSuggestions && searchQuery && filteredDestinations.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  transition={{ duration: 0.18 }}
                  className="absolute top-full mt-2 w-full bg-[#ffffff]/95 dark:bg-[#08102a]/95 backdrop-blur-2xl border border-[#0f172a]/10 dark:border-white/10 rounded-2xl overflow-hidden shadow-[0_12px_40px_rgba(0,0,0,0.7)] z-50"
                >
                  {filteredDestinations.slice(0, 7).map((dest) => (
                    <div
                      key={dest.id}
                      onMouseDown={() => handleSelect(dest)}
                      className="flex items-center gap-3 px-5 py-3.5 hover:bg-white/8 cursor-pointer border-b border-white/5 last:border-none transition-colors"
                    >
                      <span className="text-xl leading-none">{dest.flag}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-white text-sm font-semibold">{dest.name}</p>
                        <p className="text-white/38 text-xs truncate">{dest.topCities}</p>
                      </div>
                      <MapPin size={13} className="text-yellow-400 shrink-0" />
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* ── Left: Heading + mini trust icons ─────── */}
        {/* Vignette behind text for legibility over the globe */}
        <div className="absolute left-0 top-0 bottom-0 w-[520px] lg:w-[600px] bg-gradient-to-r from-[#ffffff]/95 via-[#ffffff]/75 via-[#ffffff]/35 to-transparent dark:from-black/95 dark:via-black/75 dark:via-black/35 dark:to-transparent pointer-events-none z-10 hidden md:block" />
        <div className="relative md:absolute md:left-0 md:top-0 md:bottom-0 flex flex-col justify-start md:justify-center items-center md:items-start text-center md:text-left px-4 md:px-0 md:pl-8 sm:md:pl-12 lg:md:pl-16 w-full md:w-auto z-20 pointer-events-none order-2 md:order-none mt-4 md:mt-0">
          <motion.div
            className="pointer-events-auto max-w-md md:max-w-[300px] lg:max-w-[360px]"
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Badge */}
            <div className="inline-flex items-center gap-2 mb-5 px-3.5 py-1.5 rounded-full bg-yellow-400/15 border border-yellow-600/40 dark:border-yellow-400/40 backdrop-blur-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-yellow-400 animate-pulse" />
              <span className="text-yellow-600 dark:text-yellow-300 text-[10px] font-bold uppercase tracking-[0.14em]">
                Premium Travel Experience
              </span>
            </div>

            {/* Heading */}
            <h1 className="text-3xl sm:text-4xl md:text-[2.6rem] lg:md:text-[3.2rem] xl:md:text-[3.6rem] font-black text-white leading-[1.06] tracking-tight mb-5 dark:drop-shadow-[0_2px_12px_rgba(0,0,0,0.9)]">
              Explore the <br className="hidden md:inline" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 via-yellow-600 to-amber-600 dark:from-yellow-300 dark:via-yellow-400 dark:to-amber-500">
                World.
              </span>
              <br className="hidden md:inline" />
              {" "}Your Journey <br className="hidden md:inline" />
              Starts Here.
            </h1>

            {/* Sub-text */}
            <p className="text-white/75 text-sm leading-relaxed mb-7 max-w-sm md:max-w-[280px] mx-auto md:mx-0 dark:drop-shadow-[0_1px_4px_rgba(0,0,0,0.8)]">
              Search any country, city, or destination and discover amazing travel packages,
              visa information, and attractions instantly.
            </p>

            {/* Mini feature grid */}
            <div className="grid grid-cols-2 gap-2 text-left">
              {heroFeatures.map(({ icon: Icon, label }) => (
                <div
                  key={label}
                  className="flex items-center gap-2.5 bg-[#ffffff]/80 dark:bg-black/40 border border-slate-200 dark:border-white/15 rounded-xl px-3 py-2.5 backdrop-blur-sm hover:border-yellow-400/35 hover:bg-[#ffffff]/95 dark:hover:bg-black/55 transition-all"
                >
                  <div className="w-6 h-6 rounded-lg bg-yellow-400/20 flex items-center justify-center shrink-0">
                    <Icon size={12} className="text-yellow-400" />
                  </div>
                  <span className="text-white/85 text-xs font-semibold">{label}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* ── Right: Destination info card ─────────── */}
        <div className="relative md:absolute w-full md:w-[340px] lg:md:w-[368px] px-4 md:px-0 right-0 md:right-3 lg:md:right-8 xl:md:right-12 top-0 bottom-0 flex justify-center items-end md:items-center z-20 pointer-events-none order-4 mt-6 md:mt-0">
          {!isCardClosed && activeDestination ? (
            <DestinationCard
              destination={activeDestination}
              onEnquire={triggerEnquiry}
              onClose={() => setIsCardClosed(true)}
            />
          ) : activeDestination ? (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              onClick={() => setIsCardClosed(false)}
              className="relative md:absolute right-0 bottom-0 md:bottom-24 lg:md:bottom-1/2 lg:md:-translate-y-1/2 pointer-events-auto bg-[#ffffff]/90 dark:bg-[#060d20]/90 backdrop-blur-md border border-yellow-400/50 hover:border-yellow-400 text-yellow-400 font-bold px-4 py-2.5 rounded-full flex items-center gap-2 shadow-[0_0_20px_rgba(234,179,8,0.25)] text-xs transition-all z-20 active:scale-95 cursor-pointer"
            >
              <Sparkles size={14} className="animate-pulse" />
              Show Details
            </motion.button>
          ) : null}
        </div>

        {/* ── Bottom: drag-to-rotate hint ───────────── */}
        <motion.div
          className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2 pointer-events-none hidden md:flex"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.7 }}
        >
          <div className="w-9 h-9 rounded-full border border-white/18 bg-white/4 backdrop-blur-sm flex items-center justify-center">
            <MousePointer2 size={15} className="text-white/35" />
          </div>
          <span className="text-white/28 text-[11px] tracking-wider">Drag to rotate the globe</span>
        </motion.div>

      </section>

      {/* ═══════════════════════════════════════════════════════════
          SECTIONS BELOW HERO
      ═══════════════════════════════════════════════════════════ */}
      <div className="relative bg-navy-900">
        <TrustSection />
        <CreativeExperience />
        <TestimonialSection />
        <PackageSection />
      </div>

      {/* WhatsApp sticky (mobile) */}
      <a
        href="https://wa.me/918437770006?text=Hi%20MHM%20Travels!%20I%20am%20interested%20in%20a%20travel%20package."
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center shadow-[0_0_24px_rgba(16,185,129,0.45)] text-[#ffffff] hover:scale-110 transition-transform md:hidden"
        aria-label="WhatsApp Enquiry"
      >
        <svg className="w-7 h-7" viewBox="0 0 24 24" fill="currentColor">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
        </svg>
      </a>

      {/* Global enquiry modal */}
      <EnquiryModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        defaultDestination={modalDest}
      />
    </div>
  );
}
