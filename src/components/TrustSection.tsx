"use client";

import { motion } from "framer-motion";
import { ShieldCheck, Clock, Tag, Map, Users } from "lucide-react";

const trustItems = [
  { icon: ShieldCheck, title: "12+ Years of Experience" },
  { icon: Clock, title: "24/7 Customer Support" },
  { icon: Tag, title: "Best Price Guarantee" },
  { icon: Map, title: "Customizable Tour Packages" },
  { icon: Users, title: "Trusted by 10K+ Travelers" },
];

export default function TrustSection() {
  return (
    <section className="py-20 relative z-10 bg-navy-900 border-t border-b border-white/5">
      <div className="container mx-auto px-4 md:px-6 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-12">Why Travel with <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-600">MHM Travels?</span></h2>
        
        <div className="flex flex-wrap justify-center gap-6">
          {trustItems.map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1, duration: 0.5 }}
              whileHover={{ y: -5, scale: 1.05 }}
              className="glass p-6 rounded-2xl flex flex-col items-center gap-4 w-40 md:w-48 group hover:border-yellow-400/50 transition-all hover:shadow-[0_0_20px_rgba(250,204,21,0.15)]"
            >
              <div className="w-14 h-14 rounded-full bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-yellow-400/20 transition-colors">
                <item.icon className="w-7 h-7 text-yellow-400" />
              </div>
              <p className="text-sm font-medium text-slate-300 group-hover:text-white transition-colors">{item.title}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
