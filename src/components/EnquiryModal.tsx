"use client";

import { useState, useEffect } from "react";
import { X, Calendar, Users, Send, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface EnquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultDestination?: string;
}

export default function EnquiryModal({ isOpen, onClose, defaultDestination = "" }: EnquiryModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    destination: defaultDestination,
    travelDate: "",
    travelers: "2",
    message: ""
  });
  
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setFormData(prev => ({
        ...prev,
        destination: defaultDestination
      }));
      setIsSubmitted(false);
    }
  }, [isOpen, defaultDestination]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate submission
    setIsSubmitted(true);
  };

  const handleWhatsAppRedirect = () => {
    const text = `Hi MHM Travels! I want to enquire about a holiday package.
*Name:* ${formData.name}
*Destination:* ${formData.destination}
*Travel Date:* ${formData.travelDate}
*Travelers:* ${formData.travelers}
*Phone:* ${formData.phone}
*Email:* ${formData.email}
${formData.message ? `*Message:* ${formData.message}` : ""}`;
    
    const encodedText = encodeURIComponent(text);
    window.open(`https://wa.me/918437770006?text=${encodedText}`, "_blank");
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-navy-950/80 backdrop-blur-md"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-lg bg-navy-950/95 backdrop-blur-2xl overflow-hidden border border-white/10 shadow-2xl p-8 z-10"
          >
            {/* Close Button */}
            <button 
              onClick={onClose}
              className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"
            >
              <X size={20} />
            </button>

            {!isSubmitted ? (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <h3 className="text-2xl font-bold text-white glow-text">Request a Consultation</h3>
                  <p className="text-sm text-slate-400 mt-1">Let us craft your personalized luxury itinerary.</p>
                </div>

                <div className="space-y-4">
                  {/* Name */}
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Full Name</label>
                    <input 
                      type="text" 
                      name="name"
                      required
                      placeholder="John Doe"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-yellow-400/50 transition-colors placeholder:text-slate-600"
                    />
                  </div>

                  {/* Contact Info (Row) */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Phone Number</label>
                      <input 
                        type="tel" 
                        name="phone"
                        required
                        placeholder="+91 99999 99999"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-yellow-400/50 transition-colors placeholder:text-slate-600"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Email Address</label>
                      <input 
                        type="email" 
                        name="email"
                        required
                        placeholder="john@example.com"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-yellow-400/50 transition-colors placeholder:text-slate-600"
                      />
                    </div>
                  </div>

                  {/* Destination */}
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Where do you want to go?</label>
                    <input 
                      type="text" 
                      name="destination"
                      required
                      placeholder="e.g. Japan, Switzerland, Maldives..."
                      value={formData.destination}
                      onChange={handleChange}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-yellow-400/50 transition-colors placeholder:text-slate-600"
                    />
                  </div>

                  {/* Date & Travelers */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                        <Calendar size={13} className="text-yellow-400" /> Departure Date
                      </label>
                      <input 
                        type="date" 
                        name="travelDate"
                        required
                        value={formData.travelDate}
                        onChange={handleChange}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-yellow-400/50 transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                        <Users size={13} className="text-yellow-400" /> Travelers
                      </label>
                      <select 
                        name="travelers"
                        value={formData.travelers}
                        onChange={handleChange}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-yellow-400/50 transition-colors [&>option]:bg-navy-900"
                      >
                        <option value="1">1 Traveler</option>
                        <option value="2">2 Travelers (Couple)</option>
                        <option value="3-5">3 - 5 Travelers (Family)</option>
                        <option value="6-9">6 - 9 Travelers (Small Group)</option>
                        <option value="10+">10+ Travelers (Large Group)</option>
                      </select>
                    </div>
                  </div>

                  {/* Notes */}
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Special Requests or Preferences</label>
                    <textarea 
                      name="message"
                      rows={3}
                      placeholder="e.g. Honeymoon trip, 5-star hotels only, interest in adventure sports..."
                      value={formData.message}
                      onChange={handleChange}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-yellow-400/50 transition-colors placeholder:text-slate-600 resize-none"
                    />
                  </div>
                </div>

                <div className="flex gap-4">
                  <button 
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-300 hover:to-yellow-500 text-slate-900 py-3.5 rounded-xl font-bold transition-all shadow-lg transform active:scale-95 flex items-center justify-center gap-2"
                  >
                    Submit Request <Send size={16} />
                  </button>
                </div>
              </form>
            ) : (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-8 space-y-6"
              >
                <div className="w-20 h-20 bg-green-500/10 border border-green-500/30 rounded-full flex items-center justify-center mx-auto text-green-400">
                  <CheckCircle2 size={44} className="animate-bounce" />
                </div>
                <div>
                  <h3 className="text-3xl font-extrabold text-white glow-text">Enquiry Received!</h3>
                  <p className="text-slate-300 mt-2 max-w-sm mx-auto">
                    Thank you, {formData.name}. Our luxury travel consultant will connect with you within 24 hours.
                  </p>
                </div>

                <div className="border-t border-white/5 pt-6 space-y-4">
                  <p className="text-xs text-slate-400">Want an instant quote? Connect with us directly:</p>
                  
                  <button
                    onClick={handleWhatsAppRedirect}
                    className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-[#ffffff] font-bold py-3.5 rounded-xl transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[0_0_35px_rgba(16,185,129,0.6)] flex items-center justify-center gap-2"
                  >
                    Chat on WhatsApp Now
                  </button>
                  
                  <button 
                    onClick={onClose}
                    className="text-slate-400 hover:text-white text-sm font-medium transition-colors"
                  >
                    Close Window
                  </button>
                </div>
              </motion.div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
