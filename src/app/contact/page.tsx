"use client";

import { useState } from "react";
import { Phone, Mail, MapPin, Send, CheckCircle2, Clock } from "lucide-react";
import { motion } from "framer-motion";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: ""
  });
  const [isSent, setIsSent] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSent(true);
    setFormData({
      name: "",
      email: "",
      phone: "",
      subject: "",
      message: ""
    });
  };

  return (
    <div className="min-h-screen pt-28 pb-20 relative bg-navy-950">
      {/* Background Glows */}
      <div className="absolute top-0 left-0 w-full h-[600px] overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-500/10 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[20%] left-[-10%] w-[45%] h-[55%] bg-yellow-500/5 rounded-full blur-[100px]"></div>
      </div>

      <div className="container mx-auto px-4 md:px-6 relative z-10 max-w-5xl">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-yellow-400 font-bold uppercase tracking-widest text-xs px-3 py-1.5 rounded-full bg-white/5 border border-white/10">
              Get in Touch
            </span>
            <h1 className="text-4xl md:text-5xl font-black text-white mt-6 leading-tight">
              Contact <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 via-yellow-400 to-yellow-600 glow-text">Our Experts</span>
            </h1>
            <p className="text-slate-400 mt-4 text-base">
              Have questions about booking, destinations, or customization? Send us a message or call directly.
            </p>
          </motion.div>
        </div>

        {/* Contact Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Info Side */}
          <div className="lg:col-span-5 space-y-6">
            <div className="glass-card p-6 border border-white/10 space-y-8">
              <h3 className="text-lg font-bold text-white mb-2">Connect Directly</h3>

              <div className="space-y-6">
                {/* Phone */}
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-yellow-400 shrink-0">
                    <Phone size={20} />
                  </div>
                  <div>
                    <h4 className="text-xs text-slate-500 uppercase font-bold tracking-wider">Phone & WhatsApp</h4>
                    <a href="tel:+918437770006" className="text-white font-bold hover:text-yellow-400 transition-colors mt-1 block">
                      +91 84377 70006
                    </a>
                  </div>
                </div>

                {/* Email */}
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-yellow-400 shrink-0">
                    <Mail size={20} />
                  </div>
                  <div>
                    <h4 className="text-xs text-slate-500 uppercase font-bold tracking-wider">Email Address</h4>
                    <a href="mailto:info.mhmtravels@gmail.com" className="text-white font-bold hover:text-yellow-400 transition-colors mt-1 block break-all">
                      info.mhmtravels@gmail.com
                    </a>
                  </div>
                </div>

                {/* Address */}
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-yellow-400 shrink-0">
                    <MapPin size={20} />
                  </div>
                  <div>
                    <h4 className="text-xs text-slate-500 uppercase font-bold tracking-wider">Corporate Head Office</h4>
                    <p className="text-slate-300 mt-1 text-sm font-medium leading-relaxed">
                      Mohali, Punjab
                    </p>
                  </div>
                </div>

                {/* Support Hours */}
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-yellow-400 shrink-0">
                    <Clock size={20} />
                  </div>
                  <div>
                    <h4 className="text-xs text-slate-500 uppercase font-bold tracking-wider">Business Hours</h4>
                    <p className="text-slate-300 mt-1 text-sm font-medium">
                      Mon - Sat: 9:30 AM - 7:00 PM IST
                    </p>
                    <p className="text-xs text-yellow-400 font-medium mt-0.5">
                      Emergency Support: 24/7
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Form Side */}
          <div className="lg:col-span-7">
            <div className="glass-card p-8 border border-white/10">
              {!isSent ? (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <h3 className="text-xl font-bold text-white glow-text">Send Us a Message</h3>
                  
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Name</label>
                        <input 
                          type="text" 
                          name="name"
                          required
                          value={formData.name}
                          onChange={handleChange}
                          placeholder="Your Name"
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-yellow-400/50 transition-colors placeholder:text-slate-600"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Phone</label>
                        <input 
                          type="tel" 
                          name="phone"
                          required
                          value={formData.phone}
                          onChange={handleChange}
                          placeholder="Your Phone Number"
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-yellow-400/50 transition-colors placeholder:text-slate-600"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Email Address</label>
                      <input 
                        type="email" 
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="yourname@example.com"
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-yellow-400/50 transition-colors placeholder:text-slate-600"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Subject</label>
                      <input 
                        type="text" 
                        name="subject"
                        required
                        value={formData.subject}
                        onChange={handleChange}
                        placeholder="How can we help you?"
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-yellow-400/50 transition-colors placeholder:text-slate-600"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Message</label>
                      <textarea 
                        name="message"
                        required
                        rows={4}
                        value={formData.message}
                        onChange={handleChange}
                        placeholder="Tell us details about your query..."
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-yellow-400/50 transition-colors placeholder:text-slate-600 resize-none"
                      />
                    </div>
                  </div>

                  <button 
                    type="submit"
                    className="w-full bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-300 hover:to-yellow-500 text-slate-950 font-bold py-4 rounded-xl transition-all shadow-md active:scale-95 flex items-center justify-center gap-2"
                  >
                    Send Message <Send size={16} />
                  </button>
                </form>
              ) : (
                <div className="text-center py-10 space-y-6">
                  <div className="w-16 h-16 bg-green-500/10 border border-green-500/30 rounded-full flex items-center justify-center mx-auto text-green-400">
                    <CheckCircle2 size={36} className="animate-bounce" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white glow-text">Message Sent!</h3>
                    <p className="text-slate-300 mt-2 max-w-sm mx-auto text-sm">
                      Thank you for contacting us. One of our travel executives will reach out to you shortly.
                    </p>
                  </div>
                  <button
                    onClick={() => setIsSent(false)}
                    className="text-slate-400 hover:text-white text-sm font-medium transition-colors"
                  >
                    Send Another Message
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
