"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { 
  ShieldCheck, 
  FileText, 
  CheckCircle2, 
  AlertCircle, 
  Search, 
  HelpCircle,
  Globe2,
  Calendar,
  Clock,
  CreditCard,
  ExternalLink,
  CheckSquare,
  Square,
  ArrowRight,
  Sparkles,
  Info,
  Building2,
  Check,
  AlertTriangle,
  Send
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useData } from "@/context/DataContext";
import { POPULAR_NATIONALITIES, TravelPurpose, VisaRecord } from "@/data/visa";
import EnquiryModal from "@/components/EnquiryModal";

const PURPOSES: TravelPurpose[] = ["Tourism", "Business", "Transit", "Other"];

export default function VisaPage() {
  const { destinationList, visaRecords, isLoading } = useData();

  // Filter/Search states
  const [selectedDestination, setSelectedDestination] = useState<string>("japan");
  const [selectedNationality, setSelectedNationality] = useState<string>("India");
  const [selectedPurpose, setSelectedPurpose] = useState<TravelPurpose>("Tourism");
  const [destSearch, setDestSearch] = useState("");

  // Interactive document checklist tracking
  const [checkedDocs, setCheckedDocs] = useState<Record<string, boolean>>({});

  // Modal enquiry
  const [modalOpen, setModalOpen] = useState(false);

  // Toggle document checked status
  const toggleDoc = (docText: string) => {
    setCheckedDocs(prev => ({
      ...prev,
      [docText]: !prev[docText]
    }));
  };

  // Find destination details
  const currentDest = useMemo(() => {
    return destinationList.find(d => 
      d.id === selectedDestination || 
      d.name.toLowerCase() === selectedDestination.toLowerCase() ||
      d.slug === selectedDestination
    ) || destinationList[0];
  }, [destinationList, selectedDestination]);

  // Destination filter for search input
  const filteredDestinations = useMemo(() => {
    if (!destSearch.trim()) return destinationList;
    const q = destSearch.toLowerCase();
    return destinationList.filter(d => 
      d.name.toLowerCase().includes(q) || 
      (d.parentCountry && d.parentCountry.toLowerCase().includes(q))
    );
  }, [destinationList, destSearch]);

  // Robust Visa Record Matching logic
  const matchedRecord = useMemo<VisaRecord | undefined>(() => {
    if (!visaRecords || visaRecords.length === 0) return undefined;

    return visaRecords.find(v => {
      if (v.published === false) return false;

      // Match Nationality (case-insensitive name or code)
      const natMatch = 
        v.passportNationality.toLowerCase() === selectedNationality.toLowerCase() ||
        v.passportCountryCode.toLowerCase() === selectedNationality.toLowerCase();
      if (!natMatch) return false;

      // Match Purpose
      if (selectedPurpose && v.travelPurpose.toLowerCase() !== selectedPurpose.toLowerCase()) {
        return false;
      }

      // Match Destination
      const destName = currentDest?.name?.toLowerCase() || selectedDestination.toLowerCase();
      const destId = currentDest?.id?.toLowerCase() || selectedDestination.toLowerCase();
      const destParent = currentDest?.parentCountry?.toLowerCase() || "";
      const destCode = currentDest?.countryCode?.toLowerCase() || "";

      const recordDest = v.destinationCountry.toLowerCase();
      const recordCode = v.destinationCountryCode.toLowerCase();

      return (
        recordDest === destName ||
        recordDest === destId ||
        (destParent && recordDest === destParent) ||
        (destCode && recordCode === destCode) ||
        recordCode === destId
      );
    });
  }, [visaRecords, selectedNationality, selectedPurpose, currentDest, selectedDestination]);

  // Checklist statistics
  const totalDocs = matchedRecord?.documents?.length || 0;
  const completedDocs = matchedRecord?.documents?.filter(d => checkedDocs[d]).length || 0;
  const progressPercent = totalDocs > 0 ? Math.round((completedDocs / totalDocs) * 100) : 0;

  // Status Badge Styling Helper
  const getStatusBadge = (status?: string) => {
    switch (status) {
      case "Visa-Free":
        return {
          bg: "bg-emerald-500/15 border-emerald-500/30 text-emerald-400",
          dot: "bg-emerald-400",
          label: "Visa-Free Entry"
        };
      case "Visa on Arrival":
        return {
          bg: "bg-sky-500/15 border-sky-500/30 text-sky-300",
          dot: "bg-sky-400",
          label: "Visa On Arrival"
        };
      case "eVisa / ETA":
        return {
          bg: "bg-amber-500/15 border-amber-500/30 text-yellow-300",
          dot: "bg-yellow-400",
          label: "eVisa / ETA Required"
        };
      case "Visa Required":
      default:
        return {
          bg: "bg-rose-500/15 border-rose-500/30 text-rose-300",
          dot: "bg-rose-400",
          label: "Visa Required (Embassy/VFS)"
        };
    }
  };

  const statusBadge = getStatusBadge(matchedRecord?.entryRequirementStatus);

  // Popular shortcuts
  const popularShortcuts = [
    { id: "japan", label: "Japan", flag: "🇯🇵" },
    { id: "switzerland", label: "Switzerland", flag: "🇨🇭" },
    { id: "dubai", label: "Dubai (UAE)", flag: "🇦🇪" },
    { id: "maldives", label: "Maldives", flag: "🇲🇻" },
    { id: "thailand", label: "Thailand", flag: "🇹🇭" },
    { id: "singapore", label: "Singapore", flag: "🇸🇬" },
    { id: "bali", label: "Bali", flag: "🇮🇩" },
    { id: "new-zealand", label: "New Zealand", flag: "🇳🇿" },
  ];

  return (
    <div className="min-h-screen pt-28 pb-24 relative bg-navy-950 text-slate-100 selection:bg-yellow-400 selection:text-slate-950">
      {/* Background Ambient Glows */}
      <div className="absolute top-0 left-0 w-full h-[650px] overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[10%] right-[-5%] w-[45%] h-[55%] bg-yellow-500/5 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-10 left-[-10%] w-[50%] h-[50%] bg-blue-500/10 rounded-full blur-[140px]"></div>
      </div>

      <div className="container mx-auto px-4 md:px-6 relative z-10 max-w-6xl">
        
        {/* Header Hero Section */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-flex items-center gap-2 text-yellow-400 font-bold uppercase tracking-widest text-xs px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 shadow-inner">
              <ShieldCheck size={14} className="text-yellow-400" />
              Official Travel Guidance & Assistance
            </span>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-white mt-5 tracking-tight leading-tight">
              International <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 via-yellow-400 to-yellow-600">Visa Guide</span>
            </h1>
            <p className="text-slate-400 mt-4 text-sm sm:text-base leading-relaxed">
              Check entry rules, required document checklists, and processing timelines tailored to your passport nationality. Our dedicated visa desk assists you every step of the way with a 99.2% approval record.
            </p>
          </motion.div>

          {/* Popular Destination Shortcuts */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
            <span className="text-xs uppercase font-bold text-slate-500 tracking-wider mr-1">Popular:</span>
            {popularShortcuts.map(item => (
              <button
                key={item.id}
                onClick={() => {
                  setSelectedDestination(item.id);
                  setDestSearch("");
                }}
                className={`text-xs px-3 py-1.5 rounded-full transition-all border flex items-center gap-1.5 font-medium ${
                  selectedDestination === item.id 
                    ? "bg-yellow-400 text-slate-950 border-yellow-400 font-bold shadow-md shadow-yellow-500/20" 
                    : "bg-white/5 border-white/10 text-slate-300 hover:bg-white/10 hover:text-white"
                }`}
              >
                <span>{item.flag}</span>
                <span>{item.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Step-by-Step Interactive Visa Selector Bar */}
        <div className="glass-card p-6 md:p-8 rounded-3xl border border-white/10 mb-12 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-yellow-500/5 rounded-full blur-3xl pointer-events-none"></div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Step 1: Destination Country */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-yellow-400 text-slate-950 text-[11px] font-black flex items-center justify-center">1</span>
                Destination Country
              </label>

              <div className="relative">
                <select
                  value={selectedDestination}
                  onChange={(e) => setSelectedDestination(e.target.value)}
                  className="w-full bg-navy-900 border border-white/15 rounded-xl px-4 py-3.5 text-sm text-white font-medium focus:border-yellow-400 focus:outline-none transition appearance-none cursor-pointer pr-10 shadow-inner"
                >
                  {destinationList.map(dest => (
                    <option key={dest.id} value={dest.id} className="bg-navy-950 text-white">
                      {dest.flag || "🌍"} {dest.name} {dest.parentCountry ? `(${dest.parentCountry})` : ""}
                    </option>
                  ))}
                </select>
                <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 text-xs">
                  ▼
                </div>
              </div>
              <p className="text-[11px] text-slate-500 mt-1.5">Where are you traveling to?</p>
            </div>

            {/* Step 2: Passport Nationality */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-yellow-400 text-slate-950 text-[11px] font-black flex items-center justify-center">2</span>
                Passport Nationality
              </label>

              <div className="relative">
                <select
                  value={selectedNationality}
                  onChange={(e) => setSelectedNationality(e.target.value)}
                  className="w-full bg-navy-900 border border-white/15 rounded-xl px-4 py-3.5 text-sm text-white font-medium focus:border-yellow-400 focus:outline-none transition appearance-none cursor-pointer pr-10 shadow-inner"
                >
                  {POPULAR_NATIONALITIES.map(nat => (
                    <option key={nat.code} value={nat.name} className="bg-navy-950 text-white">
                      {nat.flag} {nat.name} Passport
                    </option>
                  ))}
                </select>
                <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 text-xs">
                  ▼
                </div>
              </div>
              <p className="text-[11px] text-slate-500 mt-1.5">Your passport issuing authority</p>
            </div>

            {/* Step 3: Travel Purpose */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-yellow-400 text-slate-950 text-[11px] font-black flex items-center justify-center">3</span>
                Travel Purpose
              </label>

              <div className="relative">
                <select
                  value={selectedPurpose}
                  onChange={(e) => setSelectedPurpose(e.target.value as TravelPurpose)}
                  className="w-full bg-navy-900 border border-white/15 rounded-xl px-4 py-3.5 text-sm text-white font-medium focus:border-yellow-400 focus:outline-none transition appearance-none cursor-pointer pr-10 shadow-inner"
                >
                  {PURPOSES.map(purpose => (
                    <option key={purpose} value={purpose} className="bg-navy-950 text-white">
                      ✈️ {purpose}
                    </option>
                  ))}
                </select>
                <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 text-xs">
                  ▼
                </div>
              </div>
              <p className="text-[11px] text-slate-500 mt-1.5">Reason for international entry</p>
            </div>

          </div>
        </div>

        {/* Dynamic Visa Guide Result Section */}
        {matchedRecord ? (
          <div className="space-y-8">
            
            {/* Header Result Card */}
            <div className="glass-card p-6 md:p-8 rounded-3xl border border-white/10 relative overflow-hidden shadow-2xl">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-white/10">
                <div className="flex items-center gap-4">
                  <span className="text-5xl drop-shadow-md">{currentDest?.flag || "🌍"}</span>
                  <div>
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full border ${statusBadge.bg}`}>
                        <span className={`w-2 h-2 rounded-full ${statusBadge.dot} animate-pulse`}></span>
                        {statusBadge.label}
                      </span>
                      {matchedRecord.verifiedDate && (
                        <span className="text-[11px] text-slate-400 flex items-center gap-1 bg-white/5 px-2.5 py-1 rounded-full border border-white/5">
                          <CheckCircle2 size={12} className="text-emerald-400" />
                          Verified: {matchedRecord.verifiedDate}
                        </span>
                      )}
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-black text-white">
                      {matchedRecord.destinationCountry} Visa for {matchedRecord.passportNationality} Citizens
                    </h2>
                    <p className="text-xs sm:text-sm text-yellow-400/90 font-medium mt-1">
                      Category: {matchedRecord.visaCategory}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={() => setModalOpen(true)}
                    className="bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-300 hover:to-yellow-500 text-slate-950 font-black px-6 py-3.5 rounded-xl text-sm transition-all shadow-lg shadow-yellow-500/20 active:scale-95 flex items-center gap-2"
                  >
                    <Send size={15} />
                    Get Visa Assistance
                  </button>
                  {matchedRecord.officialUrl && (
                    <a
                      href={matchedRecord.officialUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-white/5 hover:bg-white/10 text-white font-bold px-4 py-3.5 rounded-xl text-xs transition border border-white/10 flex items-center gap-1.5"
                    >
                      <ExternalLink size={14} className="text-slate-400" />
                      Official Portal
                    </a>
                  )}
                </div>
              </div>

              {/* Key Quick Facts Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
                
                <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5 mb-1.5">
                    <Calendar size={13} className="text-yellow-400" /> Validity
                  </span>
                  <p className="text-sm font-semibold text-white">
                    {matchedRecord.validity || "Standard tourist duration"}
                  </p>
                </div>

                <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5 mb-1.5">
                    <Clock size={13} className="text-yellow-400" /> Max Permitted Stay
                  </span>
                  <p className="text-sm font-semibold text-white">
                    {matchedRecord.maxStay || "Up to 30 days"}
                  </p>
                </div>

                <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5 mb-1.5">
                    <Clock size={13} className="text-yellow-400" /> Processing Time
                  </span>
                  <p className="text-sm font-semibold text-white">
                    {matchedRecord.processingTime || "3 - 7 working days"}
                  </p>
                </div>

                <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5 mb-1.5">
                    <CreditCard size={13} className="text-yellow-400" /> Government Fee
                  </span>
                  <p className="text-sm font-semibold text-white">
                    {matchedRecord.fees || "Refer to immigration table"}
                  </p>
                </div>

              </div>

              {/* Notes Banner */}
              {matchedRecord.notes && (
                <div className="mt-6 p-4 rounded-2xl bg-yellow-400/10 border border-yellow-400/20 flex items-start gap-3">
                  <Info size={18} className="text-yellow-400 shrink-0 mt-0.5" />
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    {matchedRecord.notes}
                  </p>
                </div>
              )}
            </div>

            {/* Split Section: Interactive Checklist & Procedure */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Left Column: Interactive Document Checklist */}
              <div className="lg:col-span-7 glass-card p-6 md:p-8 rounded-3xl border border-white/10 shadow-xl space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-white/10">
                  <div>
                    <h3 className="text-lg font-black text-white flex items-center gap-2">
                      <FileText size={20} className="text-yellow-400" /> Required Documents Checklist
                    </h3>
                    <p className="text-xs text-slate-400 mt-1">
                      Click each requirement to track your preparation progress.
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-black text-yellow-400 bg-yellow-400/10 border border-yellow-400/20 px-2.5 py-1 rounded-full">
                      {completedDocs} / {totalDocs} Prepared
                    </span>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-white/5 rounded-full h-2 overflow-hidden border border-white/10">
                  <div 
                    className="bg-gradient-to-r from-yellow-400 to-emerald-400 h-full transition-all duration-300"
                    style={{ width: `${progressPercent}%` }}
                  ></div>
                </div>

                {/* Checklist items */}
                <div className="space-y-3">
                  {matchedRecord.documents.map((doc, idx) => {
                    const isChecked = !!checkedDocs[doc];
                    return (
                      <button
                        key={idx}
                        onClick={() => toggleDoc(doc)}
                        className={`w-full text-left p-4 rounded-2xl border transition-all flex items-start gap-3.5 group cursor-pointer ${
                          isChecked 
                            ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-200" 
                            : "bg-white/5 border-white/5 text-slate-300 hover:bg-white/10 hover:border-white/15"
                        }`}
                      >
                        <div className="mt-0.5 shrink-0">
                          {isChecked ? (
                            <CheckSquare size={18} className="text-emerald-400" />
                          ) : (
                            <Square size={18} className="text-slate-500 group-hover:text-yellow-400" />
                          )}
                        </div>
                        <span className={`text-xs sm:text-sm leading-relaxed ${isChecked ? "line-through opacity-80" : ""}`}>
                          {doc}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* Checklist Footer Advice */}
                <div className="p-4 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between">
                  <span className="text-xs text-slate-400">Need help preparing affidavits or bank statements?</span>
                  <button
                    onClick={() => setModalOpen(true)}
                    className="text-xs font-bold text-yellow-400 hover:text-yellow-300 transition"
                  >
                    Consult Document Desk &rarr;
                  </button>
                </div>
              </div>

              {/* Right Column: Step-by-Step Procedure & Restrictions */}
              <div className="lg:col-span-5 space-y-6">
                
                {/* Application Steps */}
                {matchedRecord.procedure && matchedRecord.procedure.length > 0 && (
                  <div className="glass-card p-6 md:p-8 rounded-3xl border border-white/10 shadow-xl">
                    <h3 className="text-lg font-black text-white mb-6 flex items-center gap-2">
                      <Sparkles size={18} className="text-yellow-400" /> Step-by-Step Procedure
                    </h3>

                    <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-[2px] before:bg-white/10">
                      {matchedRecord.procedure.map((step, idx) => (
                        <div key={idx} className="relative">
                          <span className="absolute -left-6 top-0 w-4 h-4 rounded-full bg-navy-950 border-2 border-yellow-400 flex items-center justify-center text-[9px] font-bold text-yellow-400">
                            {idx + 1}
                          </span>
                          <h4 className="text-xs font-bold uppercase tracking-wider text-yellow-400 mb-1">
                            Step {idx + 1}
                          </h4>
                          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                            {step}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Important Restrictions & Safeguards */}
                {matchedRecord.restrictions && matchedRecord.restrictions.length > 0 && (
                  <div className="glass-card p-6 rounded-3xl border border-white/10 shadow-xl space-y-4">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-rose-300 flex items-center gap-2">
                      <AlertTriangle size={16} className="text-rose-400" /> Important Restrictions
                    </h3>

                    <ul className="space-y-2.5">
                      {matchedRecord.restrictions.map((restriction, idx) => (
                        <li key={idx} className="text-xs text-slate-300 flex items-start gap-2 leading-relaxed">
                          <span className="text-rose-400 font-bold mt-0.5">•</span>
                          <span>{restriction}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Immigration Authority Disclaimer Card */}
                <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-2 text-[11px] text-slate-400 leading-relaxed">
                  <p className="font-bold text-slate-300 flex items-center gap-1.5 uppercase tracking-wider">
                    <ShieldCheck size={14} className="text-yellow-400" /> Legal Disclaimer
                  </p>
                  <p>
                    Visa requirements and entry policies are subject to change at any moment by destination governments. While MHM Travels verifies information against official consular notices, final entry permission remains at the absolute discretion of border immigration officials.
                  </p>
                </div>

              </div>

            </div>

          </div>
        ) : (
          /* Empty / Unverified State */
          <div className="glass-card p-10 md:p-14 rounded-3xl border border-white/10 text-center max-w-2xl mx-auto shadow-2xl">
            <div className="w-16 h-16 rounded-full bg-yellow-400/10 border border-yellow-400/20 text-yellow-400 flex items-center justify-center mx-auto mb-6">
              <Globe2 size={32} />
            </div>
            
            <h3 className="text-2xl font-black text-white">
              Custom Visa Advisory Required
            </h3>

            <p className="text-sm text-slate-400 mt-3 leading-relaxed">
              Specific visa guidelines for <strong className="text-white">{selectedNationality}</strong> passport holders traveling to <strong className="text-white">{currentDest?.name || selectedDestination}</strong> for <strong className="text-white">{selectedPurpose}</strong> are currently being updated with consular authorities.
            </p>

            <div className="p-4 rounded-2xl bg-white/5 border border-white/5 my-6 text-xs text-slate-300 text-left space-y-2">
              <p className="font-bold text-yellow-400 flex items-center gap-1.5">
                <ShieldCheck size={14} /> MHM Travels Verification Guarantee:
              </p>
              <p>
                We never assume visa-free entry or fabricate processing rules. Our visa concierge team reviews individual profiles, bilateral agreements, and transit visas personally before advising.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={() => setModalOpen(true)}
                className="bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-300 hover:to-yellow-500 text-slate-950 font-black px-6 py-3.5 rounded-xl text-sm transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2"
              >
                <Send size={15} />
                Request Custom Visa Guidance
              </button>
              <a
                href={`https://wa.me/919876543210?text=${encodeURIComponent(`Hello MHM Travels, I need visa consultation for ${currentDest?.name || selectedDestination} on a ${selectedNationality} passport (${selectedPurpose}).`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-6 py-3.5 rounded-xl text-sm transition border border-emerald-500 flex items-center justify-center gap-2"
              >
                Chat on WhatsApp
              </a>
            </div>
          </div>
        )}

        {/* Why Choose MHM Travels Visa Assistance */}
        <div className="mt-20 pt-16 border-t border-white/10">
          <div className="text-center max-w-xl mx-auto mb-12">
            <span className="text-xs uppercase font-bold text-yellow-400 tracking-wider">Premium Concierge</span>
            <h2 className="text-2xl sm:text-3xl font-black text-white mt-2">
              Why Book Your Visa Through MHM Travels?
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="glass-card p-6 rounded-2xl border border-white/10 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-yellow-400/10 border border-yellow-400/20 text-yellow-400 flex items-center justify-center">
                <ShieldCheck size={20} />
              </div>
              <h3 className="text-base font-bold text-white">99.2% Visa Approval Rate</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Every application undergoes a multi-point verification check by seasoned immigration specialists before submission to eliminate rejections.
              </p>
            </div>

            <div className="glass-card p-6 rounded-2xl border border-white/10 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-yellow-400/10 border border-yellow-400/20 text-yellow-400 flex items-center justify-center">
                <FileText size={20} />
              </div>
              <h3 className="text-base font-bold text-white">Complete Document Curation</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                We draft tailored cover letters, verify hotel confirmations, structure travel itineraries, and audit financial statements to meet embassy standards.
              </p>
            </div>

            <div className="glass-card p-6 rounded-2xl border border-white/10 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-yellow-400/10 border border-yellow-400/20 text-yellow-400 flex items-center justify-center">
                <Clock size={20} />
              </div>
              <h3 className="text-base font-bold text-white">Priority Biometric Bookings</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Struggling to find Schengen or UK visa appointment slots? Our concierge team monitors and schedules priority slots on your behalf.
              </p>
            </div>
          </div>
        </div>

      </div>

      {/* Reusable Enquiry Modal */}
      <EnquiryModal 
        isOpen={modalOpen} 
        onClose={() => setModalOpen(false)} 
        defaultDestination={`${currentDest?.name || selectedDestination} Visa Assistance (${selectedNationality} Passport, ${selectedPurpose})`}
      />
    </div>
  );
}
