"use client";

import { useState } from "react";
import { ArrowRight, Plane, Hotel, Check, Compass, Star, Map, Clock } from "lucide-react";
import { motion } from "framer-motion";
import EnquiryModal from "@/components/EnquiryModal";

const packages = [
  {
    id: "luxury-japan",
    title: "Signature Japan Chronicles",
    category: "Luxury",
    rating: 4.9,
    duration: "9 Days / 8 Nights",
    destinations: "Tokyo • Kyoto • Hakone • Osaka",
    price: "₹1,49,999",
    image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=1000&auto=format&fit=crop",
    features: ["5-Star Ryokan stays", "Private Bullet Train tickets", "Guided tea ceremony", "All entry vouchers"]
  },
  {
    id: "honeymoon-swiss",
    title: "Romantic Switzerland Hideaway",
    category: "Honeymoon",
    rating: 5.0,
    duration: "8 Days / 7 Nights",
    destinations: "Zurich • Interlaken • Lucerne • Zermatt",
    price: "₹1,99,999",
    image: "https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?q=80&w=1000&auto=format&fit=crop",
    features: ["Scenic rail passes", "Private mountain picnic", "Spa resort accommodations", "Lake cruise with dinner"]
  },
  {
    id: "family-dubai",
    title: "Dubai & Abu Dhabi Discovery",
    category: "Family",
    rating: 4.7,
    duration: "6 Days / 5 Nights",
    destinations: "Dubai Downtown • Palm Jumeirah • Yas Island",
    price: "₹74,999",
    image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?q=80&w=1000&auto=format&fit=crop",
    features: ["Burj Khalifa VIP access", "Desert safari with BBQ", "Theme Park passes", "Airport transfers"]
  },
  {
    id: "luxury-maldives",
    title: "Overwater Villa Retreat",
    category: "Luxury",
    rating: 4.9,
    duration: "5 Days / 4 Nights",
    destinations: "Private Water Villa Resort",
    price: "₹99,999",
    image: "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?q=80&w=1000&auto=format&fit=crop",
    features: ["Premium All-Inclusive dining", "Speedboat transfers", "Sunset dolphin cruise", "Snorkeling gear"]
  },
  {
    id: "group-thailand",
    title: "Golden Temple & Island Escape",
    category: "Group Tour",
    rating: 4.6,
    duration: "7 Days / 6 Nights",
    destinations: "Bangkok • Phuket • Phi Phi Islands",
    price: "₹54,999",
    image: "https://images.unsplash.com/photo-1508009603885-50cf7c579365?q=80&w=1000&auto=format&fit=crop",
    features: ["4-Star beach resort stays", "Island hopping excursion", "Dedicated tour manager", "Traditional buffet"]
  },
  {
    id: "family-singapore",
    title: "Singapore Wonders & Sentosa",
    category: "Family",
    rating: 4.8,
    duration: "6 Days / 5 Nights",
    destinations: "Marina Bay • Sentosa Island • Night Safari",
    price: "₹79,999",
    image: "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?q=80&w=1000&auto=format&fit=crop",
    features: ["Universal Studios VIP", "Gardens by the Bay entry", "Daily breakfast buffet", "Flight ticket inclusions"]
  }
];

