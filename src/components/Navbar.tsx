"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Phone, Menu, X, PlaneTakeoff } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import EnquiryModal from "@/components/EnquiryModal";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Destinations", href: "/destinations" },
    { name: "Packages", href: "/packages" },
    { name: "Visa Guide", href: "/visa" },
    { name: "About Us", href: "/about" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <header
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled ? "bg-navy-900/80 backdrop-blur-xl border-b border-white/10 py-3" : "bg-transparent py-5"
      }`}
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-yellow-400 to-yellow-600 flex items-center justify-center text-navy-900 group-hover:shadow-[0_0_15px_rgba(250,204,21,0.5)] transition-all">
              <PlaneTakeoff size={20} className="transform group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-white m-0 leading-tight">MHM Travels</h1>
              <p className="text-[10px] text-yellow-400 uppercase tracking-widest font-semibold m-0">Make Holidays Memorable</p>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-sm font-medium text-slate-300 hover:text-yellow-400 transition-colors relative group"
              >
                {link.name}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-yellow-400 transition-all group-hover:w-full"></span>
              </Link>
            ))}
          </nav>

          <div className="hidden lg:flex items-center gap-6">
            <div className="flex items-center gap-2 text-sm text-white">
              <Phone size={16} className="text-yellow-400" />
              <span className="font-semibold">+91 84377 70006</span>
            </div>
            <button 
              onClick={() => setModalOpen(true)}
              className="bg-white/10 hover:bg-yellow-400 hover:text-navy-900 text-white border border-white/20 hover:border-yellow-400 transition-all px-6 py-2.5 rounded-full text-sm font-bold shadow-lg hover:shadow-[0_0_20px_rgba(250,204,21,0.4)] backdrop-blur-md"
            >
              Enquire Now
            </button>
          </div>

          {/* Mobile Menu Toggle */}
          <button 
            className="lg:hidden text-white p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-0 w-full glass border-t border-white/10 p-4 lg:hidden flex flex-col gap-4 shadow-2xl"
          >
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="text-lg font-medium text-white hover:text-yellow-400 px-4 py-2 border-b border-white/5"
              >
                {link.name}
              </Link>
            ))}
            <div className="flex flex-col gap-4 p-4 mt-2 bg-white/5 rounded-xl border border-white/10">
              <div className="flex items-center gap-3 text-white">
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                  <Phone size={18} className="text-yellow-400" />
                </div>
                <div>
                  <p className="text-xs text-slate-400">Call us 24/7</p>
                  <p className="font-bold">+91 84377 70006</p>
                </div>
              </div>
              <button 
                onClick={() => {
                  setMobileMenuOpen(false);
                  setModalOpen(true);
                }}
                className="w-full bg-gradient-to-r from-yellow-400 to-yellow-600 text-navy-900 py-3 rounded-xl font-bold shadow-[0_0_15px_rgba(250,204,21,0.3)]"
              >
                Enquire Now
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <EnquiryModal isOpen={modalOpen} onClose={() => setModalOpen(false)} defaultDestination="General Consultation" />
    </header>
  );
}
