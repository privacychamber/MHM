"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { 
  Calendar, 
  MapPin, 
  Clock, 
  Star, 
  Check, 
  X, 
  ChevronDown, 
  Compass, 
  Sparkles, 
  PhoneCall, 
  Info, 
  Luggage,
  ShieldCheck,
  CheckCircle2,
  ArrowRight
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useData } from "@/context/DataContext";
import { TravelPackage, defaultPackages } from "@/data/packages";
import EnquiryModal from "@/components/EnquiryModal";

function PackageDetailContent() {
  const searchParams = useSearchParams();
  const packageId = searchParams.get("id");
  const { packages, isLoading } = useData();

  const [activeTab, setActiveTab] = useState<"dayByDay" | "yourTrip" | "travelTips" | "inclusions">("dayByDay");
  const [expandedDays, setExpandedDays] = useState<Record<number, boolean>>({ 1: true });
  const [modalOpen, setModalOpen] = useState(false);

  // Find matching package, fallback to first package if not found
  const pkgList = (packages && packages.length > 0) ? packages : defaultPackages;
  const currentPkg: TravelPackage = 
    pkgList.find((p) => p.id === packageId) || 
    pkgList.find((p) => p.id === "new-zealand-wonders") || 
    pkgList[0];

  useEffect(() => {
    // Expand day 1 by default whenever currentPkg changes
    setExpandedDays({ 1: true });
  }, [currentPkg]);

  const toggleDay = (dayNum: number) => {
    setExpandedDays((prev) => ({
      ...prev,
      [dayNum]: !prev[dayNum],
    }));
  };

  const expandAllDays = () => {
    if (!currentPkg.itinerary) return;
    const all: Record<number, boolean> = {};
    currentPkg.itinerary.forEach((d) => {
      all[d.day] = true;
    });
    setExpandedDays(all);
  };

  const collapseAllDays = () => {
    setExpandedDays({});
  };

  const allExpanded = currentPkg.itinerary && currentPkg.itinerary.length > 0
    ? currentPkg.itinerary.every((d) => expandedDays[d.day])
    : false;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pt-20">
      {/* Hero Header Banner */}
      <section className="relative min-h-[380px] md:min-h-[460px] flex items-end overflow-hidden pb-12">
        <div className="absolute inset-0 z-0">
          <img 
            src={currentPkg.heroImage || currentPkg.image} 
            alt={currentPkg.title}
            className="w-full h-full object-cover object-center transform scale-105 filter brightness-75"
          />
          {/* Subtle gradient overlays */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-slate-950/20" />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/80 via-slate-950/30 to-transparent" />
        </div>

        <div className="container mx-auto px-4 md:px-8 relative z-10">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs md:text-sm text-slate-300/80 mb-4">
            <Link href="/" className="hover:text-yellow-400 transition-colors">Home</Link>
            <span>/</span>
            <Link href="/packages" className="hover:text-yellow-400 transition-colors">Packages</Link>
            <span>/</span>
            <span className="text-yellow-400 font-medium truncate max-w-[200px] md:max-w-md">{currentPkg.title}</span>
          </div>

          {/* Badges */}
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <span className="bg-yellow-500 text-slate-950 text-xs font-black uppercase tracking-wider px-3.5 py-1 rounded-full shadow-lg shadow-yellow-500/20">
              {currentPkg.category}
            </span>
            <span className="flex items-center gap-1.5 bg-black/60 backdrop-blur-md border border-white/10 text-white text-xs px-3 py-1 rounded-full">
              <Clock size={13} className="text-yellow-400" />
              {currentPkg.duration}
            </span>
            <span className="flex items-center gap-1 bg-black/60 backdrop-blur-md border border-white/10 text-yellow-400 text-xs px-3 py-1 rounded-full font-bold">
              <Star size={13} fill="currentColor" />
              {currentPkg.rating} Rating
            </span>
          </div>

          {/* Title */}
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight max-w-4xl drop-shadow-md">
            {currentPkg.title}
          </h1>

          {/* Destinations String */}
          <p className="text-slate-300 text-sm md:text-base mt-3 flex items-center gap-2 max-w-3xl">
            <MapPin size={16} className="text-yellow-400 shrink-0" />
            <span>{currentPkg.destinations}</span>
          </p>
        </div>
      </section>

      {/* Sticky Sub-Navigation Bar (Matches screenshot) */}
      <nav className="sticky top-16 md:top-20 z-40 bg-white dark:bg-slate-900 border-y border-slate-200 dark:border-white/10 shadow-md">
        <div className="container mx-auto px-4 md:px-8">
          <div className="flex items-center justify-between gap-4 py-2.5">
            {/* Tabs List */}
            <div className="flex items-center gap-1 md:gap-3 overflow-x-auto no-scrollbar py-1">
              <button
                onClick={() => setActiveTab("yourTrip")}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs md:text-sm font-semibold transition-all whitespace-nowrap ${
                  activeTab === "yourTrip"
                    ? "bg-slate-100 dark:bg-white/10 text-yellow-600 dark:text-yellow-400 border border-yellow-500/30"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                <Luggage size={16} />
                <span>Your Trip</span>
              </button>

              <button
                onClick={() => setActiveTab("dayByDay")}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs md:text-sm font-semibold transition-all whitespace-nowrap ${
                  activeTab === "dayByDay"
                    ? "bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 border border-red-500/30"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                <Calendar size={16} />
                <span>Day By Day</span>
              </button>

              <button
                onClick={() => setActiveTab("travelTips")}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs md:text-sm font-semibold transition-all whitespace-nowrap ${
                  activeTab === "travelTips"
                    ? "bg-slate-100 dark:bg-white/10 text-yellow-600 dark:text-yellow-400 border border-yellow-500/30"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                <Compass size={16} />
                <span>Travel Tips</span>
              </button>

              <button
                onClick={() => setActiveTab("inclusions")}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs md:text-sm font-semibold transition-all whitespace-nowrap ${
                  activeTab === "inclusions"
                    ? "bg-slate-100 dark:bg-white/10 text-yellow-600 dark:text-yellow-400 border border-yellow-500/30"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                <ShieldCheck size={16} />
                <span>Inclusions Exclusions</span>
              </button>
            </div>

            {/* Price & Book CTA (Right side of sticky bar) */}
            <div className="flex items-center gap-4 shrink-0">
              <div className="text-right hidden sm:block">
                <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase tracking-wider block font-bold">Starting from</span>
                <span className="text-xl md:text-2xl font-black text-slate-900 dark:text-white">
                  {currentPkg.price}
                </span>
              </div>
              <button
                onClick={() => setModalOpen(true)}
                className="bg-red-600 hover:bg-red-500 text-white font-black text-xs md:text-sm px-5 md:px-7 py-2.5 rounded-lg transition-all shadow-md active:scale-95 uppercase tracking-wider"
              >
                Book Now
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="container mx-auto px-4 md:px-8 py-10 md:py-14">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Main Detail Section (8 Cols) */}
          <div className="lg:col-span-8 space-y-10">
            
            {/* TAB: DAY BY DAY ITINERARY */}
            {activeTab === "dayByDay" && (
              <div>
                <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-200 dark:border-white/10">
                  <div>
                    <h2 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white">
                      Day wise Itinerary
                    </h2>
                    <p className="text-slate-500 dark:text-slate-400 text-xs md:text-sm mt-1">
                      Explore detailed schedule, experiences, and highlights day by day
                    </p>
                  </div>
                  
                  <button
                    onClick={allExpanded ? collapseAllDays : expandAllDays}
                    className="text-xs font-bold text-yellow-500 hover:text-yellow-400 px-3 py-1.5 rounded-lg border border-yellow-500/30 hover:bg-yellow-500/10 transition-colors"
                  >
                    {allExpanded ? "Collapse All" : "Expand All"}
                  </button>
                </div>

                {/* Timeline Container */}
                <div className="relative pl-6 md:pl-8 space-y-6">
                  {/* Vertical Timeline Track Line */}
                  <div className="absolute left-[18px] md:left-[22px] top-6 bottom-6 w-0.5 bg-slate-300 dark:bg-slate-800" />

                  {currentPkg.itinerary && currentPkg.itinerary.length > 0 ? (
                    currentPkg.itinerary.map((dayItem) => {
                      const isExpanded = !!expandedDays[dayItem.day];
                      return (
                        <div key={dayItem.day} className="relative group">
                          {/* Timeline Day Marker Pin */}
                          <div className={`absolute -left-6 md:-left-8 top-4 w-7 h-7 md:w-8 md:h-8 rounded-full border-2 flex items-center justify-center text-xs font-black transition-all z-10 ${
                            isExpanded 
                              ? "bg-yellow-500 text-slate-950 border-yellow-400 shadow-md shadow-yellow-500/30 scale-110" 
                              : "bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-300 dark:border-slate-700"
                          }`}>
                            {dayItem.day}
                          </div>

                          {/* Accordion Card (Matches user's screenshot layout) */}
                          <div className={`rounded-xl border transition-all overflow-hidden ${
                            isExpanded 
                              ? "bg-white dark:bg-slate-900/90 border-yellow-500/40 shadow-lg shadow-black/20" 
                              : "bg-slate-50 dark:bg-slate-900/40 border-slate-200 dark:border-white/5 hover:border-slate-300 dark:hover:border-white/10"
                          }`}>
                            {/* Accordion Header */}
                            <button
                              onClick={() => toggleDay(dayItem.day)}
                              className="w-full px-5 py-4 flex items-center justify-between text-left gap-4"
                            >
                              <div className="flex items-center gap-3">
                                <span className="bg-slate-200 dark:bg-white/10 text-slate-800 dark:text-slate-200 text-xs font-bold px-2.5 py-1 rounded-md">
                                  Day {dayItem.day}
                                </span>
                                <h3 className="text-base md:text-lg font-bold text-slate-900 dark:text-white group-hover:text-yellow-500 transition-colors">
                                  {dayItem.title}
                                </h3>
                              </div>

                              <ChevronDown 
                                size={18} 
                                className={`text-slate-400 shrink-0 transition-transform duration-300 ${isExpanded ? "rotate-180 text-yellow-500" : ""}`}
                              />
                            </button>

                            {/* Accordion Body */}
                            <AnimatePresence>
                              {isExpanded && (
                                <motion.div
                                  initial={{ height: 0, opacity: 0 }}
                                  animate={{ height: "auto", opacity: 1 }}
                                  exit={{ height: 0, opacity: 0 }}
                                  transition={{ duration: 0.3 }}
                                  className="border-t border-slate-200 dark:border-white/5"
                                >
                                  <div className="p-5 md:p-6 space-y-5">
                                    {/* Day Photo Banner */}
                                    {dayItem.image && (
                                      <div className="rounded-xl overflow-hidden h-52 md:h-64 relative shadow-md">
                                        <img 
                                          src={dayItem.image} 
                                          alt={dayItem.title} 
                                          className="w-full h-full object-cover"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent" />
                                      </div>
                                    )}

                                    {/* Subtitle / Day Highlights */}
                                    {dayItem.subtitle && (
                                      <h4 className="text-base font-bold text-yellow-600 dark:text-yellow-400">
                                        {dayItem.subtitle}
                                      </h4>
                                    )}

                                    {/* Activities Bullet Points (Matches screenshot style) */}
                                    <div className="space-y-3">
                                      {dayItem.activities && dayItem.activities.map((act, aIdx) => (
                                        <div key={aIdx} className="flex items-start gap-3 text-sm text-slate-700 dark:text-slate-300">
                                          <div className="w-1.5 h-1.5 rounded-full bg-yellow-500 mt-2 shrink-0" />
                                          <span className="leading-relaxed">{act}</span>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="p-8 text-center text-slate-400 bg-white dark:bg-slate-900 rounded-xl border border-white/5">
                      No day-wise itinerary recorded for this package yet.
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* TAB: YOUR TRIP (OVERVIEW & HIGHLIGHTS) */}
            {activeTab === "yourTrip" && (
              <div className="space-y-8">
                {/* Overview */}
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-2xl p-6 md:p-8">
                  <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-4">
                    Trip Overview
                  </h2>
                  <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
                    {currentPkg.overview || "Embark on an unforgettable vacation with handpicked luxury stays, guided sightseeing, seamless transfers, and unforgettable memory-making adventures."}
                  </p>
                </div>

                {/* Highlights */}
                {currentPkg.highlights && currentPkg.highlights.length > 0 && (
                  <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-2xl p-6 md:p-8">
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                      <Sparkles size={20} className="text-yellow-500" />
                      Key Tour Highlights
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {currentPkg.highlights.map((hl, idx) => (
                        <div key={idx} className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/5">
                          <CheckCircle2 size={18} className="text-yellow-500 shrink-0 mt-0.5" />
                          <span className="text-sm text-slate-700 dark:text-slate-200">{hl}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Quick Info Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10">
                    <span className="text-xs text-slate-500 dark:text-slate-400 block mb-1">Duration</span>
                    <span className="text-base font-bold text-slate-900 dark:text-white">{currentPkg.duration}</span>
                  </div>
                  <div className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10">
                    <span className="text-xs text-slate-500 dark:text-slate-400 block mb-1">Category</span>
                    <span className="text-base font-bold text-yellow-600 dark:text-yellow-400">{currentPkg.category}</span>
                  </div>
                  <div className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10">
                    <span className="text-xs text-slate-500 dark:text-slate-400 block mb-1">Guest Rating</span>
                    <span className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-1">
                      <Star size={14} className="text-yellow-500" fill="currentColor" /> {currentPkg.rating} / 5.0
                    </span>
                  </div>
                  <div className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10">
                    <span className="text-xs text-slate-500 dark:text-slate-400 block mb-1">Customizable</span>
                    <span className="text-base font-bold text-green-500">100% Flexible</span>
                  </div>
                </div>
              </div>
            )}

            {/* TAB: TRAVEL TIPS */}
            {activeTab === "travelTips" && (
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-2xl p-6 md:p-8 space-y-6">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-xl bg-yellow-500/10 flex items-center justify-center text-yellow-500">
                    <Info size={22} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-black text-slate-900 dark:text-white">
                      Essential Travel Tips & Guidelines
                    </h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Everything you need to know before your departure</p>
                  </div>
                </div>

                <div className="space-y-4 pt-4">
                  {currentPkg.travelTips && currentPkg.travelTips.length > 0 ? (
                    currentPkg.travelTips.map((tip, idx) => (
                      <div key={idx} className="p-4 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/5 flex items-start gap-3.5">
                        <span className="w-6 h-6 rounded-full bg-yellow-500/20 text-yellow-600 dark:text-yellow-400 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                          {idx + 1}
                        </span>
                        <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">{tip}</p>
                      </div>
                    ))
                  ) : (
                    <div className="space-y-3">
                      <div className="p-4 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/5">
                        <strong className="text-yellow-500">Visa Requirements:</strong> Valid passport with at least 6 months validity. Our visa team provides complete documentation support.
                      </div>
                      <div className="p-4 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/5">
                        <strong className="text-yellow-500">Currency & Cards:</strong> International credit/debit cards are widely accepted. Carrying a small amount of local currency is recommended for local tips and markets.
                      </div>
                      <div className="p-4 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/5">
                        <strong className="text-yellow-500">Weather & Packing:</strong> We recommend weather-appropriate layers, comfortable walking footwear, and universal power adapters.
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* TAB: INCLUSIONS & EXCLUSIONS */}
            {activeTab === "inclusions" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Inclusions Card */}
                <div className="bg-white dark:bg-slate-900 border border-green-500/20 rounded-2xl p-6 md:p-8 space-y-6">
                  <div className="flex items-center gap-3 pb-4 border-b border-green-500/20">
                    <div className="w-9 h-9 rounded-xl bg-green-500/10 text-green-500 flex items-center justify-center font-bold">
                      <Check size={20} />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-slate-900 dark:text-white">What's Included</h3>
                      <span className="text-xs text-green-500 font-semibold">Guaranteed inclusions in package</span>
                    </div>
                  </div>

                  <ul className="space-y-3.5">
                    {currentPkg.inclusions && currentPkg.inclusions.length > 0 ? (
                      currentPkg.inclusions.map((inc, idx) => (
                        <li key={idx} className="flex items-start gap-3 text-sm text-slate-700 dark:text-slate-300">
                          <Check size={16} className="text-green-500 shrink-0 mt-0.5" />
                          <span className="leading-snug">{inc}</span>
                        </li>
                      ))
                    ) : (
                      currentPkg.features.map((feat, idx) => (
                        <li key={idx} className="flex items-start gap-3 text-sm text-slate-700 dark:text-slate-300">
                          <Check size={16} className="text-green-500 shrink-0 mt-0.5" />
                          <span className="leading-snug">{feat}</span>
                        </li>
                      ))
                    )}
                  </ul>
                </div>

                {/* Exclusions Card */}
                <div className="bg-white dark:bg-slate-900 border border-red-500/20 rounded-2xl p-6 md:p-8 space-y-6">
                  <div className="flex items-center gap-3 pb-4 border-b border-red-500/20">
                    <div className="w-9 h-9 rounded-xl bg-red-500/10 text-red-500 flex items-center justify-center font-bold">
                      <X size={20} />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-slate-900 dark:text-white">What's Excluded</h3>
                      <span className="text-xs text-red-400 font-semibold">Payable extra on site</span>
                    </div>
                  </div>

                  <ul className="space-y-3.5">
                    {currentPkg.exclusions && currentPkg.exclusions.length > 0 ? (
                      currentPkg.exclusions.map((exc, idx) => (
                        <li key={idx} className="flex items-start gap-3 text-sm text-slate-700 dark:text-slate-300">
                          <X size={16} className="text-red-400 shrink-0 mt-0.5" />
                          <span className="leading-snug">{exc}</span>
                        </li>
                      ))
                    ) : (
                      [
                        "International & domestic airfare (unless specified)",
                        "Personal expenses like laundry, minibar, and telephone calls",
                        "Optional adventure activities not mentioned in itinerary",
                        "Travel and medical insurance cover"
                      ].map((item, idx) => (
                        <li key={idx} className="flex items-start gap-3 text-sm text-slate-700 dark:text-slate-300">
                          <X size={16} className="text-red-400 shrink-0 mt-0.5" />
                          <span className="leading-snug">{item}</span>
                        </li>
                      ))
                    )}
                  </ul>
                </div>
              </div>
            )}

          </div>

          {/* Right Sidebar Booking & Assistance Card (4 Cols) */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-2xl p-6 md:p-8 sticky top-36 shadow-xl">
              <span className="text-xs uppercase font-bold text-slate-500 dark:text-slate-400 tracking-wider block mb-1">
                Special Package Price
              </span>
              <div className="flex items-baseline gap-2 mb-2">
                <span className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white">
                  {currentPkg.price}
                </span>
                <span className="text-xs text-slate-400">/ per person</span>
              </div>
              <p className="text-xs text-green-500 font-semibold mb-6">
                ✓ Includes hotel stays, transfers, and activities
              </p>

              {/* Book Now Button */}
              <button
                onClick={() => setModalOpen(true)}
                className="w-full bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 text-white font-black py-4 rounded-xl text-sm transition-all shadow-lg shadow-red-600/30 active:scale-98 flex items-center justify-center gap-2 uppercase tracking-wider mb-4"
              >
                <span>Book This Tour</span>
                <ArrowRight size={16} />
              </button>

              <button
                onClick={() => setModalOpen(true)}
                className="w-full bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-800 dark:text-slate-200 font-bold py-3.5 rounded-xl text-xs transition-colors border border-slate-200 dark:border-white/10"
              >
                Request Custom Itinerary
              </button>

              {/* Trust badges */}
              <div className="pt-6 mt-6 border-t border-slate-200 dark:border-white/10 space-y-3.5">
                <div className="flex items-center gap-3 text-xs text-slate-600 dark:text-slate-400">
                  <ShieldCheck size={16} className="text-yellow-500 shrink-0" />
                  <span>100% Verified Local Partners & Guides</span>
                </div>
                <div className="flex items-center gap-3 text-xs text-slate-600 dark:text-slate-400">
                  <Sparkles size={16} className="text-yellow-500 shrink-0" />
                  <span>Transparent Pricing, No Hidden Charges</span>
                </div>
              </div>

              {/* Contact direct card */}
              <div className="mt-6 p-4 rounded-xl bg-yellow-500/10 border border-yellow-500/20 text-center">
                <p className="text-xs text-slate-600 dark:text-slate-300 mb-2 font-medium">Need immediate assistance with this package?</p>
                <a 
                  href="tel:+917650882223"
                  className="inline-flex items-center gap-2 text-yellow-600 dark:text-yellow-400 font-black text-sm hover:underline"
                >
                  <PhoneCall size={16} />
                  <span>+91 7650 882 223</span>
                </a>
              </div>
            </div>
          </div>

        </div>
      </main>

      {/* Booking Enquiry Modal */}
      <EnquiryModal 
        isOpen={modalOpen} 
        onClose={() => setModalOpen(false)} 
        defaultDestination={currentPkg.title}
      />
    </div>
  );
}

export default function PackageDetailPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-slate-400 text-sm">Loading package details...</p>
        </div>
      </div>
    }>
      <PackageDetailContent />
    </Suspense>
  );
}

