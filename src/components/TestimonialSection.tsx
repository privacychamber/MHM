"use client";

import { motion } from "framer-motion";
import { Star, Quote, Heart } from "lucide-react";

interface Testimonial {
  name: string;
  location: string;
  avatarGradient: string;
  rating: number;
  text: string;
  trip: string;
  relatabilityBadge: string;
}

const testimonials: Testimonial[] = [
  {
    name: "Aarav Mehta",
    location: "Mumbai",
    avatarGradient: "from-yellow-400 to-amber-500",
    rating: 5,
    text: "I had 23 tabs open trying to coordinate our multi-city trip. MHM literally closed all my tabs, saved my sanity, and booked the entire dream itinerary in 48 hours. The boutique stays were 10/10!",
    trip: "Grand World Tour",
    relatabilityBadge: "Saved my sanity"
  },
  {
    name: "Sarah D'Souza",
    location: "Goa",
    avatarGradient: "from-blue-400 to-indigo-500",
    rating: 5,
    text: "Honestly, I thought all-inclusive pricing this good was a myth. But the flights, the gorgeous 4-star hotels, and the local food guides were absolutely flawless. I'm already booking Bali next month!",
    trip: "Switzerland & Italy",
    relatabilityBadge: "Worth every rupee"
  },
  {
    name: "Dr. Vikram Sen",
    location: "New Delhi",
    avatarGradient: "from-emerald-400 to-teal-500",
    rating: 5,
    text: "Planning a trip with senior parents and active kids is usually a logistical nightmare. MHM customized the pace of the itinerary so the elders could relax while the kids had a blast. Incredible support!",
    trip: "Dubai & Egypt",
    relatabilityBadge: "Family approved"
  }
];

export default function TestimonialSection() {
  return (
    <section className="py-20 relative overflow-hidden z-10">
      {/* Background glow blobs */}
      <div className="absolute top-1/3 left-[-10%] w-[40%] h-[40%] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-10 right-[-10%] w-[35%] h-[35%] bg-yellow-500/8 rounded-full blur-[110px] pointer-events-none" />

      <div className="container mx-auto px-4 md:px-6 relative">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 mb-3 px-3.5 py-1.5 rounded-full bg-yellow-400/10 border border-yellow-400/25">
            <Heart size={12} className="text-yellow-400 fill-yellow-400/20" />
            <span className="text-yellow-400 text-[10px] font-bold uppercase tracking-[0.14em]">Real Stories</span>
          </div>
          
          <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight mb-4 dark:drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)]">
            Approved by Over <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-amber-500">12,500+ Happy Travelers</span>
          </h2>
          <p className="text-slate-400 text-sm md:text-base">
            No corporate jargon, just genuine reviews from people who closed their browser tabs and actually packed their bags.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {testimonials.map((t, idx) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.15, duration: 0.6 }}
              whileHover={{ y: -8 }}
              className="bg-white/5 dark:bg-black/25 backdrop-blur-xl border border-white/10 rounded-2xl p-6 flex flex-col justify-between shadow-[0_10px_30px_rgba(0,0,0,0.3)] hover:shadow-[0_15px_40px_rgba(0,0,0,0.5)] hover:border-yellow-400/30 transition-all duration-300 relative group"
            >
              {/* Quote Mark Icon */}
              <div className="absolute top-5 right-6 text-yellow-400/10 group-hover:text-yellow-400/20 transition-colors">
                <Quote size={40} className="transform rotate-180" />
              </div>

              <div>
                {/* Rating stars */}
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} size={14} className="text-yellow-400 fill-yellow-400" />
                  ))}
                </div>

                {/* Review Text */}
                <p className="text-slate-300 text-sm leading-relaxed mb-6 font-medium italic">
                  &ldquo;{t.text}&rdquo;
                </p>
              </div>

              {/* User Bio */}
              <div className="flex items-center gap-3.5 pt-4 border-t border-white/5 mt-auto">
                <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${t.avatarGradient} flex items-center justify-center text-black font-extrabold text-sm shadow-[0_2px_10px_rgba(255,255,255,0.1)]`}>
                  {t.name.split(" ").map(n => n[0]).join("")}
                </div>
                <div>
                  <h4 className="text-white text-sm font-bold">{t.name}</h4>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="text-slate-400 text-xs">{t.location}</span>
                    <span className="w-1 h-1 rounded-full bg-white/20" />
                    <span className="text-yellow-400 text-[10px] font-semibold bg-yellow-400/10 px-1.5 py-0.5 rounded">
                      {t.trip}
                    </span>
                  </div>
                </div>
              </div>

              {/* Relatability Badge */}
              <div className="absolute -top-3 left-6 bg-gradient-to-r from-yellow-400 to-amber-500 text-black text-[9px] font-black uppercase tracking-wider px-2.5 py-1 rounded-md shadow-lg">
                {t.relatabilityBadge}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
