"use client";

import Link from "next/link";
import { PlaneTakeoff, MapPin, Phone, Mail, ArrowRight } from "lucide-react";

export default function Footer() {
  return (
    <footer className="relative bg-navy-900 border-t border-white/10 pt-20 pb-10 overflow-hidden">
      {/* Background elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-yellow-500/5 rounded-full blur-[100px] pointer-events-none"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand */}
          <div className="space-y-6">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-yellow-400 to-yellow-600 flex items-center justify-center text-navy-900">
                <PlaneTakeoff size={20} />
              </div>
              <div>
                <h2 className="text-xl font-bold tracking-tight text-white m-0 leading-tight">MHM Travels</h2>
                <p className="text-[10px] text-yellow-400 uppercase tracking-widest font-semibold m-0">Make Holidays Memorable</p>
              </div>
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed">
              Experience the world with unparalleled luxury and comfort. Your premium travel partner for creating unforgettable memories across the globe.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-yellow-400 hover:text-navy-900 hover:border-yellow-400 transition-all">
                <span className="font-bold text-sm">IG</span>
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-yellow-400 hover:text-navy-900 hover:border-yellow-400 transition-all">
                <span className="font-bold text-sm">FB</span>
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-yellow-400 hover:text-navy-900 hover:border-yellow-400 transition-all">
                <span className="font-bold text-sm">X</span>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-bold text-lg mb-6">Quick Links</h3>
            <ul className="space-y-3">
              {[
                { name: 'About Us', href: '/about' },
                { name: 'Our Packages', href: '/packages' },
                { name: 'Visa Services', href: '/visa' },
                { name: 'Contact Us', href: '/contact' }
              ].map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-slate-400 hover:text-yellow-400 text-sm flex items-center gap-2 transition-colors">
                    <ArrowRight size={14} className="text-yellow-400/50" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Popular Destinations */}
          <div>
            <h3 className="text-white font-bold text-lg mb-6">Popular Destinations</h3>
            <ul className="space-y-3">
              {[
                { name: 'Japan', href: '/destinations' },
                { name: 'Switzerland', href: '/destinations' },
                { name: 'Dubai', href: '/destinations' },
                { name: 'Maldives', href: '/destinations' },
                { name: 'Thailand', href: '/destinations' },
                { name: 'Singapore', href: '/destinations' }
              ].map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-slate-400 hover:text-yellow-400 text-sm flex items-center gap-2 transition-colors">
                    <MapPin size={14} className="text-yellow-400/50" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-bold text-lg mb-6">Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <Phone size={18} className="text-yellow-400 mt-1 shrink-0" />
                <div>
                  <p className="text-sm text-slate-400">Phone & WhatsApp</p>
                  <a href="tel:+918437770006" className="text-white font-medium hover:text-yellow-400 transition-colors">+91 84377 70006</a>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Mail size={18} className="text-yellow-400 mt-1 shrink-0" />
                <div>
                  <p className="text-sm text-slate-400">Email Address</p>
                  <a href="mailto:info.mhmtravels@gmail.com" className="text-white font-medium hover:text-yellow-400 transition-colors break-all">info.mhmtravels@gmail.com</a>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <MapPin size={18} className="text-yellow-400 mt-1 shrink-0" />
                <div>
                  <p className="text-sm text-slate-400">Office</p>
                  <p className="text-white text-sm">New Delhi, India</p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-slate-500 text-sm text-center md:text-left">
            &copy; {new Date().getFullYear()} MHM Travels. All rights reserved.
          </p>
          <div className="flex gap-4 text-sm text-slate-500">
            <Link href="#" className="hover:text-white transition-colors">Designed for Luxury Travel</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