export default function PackagesPage() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [modalOpen, setModalOpen] = useState(false);
  const [activePackage, setActivePackage] = useState("");

  const filtered = selectedCategory === "All" 
    ? packages 
    : packages.filter(p => p.category === selectedCategory);

  const triggerEnquiry = (title: string) => {
    setActivePackage(title);
    setModalOpen(true);
  };

  return (
    <div className="min-h-screen pt-28 pb-20 relative bg-navy-950">
      {/* Background Glows */}
      <div className="absolute top-0 left-0 w-full h-[600px] overflow-hidden pointer-events-none z-0">
        <div className="absolute bottom-0 right-[-10%] w-[50%] h-[50%] bg-blue-500/10 rounded-full blur-[120px]"></div>
        <div className="absolute top-[-10%] left-[-10%] w-[45%] h-[55%] bg-yellow-500/5 rounded-full blur-[100px]"></div>
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
              All-Inclusive Deals
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mt-6 leading-tight">
              Premium <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 via-yellow-400 to-yellow-600 glow-text">Tour Packages</span>
            </h1>
            <p className="text-slate-400 mt-4 text-base md:text-lg">
              Explore meticulously designed travel itineraries featuring boutique luxury stays, private excursions, and airfare.
            </p>
          </motion.div>
        </div>

        {/* Category Tabs */}
        <div className="flex justify-center mb-12">
          <div className="flex gap-2 p-1 bg-white/5 rounded-xl border border-white/5 overflow-x-auto">
            {["All", "Luxury", "Honeymoon", "Family", "Group Tour"].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-5 py-2.5 rounded-lg text-sm font-semibold transition-all whitespace-nowrap ${
                  selectedCategory === cat 
                    ? "bg-gradient-to-r from-yellow-400 to-yellow-600 text-slate-900 shadow-md" 
                    : "text-slate-400 hover:text-white hover:bg-white/5"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Package Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {filtered.map((pkg, index) => (
            <motion.div
              key={pkg.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05, duration: 0.5 }}
              className="glass-card overflow-hidden flex flex-col md:flex-row border border-white/10 hover:border-yellow-400/20 hover:shadow-[0_0_30px_rgba(0,0,0,0.4)] transition-all group"
            >
              {/* Image Column */}
              <div className="w-full md:w-2/5 h-64 md:h-auto relative min-h-[250px]">
                <div className="absolute inset-0 bg-gradient-to-r from-slate-950/20 to-slate-950 md:from-transparent md:to-slate-950 z-10"></div>
                <img 
                  src={pkg.image} 
                  alt={pkg.title}
                  className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-4 left-4 z-20 bg-yellow-500 text-slate-950 text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-md shadow-md">
                  {pkg.category}
                </span>
              </div>

              {/* Content Column */}
              <div className="w-full md:w-3/5 p-6 md:p-8 flex flex-col justify-between relative z-10 bg-navy-900/50">
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-xs text-yellow-400 font-bold uppercase tracking-wider flex items-center gap-1">
                      <Clock size={12} /> {pkg.duration}
                    </span>
                    <span className="text-xs font-semibold text-yellow-400 flex items-center gap-1">
                      <Star size={12} fill="currentColor" /> {pkg.rating}
                    </span>
                  </div>

                  <h3 className="text-2xl font-bold text-white mb-2 leading-tight group-hover:text-yellow-400 transition-colors">
                    {pkg.title}
                  </h3>
                  
                  <p className="text-xs text-slate-400 font-medium mb-4 flex items-center gap-1">
                    <Map size={12} className="text-slate-500" /> {pkg.destinations}
                  </p>

                  <ul className="space-y-2 mb-6">
                    {pkg.features.map((feat, idx) => (
                      <li key={idx} className="text-xs text-slate-300 flex items-center gap-2">
                        <Check size={14} className="text-green-500 shrink-0" /> {feat}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex items-center justify-between border-t border-white/5 pt-4 mt-auto">
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase font-bold block">Starting At</span>
                    <span className="text-2xl font-black text-white">{pkg.price}</span>
                  </div>

                  <button 
                    onClick={() => triggerEnquiry(pkg.title)}
                    className="bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-300 hover:to-yellow-500 text-slate-900 font-bold px-5 py-2.5 rounded-xl text-xs transition-all shadow-md active:scale-95 flex items-center gap-1.5"
                  >
                    Enquire Now <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <EnquiryModal 
        isOpen={modalOpen} 
        onClose={() => setModalOpen(false)} 
        defaultDestination={activePackage}
      />
    </div>
  );
}
