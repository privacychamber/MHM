"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Star, Clock, Map, Plane, Landmark, CheckCircle, Languages, Banknote, DollarSign } from "lucide-react";
import Image from "next/image";

import { Destination } from "@/data/destinations";

interface Props {
  destination: Destination | null;
  onEnquire?: (destinationName: string) => void;
}

export default function DestinationCard({ destination, onEnquire }: Props) {
  if (!destination) return null;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={destination.id}
        initial={{ opacity: 0, x: 50, scale: 0.95 }}
        animate={{ opacity: 1, x: 0, scale: 1 }}
        exit={{ opacity: 0, x: -50, scale: 0.95 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-md glass-card overflow-hidden"
      >
        {/* Header Image */}
        <div className="relative h-48 w-full overflow-hidden rounded-t-2xl">
          {/* Using a solid gradient fallback for the image to prevent missing asset errors */}
          <div className="absolute inset-0 bg-gradient-to-br from-navy-800 to-navy-900 z-0"></div>
          {destination.image && (
            <img 
              src={destination.image} 
              alt={destination.name}
              className="object-cover w-full h-full opacity-60 mix-blend-overlay z-10 relative"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-navy-900 to-transparent z-20"></div>
          
          <div className="absolute bottom-4 left-6 z-30 flex flex-col">
            <div className="flex items-center gap-3 mb-1">
              <span className="text-2xl drop-shadow-lg">{destination.flag}</span>
              <h2 className="text-3xl font-bold text-white tracking-tight glow-text">{destination.name}</h2>
            </div>
            <div className="flex items-center gap-2 text-yellow-400 text-sm font-medium">
              <Star size={16} fill="currentColor" />
              <span>{destination.rating} <span className="text-slate-300">({destination.reviews}+ reviews)</span></span>
            </div>
          </div>
        </div>

        {/* Facts Grid */}
        <div className="p-6">
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-white/5 rounded-xl p-3 border border-white/10 hover:border-yellow-400/30 transition-colors group">
              <div className="flex items-center gap-2 mb-1">
                <Landmark size={14} className="text-yellow-400" />
                <span className="text-xs text-slate-400 font-medium">Top Cities</span>
              </div>
              <p className="text-sm text-white font-medium truncate group-hover:text-yellow-100 transition-colors">{destination.topCities}</p>
            </div>
            
            <div className="bg-white/5 rounded-xl p-3 border border-white/10 hover:border-yellow-400/30 transition-colors group">
              <div className="flex items-center gap-2 mb-1">
                <Clock size={14} className="text-yellow-400" />
                <span className="text-xs text-slate-400 font-medium">Best Time</span>
              </div>
              <p className="text-sm text-white font-medium group-hover:text-yellow-100 transition-colors">{destination.bestTime}</p>
            </div>
            
            <div className="bg-white/5 rounded-xl p-3 border border-white/10 hover:border-yellow-400/30 transition-colors group">
              <div className="flex items-center gap-2 mb-1">
                <CheckCircle size={14} className="text-yellow-400" />
                <span className="text-xs text-slate-400 font-medium">Visa</span>
              </div>
              <p className="text-sm text-white font-medium group-hover:text-yellow-100 transition-colors">{destination.visa}</p>
            </div>
            
            <div className="bg-white/5 rounded-xl p-3 border border-white/10 hover:border-yellow-400/30 transition-colors group">
              <div className="flex items-center gap-2 mb-1">
                <Banknote size={14} className="text-yellow-400" />
                <span className="text-xs text-slate-400 font-medium">Currency</span>
              </div>
              <p className="text-sm text-white font-medium group-hover:text-yellow-100 transition-colors">{destination.currency}</p>
            </div>
            
            <div className="bg-white/5 rounded-xl p-3 border border-white/10 hover:border-yellow-400/30 transition-colors group">
              <div className="flex items-center gap-2 mb-1">
                <Map size={14} className="text-yellow-400" />
                <span className="text-xs text-slate-400 font-medium">Time Diff</span>
              </div>
              <p className="text-sm text-white font-medium group-hover:text-yellow-100 transition-colors">{destination.timeDiff}</p>
            </div>
            
            <div className="bg-white/5 rounded-xl p-3 border border-white/10 hover:border-yellow-400/30 transition-colors group">
              <div className="flex items-center gap-2 mb-1">
                <Plane size={14} className="text-yellow-400" />
                <span className="text-xs text-slate-400 font-medium">Flight</span>
              </div>
              <p className="text-sm text-white font-medium group-hover:text-yellow-100 transition-colors">{destination.flightDuration}</p>
            </div>
          </div>

          <button 
            onClick={() => onEnquire && onEnquire(destination.name)}
            className="w-full relative group overflow-hidden rounded-xl bg-transparent border border-yellow-400 text-yellow-400 font-bold py-3 transition-all hover:shadow-[0_0_20px_rgba(250,204,21,0.3)]"
          >
            <span className="relative z-10 flex items-center justify-center gap-2">
              Explore Packages
            </span>
            <div className="absolute inset-0 bg-yellow-400 translate-y-[100%] group-hover:translate-y-0 transition-transform duration-300 ease-out z-0"></div>
            <div className="absolute inset-0 flex items-center justify-center translate-y-[100%] group-hover:translate-y-0 transition-transform duration-300 ease-out z-10 text-navy-900 font-bold">
              Explore Packages
            </div>
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
