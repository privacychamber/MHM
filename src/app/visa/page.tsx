"use client";

import { useState } from "react";
import { ShieldCheck, FileText, CheckCircle2, AlertCircle, Search, HelpCircle } from "lucide-react";
import { motion } from "framer-motion";
import { destinationsData } from "@/data/destinations";
import EnquiryModal from "@/components/EnquiryModal";

const visaGuidelines: Record<string, {
  requirement: string;
  processingTime: string;
  docs: string[];
  tips: string;
}> = {
  "japan": {
    requirement: "Electronic Visa (E-Visa) available for Indian Tourists. Valid for up to 90 days stay.",
    processingTime: "5 - 7 Working Days",
    docs: ["Passport valid for 6 months", "Completed visa application form with photo", "Confirmed flight tickets", "Day-by-day itinerary", "Bank statement of last 6 months (showing healthy balance)"],
    tips: "Ensure your travel itinerary dates match your hotel booking confirmations exactly."
  },
  "switzerland": {
    requirement: "Schengen Visa Required. Requires biometric appointment and physical passport submission.",
    processingTime: "15 - 20 Working Days",
    docs: ["Original Passport", "Schengen application form", "2 Recent photos (Schengen spec)", "Covering letter stating travel purpose", "Confirmed roundtrip flights & hotel vouchers", "NOC from employer / Business registration", "Income Tax Returns (ITR) for last 3 years", "Travel Insurance (min cover €30,000)"],
    tips: "Apply at least 4-6 weeks in advance of travel date as Schengen queues can be long."
  },
  "dubai": {
    requirement: "Pre-arranged single entry tourist E-Visa. Apply online through our travel agents.",
    processingTime: "48 - 72 Hours",
    docs: ["Clear color scan of passport bio pages", "Passport size photo with white background", "Confirmed return flight ticket", "Hotel booking voucher"],
    tips: "E-visas are sent directly via PDF email. Fast-track options are available."
  },
  "maldives": {
    requirement: "Visa On Arrival (Free of charge) for all nationalities. Valid for 30 days.",
    processingTime: "Instant (On Arrival)",
    docs: ["Passport valid for 1 month", "Pre-booked hotel reservation confirmation", "Return/onward flight tickets", "Sufficient funds declaration", "IMUGA Traveler Declaration Form (must be submitted within 96 hours before arrival)"],
    tips: "Keep your resort confirmation voucher handy on your phone for airport immigration clearance."
  },
  "thailand": {
    requirement: "Visa On Arrival (VOA) or Visa Free (depending on government updates). Currently Visa Free for Indian Nationals.",
    processingTime: "Instant / Visa Free Entry",
    docs: ["Passport valid for 6 months", "Confirmed return flight ticket within 15/30 days", "Proof of accommodation in Thailand", "Sufficient funds (minimum 10,000 THB per person)"],
    tips: "Keep printouts of flight tickets and hotel bookings as digital copies are sometimes rejected at VOA counters."
  },
  "singapore": {
    requirement: "Tourist Visa (Paper/E-Visa) via authorized agents. Valid for multiple entries.",
    processingTime: "3 - 5 Working Days",
    docs: ["Original passport", "Form 14A completed & signed", "2 Recent passport photos (matte finish)", "Confirmed onward flights", "Bank statements / Credit card limit proof"],
    tips: "Singapore offers 2-year multiple entry visas to frequent travelers."
  },
  "bali": {
    requirement: "Visa On Arrival (VOA) available online (E-VOA) or at the counter. Valid for 30 days.",
    processingTime: "Instant / 24 Hours online",
    docs: ["Passport valid for 6 months", "Return ticket", "Customs declaration QR code", "VOA fee payment (approx. 35 USD)"],
    tips: "Pre-pay and apply for E-VOA online to bypass the long immigration payment queues at Denpasar airport."
  }
};

