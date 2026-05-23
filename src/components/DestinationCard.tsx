"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  Star, Clock, CheckCircle, Banknote, Plane, Languages, Sparkles, X
} from "lucide-react";
import { Destination } from "@/data/destinations";

interface Props {
  destination: Destination | null;
  onEnquire?: (destinationName: string) => void;
  onClose?: () => void;
}

export default function DestinationCard({ destination, onEnquire, onClose }: Props) {
  if (!destination) return null;

  const cities = destination.topCities.split(",").map((c) => c.trim());

  const stats = [
    { icon: Clock,      label: "Best Time",       value: destination.bestTime },
    { icon: Sparkles,   label: "Top Attractions",  value: destination.topAttractions },
    { icon: CheckCircle,label: "Visa",             value: destination.visa },
    { icon: Languages,  label: "Language",         value: destination.language },
    { icon: Banknote,   label: "Currency",         value: destination.currency },
    { icon: Plane,      label: "Time Diff",        value: destination.timeDiff },
  ];

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={destination.id}
        initial={{ opacity: 0, x: 60, scale: 0.96 }}
        animate={{ opacity: 1, x: 0, scale: 1 }}
        exit={{ opacity: 0, x: 60, scale: 0.96 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="w-full bg-[#ffffff]/95 dark:bg-[#060d20]/95 backdrop-blur-2xl border border-white/18 rounded-3xl overflow-hidden shadow-[0_8px_60px_rgba(0,0,0,0.9)] flex flex-col max-h-[85vh] overflow-y-auto pointer-events-auto"
        style={{ scrollbarWidth: "none" }}
      >
        {/* ── Header ─────────────────────────────── */}
        <div className="px-5 pt-5 pb-3 flex items-start justify-between shrink-0">
          <div className="flex items-center gap-3">
            <span className="text-[2rem] leading-none drop-shadow-lg">{destination.flag}</span>
            <div>
              <h2 className="text-xl font-black text-white tracking-tight leading-tight">
                {destination.name}
              </h2>
              <div className="flex items-center gap-1.5 mt-0.5">
                <Star size={12} className="text-yellow-600 dark:text-yellow-400" fill="currentColor" />
                <span className="text-yellow-600 dark:text-yellow-400 text-sm font-bold">{destination.rating}</span>
                <span className="text-white/40 text-xs">({destination.reviews}+ reviews)</span>
              </div>
            </div>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="w-7 h-7 rounded-full bg-white/8 border border-white/10 flex items-center justify-center text-white/40 hover:text-white hover:bg-white/15 transition-all shrink-0"
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* ── Hero image ─────────────────────────── */}
        <div className="mx-4 rounded-2xl overflow-hidden h-[118px] relative shrink-0">
          <img
            src={destination.image}
            alt={destination.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#ffffff]/70 dark:from-[#060d20]/70 via-transparent to-transparent" />
        </div>

        {/* ── Popular cities ─────────────────────── */}
        <div className="px-4 pt-3 pb-1 shrink-0">
          <p className="text-white/55 text-[10px] font-bold uppercase tracking-[0.12em] mb-2">
            Top Cities
          </p>
          <div className="flex flex-wrap gap-1.5">
            {cities.map((city) => (
              <span
                key={city}
                className="px-2.5 py-1 bg-white/10 border border-white/15 rounded-lg text-white text-xs font-semibold hover:bg-white/18 hover:border-yellow-400/40 hover:text-white transition-all cursor-default"
              >
                {city}
              </span>
            ))}
          </div>
        </div>

        {/* ── Info grid ──────────────────────────── */}
        <div className="px-4 py-2 grid grid-cols-2 gap-1.5 shrink-0">
          {stats.map(({ icon: Icon, label, value }) => (
            <div
              key={label}
              className="bg-white/6 border border-white/12 rounded-xl p-2.5 hover:border-yellow-400/30 transition-colors group"
            >
              <div className="flex items-center gap-1.5 mb-1">
                <Icon size={11} className="text-yellow-400 shrink-0" />
                <span className="text-white/60 text-[10px] font-bold uppercase tracking-wider">
                  {label}
                </span>
              </div>
              <p className="text-white text-xs font-semibold leading-snug line-clamp-2">{value}</p>
            </div>
          ))}
        </div>

        {/* ── Price section ──────────────────────── */}
        {(() => {
          const inrNum = parseInt(destination.price.replace(/[^\d]/g, ""), 10);
          const usdNum = inrNum ? Math.round(inrNum / 84) : null;
          const usdStr = usdNum ? `$${usdNum.toLocaleString("en-US")}` : null;
          return (
            <div className="mx-4 my-2 p-3 bg-gradient-to-br from-yellow-400/12 to-amber-500/6 border border-yellow-400/20 rounded-2xl flex items-center justify-between gap-3 shrink-0">
              <div>
                <p className="text-white/40 text-[10px] font-medium">Explore Packages Starting From</p>
                <p className="text-[1.6rem] font-black text-yellow-600 dark:text-yellow-400 leading-tight tracking-tight">
                  {destination.price}
                </p>
                {usdStr && (
                  <p className="text-white/50 text-xs font-semibold mt-0.5">
                    ≈ {usdStr} <span className="text-white/30 font-normal">per person</span>
                  </p>
                )}
              </div>
              <div className="w-[60px] h-[52px] rounded-xl overflow-hidden shrink-0 border border-white/10">
                <img
                  src={destination.image}
                  alt=""
                  className="w-full h-full object-cover opacity-80"
                />
              </div>
            </div>
          );
        })()}

        {/* ── CTA Buttons ────────────────────────── */}
        <div className="px-4 pb-5 grid grid-cols-2 gap-2 shrink-0">
          <button
            onClick={() => onEnquire && onEnquire(destination.name)}
            className="bg-white/8 hover:bg-white/15 border border-white/15 hover:border-white/30 text-white py-2.5 rounded-xl text-xs font-bold transition-all"
          >
            View Packages
          </button>
          <a
            href={`https://wa.me/918437770006?text=Hi%20MHM%20Travels!%20I%20am%20interested%20in%20a%20travel%20package%20to%20${encodeURIComponent(destination.name)}.`}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-400 hover:to-emerald-400 text-[#ffffff] py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-[0_0_15px_rgba(16,185,129,0.25)]"
          >
            <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
            </svg>
            WhatsApp
          </a>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
