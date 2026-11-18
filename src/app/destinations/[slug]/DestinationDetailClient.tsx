"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { 
  MapPin, 
  Calendar, 
  Clock, 
  Coins, 
  Globe2, 
  Plane, 
  Star, 
  CheckCircle2, 
  ArrowRight, 
  FileText, 
  Compass, 
  Sparkles,
  ChevronRight,
  ShieldCheck,
  Share2,
  Building,
  Camera
} from "lucide-react";
import { FaWhatsapp } from "react-icons/fa6";
import { useData } from "@/context/DataContext";
import EnquiryModal from "@/components/EnquiryModal";

export default function DestinationDetailClient({ slug }: { slug: string }) {
  const { getDestinationBySlug, getPackagesByDestinationId, isLoading } = useData();
  const [modalOpen, setModalOpen] = useState(false);

  const destination = getDestinationBySlug(slug);
  const relatedPackages = destination ? getPackagesByDestinationId(destination.id) : [];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-navy-950 flex items-center justify-center pt-28">
        <div className="w-12 h-12 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!destination) {
    return (
      <div className="min-h-screen bg-navy-950 text-white flex flex-col items-center justify-center px-4 pt-28 pb-20 text-center">
        <Compass size={64} className="text-yellow-400 mb-6 opacity-60 animate-pulse" />
        <h1 className="text-3xl md:text-5xl font-black mb-4">Destination Not Found</h1>
        <p className="text-slate-400 max-w-md mb-8">
          The destination you are looking for is currently being curated or has moved. Explore our other world wonders.
        </p>
        <Link
          href="/destinations"
          className="px-8 py-3.5 rounded-full bg-gradient-to-r from-yellow-400 to-yellow-600 text-slate-950 font-bold hover:shadow-[0_0_25px_rgba(250,204,21,0.4)] transition-all"
        >
          View All Destinations
        </Link>
      </div>
    );
  }

  const attractions = destination.attractionsList && destination.attractionsList.length > 0
    ? destination.attractionsList
    : (destination.topAttractions ? destination.topAttractions.split(",").map(s => s.trim()) : []);

  const cities = destination.citiesList && destination.citiesList.length > 0
    ? destination.citiesList
    : (destination.topCities ? destination.topCities.split(",").map(s => s.trim()) : []);

  const highlights = destination.highlights && destination.highlights.length > 0
    ? destination.highlights
    : [
        `Discover signature luxury resorts and iconic landscapes across ${destination.name}`,
        `Bespoke itineraries curated with private chauffeur and premier guided excursions`,
        `End-to-end visa assistance and dedicated 24/7 concierge support`
      ];

  const whatsappMessage = encodeURIComponent(
    `Hi MHM Travels, I am interested in planning a luxury holiday to ${destination.name}. Please share customized packages and availability.`
  );

  return (
    <div className="min-h-screen bg-navy-950 text-white selection:bg-yellow-500/30">
      {/* 1. Hero Section with Background Glow */}
      <section className="relative min-h-[70vh] lg:min-h-[80vh] flex items-end pb-16 pt-32 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src={destination.heroImage || destination.image}
            alt={destination.name}
            fill
            priority
            className="object-cover object-center scale-105 animate-pulse-slow"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-navy-950/70 to-navy-950/30"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-navy-950/80 via-transparent to-navy-950/80"></div>
        </div>

        <div className="container mx-auto px-4 md:px-6 relative z-10">
          {/* Breadcrumb Navigation */}
          <nav className="flex items-center gap-2 text-xs md:text-sm text-slate-400 mb-6 flex-wrap">
            <Link href="/" className="hover:text-yellow-400 transition-colors">Home</Link>
            <ChevronRight size={14} />
            <Link href="/destinations" className="hover:text-yellow-400 transition-colors">Destinations</Link>
            <ChevronRight size={14} />
            <span className="text-yellow-400 font-medium">{destination.name}</span>
          </nav>

          <div className="max-w-4xl">
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <span className="text-2xl md:text-3xl">{destination.flag}</span>
              <span className="px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-widest bg-yellow-400/20 text-yellow-300 border border-yellow-400/30 backdrop-blur-md">
                {destination.type || "Country"}
              </span>
              {destination.parentCountry && (
                <span className="px-3 py-1 rounded-full text-xs font-medium text-slate-300 bg-white/10 backdrop-blur-md">
                  Part of {destination.parentCountry}
                </span>
              )}
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/40 border border-white/10 backdrop-blur-md text-xs text-yellow-400">
                <Star size={14} className="fill-yellow-400" />
                <span className="font-bold">{destination.rating || 4.9}</span>
                <span className="text-slate-400">({destination.reviews || "1,000+"} Reviews)</span>
              </div>
            </div>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-white leading-tight tracking-tight mb-4">
              {destination.name}
            </h1>

            <p className="text-base md:text-xl text-slate-200 font-light max-w-2xl leading-relaxed mb-8 drop-shadow-md">
              {destination.shortDescription || destination.description || "Experience the timeless beauty, rich culture, and world-class luxury of this iconic destination."}
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <button
                onClick={() => setModalOpen(true)}
                className="px-8 py-4 rounded-full bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 text-slate-950 font-black text-sm uppercase tracking-wider hover:shadow-[0_0_30px_rgba(250,204,21,0.5)] transition-all transform hover:-translate-y-0.5 cursor-pointer"
              >
                Plan Your Trip
              </button>
              <a
                href={`https://wa.me/919876543210?text=${whatsappMessage}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-4 rounded-full bg-emerald-600/90 hover:bg-emerald-500 text-white font-bold text-sm flex items-center gap-2.5 backdrop-blur-md shadow-lg transition-all"
              >
                <FaWhatsapp size={18} />
                WhatsApp Enquiry
              </a>
              <Link
                href={`/visa?dest=${destination.id}`}
                className="px-6 py-4 rounded-full bg-white/10 hover:bg-white/20 text-white font-medium text-sm border border-white/15 backdrop-blur-md transition-all flex items-center gap-2"
              >
                <FileText size={16} className="text-yellow-400" />
                Visa Guidelines
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Key Facts Bar */}
      <section className="border-y border-white/10 bg-navy-900/60 backdrop-blur-md py-6">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-yellow-400/10 border border-yellow-400/20 flex items-center justify-center text-yellow-400 flex-shrink-0">
                <Calendar size={18} />
              </div>
              <div>
                <p className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold">Best Time</p>
                <p className="text-sm font-bold text-white truncate">{destination.bestTime || "Year-Round"}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-yellow-400/10 border border-yellow-400/20 flex items-center justify-center text-yellow-400 flex-shrink-0">
                <Clock size={18} />
              </div>
              <div>
                <p className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold">Duration</p>
                <p className="text-sm font-bold text-white truncate">{destination.recommendedDuration || destination.duration || "7 - 10 Days"}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-yellow-400/10 border border-yellow-400/20 flex items-center justify-center text-yellow-400 flex-shrink-0">
                <Coins size={18} />
              </div>
              <div>
                <p className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold">Currency</p>
                <p className="text-sm font-bold text-white truncate">{destination.currency || "Local Currency"}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-yellow-400/10 border border-yellow-400/20 flex items-center justify-center text-yellow-400 flex-shrink-0">
                <Globe2 size={18} />
              </div>
              <div>
                <p className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold">Language</p>
                <p className="text-sm font-bold text-white truncate">{destination.language || "English"}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-yellow-400/10 border border-yellow-400/20 flex items-center justify-center text-yellow-400 flex-shrink-0">
                <Clock size={18} />
              </div>
              <div>
                <p className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold">Timezone</p>
                <p className="text-sm font-bold text-white truncate">{destination.timeZone || destination.timeDiff || "UTC"}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-yellow-400/10 border border-yellow-400/20 flex items-center justify-center text-yellow-400 flex-shrink-0">
                <Plane size={18} />
              </div>
              <div>
                <p className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold">Flight Time</p>
                <p className="text-sm font-bold text-white truncate">{destination.flightDuration || "Approx 8h"}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Main Content: Overview, Highlights, Attractions, Cities */}
      <section className="py-20 relative">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Left 2 Cols: Story, Highlights & Gallery */}
            <div className="lg:col-span-2 space-y-12">
              {/* About & Description */}
              <div className="glass-card p-8 md:p-10 rounded-3xl border border-white/10">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2.5 rounded-xl bg-yellow-400/10 border border-yellow-400/20 text-yellow-400">
                    <Compass size={22} />
                  </div>
                  <h2 className="text-2xl md:text-3xl font-black text-white">About {destination.name}</h2>
                </div>
                <div className="prose prose-invert max-w-none text-slate-300 leading-relaxed space-y-4 text-base md:text-lg">
                  <p>{destination.description || destination.shortDescription}</p>
                  <p>
                    From scenic vistas and world-class luxury accommodations to private culinary journeys and authentic local encounters, MHM Travels handpicks every element to craft unforgettable memories for you and your family.
                  </p>
                </div>
              </div>

              {/* Travel Highlights */}
              <div className="glass-card p-8 md:p-10 rounded-3xl border border-white/10">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2.5 rounded-xl bg-yellow-400/10 border border-yellow-400/20 text-yellow-400">
                    <Sparkles size={22} />
                  </div>
                  <h2 className="text-2xl md:text-3xl font-black text-white">Curated Highlights</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {highlights.map((hl, idx) => (
                    <div key={idx} className="flex items-start gap-3.5 p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-yellow-400/30 transition-all">
                      <CheckCircle2 size={20} className="text-yellow-400 flex-shrink-0 mt-0.5" />
                      <span className="text-sm md:text-base text-slate-200 font-medium leading-snug">{hl}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Gallery (if available) */}
              {destination.gallery && destination.gallery.length > 0 && (
                <div className="space-y-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-yellow-400/10 border border-yellow-400/20 text-yellow-400">
                      <Camera size={22} />
                    </div>
                    <h2 className="text-2xl md:text-3xl font-black text-white">Photo Gallery</h2>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {destination.gallery.map((imgUrl, i) => (
                      <div key={i} className="relative aspect-[4/3] rounded-2xl overflow-hidden group border border-white/10">
                        <Image
                          src={imgUrl}
                          alt={`${destination.name} photo ${i + 1}`}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors"></div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right Col: Attractions, Cities, Visa Shortcut & Fast Enquiry */}
            <div className="space-y-8">
              {/* Popular Attractions */}
              {attractions.length > 0 && (
                <div className="glass-card p-6 md:p-8 rounded-3xl border border-white/10">
                  <div className="flex items-center gap-2.5 mb-5 text-yellow-400 font-bold text-lg">
                    <MapPin size={20} />
                    <h3>Top Attractions</h3>
                  </div>
                  <div className="flex flex-wrap gap-2.5">
                    {attractions.map((att, i) => (
                      <span
                        key={i}
                        className="px-3.5 py-1.5 rounded-full text-xs md:text-sm font-medium bg-white/5 border border-white/10 text-slate-300 hover:border-yellow-400/40 hover:text-white transition-all"
                      >
                        {att}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Popular Cities / Regions */}
              {cities.length > 0 && (
                <div className="glass-card p-6 md:p-8 rounded-3xl border border-white/10">
                  <div className="flex items-center gap-2.5 mb-5 text-yellow-400 font-bold text-lg">
                    <Building size={20} />
                    <h3>Featured Cities & Hubs</h3>
                  </div>
                  <div className="flex flex-wrap gap-2.5">
                    {cities.map((city, i) => (
                      <span
                        key={i}
                        className="px-3.5 py-1.5 rounded-full text-xs md:text-sm font-medium bg-yellow-400/10 border border-yellow-400/20 text-yellow-300"
                      >
                        {city}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Visa Information Shortcut Card */}
              <div className="glass-card p-6 md:p-8 rounded-3xl border border-yellow-400/20 bg-gradient-to-br from-yellow-500/10 via-white/5 to-transparent relative overflow-hidden">
                <div className="flex items-center gap-2.5 mb-3 text-yellow-400 font-bold text-base uppercase tracking-wider">
                  <ShieldCheck size={20} />
                  <span>Visa Guidance</span>
                </div>
                <h4 className="text-xl font-bold text-white mb-2">{destination.visa || "Visa Assistance Available"}</h4>
                <p className="text-xs md:text-sm text-slate-300 mb-6 leading-relaxed">
                  Get certified document checklists, application turnaround times, and expert filing assistance for your {destination.name} journey.
                </p>
                <Link
                  href={`/visa?dest=${destination.id}`}
                  className="w-full py-3 rounded-xl bg-yellow-400/20 hover:bg-yellow-400 hover:text-slate-950 text-yellow-300 font-bold text-sm border border-yellow-400/40 transition-all flex items-center justify-center gap-2 group"
                >
                  <span>Check Visa Requirements</span>
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>

              {/* Direct Booking & Assistance Card */}
              <div className="glass-card p-6 md:p-8 rounded-3xl border border-white/10 bg-gradient-to-b from-navy-900 to-navy-950 text-center">
                <h3 className="text-xl font-bold text-white mb-2">Need a Bespoke Itinerary?</h3>
                <p className="text-xs md:text-sm text-slate-400 mb-6">
                  Our destination specialists will customize flights, 5-star hotels, private transfers, and luxury tours for {destination.name}.
                </p>
                <button
                  onClick={() => setModalOpen(true)}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-yellow-400 to-yellow-600 text-slate-950 font-black text-sm uppercase tracking-wider hover:shadow-[0_0_20px_rgba(250,204,21,0.4)] transition-all cursor-pointer mb-3"
                >
                  Request Itinerary Quote
                </button>
                <a
                  href={`https://wa.me/919876543210?text=${whatsappMessage}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white font-medium text-xs border border-white/10 flex items-center justify-center gap-2 transition-all"
                >
                  <FaWhatsapp size={14} className="text-emerald-400" />
                  Chat with a Specialist
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Relevant Tour Packages Section */}
      <section className="py-20 bg-navy-900/40 border-t border-white/10 relative">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <span className="text-yellow-400 font-bold uppercase tracking-widest text-xs px-3 py-1 rounded-full bg-white/5 border border-white/10">
                Curated Experiences
              </span>
              <h2 className="text-3xl md:text-4xl font-black text-white mt-4">
                Tour Packages for <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 via-yellow-400 to-yellow-600">{destination.name}</span>
              </h2>
              <p className="text-slate-400 mt-2 text-sm md:text-base">
                Handcrafted itineraries complete with luxury stays, guided sightseeing, and private transfers.
              </p>
            </div>
            <Link
              href="/packages"
              className="text-xs md:text-sm font-bold text-yellow-400 hover:text-yellow-300 flex items-center gap-2 group self-start md:self-auto"
            >
              <span>Explore All Global Packages</span>
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {relatedPackages.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {relatedPackages.map((pkg) => (
                <div
                  key={pkg.id}
                  className="glass-card rounded-3xl overflow-hidden border border-white/10 hover:border-yellow-400/50 transition-all duration-300 flex flex-col group hover:-translate-y-1.5"
                >
                  {/* Package Card Image */}
                  <div className="relative h-60 w-full overflow-hidden">
                    <Image
                      src={pkg.image}
                      alt={pkg.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-transparent to-transparent"></div>
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-black/60 backdrop-blur-md text-yellow-400 border border-yellow-400/30">
                        {pkg.category}
                      </span>
                    </div>
                    <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-xs text-white">
                      <span className="flex items-center gap-1.5 bg-black/50 backdrop-blur-md px-2.5 py-1 rounded-lg">
                        <Clock size={13} className="text-yellow-400" />
                        {pkg.duration}
                      </span>
                      <span className="flex items-center gap-1.5 bg-black/50 backdrop-blur-md px-2.5 py-1 rounded-lg text-yellow-400 font-bold">
                        <Star size={13} className="fill-yellow-400" />
                        {pkg.rating}
                      </span>
                    </div>
                  </div>

                  {/* Package Card Content */}
                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="text-xl font-bold text-white group-hover:text-yellow-400 transition-colors line-clamp-2 mb-2">
                        {pkg.title}
                      </h3>
                      <p className="text-xs text-slate-400 line-clamp-2 mb-4">
                        {pkg.overview || pkg.destinations}
                      </p>
                      
                      {/* Features */}
                      {pkg.features && pkg.features.length > 0 && (
                        <div className="space-y-1.5 mb-6">
                          {pkg.features.slice(0, 3).map((feat, idx) => (
                            <div key={idx} className="flex items-center gap-2 text-xs text-slate-300">
                              <CheckCircle2 size={13} className="text-yellow-400 flex-shrink-0" />
                              <span className="truncate">{feat}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] uppercase text-slate-400 font-bold block">Starting From</span>
                        <span className="text-xl font-black text-white">{pkg.price}</span>
                      </div>
                      <Link
                        href={`/package?id=${pkg.id}`}
                        className="px-4 py-2.5 rounded-xl bg-yellow-400/10 hover:bg-yellow-400 text-yellow-300 hover:text-slate-950 font-bold text-xs border border-yellow-400/30 transition-all flex items-center gap-1.5"
                      >
                        <span>View Itinerary</span>
                        <ArrowRight size={14} />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="glass-card rounded-3xl p-12 text-center max-w-xl mx-auto border border-white/10">
              <Compass size={48} className="text-yellow-400 mx-auto mb-4 opacity-70" />
              <h3 className="text-xl font-bold text-white mb-2">Custom Itineraries Available</h3>
              <p className="text-sm text-slate-400 mb-6">
                We design bespoke private travel programs for {destination.name}. Tell us your travel dates and group preferences, and our specialists will assemble a customized itinerary.
              </p>
              <button
                onClick={() => setModalOpen(true)}
                className="px-8 py-3.5 rounded-full bg-gradient-to-r from-yellow-400 to-yellow-600 text-slate-950 font-bold text-sm uppercase tracking-wider hover:shadow-[0_0_20px_rgba(250,204,21,0.4)] transition-all cursor-pointer"
              >
                Inquire For Custom Package
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Enquiry Modal */}
      <EnquiryModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        defaultDestination={destination.name}
      />
    </div>
  );
}