export default function VisaPage() {
  const [selectedDest, setSelectedDest] = useState("japan");
  const [modalOpen, setModalOpen] = useState(false);

  const visaInfo = visaGuidelines[selectedDest] || {
    requirement: "Standard Tourist Visa required. Contact our experts for documentation checklist.",
    processingTime: "7 - 10 Working Days",
    docs: ["Passport valid for 6 months", "Completed application forms", "Proof of funds (Bank statement)", "Flights and hotel itinerary"],
    tips: "Consult our dedicated visa assistance desk to evaluate your profile eligibility."
  };

  const currentDest = Object.values(destinationsData).find(d => d.id === selectedDest) || {
    name: "Selected Country",
    flag: "🌍"
  };

  return (
    <div className="min-h-screen pt-28 pb-20 relative bg-navy-950">
      {/* Background Glows */}
      <div className="absolute top-0 left-0 w-full h-[600px] overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[20%] right-[-10%] w-[45%] h-[55%] bg-yellow-500/5 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-0 left-[-10%] w-[50%] h-[50%] bg-blue-500/10 rounded-full blur-[120px]"></div>
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
              Hassle-Free Visa Services
            </span>
            <h1 className="text-4xl md:text-5xl font-black text-white mt-6 leading-tight">
              Tourist <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 via-yellow-400 to-yellow-600 glow-text">Visa Guide</span>
            </h1>
            <p className="text-slate-400 mt-4 text-sm md:text-base">
              Get detailed documentation checklists, processing times, and let our visa experts file your applications with high approval rates.
            </p>
          </motion.div>
        </div>

        {/* Visa Guide Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Panel: Country Selector */}
          <div className="lg:col-span-4 glass-card p-6 space-y-3 border border-white/10">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">Select Destination</h3>
            
            <div className="space-y-2 max-h-[350px] overflow-y-auto pr-2">
              {Object.values(destinationsData).slice(0, 10).map((dest) => (
                <button
                  key={dest.id}
                  onClick={() => setSelectedDest(dest.id)}
                  className={`w-full flex items-center justify-between p-3.5 rounded-xl border text-left font-bold transition-all ${
                    selectedDest === dest.id 
                      ? "bg-gradient-to-r from-yellow-400 to-yellow-600 border-transparent text-navy-950 shadow-lg" 
                      : "bg-white/5 border-white/5 text-white hover:bg-white/10"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{dest.flag}</span>
                    <span className="text-sm">{dest.name}</span>
                  </div>
                  <span className={`text-[10px] uppercase font-black px-2 py-0.5 rounded-md ${
                    selectedDest === dest.id ? "bg-navy-900 text-yellow-400" : "bg-white/10 text-slate-300"
                  }`}>
                    {dest.visa.split(" ")[0]}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Right Panel: Visa Details */}
          <div className="lg:col-span-8 space-y-6">
            <div className="glass-card p-8 border border-white/10 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-48 h-48 bg-yellow-500/5 rounded-full blur-3xl pointer-events-none"></div>
              
              <div className="flex items-center gap-3 mb-6 border-b border-white/10 pb-6">
                <span className="text-4xl">{currentDest.flag}</span>
                <div>
                  <h2 className="text-2xl font-black text-white">{currentDest.name} Visa Guide</h2>
                  <p className="text-xs text-yellow-400 font-bold uppercase tracking-wider mt-1 flex items-center gap-1.5">
                    <ShieldCheck size={14} /> 99.2% Visa Approval Rate by MHM Travels
                  </p>
                </div>
              </div>

              {/* Grid Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="bg-white/5 p-5 rounded-2xl border border-white/5">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">Visa Requirement Type</span>
                  <p className="text-sm text-white font-semibold leading-relaxed">{visaInfo.requirement}</p>
                </div>

                <div className="bg-white/5 p-5 rounded-2xl border border-white/5">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">Expected Processing Time</span>
                  <p className="text-sm text-white font-semibold">{visaInfo.processingTime}</p>
                </div>
              </div>

              {/* Documents Required */}
              <div className="mb-8">
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                  <FileText size={16} className="text-yellow-400" /> Documents Checklist
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {visaInfo.docs.map((doc, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 p-3 bg-white/5 rounded-xl border border-white/5">
                      <CheckCircle2 size={16} className="text-green-500 shrink-0 mt-0.5" />
                      <span className="text-xs text-slate-200 leading-normal">{doc}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Expert Tips */}
              <div className="p-4 bg-yellow-400/10 border border-yellow-400/20 rounded-2xl flex items-start gap-3 mb-8">
                <AlertCircle size={18} className="text-yellow-400 shrink-0 mt-0.5" />
                <div>
                  <span className="text-xs font-bold text-yellow-400 uppercase tracking-wider block">Expert Filing Tip</span>
                  <p className="text-xs text-slate-300 mt-1 leading-relaxed">{visaInfo.tips}</p>
                </div>
              </div>

              {/* Call to Action */}
              <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-white/5 p-6 rounded-2xl border border-white/10">
                <div className="text-center sm:text-left">
                  <h4 className="text-white font-bold">Need assistance with your filing?</h4>
                  <p className="text-xs text-slate-400 mt-0.5">Let our consultants review your profile and handle the paperwork.</p>
                </div>
                <button
                  onClick={() => setModalOpen(true)}
                  className="w-full sm:w-auto bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-300 hover:to-yellow-500 text-navy-950 font-bold px-6 py-3.5 rounded-xl text-sm transition-all shadow-md active:scale-95 whitespace-nowrap"
                >
                  Request Visa Consultation
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <EnquiryModal 
        isOpen={modalOpen} 
        onClose={() => setModalOpen(false)} 
        defaultDestination={`${currentDest.name} Visa Consultation`}
      />
    </div>
  );
}
