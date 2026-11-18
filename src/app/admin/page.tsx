"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { 
  LogOut, 
  Save, 
  Plus, 
  Edit2, 
  Trash2, 
  MapPin, 
  Package, 
  X,
  AlertCircle,
  ExternalLink,
  Calendar,
  Sparkles,
  ShieldCheck,
  Compass,
  FileText,
  ChevronDown,
  Layers,
  Search,
  Filter,
  CheckCircle2,
  Globe2,
  Clock,
  Eye,
  Check,
  ShieldAlert,
  Coins,
  Building,
  Star
} from "lucide-react";
import { TravelPackage, ItineraryDay, defaultPackages } from "@/data/packages";
import { Destination, destinationsData, DestinationType } from "@/data/destinations";
import { VisaRecord, defaultVisaRecords, VisaRequirementStatus, TravelPurpose, POPULAR_NATIONALITIES } from "@/data/visa";

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState("");
  const [loginError, setLoginError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Database State
  const [db, setDb] = useState<{
    destinations: Record<string, Destination>;
    packages: TravelPackage[];
    visaRecords: VisaRecord[];
    settings?: any;
  }>({
    destinations: destinationsData,
    packages: defaultPackages,
    visaRecords: defaultVisaRecords,
  });

  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [activeTab, setActiveTab] = useState<"packages" | "destinations" | "visas">("packages");
  const [status, setStatus] = useState({ type: "", message: "" });
  const [editMode, setEditMode] = useState<"add" | "edit" | null>(null);

  // Search and Filter states
  const [packageSearch, setPackageSearch] = useState("");
  const [destinationSearch, setDestinationSearch] = useState("");
  const [destTypeFilter, setDestTypeFilter] = useState("All");
  const [visaSearch, setVisaSearch] = useState("");
  const [visaDestFilter, setVisaDestFilter] = useState("All");
  const [visaNatFilter, setVisaNatFilter] = useState("All");
  const [visaStatusFilter, setVisaStatusFilter] = useState("All");

  // Delete Confirmation State
  const [deleteTarget, setDeleteTarget] = useState<{
    type: "package" | "destination" | "visa";
    id: string;
    title: string;
  } | null>(null);

  // --- FORM STATES ---
  // Package Form
  const [pkgFormData, setPkgFormData] = useState<TravelPackage>({
    id: "",
    title: "",
    category: "Luxury",
    rating: 5.0,
    duration: "",
    destinations: "",
    destinationIds: [],
    published: true,
    price: "",
    image: "",
    heroImage: "",
    features: [],
    overview: "",
    highlights: [],
    itinerary: [],
    inclusions: [],
    exclusions: [],
    travelTips: []
  });
  const [pkgModalTab, setPkgModalTab] = useState<"general" | "destinations" | "overview" | "itinerary" | "inclusions" | "tips">("general");
  const [destPickerSearch, setDestPickerSearch] = useState("");

  // Destination Form
  const [destFormData, setDestFormData] = useState<Destination>({
    id: "",
    name: "",
    slug: "",
    type: "Country",
    parentCountry: "",
    flag: "🌍",
    rating: 4.8,
    reviews: "1,000",
    image: "",
    heroImage: "",
    gallery: [],
    shortDescription: "",
    description: "",
    topCities: "",
    bestTime: "",
    duration: "7 - 10 Days",
    recommendedDuration: "7 - 10 Days",
    visa: "Guidance Available",
    currency: "USD",
    timeDiff: "+0h",
    timeZone: "UTC",
    flightDuration: "8h",
    lat: 0,
    lng: 0,
    price: "₹89,999",
    language: "English",
    topAttractions: "",
    highlights: [],
    featured: false,
    published: true,
    seoTitle: "",
    seoDescription: ""
  });
  const [destModalTab, setDestModalTab] = useState<"basic" | "media" | "content" | "facts" | "seo">("basic");

  // Visa Form
  const [visaFormData, setVisaFormData] = useState<VisaRecord>({
    id: "",
    destinationCountry: "Japan",
    destinationCountryCode: "JP",
    passportNationality: "India",
    passportCountryCode: "IN",
    travelPurpose: "Tourism",
    visaCategory: "Tourist Visa",
    entryRequirementStatus: "Visa Required",
    validity: "90 Days",
    maxStay: "30 Days",
    entries: "Single Entry",
    processingTime: "5 - 7 Working Days",
    fees: "₹3,500",
    currency: "INR",
    applicationMethod: "Online (eVisa)",
    officialUrl: "",
    documents: [
      "Valid passport with at least 6 months validity",
      "Recent passport-size photographs",
      "Confirmed roundtrip flight bookings",
      "Hotel reservation vouchers",
      "Bank statements for the past 6 months"
    ],
    procedure: [],
    restrictions: [],
    notes: "",
    verifiedDate: new Date().toISOString().split("T")[0],
    published: true
  });
  const [newDocInput, setNewDocInput] = useState("");

  // Load database from API on login
  useEffect(() => {
    if (isAuthenticated) {
      fetch("/api/data.json?t=" + Date.now())
        .then((res) => res.json())
        .then((json) => {
          setDb({
            destinations: (json.destinations && Object.keys(json.destinations).length > 0) ? json.destinations : destinationsData,
            packages: (json.packages && json.packages.length > 0) ? json.packages : defaultPackages,
            visaRecords: (json.visaRecords && json.visaRecords.length > 0) ? json.visaRecords : defaultVisaRecords,
            settings: json.settings || {}
          });
          setHasUnsavedChanges(false);
        })
        .catch((err) => {
          console.error("Error loading data", err);
          setStatus({ type: "error", message: "Failed to load database from server. Using local fallback." });
        });
    }
  }, [isAuthenticated]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setLoginError("");
    try {
      const res = await fetch("/api/save.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, action: "login" }),
      });
      if (res.ok) {
        setIsAuthenticated(true);
      } else {
        setLoginError("Invalid Admin Password");
      }
    } catch (err) {
      setLoginError("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveToServer = async () => {
    setStatus({ type: "info", message: "Saving changes to server..." });
    try {
      const res = await fetch("/api/save.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, data: db }),
      });
      const result = await res.json();
      if (res.ok) {
        setStatus({ type: "success", message: "Database saved successfully!" });
        setHasUnsavedChanges(false);
        setTimeout(() => setStatus({ type: "", message: "" }), 3500);
      } else {
        setStatus({ type: "error", message: "Error: " + (result.error || "Save failed") });
      }
    } catch (err) {
      setStatus({ type: "error", message: "Network error while saving." });
    }
  };

  // --- DESTINATION HELPERS ---
  const destinationList = useMemo(() => {
    return Object.values(db.destinations || {});
  }, [db.destinations]);

  const getPackageCountForDest = (destId: string, destName: string) => {
    const dIdLower = (destId || "").toLowerCase();
    const dNameLower = (destName || "").toLowerCase();
    return db.packages.filter(p => {
      if (p.destinationIds && Array.isArray(p.destinationIds)) {
        if (p.destinationIds.some(id => id.toLowerCase() === dIdLower)) return true;
      }
      if (p.destinations && p.destinations.toLowerCase().includes(dNameLower)) return true;
      return false;
    }).length;
  };

  // --- FORM OPENERS ---
  const openPackageForm = (mode: "add" | "edit", item: TravelPackage | null = null) => {
    setEditMode(mode);
    setPkgModalTab("general");
    if (mode === "add") {
      setPkgFormData({
        id: "pkg-" + Date.now(),
        title: "",
        category: "Luxury",
        rating: 4.9,
        duration: "7 Days / 6 Nights",
        destinations: "",
        destinationIds: [],
        published: true,
        price: "₹99,999",
        image: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=1200&auto=format&fit=crop",
        heroImage: "",
        features: ["Handpicked 4-Star & 5-Star Accommodations", "Daily gourmet breakfast", "Private airport & sightseeing transfers"],
        overview: "",
        highlights: ["Guided tours with English-speaking expert", "All entry vouchers and permits included"],
        itinerary: [
          {
            day: 1,
            title: "Arrival & VIP Hotel Check-in",
            subtitle: "Welcome to your dream destination",
            image: "",
            activities: [
              "Meet & greet at arrival airport with private luxury transfer",
              "Smooth check-in at luxury hotel & evening at leisure",
              "Welcome dinner featuring regional specialties"
            ]
          }
        ],
        inclusions: ["Luxury hotel stays", "Daily breakfast", "Private AC transfers", "All entry permits"],
        exclusions: ["International airfare", "Visa fees", "Personal expenses & tips"],
        travelTips: ["Passport must have at least 6 months validity.", "Carry international credit card."]
      });
    } else if (item) {
      setPkgFormData({
        ...item,
        destinationIds: Array.isArray(item.destinationIds) ? item.destinationIds : [],
        features: Array.isArray(item.features) ? item.features : [],
        highlights: Array.isArray(item.highlights) ? item.highlights : [],
        itinerary: Array.isArray(item.itinerary) ? item.itinerary : [],
        inclusions: Array.isArray(item.inclusions) ? item.inclusions : [],
        exclusions: Array.isArray(item.exclusions) ? item.exclusions : [],
        travelTips: Array.isArray(item.travelTips) ? item.travelTips : [],
        published: item.published !== false
      });
    }
  };

  const openDestinationForm = (mode: "add" | "edit", item: Destination | null = null) => {
    setEditMode(mode);
    setDestModalTab("basic");
    if (mode === "add") {
      setDestFormData({
        id: "",
        name: "",
        slug: "",
        type: "Country",
        parentCountry: "",
        flag: "🌍",
        rating: 4.8,
        reviews: "1,000",
        image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=1000&auto=format&fit=crop",
        heroImage: "",
        gallery: [],
        shortDescription: "",
        description: "",
        topCities: "",
        bestTime: "Mar–May / Sep–Nov",
        duration: "7 - 10 Days",
        recommendedDuration: "7 - 10 Days",
        visa: "Tourist Visa Required",
        currency: "USD",
        timeDiff: "+0h",
        timeZone: "UTC",
        flightDuration: "8h",
        lat: 0,
        lng: 0,
        price: "₹89,999",
        language: "English",
        topAttractions: "",
        highlights: [
          "Handpicked boutique 5-star accommodations",
          "Private escorted tours and exclusive cultural experiences"
        ],
        featured: false,
        published: true,
        seoTitle: "",
        seoDescription: ""
      });
    } else if (item) {
      setDestFormData({
        ...item,
        slug: item.slug || item.id,
        gallery: Array.isArray(item.gallery) ? item.gallery : [],
        highlights: Array.isArray(item.highlights) ? item.highlights : [],
        published: item.published !== false
      });
    }
  };

  const openVisaForm = (mode: "add" | "edit", item: VisaRecord | null = null) => {
    setEditMode(mode);
    setNewDocInput("");
    if (mode === "add") {
      setVisaFormData({
        id: "visa-" + Date.now(),
        destinationCountry: "",
        destinationCountryCode: "",
        passportNationality: "India",
        passportCountryCode: "IN",
        travelPurpose: "Tourism",
        visaCategory: "Tourist Visa",
        entryRequirementStatus: "Visa Required",
        validity: "90 Days from issuance",
        maxStay: "Up to 30 Days",
        entries: "Single Entry",
        processingTime: "5 - 7 Working Days",
        fees: "₹3,500",
        currency: "INR",
        applicationMethod: "Online (eVisa)",
        officialUrl: "",
        documents: [
          "Passport valid for at least 6 months with 2 blank pages",
          "Recent biometric photographs with white background",
          "Confirmed return flight tickets",
          "Hotel booking confirmation vouchers",
          "Bank statement of past 6 months"
        ],
        procedure: [
          "Complete online visa application",
          "Upload verified passport and itinerary documents",
          "Pay embassy processing fees",
          "Receive approved visa / issuance notice"
        ],
        restrictions: [
          "Strictly for leisure tourism; no local employment permitted"
        ],
        notes: "MHM Travels provides end-to-end filing and documentation assistance.",
        verifiedDate: new Date().toISOString().split("T")[0],
        published: true
      });
    } else if (item) {
      setVisaFormData({
        ...item,
        documents: Array.isArray(item.documents) ? item.documents : [],
        procedure: Array.isArray(item.procedure) ? item.procedure : [],
        restrictions: Array.isArray(item.restrictions) ? item.restrictions : [],
        published: item.published !== false
      });
    }
  };

  const closeForm = () => {
    setEditMode(null);
  };

  // --- SAVE FORM HANDLERS ---
  const savePackageForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pkgFormData.title.trim()) return alert("Package Title is required.");
    const pkgId = pkgFormData.id || ("pkg-" + Date.now());
    const updatedPkg = { ...pkgFormData, id: pkgId };

    setDb(prev => {
      const existing = [...prev.packages];
      const idx = existing.findIndex(p => p.id === pkgId);
      if (idx >= 0) existing[idx] = updatedPkg;
      else existing.unshift(updatedPkg);
      return { ...prev, packages: existing };
    });
    setHasUnsavedChanges(true);
    closeForm();
  };

  const saveDestinationForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!destFormData.name.trim()) return alert("Destination Name is required.");
    const destId = destFormData.id || destFormData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const slug = destFormData.slug || destId;
    const key = destFormData.name;

    const updatedDest = {
      ...destFormData,
      id: destId,
      slug: slug
    };

    setDb(prev => ({
      ...prev,
      destinations: {
        ...prev.destinations,
        [key]: updatedDest
      }
    }));
    setHasUnsavedChanges(true);
    closeForm();
  };

  const saveVisaForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!visaFormData.destinationCountry.trim()) return alert("Destination Country is required.");
    if (!visaFormData.passportNationality.trim()) return alert("Passport Nationality is required.");
    const visaId = visaFormData.id || ("visa-" + Date.now());
    const updatedVisa = { ...visaFormData, id: visaId };

    setDb(prev => {
      const existing = [...prev.visaRecords];
      const idx = existing.findIndex(v => v.id === visaId);
      if (idx >= 0) existing[idx] = updatedVisa;
      else existing.unshift(updatedVisa);
      return { ...prev, visaRecords: existing };
    });
    setHasUnsavedChanges(true);
    closeForm();
  };

  // --- DELETE EXECUTION ---
  const executeDelete = () => {
    if (!deleteTarget) return;

    if (deleteTarget.type === "package") {
      setDb(prev => ({
        ...prev,
        packages: prev.packages.filter(p => p.id !== deleteTarget.id)
      }));
    } else if (deleteTarget.type === "destination") {
      setDb(prev => {
        const next = { ...prev.destinations };
        delete next[deleteTarget.title];
        // Also remove if keyed by id
        delete next[deleteTarget.id];
        return { ...prev, destinations: next };
      });
    } else if (deleteTarget.type === "visa") {
      setDb(prev => ({
        ...prev,
        visaRecords: prev.visaRecords.filter(v => v.id !== deleteTarget.id)
      }));
    }

    setHasUnsavedChanges(true);
    setDeleteTarget(null);
  };

  // --- ITINERARY DAY ACTIONS ---
  const addItineraryDay = () => {
    const nextDayNum = (pkgFormData.itinerary?.length || 0) + 1;
    setPkgFormData(prev => ({
      ...prev,
      itinerary: [
        ...(prev.itinerary || []),
        {
          day: nextDayNum,
          title: `Day ${nextDayNum} Exploration`,
          subtitle: "Sightseeing & Leisure",
          image: "",
          activities: [
            "Morning breakfast at hotel",
            "Guided sightseeing and photo stops",
            "Evening leisure and dinner"
          ]
        }
      ]
    }));
  };

  const removeItineraryDay = (index: number) => {
    setPkgFormData(prev => {
      const nextItin = (prev.itinerary || []).filter((_, i) => i !== index);
      // Re-number days
      return {
        ...prev,
        itinerary: nextItin.map((item, i) => ({ ...item, day: i + 1 }))
      };
    });
  };

  const updateItineraryDay = (index: number, field: keyof ItineraryDay, value: any) => {
    setPkgFormData(prev => {
      const nextItin = [...(prev.itinerary || [])];
      if (nextItin[index]) {
        nextItin[index] = { ...nextItin[index], [field]: value };
      }
      return { ...prev, itinerary: nextItin };
    });
  };

  // --- LOGIN SCREEN ---
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-navy-950 flex flex-col justify-center items-center px-4 relative overflow-hidden">
        <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-yellow-500/10 rounded-full blur-[140px]"></div>
        <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[140px]"></div>

        <div className="w-full max-w-md glass-card p-8 md:p-10 rounded-3xl border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.8)] z-10">
          <div className="text-center mb-8">
            <span className="text-xs uppercase tracking-widest text-yellow-400 font-bold px-3 py-1 rounded-full bg-white/5 border border-white/10">
              Admin Portal
            </span>
            <h1 className="text-3xl font-black text-white mt-4">MHM Travels</h1>
            <p className="text-slate-400 text-sm mt-1">Sign in to manage packages, destinations & visa guide</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                Secret Access Token
              </label>
              <input
                type="password"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                placeholder="Enter admin password..."
                className="w-full p-4 rounded-xl bg-black/50 border border-white/10 text-white placeholder:text-slate-500 text-sm outline-none focus:border-yellow-400 transition"
                required
              />
            </div>

            {loginError && (
              <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-2">
                <AlertCircle size={16} className="shrink-0" />
                <span>{loginError}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 rounded-xl bg-gradient-to-r from-yellow-400 to-yellow-600 text-slate-950 font-black text-sm uppercase tracking-wider hover:shadow-[0_0_25px_rgba(250,204,21,0.4)] transition cursor-pointer disabled:opacity-50"
            >
              {isLoading ? "Authenticating..." : "Unlock Dashboard"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-navy-950 text-white flex flex-col">
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 bg-navy-950/90 border-b border-white/10 backdrop-blur-md px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-xl font-black tracking-tight text-white">MHM <span className="text-yellow-400">Admin</span></span>
          </Link>
          <div className="hidden md:flex items-center gap-2 ml-4">
            <button
              onClick={() => setActiveTab("packages")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
                activeTab === "packages"
                  ? "bg-yellow-400 text-slate-950 shadow-md"
                  : "text-slate-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <Package size={15} />
              Tour Packages ({db.packages.length})
            </button>

            <button
              onClick={() => setActiveTab("destinations")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
                activeTab === "destinations"
                  ? "bg-yellow-400 text-slate-950 shadow-md"
                  : "text-slate-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <Compass size={15} />
              Destinations ({destinationList.length})
            </button>

            <button
              onClick={() => setActiveTab("visas")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
                activeTab === "visas"
                  ? "bg-yellow-400 text-slate-950 shadow-md"
                  : "text-slate-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <ShieldCheck size={15} />
              Visa Management ({db.visaRecords.length})
            </button>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {hasUnsavedChanges && (
            <span className="hidden lg:flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 animate-pulse">
              ● Unsaved Changes
            </span>
          )}

          <button
            onClick={handleSaveToServer}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-400 hover:to-green-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-emerald-500/20 transition cursor-pointer"
          >
            <Save size={16} />
            <span>Save to Server</span>
          </button>

          <Link
            href="/"
            target="_blank"
            className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition"
            title="Preview Live Site"
          >
            <ExternalLink size={16} />
          </Link>

          <button
            onClick={() => setIsAuthenticated(false)}
            className="p-2.5 rounded-xl bg-white/5 hover:bg-red-500/20 text-slate-400 hover:text-red-400 transition"
            title="Log Out"
          >
            <LogOut size={16} />
          </button>
        </div>
      </header>

      {/* Mobile Tab Bar */}
      <div className="flex md:hidden border-b border-white/10 bg-navy-900/60 p-2 gap-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab("packages")}
          className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold whitespace-nowrap ${
            activeTab === "packages" ? "bg-yellow-400 text-slate-950" : "text-slate-400"
          }`}
        >
          Packages ({db.packages.length})
        </button>
        <button
          onClick={() => setActiveTab("destinations")}
          className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold whitespace-nowrap ${
            activeTab === "destinations" ? "bg-yellow-400 text-slate-950" : "text-slate-400"
          }`}
        >
          Destinations ({destinationList.length})
        </button>
        <button
          onClick={() => setActiveTab("visas")}
          className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold whitespace-nowrap ${
            activeTab === "visas" ? "bg-yellow-400 text-slate-950" : "text-slate-400"
          }`}
        >
          Visa ({db.visaRecords.length})
        </button>
      </div>

      {/* Notification Toast */}
      {status.message && (
        <div className={`py-2.5 px-6 text-center text-xs font-bold flex items-center justify-center gap-2 ${
          status.type === "success" ? "bg-emerald-600 text-white" :
          status.type === "error" ? "bg-red-600 text-white" : "bg-blue-600 text-white"
        }`}>
          {status.type === "success" && <CheckCircle2 size={16} />}
          {status.type === "error" && <AlertCircle size={16} />}
          <span>{status.message}</span>
        </div>
      )}

      {/* Main Admin Workspace */}
      <main className="flex-1 p-6 md:p-8 max-w-7xl mx-auto w-full">
        {/* ========================================================
            TAB 1: TOUR PACKAGES
        ======================================================== */}
        {activeTab === "packages" && (
          <div>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
              <div>
                <h2 className="text-2xl md:text-3xl font-black text-white">Tour Packages</h2>
                <p className="text-slate-400 text-sm mt-1">Manage luxury travel packages, day-by-day itineraries, and destination links.</p>
              </div>

              <div className="flex items-center gap-3">
                <div className="relative">
                  <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search packages..."
                    value={packageSearch}
                    onChange={(e) => setPackageSearch(e.target.value)}
                    className="pl-9 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs outline-none focus:border-yellow-400 w-52 md:w-64"
                  />
                </div>
                <button
                  onClick={() => openPackageForm("add")}
                  className="px-4 py-2.5 rounded-xl bg-yellow-400 hover:bg-yellow-300 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition cursor-pointer"
                >
                  <Plus size={16} />
                  <span>Create Package</span>
                </button>
              </div>
            </div>

            {/* Packages Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {db.packages
                .filter(p => p.title.toLowerCase().includes(packageSearch.toLowerCase()) || p.destinations.toLowerCase().includes(packageSearch.toLowerCase()))
                .map((pkg) => (
                  <div
                    key={pkg.id}
                    className="glass-card rounded-2xl overflow-hidden border border-white/10 flex flex-col justify-between group hover:border-yellow-400/40 transition"
                  >
                    <div className="relative h-44 w-full">
                      <img src={pkg.image} alt={pkg.title} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-transparent to-transparent"></div>
                      <span className="absolute top-3 left-3 px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase bg-yellow-400 text-slate-950">
                        {pkg.category}
                      </span>
                      <span className="absolute top-3 right-3 px-2 py-0.5 rounded-md text-[11px] font-bold bg-black/60 text-white backdrop-blur-md">
                        {pkg.duration}
                      </span>
                    </div>

                    <div className="p-5 flex-1 flex flex-col justify-between">
                      <div>
                        <h3 className="font-bold text-white text-base line-clamp-1 mb-1">{pkg.title}</h3>
                        <p className="text-xs text-slate-400 line-clamp-1 mb-3">{pkg.destinations}</p>

                        {/* Associated destination tags */}
                        {pkg.destinationIds && pkg.destinationIds.length > 0 && (
                          <div className="flex flex-wrap gap-1 mb-3">
                            {pkg.destinationIds.map(dId => (
                              <span key={dId} className="px-2 py-0.5 rounded text-[10px] font-medium bg-yellow-400/10 text-yellow-300 border border-yellow-400/20">
                                {db.destinations[dId]?.name || dId}
                              </span>
                            ))}
                          </div>
                        )}

                        <div className="text-xs text-slate-400 mb-4">
                          <span>Itinerary: </span>
                          <span className="font-bold text-white">{(pkg.itinerary || []).length} Days</span>
                        </div>
                      </div>

                      <div className="pt-3 border-t border-white/10 flex items-center justify-between">
                        <span className="text-sm font-black text-white">{pkg.price}</span>
                        <div className="flex items-center gap-1.5">
                          <Link
                            href={`/package?id=${pkg.id}`}
                            target="_blank"
                            className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition"
                            title="Preview Page"
                          >
                            <Eye size={14} />
                          </Link>
                          <button
                            onClick={() => openPackageForm("edit", pkg)}
                            className="p-2 rounded-lg bg-white/5 hover:bg-yellow-400 hover:text-slate-950 text-slate-400 transition cursor-pointer"
                            title="Edit Package"
                          >
                            <Edit2 size={14} />
                          </button>
                          <button
                            onClick={() => setDeleteTarget({ type: "package", id: pkg.id, title: pkg.title })}
                            className="p-2 rounded-lg bg-white/5 hover:bg-red-500/20 text-slate-400 hover:text-red-400 transition cursor-pointer"
                            title="Delete Package"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* ========================================================
            TAB 2: DESTINATIONS MANAGEMENT
        ======================================================== */}
        {activeTab === "destinations" && (
          <div>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
              <div>
                <h2 className="text-2xl md:text-3xl font-black text-white">Destinations</h2>
                <p className="text-slate-400 text-sm mt-1">Manage countries, cities, attractions, travel highlights, and linked packages.</p>
              </div>

              <div className="flex items-center gap-3 flex-wrap">
                <div className="relative">
                  <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search destinations..."
                    value={destinationSearch}
                    onChange={(e) => setDestinationSearch(e.target.value)}
                    className="pl-9 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs outline-none focus:border-yellow-400 w-48 md:w-60"
                  />
                </div>

                <select
                  value={destTypeFilter}
                  onChange={(e) => setDestTypeFilter(e.target.value)}
                  className="px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs outline-none focus:border-yellow-400"
                >
                  <option value="All" className="bg-navy-950">All Types</option>
                  <option value="Country" className="bg-navy-950">Countries</option>
                  <option value="City" className="bg-navy-950">Cities</option>
                  <option value="Island" className="bg-navy-950">Islands</option>
                  <option value="Region" className="bg-navy-950">Regions</option>
                </select>

                <button
                  onClick={() => openDestinationForm("add")}
                  className="px-4 py-2.5 rounded-xl bg-yellow-400 hover:bg-yellow-300 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition cursor-pointer"
                >
                  <Plus size={16} />
                  <span>Add Destination</span>
                </button>
              </div>
            </div>

            {/* Destinations Table / Cards */}
            <div className="glass-card rounded-2xl border border-white/10 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-white/5 border-b border-white/10 text-slate-400 uppercase tracking-wider text-[10px]">
                    <tr>
                      <th className="py-3.5 px-4 font-semibold">Destination</th>
                      <th className="py-3.5 px-4 font-semibold">Type</th>
                      <th className="py-3.5 px-4 font-semibold">Rating</th>
                      <th className="py-3.5 px-4 font-semibold">Packages</th>
                      <th className="py-3.5 px-4 font-semibold">Best Time</th>
                      <th className="py-3.5 px-4 font-semibold">Status</th>
                      <th className="py-3.5 px-4 font-semibold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 text-slate-300">
                    {destinationList
                      .filter(d => {
                        const matchesSearch = d.name.toLowerCase().includes(destinationSearch.toLowerCase()) || 
                          (d.topCities || "").toLowerCase().includes(destinationSearch.toLowerCase());
                        if (!matchesSearch) return false;
                        if (destTypeFilter !== "All" && d.type !== destTypeFilter) return false;
                        return true;
                      })
                      .map((dest) => {
                        const pkgCount = getPackageCountForDest(dest.id, dest.name);
                        const slug = dest.slug || dest.id;

                        return (
                          <tr key={dest.id} className="hover:bg-white/5 transition">
                            <td className="py-3.5 px-4">
                              <div className="flex items-center gap-3">
                                <img
                                  src={dest.image}
                                  alt={dest.name}
                                  className="w-10 h-10 rounded-lg object-cover border border-white/10"
                                />
                                <div>
                                  <div className="flex items-center gap-1.5 font-bold text-white text-sm">
                                    <span>{dest.flag}</span>
                                    <span>{dest.name}</span>
                                    {dest.featured && (
                                      <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-yellow-400/20 text-yellow-300 border border-yellow-400/30">
                                        Featured
                                      </span>
                                    )}
                                  </div>
                                  <span className="text-[11px] text-slate-400 truncate max-w-xs block">
                                    {dest.topCities || dest.shortDescription || "No hubs listed"}
                                  </span>
                                </div>
                              </div>
                            </td>

                            <td className="py-3.5 px-4">
                              <span className="px-2.5 py-1 rounded-md text-[10px] font-bold bg-white/10 text-slate-300">
                                {dest.type || "Country"}
                              </span>
                            </td>

                            <td className="py-3.5 px-4">
                              <div className="flex items-center gap-1 font-bold text-yellow-400">
                                <Star size={12} className="fill-yellow-400" />
                                <span>{dest.rating || 4.8}</span>
                              </div>
                            </td>

                            <td className="py-3.5 px-4">
                              <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold ${
                                pkgCount > 0 
                                  ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30" 
                                  : "bg-slate-800 text-slate-400"
                              }`}>
                                {pkgCount} {pkgCount === 1 ? 'Package' : 'Packages'}
                              </span>
                            </td>

                            <td className="py-3.5 px-4 text-slate-400">
                              {dest.bestTime || "Year-Round"}
                            </td>

                            <td className="py-3.5 px-4">
                              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                dest.published !== false 
                                  ? "bg-green-500/20 text-green-300" 
                                  : "bg-amber-500/20 text-amber-300"
                              }`}>
                                {dest.published !== false ? "Published" : "Draft"}
                              </span>
                            </td>

                            <td className="py-3.5 px-4 text-right">
                              <div className="flex items-center justify-end gap-1.5">
                                <Link
                                  href={`/destinations/${slug}`}
                                  target="_blank"
                                  className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition"
                                  title="View Public Page"
                                >
                                  <Eye size={13} />
                                </Link>
                                <button
                                  onClick={() => openDestinationForm("edit", dest)}
                                  className="p-1.5 rounded-lg bg-white/5 hover:bg-yellow-400 hover:text-slate-950 text-slate-400 transition cursor-pointer"
                                  title="Edit Destination"
                                >
                                  <Edit2 size={13} />
                                </button>
                                <button
                                  onClick={() => setDeleteTarget({ type: "destination", id: dest.id, title: dest.name })}
                                  className="p-1.5 rounded-lg bg-white/5 hover:bg-red-500/20 text-slate-400 hover:text-red-400 transition cursor-pointer"
                                  title="Delete Destination"
                                >
                                  <Trash2 size={13} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================
            TAB 3: VISA MANAGEMENT
        ======================================================== */}
        {activeTab === "visas" && (
          <div>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
              <div>
                <h2 className="text-2xl md:text-3xl font-black text-white">Visa Management</h2>
                <p className="text-slate-400 text-sm mt-1">Configure verified visa requirements by Destination Country and Passport Nationality.</p>
              </div>

              <div className="flex items-center gap-3 flex-wrap">
                <div className="relative">
                  <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search country / nationality..."
                    value={visaSearch}
                    onChange={(e) => setVisaSearch(e.target.value)}
                    className="pl-9 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs outline-none focus:border-yellow-400 w-44 md:w-56"
                  />
                </div>

                <select
                  value={visaStatusFilter}
                  onChange={(e) => setVisaStatusFilter(e.target.value)}
                  className="px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs outline-none focus:border-yellow-400"
                >
                  <option value="All" className="bg-navy-950">All Requirements</option>
                  <option value="Visa-Free" className="bg-navy-950">Visa-Free</option>
                  <option value="eVisa / ETA" className="bg-navy-950">eVisa / ETA</option>
                  <option value="Visa on Arrival" className="bg-navy-950">Visa on Arrival</option>
                  <option value="Visa Required" className="bg-navy-950">Visa Required</option>
                </select>

                <button
                  onClick={() => openVisaForm("add")}
                  className="px-4 py-2.5 rounded-xl bg-yellow-400 hover:bg-yellow-300 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition cursor-pointer"
                >
                  <Plus size={16} />
                  <span>Add Visa Record</span>
                </button>
              </div>
            </div>

            {/* Visa Records Table */}
            <div className="glass-card rounded-2xl border border-white/10 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-white/5 border-b border-white/10 text-slate-400 uppercase tracking-wider text-[10px]">
                    <tr>
                      <th className="py-3.5 px-4 font-semibold">Destination Country</th>
                      <th className="py-3.5 px-4 font-semibold">Passport Nationality</th>
                      <th className="py-3.5 px-4 font-semibold">Purpose</th>
                      <th className="py-3.5 px-4 font-semibold">Requirement</th>
                      <th className="py-3.5 px-4 font-semibold">Processing & Fees</th>
                      <th className="py-3.5 px-4 font-semibold">Last Verified</th>
                      <th className="py-3.5 px-4 font-semibold">Status</th>
                      <th className="py-3.5 px-4 font-semibold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 text-slate-300">
                    {db.visaRecords
                      .filter(v => {
                        const s = visaSearch.toLowerCase();
                        const matches = v.destinationCountry.toLowerCase().includes(s) ||
                                        v.passportNationality.toLowerCase().includes(s) ||
                                        v.visaCategory.toLowerCase().includes(s);
                        if (!matches) return false;
                        if (visaStatusFilter !== "All" && v.entryRequirementStatus !== visaStatusFilter) return false;
                        return true;
                      })
                      .map((visa) => {
                        return (
                          <tr key={visa.id} className="hover:bg-white/5 transition">
                            <td className="py-3.5 px-4 font-bold text-white">
                              <span>{visa.destinationCountry}</span>
                              <span className="text-slate-500 text-[10px] ml-1.5">({visa.destinationCountryCode})</span>
                            </td>

                            <td className="py-3.5 px-4 text-slate-300">
                              <span>{visa.passportNationality}</span>
                              <span className="text-slate-500 text-[10px] ml-1.5">({visa.passportCountryCode})</span>
                            </td>

                            <td className="py-3.5 px-4">
                              <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-white/5 text-slate-400">
                                {visa.travelPurpose}
                              </span>
                            </td>

                            <td className="py-3.5 px-4">
                              <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold ${
                                visa.entryRequirementStatus === "Visa-Free" ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30" :
                                visa.entryRequirementStatus === "eVisa / ETA" ? "bg-blue-500/20 text-blue-300 border border-blue-500/30" :
                                visa.entryRequirementStatus === "Visa on Arrival" ? "bg-amber-500/20 text-amber-300 border border-amber-500/30" :
                                "bg-purple-500/20 text-purple-300 border border-purple-500/30"
                              }`}>
                                {visa.entryRequirementStatus}
                              </span>
                            </td>

                            <td className="py-3.5 px-4">
                              <div className="text-[11px] font-medium text-white">{visa.processingTime || "Standard"}</div>
                              <div className="text-[10px] text-slate-400">{visa.fees || "N/A"}</div>
                            </td>

                            <td className="py-3.5 px-4 text-slate-400 text-[11px]">
                              {visa.verifiedDate || "Not recorded"}
                            </td>

                            <td className="py-3.5 px-4">
                              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                visa.published !== false ? "bg-green-500/20 text-green-300" : "bg-amber-500/20 text-amber-300"
                              }`}>
                                {visa.published !== false ? "Published" : "Draft"}
                              </span>
                            </td>

                            <td className="py-3.5 px-4 text-right">
                              <div className="flex items-center justify-end gap-1.5">
                                <Link
                                  href={`/visa?dest=${encodeURIComponent(visa.destinationCountry.toLowerCase())}`}
                                  target="_blank"
                                  className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition"
                                  title="Preview in Visa Guide"
                                >
                                  <Eye size={13} />
                                </Link>
                                <button
                                  onClick={() => openVisaForm("edit", visa)}
                                  className="p-1.5 rounded-lg bg-white/5 hover:bg-yellow-400 hover:text-slate-950 text-slate-400 transition cursor-pointer"
                                  title="Edit Visa Info"
                                >
                                  <Edit2 size={13} />
                                </button>
                                <button
                                  onClick={() => setDeleteTarget({ type: "visa", id: visa.id, title: `${visa.destinationCountry} (${visa.passportNationality})` })}
                                  className="p-1.5 rounded-lg bg-white/5 hover:bg-red-500/20 text-slate-400 hover:text-red-400 transition cursor-pointer"
                                  title="Delete Visa Record"
                                >
                                  <Trash2 size={13} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* ========================================================
          MODAL 1: PACKAGE EDITOR
      ======================================================== */}
      {editMode && activeTab === "packages" && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-navy-900 border border-white/10 w-full max-w-4xl max-h-[90vh] rounded-3xl overflow-hidden flex flex-col shadow-2xl">
            <div className="p-6 border-b border-white/10 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-white">
                  {pkgFormData.id ? "Edit Tour Package" : "Create Tour Package"}
                </h3>
                <p className="text-xs text-slate-400">Configure itinerary, highlights, and link destinations.</p>
              </div>
              <button onClick={closeForm} className="p-2 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition">
                <X size={18} />
              </button>
            </div>

            {/* Sub-tabs inside Package Editor */}
            <div className="flex border-b border-white/10 px-6 gap-2 bg-navy-950/60 overflow-x-auto">
              {[
                { id: "general", label: "General Info" },
                { id: "destinations", label: "Linked Destinations" },
                { id: "overview", label: "Overview & Features" },
                { id: "itinerary", label: "Day-by-Day Itinerary" },
                { id: "inclusions", label: "Inclusions / Exclusions" },
                { id: "tips", label: "Travel Tips" }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setPkgModalTab(tab.id as any)}
                  className={`py-3 px-3 text-xs font-bold whitespace-nowrap border-b-2 transition ${
                    pkgModalTab === tab.id
                      ? "border-yellow-400 text-yellow-400"
                      : "border-transparent text-slate-400 hover:text-white"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <form onSubmit={savePackageForm} className="p-6 overflow-y-auto flex-1 space-y-6">
              {/* TAB: GENERAL */}
              {pkgModalTab === "general" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Package Title *</label>
                    <input
                      type="text"
                      value={pkgFormData.title}
                      onChange={(e) => setPkgFormData({ ...pkgFormData, title: e.target.value })}
                      placeholder="e.g. Natural Wonders of New Zealand – 10 Nights / 11 Days"
                      className="w-full p-3 bg-black/40 border border-white/10 rounded-xl text-white text-sm outline-none focus:border-yellow-400"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Category</label>
                    <select
                      value={pkgFormData.category}
                      onChange={(e) => setPkgFormData({ ...pkgFormData, category: e.target.value })}
                      className="w-full p-3 bg-black/40 border border-white/10 rounded-xl text-white text-sm outline-none focus:border-yellow-400"
                    >
                      <option value="Luxury" className="bg-navy-950">Luxury</option>
                      <option value="Honeymoon" className="bg-navy-950">Honeymoon</option>
                      <option value="Family" className="bg-navy-950">Family</option>
                      <option value="Adventure" className="bg-navy-950">Adventure</option>
                      <option value="Cultural" className="bg-navy-950">Cultural</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Duration *</label>
                    <input
                      type="text"
                      value={pkgFormData.duration}
                      onChange={(e) => setPkgFormData({ ...pkgFormData, duration: e.target.value })}
                      placeholder="e.g. 11 Days / 10 Nights"
                      className="w-full p-3 bg-black/40 border border-white/10 rounded-xl text-white text-sm outline-none focus:border-yellow-400"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Starting Price *</label>
                    <input
                      type="text"
                      value={pkgFormData.price}
                      onChange={(e) => setPkgFormData({ ...pkgFormData, price: e.target.value })}
                      placeholder="e.g. ₹2,49,999"
                      className="w-full p-3 bg-black/40 border border-white/10 rounded-xl text-white text-sm outline-none focus:border-yellow-400"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Rating (1.0 - 5.0)</label>
                    <input
                      type="number"
                      step="0.1"
                      min="1"
                      max="5"
                      value={pkgFormData.rating}
                      onChange={(e) => setPkgFormData({ ...pkgFormData, rating: parseFloat(e.target.value) || 5.0 })}
                      className="w-full p-3 bg-black/40 border border-white/10 rounded-xl text-white text-sm outline-none focus:border-yellow-400"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Summary Destinations Display String</label>
                    <input
                      type="text"
                      value={pkgFormData.destinations}
                      onChange={(e) => setPkgFormData({ ...pkgFormData, destinations: e.target.value })}
                      placeholder="e.g. Auckland • Rotorua • Queenstown • Milford Sound"
                      className="w-full p-3 bg-black/40 border border-white/10 rounded-xl text-white text-sm outline-none focus:border-yellow-400"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Card Image URL *</label>
                    <input
                      type="text"
                      value={pkgFormData.image}
                      onChange={(e) => setPkgFormData({ ...pkgFormData, image: e.target.value })}
                      placeholder="https://images.unsplash.com/..."
                      className="w-full p-3 bg-black/40 border border-white/10 rounded-xl text-white text-sm outline-none focus:border-yellow-400"
                      required
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Hero Banner Image URL (Optional)</label>
                    <input
                      type="text"
                      value={pkgFormData.heroImage || ""}
                      onChange={(e) => setPkgFormData({ ...pkgFormData, heroImage: e.target.value })}
                      placeholder="https://images.unsplash.com/..."
                      className="w-full p-3 bg-black/40 border border-white/10 rounded-xl text-white text-sm outline-none focus:border-yellow-400"
                    />
                  </div>

                  <div className="flex items-center gap-2 pt-2">
                    <input
                      type="checkbox"
                      id="pkgPublished"
                      checked={pkgFormData.published !== false}
                      onChange={(e) => setPkgFormData({ ...pkgFormData, published: e.target.checked })}
                      className="w-4 h-4 rounded text-yellow-400"
                    />
                    <label htmlFor="pkgPublished" className="text-xs text-slate-300 font-semibold cursor-pointer">
                      Published on Live Website
                    </label>
                  </div>
                </div>
              )}

              {/* TAB: LINKED DESTINATIONS (MODULE 1 CRITICAL REQUIREMENT) */}
              {pkgModalTab === "destinations" && (
                <div className="space-y-6">
                  <div className="p-4 rounded-2xl bg-yellow-400/10 border border-yellow-400/20 text-xs text-slate-300">
                    <p className="font-bold text-yellow-300 mb-1">Destination Association</p>
                    <p>
                      Associate this tour package with one or multiple destinations. When customers browse any of these destination pages, this package will automatically appear.
                    </p>
                  </div>

                  {/* Selected Tags */}
                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase mb-2">
                      Selected Associated Destinations ({pkgFormData.destinationIds?.length || 0})
                    </label>
                    <div className="flex flex-wrap gap-2 p-3 bg-black/40 border border-white/10 rounded-xl min-h-[50px]">
                      {pkgFormData.destinationIds && pkgFormData.destinationIds.length > 0 ? (
                        pkgFormData.destinationIds.map(dId => {
                          const dest = destinationList.find(d => d.id === dId || d.slug === dId);
                          return (
                            <span
                              key={dId}
                              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-yellow-400 text-slate-950 shadow-sm"
                            >
                              {dest?.flag && <span>{dest.flag}</span>}
                              <span>{dest?.name || dId}</span>
                              <button
                                type="button"
                                onClick={() => {
                                  setPkgFormData(prev => ({
                                    ...prev,
                                    destinationIds: (prev.destinationIds || []).filter(id => id !== dId)
                                  }));
                                }}
                                className="hover:text-red-700 transition"
                              >
                                <X size={13} />
                              </button>
                            </span>
                          );
                        })
                      ) : (
                        <span className="text-xs text-slate-500 italic p-1">No destinations linked yet. Pick destinations below.</span>
                      )}
                    </div>
                  </div>

                  {/* Available Destinations Selector */}
                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase mb-2">
                      Click to Add Destination
                    </label>
                    <input
                      type="text"
                      placeholder="Filter destinations list..."
                      value={destPickerSearch}
                      onChange={(e) => setDestPickerSearch(e.target.value)}
                      className="w-full p-2.5 bg-black/40 border border-white/10 rounded-xl text-white text-xs mb-3 outline-none focus:border-yellow-400"
                    />
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-56 overflow-y-auto p-1">
                      {destinationList
                        .filter(d => d.name.toLowerCase().includes(destPickerSearch.toLowerCase()))
                        .map(dest => {
                          const isSelected = pkgFormData.destinationIds?.includes(dest.id);
                          return (
                            <button
                              key={dest.id}
                              type="button"
                              onClick={() => {
                                setPkgFormData(prev => {
                                  const current = prev.destinationIds || [];
                                  if (current.includes(dest.id)) {
                                    return { ...prev, destinationIds: current.filter(id => id !== dest.id) };
                                  } else {
                                    return { ...prev, destinationIds: [...current, dest.id] };
                                  }
                                });
                              }}
                              className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center justify-between transition cursor-pointer ${
                                isSelected
                                  ? "bg-yellow-400/20 border-yellow-400 text-yellow-300"
                                  : "bg-white/5 border-white/10 text-slate-300 hover:bg-white/10"
                              }`}
                            >
                              <div className="flex items-center gap-2 truncate">
                                <span>{dest.flag}</span>
                                <span className="truncate">{dest.name}</span>
                              </div>
                              {isSelected ? <Check size={14} className="text-yellow-400 shrink-0" /> : <Plus size={14} className="text-slate-500 shrink-0" />}
                            </button>
                          );
                        })}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB: OVERVIEW & FEATURES */}
              {pkgModalTab === "overview" && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Package Overview Story</label>
                    <textarea
                      rows={5}
                      value={pkgFormData.overview || ""}
                      onChange={(e) => setPkgFormData({ ...pkgFormData, overview: e.target.value })}
                      placeholder="Describe the journey, landscapes, exclusive hotels, and luxury vibes..."
                      className="w-full p-3 bg-black/40 border border-white/10 rounded-xl text-white text-sm outline-none focus:border-yellow-400 leading-relaxed"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Key Features (One feature per line)</label>
                    <textarea
                      rows={4}
                      value={(pkgFormData.features || []).join("\n")}
                      onChange={(e) => setPkgFormData({
                        ...pkgFormData,
                        features: e.target.value.split("\n").map(s => s.trim()).filter(Boolean)
                      })}
                      placeholder="5-Star Handpicked Stays&#10;TranzAlpine Scenic Train Journey&#10;Private Milford Sound Cruise"
                      className="w-full p-3 bg-black/40 border border-white/10 rounded-xl text-white text-sm outline-none focus:border-yellow-400 leading-relaxed"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Trip Highlights (One highlight per line)</label>
                    <textarea
                      rows={4}
                      value={(pkgFormData.highlights || []).join("\n")}
                      onChange={(e) => setPkgFormData({
                        ...pkgFormData,
                        highlights: e.target.value.split("\n").map(s => s.trim()).filter(Boolean)
                      })}
                      placeholder="Guided boat tour through Waitomo Glowworm Caves&#10;Skyline Gondola & Dinner in Queenstown"
                      className="w-full p-3 bg-black/40 border border-white/10 rounded-xl text-white text-sm outline-none focus:border-yellow-400 leading-relaxed"
                    />
                  </div>
                </div>
              )}

              {/* TAB: DAY-BY-DAY ITINERARY */}
              {pkgModalTab === "itinerary" && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase text-slate-400">Days Configured: {pkgFormData.itinerary?.length || 0}</span>
                    <button
                      type="button"
                      onClick={addItineraryDay}
                      className="px-3 py-1.5 rounded-lg bg-yellow-400 text-slate-950 font-bold text-xs flex items-center gap-1 cursor-pointer"
                    >
                      <Plus size={14} /> Add Next Day
                    </button>
                  </div>

                  <div className="space-y-4">
                    {(pkgFormData.itinerary || []).map((dayItem, idx) => (
                      <div key={idx} className="p-4 rounded-2xl bg-black/40 border border-white/10 space-y-3">
                        <div className="flex items-center justify-between pb-2 border-b border-white/10">
                          <span className="text-xs font-black text-yellow-400 uppercase tracking-wider">Day {dayItem.day}</span>
                          <button
                            type="button"
                            onClick={() => removeItineraryDay(idx)}
                            className="p-1 text-slate-400 hover:text-red-400 transition"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-[10px] font-bold text-slate-400 uppercase">Day Title</label>
                            <input
                              type="text"
                              value={dayItem.title}
                              onChange={(e) => updateItineraryDay(idx, "title", e.target.value)}
                              placeholder="e.g. Arrival in Auckland"
                              className="w-full p-2.5 bg-black/40 border border-white/10 rounded-lg text-white text-xs outline-none focus:border-yellow-400"
                            />
                          </div>

                          <div>
                            <label className="block text-[10px] font-bold text-slate-400 uppercase">Subtitle</label>
                            <input
                              type="text"
                              value={dayItem.subtitle || ""}
                              onChange={(e) => updateItineraryDay(idx, "subtitle", e.target.value)}
                              placeholder="e.g. Welcome to the City of Sails"
                              className="w-full p-2.5 bg-black/40 border border-white/10 rounded-lg text-white text-xs outline-none focus:border-yellow-400"
                            />
                          </div>

                          <div className="md:col-span-2">
                            <label className="block text-[10px] font-bold text-slate-400 uppercase">Day Photo URL</label>
                            <input
                              type="text"
                              value={dayItem.image || ""}
                              onChange={(e) => updateItineraryDay(idx, "image", e.target.value)}
                              placeholder="https://images.unsplash.com/..."
                              className="w-full p-2.5 bg-black/40 border border-white/10 rounded-lg text-white text-xs outline-none focus:border-yellow-400"
                            />
                          </div>

                          <div className="md:col-span-2">
                            <label className="block text-[10px] font-bold text-slate-400 uppercase">Activities (One activity per line)</label>
                            <textarea
                              rows={3}
                              value={(dayItem.activities || []).join("\n")}
                              onChange={(e) => updateItineraryDay(idx, "activities", e.target.value.split("\n").map(s => s.trim()).filter(Boolean))}
                              placeholder="Meet & greet at Airport&#10;Transfer to hotel & check-in"
                              className="w-full p-2.5 bg-black/40 border border-white/10 rounded-lg text-white text-xs outline-none focus:border-yellow-400"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB: INCLUSIONS & EXCLUSIONS */}
              {pkgModalTab === "inclusions" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-emerald-400 uppercase mb-1">What's Included (One per line)</label>
                    <textarea
                      rows={8}
                      value={(pkgFormData.inclusions || []).join("\n")}
                      onChange={(e) => setPkgFormData({
                        ...pkgFormData,
                        inclusions: e.target.value.split("\n").map(s => s.trim()).filter(Boolean)
                      })}
                      className="w-full p-3 bg-black/40 border border-white/10 rounded-xl text-white text-xs outline-none focus:border-emerald-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-red-400 uppercase mb-1">What's Excluded (One per line)</label>
                    <textarea
                      rows={8}
                      value={(pkgFormData.exclusions || []).join("\n")}
                      onChange={(e) => setPkgFormData({
                        ...pkgFormData,
                        exclusions: e.target.value.split("\n").map(s => s.trim()).filter(Boolean)
                      })}
                      className="w-full p-3 bg-black/40 border border-white/10 rounded-xl text-white text-xs outline-none focus:border-red-400"
                    />
                  </div>
                </div>
              )}

              {/* TAB: TRAVEL TIPS */}
              {pkgModalTab === "tips" && (
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Essential Travel Tips (One per line)</label>
                  <textarea
                    rows={8}
                    value={(pkgFormData.travelTips || []).join("\n")}
                    onChange={(e) => setPkgFormData({
                      ...pkgFormData,
                      travelTips: e.target.value.split("\n").map(s => s.trim()).filter(Boolean)
                    })}
                    className="w-full p-3 bg-black/40 border border-white/10 rounded-xl text-white text-xs outline-none focus:border-yellow-400"
                  />
                </div>
              )}

              <div className="pt-4 border-t border-white/10 flex justify-between items-center">
                <button type="button" onClick={closeForm} className="px-5 py-2.5 rounded-xl font-medium text-slate-400 hover:text-white text-xs">
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-yellow-400 text-slate-950 font-black text-xs hover:bg-yellow-300 transition"
                >
                  Save Package
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================
          MODAL 2: DESTINATION EDITOR
      ======================================================== */}
      {editMode && activeTab === "destinations" && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-navy-900 border border-white/10 w-full max-w-4xl max-h-[90vh] rounded-3xl overflow-hidden flex flex-col shadow-2xl">
            <div className="p-6 border-b border-white/10 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-white">
                  {destFormData.id ? `Edit ${destFormData.name}` : "Add New Destination"}
                </h3>
                <p className="text-xs text-slate-400">Configure destination hero, travel facts, attractions, and SEO.</p>
              </div>
              <button onClick={closeForm} className="p-2 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition">
                <X size={18} />
              </button>
            </div>

            <div className="flex border-b border-white/10 px-6 gap-2 bg-navy-950/60 overflow-x-auto">
              {[
                { id: "basic", label: "Basic Details" },
                { id: "media", label: "Images & Gallery" },
                { id: "content", label: "Description & Highlights" },
                { id: "facts", label: "Travel Facts & Hubs" },
                { id: "seo", label: "SEO & Visibility" }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setDestModalTab(tab.id as any)}
                  className={`py-3 px-3 text-xs font-bold whitespace-nowrap border-b-2 transition ${
                    destModalTab === tab.id
                      ? "border-yellow-400 text-yellow-400"
                      : "border-transparent text-slate-400 hover:text-white"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <form onSubmit={saveDestinationForm} className="p-6 overflow-y-auto flex-1 space-y-6">
              {/* TAB: BASIC */}
              {destModalTab === "basic" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Destination Name *</label>
                    <input
                      type="text"
                      value={destFormData.name}
                      onChange={(e) => {
                        const name = e.target.value;
                        const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
                        setDestFormData({ ...destFormData, name, slug: destFormData.slug || slug, id: destFormData.id || slug });
                      }}
                      placeholder="e.g. New Zealand"
                      className="w-full p-3 bg-black/40 border border-white/10 rounded-xl text-white text-sm outline-none focus:border-yellow-400"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase mb-1">SEO URL Slug *</label>
                    <input
                      type="text"
                      value={destFormData.slug || ""}
                      onChange={(e) => setDestFormData({ ...destFormData, slug: e.target.value })}
                      placeholder="e.g. new-zealand"
                      className="w-full p-3 bg-black/40 border border-white/10 rounded-xl text-white text-sm outline-none focus:border-yellow-400"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Destination Type</label>
                    <select
                      value={destFormData.type || "Country"}
                      onChange={(e) => setDestFormData({ ...destFormData, type: e.target.value as DestinationType })}
                      className="w-full p-3 bg-black/40 border border-white/10 rounded-xl text-white text-sm outline-none focus:border-yellow-400"
                    >
                      <option value="Country" className="bg-navy-950">Country</option>
                      <option value="City" className="bg-navy-950">City</option>
                      <option value="Island" className="bg-navy-950">Island</option>
                      <option value="Region" className="bg-navy-950">Region</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Parent Country (If city or island)</label>
                    <input
                      type="text"
                      value={destFormData.parentCountry || ""}
                      onChange={(e) => setDestFormData({ ...destFormData, parentCountry: e.target.value })}
                      placeholder="e.g. Indonesia for Bali, UAE for Dubai"
                      className="w-full p-3 bg-black/40 border border-white/10 rounded-xl text-white text-sm outline-none focus:border-yellow-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Flag Emoji</label>
                    <input
                      type="text"
                      value={destFormData.flag}
                      onChange={(e) => setDestFormData({ ...destFormData, flag: e.target.value })}
                      placeholder="e.g. 🇳🇿"
                      className="w-full p-3 bg-black/40 border border-white/10 rounded-xl text-white text-sm outline-none focus:border-yellow-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Rating & Reviews Count</label>
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="number"
                        step="0.1"
                        min="1"
                        max="5"
                        value={destFormData.rating}
                        onChange={(e) => setDestFormData({ ...destFormData, rating: parseFloat(e.target.value) || 4.8 })}
                        placeholder="Rating (4.8)"
                        className="p-3 bg-black/40 border border-white/10 rounded-xl text-white text-sm outline-none focus:border-yellow-400"
                      />
                      <input
                        type="text"
                        value={destFormData.reviews}
                        onChange={(e) => setDestFormData({ ...destFormData, reviews: e.target.value })}
                        placeholder="Reviews (1,250)"
                        className="p-3 bg-black/40 border border-white/10 rounded-xl text-white text-sm outline-none focus:border-yellow-400"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* TAB: MEDIA */}
              {destModalTab === "media" && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Cover Image URL *</label>
                    <input
                      type="text"
                      value={destFormData.image}
                      onChange={(e) => setDestFormData({ ...destFormData, image: e.target.value })}
                      placeholder="https://images.unsplash.com/..."
                      className="w-full p-3 bg-black/40 border border-white/10 rounded-xl text-white text-sm outline-none focus:border-yellow-400"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Hero Banner Image URL (Optional)</label>
                    <input
                      type="text"
                      value={destFormData.heroImage || ""}
                      onChange={(e) => setDestFormData({ ...destFormData, heroImage: e.target.value })}
                      placeholder="https://images.unsplash.com/..."
                      className="w-full p-3 bg-black/40 border border-white/10 rounded-xl text-white text-sm outline-none focus:border-yellow-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Photo Gallery URLs (One image URL per line)</label>
                    <textarea
                      rows={5}
                      value={(destFormData.gallery || []).join("\n")}
                      onChange={(e) => setDestFormData({
                        ...destFormData,
                        gallery: e.target.value.split("\n").map(s => s.trim()).filter(Boolean)
                      })}
                      placeholder="https://images.unsplash.com/photo-1&#10;https://images.unsplash.com/photo-2"
                      className="w-full p-3 bg-black/40 border border-white/10 rounded-xl text-white text-xs outline-none focus:border-yellow-400"
                    />
                  </div>
                </div>
              )}

              {/* TAB: CONTENT & HIGHLIGHTS */}
              {destModalTab === "content" && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Short Description (Summary)</label>
                    <textarea
                      rows={2}
                      value={destFormData.shortDescription || ""}
                      onChange={(e) => setDestFormData({ ...destFormData, shortDescription: e.target.value })}
                      placeholder="One-sentence enticing summary for cards and search results..."
                      className="w-full p-3 bg-black/40 border border-white/10 rounded-xl text-white text-sm outline-none focus:border-yellow-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Full Detailed Description</label>
                    <textarea
                      rows={5}
                      value={destFormData.description || ""}
                      onChange={(e) => setDestFormData({ ...destFormData, description: e.target.value })}
                      placeholder="Full narrative for the destination page..."
                      className="w-full p-3 bg-black/40 border border-white/10 rounded-xl text-white text-sm outline-none focus:border-yellow-400 leading-relaxed"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Travel Highlights (One highlight per line)</label>
                    <textarea
                      rows={4}
                      value={(destFormData.highlights || []).join("\n")}
                      onChange={(e) => setDestFormData({
                        ...destFormData,
                        highlights: e.target.value.split("\n").map(s => s.trim()).filter(Boolean)
                      })}
                      placeholder="Cruise through misty cliffs of Milford Sound fjord&#10;Glide on underground glowworm rivers"
                      className="w-full p-3 bg-black/40 border border-white/10 rounded-xl text-white text-xs outline-none focus:border-yellow-400"
                    />
                  </div>
                </div>
              )}

              {/* TAB: FACTS */}
              {destModalTab === "facts" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Best Time to Visit</label>
                    <input
                      type="text"
                      value={destFormData.bestTime}
                      onChange={(e) => setDestFormData({ ...destFormData, bestTime: e.target.value })}
                      placeholder="e.g. Nov–Apr / Dec–Feb"
                      className="w-full p-3 bg-black/40 border border-white/10 rounded-xl text-white text-sm outline-none focus:border-yellow-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Recommended Duration</label>
                    <input
                      type="text"
                      value={destFormData.recommendedDuration || destFormData.duration || ""}
                      onChange={(e) => setDestFormData({ ...destFormData, recommendedDuration: e.target.value, duration: e.target.value })}
                      placeholder="e.g. 10 - 14 Days"
                      className="w-full p-3 bg-black/40 border border-white/10 rounded-xl text-white text-sm outline-none focus:border-yellow-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Currency</label>
                    <input
                      type="text"
                      value={destFormData.currency}
                      onChange={(e) => setDestFormData({ ...destFormData, currency: e.target.value })}
                      placeholder="e.g. New Zealand Dollar (NZD)"
                      className="w-full p-3 bg-black/40 border border-white/10 rounded-xl text-white text-sm outline-none focus:border-yellow-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Primary Language</label>
                    <input
                      type="text"
                      value={destFormData.language}
                      onChange={(e) => setDestFormData({ ...destFormData, language: e.target.value })}
                      placeholder="e.g. English / Maori"
                      className="w-full p-3 bg-black/40 border border-white/10 rounded-xl text-white text-sm outline-none focus:border-yellow-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Timezone / Difference</label>
                    <input
                      type="text"
                      value={destFormData.timeZone || destFormData.timeDiff || ""}
                      onChange={(e) => setDestFormData({ ...destFormData, timeZone: e.target.value, timeDiff: e.target.value })}
                      placeholder="e.g. +7.5h IST (NZST)"
                      className="w-full p-3 bg-black/40 border border-white/10 rounded-xl text-white text-sm outline-none focus:border-yellow-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Flight Duration</label>
                    <input
                      type="text"
                      value={destFormData.flightDuration}
                      onChange={(e) => setDestFormData({ ...destFormData, flightDuration: e.target.value })}
                      placeholder="e.g. 16h (1 stop)"
                      className="w-full p-3 bg-black/40 border border-white/10 rounded-xl text-white text-sm outline-none focus:border-yellow-400"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Popular Attractions (Comma separated)</label>
                    <input
                      type="text"
                      value={destFormData.topAttractions}
                      onChange={(e) => setDestFormData({ ...destFormData, topAttractions: e.target.value })}
                      placeholder="e.g. Milford Sound, Waitomo Caves, Hobbiton Movie Set, Franz Josef Glacier"
                      className="w-full p-3 bg-black/40 border border-white/10 rounded-xl text-white text-sm outline-none focus:border-yellow-400"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Top Cities / Regions (Comma separated)</label>
                    <input
                      type="text"
                      value={destFormData.topCities}
                      onChange={(e) => setDestFormData({ ...destFormData, topCities: e.target.value })}
                      placeholder="e.g. Auckland, Queenstown, Rotorua, Christchurch, Wellington"
                      className="w-full p-3 bg-black/40 border border-white/10 rounded-xl text-white text-sm outline-none focus:border-yellow-400"
                    />
                  </div>
                </div>
              )}

              {/* TAB: SEO & VISIBILITY */}
              {destModalTab === "seo" && (
                <div className="space-y-4">
                  <div className="flex items-center gap-6 p-4 rounded-2xl bg-black/40 border border-white/10">
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="destPublished"
                        checked={destFormData.published !== false}
                        onChange={(e) => setDestFormData({ ...destFormData, published: e.target.checked })}
                        className="w-4 h-4 rounded text-yellow-400"
                      />
                      <label htmlFor="destPublished" className="text-xs text-slate-300 font-semibold cursor-pointer">
                        Published on Live Website
                      </label>
                    </div>

                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="destFeatured"
                        checked={destFormData.featured || false}
                        onChange={(e) => setDestFormData({ ...destFormData, featured: e.target.checked })}
                        className="w-4 h-4 rounded text-yellow-400"
                      />
                      <label htmlFor="destFeatured" className="text-xs text-slate-300 font-semibold cursor-pointer">
                        Mark as Featured Destination
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Custom SEO Page Title</label>
                    <input
                      type="text"
                      value={destFormData.seoTitle || ""}
                      onChange={(e) => setDestFormData({ ...destFormData, seoTitle: e.target.value })}
                      placeholder={`e.g. ${destFormData.name} Luxury Tour Packages | MHM Travels`}
                      className="w-full p-3 bg-black/40 border border-white/10 rounded-xl text-white text-sm outline-none focus:border-yellow-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase mb-1">SEO Meta Description</label>
                    <textarea
                      rows={3}
                      value={destFormData.seoDescription || ""}
                      onChange={(e) => setDestFormData({ ...destFormData, seoDescription: e.target.value })}
                      placeholder="High-converting search engine snippet..."
                      className="w-full p-3 bg-black/40 border border-white/10 rounded-xl text-white text-sm outline-none focus:border-yellow-400"
                    />
                  </div>
                </div>
              )}

              <div className="pt-4 border-t border-white/10 flex justify-between items-center">
                <button type="button" onClick={closeForm} className="px-5 py-2.5 rounded-xl font-medium text-slate-400 hover:text-white text-xs">
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-yellow-400 text-slate-950 font-black text-xs hover:bg-yellow-300 transition"
                >
                  Save Destination
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================
          MODAL 3: VISA RECORD EDITOR
      ======================================================== */}
      {editMode && activeTab === "visas" && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-navy-900 border border-white/10 w-full max-w-4xl max-h-[90vh] rounded-3xl overflow-hidden flex flex-col shadow-2xl">
            <div className="p-6 border-b border-white/10 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-white">
                  {visaFormData.id ? "Edit Visa Requirement Record" : "Add Visa Requirement Record"}
                </h3>
                <p className="text-xs text-slate-400">Configure entry rules, document checklists, and application steps.</p>
              </div>
              <button onClick={closeForm} className="p-2 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={saveVisaForm} className="p-6 overflow-y-auto flex-1 space-y-6">
              {/* Basic Pairing */}
              <div className="p-4 rounded-2xl bg-black/40 border border-white/10 space-y-4">
                <span className="text-xs font-black uppercase text-yellow-400 tracking-wider">1. Country & Nationality Matching</span>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-300 uppercase mb-1">Destination Country *</label>
                    <input
                      type="text"
                      value={visaFormData.destinationCountry}
                      onChange={(e) => setVisaFormData({ ...visaFormData, destinationCountry: e.target.value })}
                      placeholder="e.g. Japan"
                      className="w-full p-2.5 bg-black/40 border border-white/10 rounded-xl text-white text-xs outline-none focus:border-yellow-400"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-300 uppercase mb-1">Destination 2-Letter Code</label>
                    <input
                      type="text"
                      maxLength={3}
                      value={visaFormData.destinationCountryCode}
                      onChange={(e) => setVisaFormData({ ...visaFormData, destinationCountryCode: e.target.value.toUpperCase() })}
                      placeholder="e.g. JP"
                      className="w-full p-2.5 bg-black/40 border border-white/10 rounded-xl text-white text-xs uppercase outline-none focus:border-yellow-400"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-300 uppercase mb-1">Travel Purpose</label>
                    <select
                      value={visaFormData.travelPurpose}
                      onChange={(e) => setVisaFormData({ ...visaFormData, travelPurpose: e.target.value as TravelPurpose })}
                      className="w-full p-2.5 bg-black/40 border border-white/10 rounded-xl text-white text-xs outline-none focus:border-yellow-400"
                    >
                      <option value="Tourism" className="bg-navy-950">Tourism</option>
                      <option value="Business" className="bg-navy-950">Business</option>
                      <option value="Transit" className="bg-navy-950">Transit</option>
                      <option value="Other" className="bg-navy-950">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-300 uppercase mb-1">Passport Nationality *</label>
                    <input
                      type="text"
                      value={visaFormData.passportNationality}
                      onChange={(e) => setVisaFormData({ ...visaFormData, passportNationality: e.target.value })}
                      placeholder="e.g. India"
                      className="w-full p-2.5 bg-black/40 border border-white/10 rounded-xl text-white text-xs outline-none focus:border-yellow-400"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-300 uppercase mb-1">Nationality 2-Letter Code</label>
                    <input
                      type="text"
                      maxLength={3}
                      value={visaFormData.passportCountryCode}
                      onChange={(e) => setVisaFormData({ ...visaFormData, passportCountryCode: e.target.value.toUpperCase() })}
                      placeholder="e.g. IN"
                      className="w-full p-2.5 bg-black/40 border border-white/10 rounded-xl text-white text-xs uppercase outline-none focus:border-yellow-400"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-300 uppercase mb-1">Requirement Status *</label>
                    <select
                      value={visaFormData.entryRequirementStatus}
                      onChange={(e) => setVisaFormData({ ...visaFormData, entryRequirementStatus: e.target.value as VisaRequirementStatus })}
                      className="w-full p-2.5 bg-black/40 border border-white/10 rounded-xl text-white text-xs outline-none focus:border-yellow-400"
                    >
                      <option value="Visa Required" className="bg-navy-950">Visa Required (Sticker / VFS)</option>
                      <option value="eVisa / ETA" className="bg-navy-950">eVisa / ETA</option>
                      <option value="Visa on Arrival" className="bg-navy-950">Visa on Arrival</option>
                      <option value="Visa-Free" className="bg-navy-950">Visa-Free</option>
                      <option value="Other" className="bg-navy-950">Other</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Visa Details & Validity */}
              <div className="p-4 rounded-2xl bg-black/40 border border-white/10 space-y-4">
                <span className="text-xs font-black uppercase text-yellow-400 tracking-wider">2. Visa Specs, Timing & Fees</span>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-[11px] font-bold text-slate-300 uppercase mb-1">Official Visa Category Name</label>
                    <input
                      type="text"
                      value={visaFormData.visaCategory}
                      onChange={(e) => setVisaFormData({ ...visaFormData, visaCategory: e.target.value })}
                      placeholder="e.g. Short-Term Tourist eVisa (JAPAN eVISA)"
                      className="w-full p-2.5 bg-black/40 border border-white/10 rounded-xl text-white text-xs outline-none focus:border-yellow-400"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-300 uppercase mb-1">Application Method</label>
                    <select
                      value={visaFormData.applicationMethod || "Online (eVisa)"}
                      onChange={(e) => setVisaFormData({ ...visaFormData, applicationMethod: e.target.value as any })}
                      className="w-full p-2.5 bg-black/40 border border-white/10 rounded-xl text-white text-xs outline-none focus:border-yellow-400"
                    >
                      <option value="Online (eVisa)" className="bg-navy-950">Online (eVisa)</option>
                      <option value="Embassy / VFS Biometrics" className="bg-navy-950">Embassy / VFS Biometrics</option>
                      <option value="On Arrival at Port of Entry" className="bg-navy-950">On Arrival at Port of Entry</option>
                      <option value="Visa Exempt / No Application" className="bg-navy-950">Visa Exempt / No Application</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-300 uppercase mb-1">Validity</label>
                    <input
                      type="text"
                      value={visaFormData.validity || ""}
                      onChange={(e) => setVisaFormData({ ...visaFormData, validity: e.target.value })}
                      placeholder="e.g. 90 Days from issue"
                      className="w-full p-2.5 bg-black/40 border border-white/10 rounded-xl text-white text-xs outline-none focus:border-yellow-400"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-300 uppercase mb-1">Max Permitted Stay</label>
                    <input
                      type="text"
                      value={visaFormData.maxStay || ""}
                      onChange={(e) => setVisaFormData({ ...visaFormData, maxStay: e.target.value })}
                      placeholder="e.g. Up to 30 Days"
                      className="w-full p-2.5 bg-black/40 border border-white/10 rounded-xl text-white text-xs outline-none focus:border-yellow-400"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-300 uppercase mb-1">Number of Entries</label>
                    <select
                      value={visaFormData.entries || "Single Entry"}
                      onChange={(e) => setVisaFormData({ ...visaFormData, entries: e.target.value as any })}
                      className="w-full p-2.5 bg-black/40 border border-white/10 rounded-xl text-white text-xs outline-none focus:border-yellow-400"
                    >
                      <option value="Single Entry" className="bg-navy-950">Single Entry</option>
                      <option value="Double Entry" className="bg-navy-950">Double Entry</option>
                      <option value="Multiple Entry" className="bg-navy-950">Multiple Entry</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-300 uppercase mb-1">Processing Time</label>
                    <input
                      type="text"
                      value={visaFormData.processingTime || ""}
                      onChange={(e) => setVisaFormData({ ...visaFormData, processingTime: e.target.value })}
                      placeholder="e.g. 5 - 7 Working Days"
                      className="w-full p-2.5 bg-black/40 border border-white/10 rounded-xl text-white text-xs outline-none focus:border-yellow-400"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-300 uppercase mb-1">Visa Fees</label>
                    <input
                      type="text"
                      value={visaFormData.fees || ""}
                      onChange={(e) => setVisaFormData({ ...visaFormData, fees: e.target.value })}
                      placeholder="e.g. ₹3,500 / $45 USD / Free"
                      className="w-full p-2.5 bg-black/40 border border-white/10 rounded-xl text-white text-xs outline-none focus:border-yellow-400"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-300 uppercase mb-1">Official Government Immigration URL</label>
                    <input
                      type="url"
                      value={visaFormData.officialUrl || ""}
                      onChange={(e) => setVisaFormData({ ...visaFormData, officialUrl: e.target.value })}
                      placeholder="https://www.mofa.go.jp/..."
                      className="w-full p-2.5 bg-black/40 border border-white/10 rounded-xl text-white text-xs outline-none focus:border-yellow-400"
                    />
                  </div>
                </div>
              </div>

              {/* Document Checklist Manager */}
              <div className="p-4 rounded-2xl bg-black/40 border border-white/10 space-y-3">
                <span className="text-xs font-black uppercase text-yellow-400 tracking-wider">3. Document Checklist Items</span>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newDocInput}
                    onChange={(e) => setNewDocInput(e.target.value)}
                    placeholder="Type document requirement (e.g. 6 Months Bank Statement)..."
                    className="flex-1 p-2.5 bg-black/40 border border-white/10 rounded-xl text-white text-xs outline-none focus:border-yellow-400"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (!newDocInput.trim()) return;
                      setVisaFormData(prev => ({
                        ...prev,
                        documents: [...(prev.documents || []), newDocInput.trim()]
                      }));
                      setNewDocInput("");
                    }}
                    className="px-4 py-2.5 rounded-xl bg-yellow-400 text-slate-950 font-bold text-xs"
                  >
                    Add Document
                  </button>
                </div>

                <div className="space-y-1.5 max-h-48 overflow-y-auto">
                  {(visaFormData.documents || []).map((doc, idx) => (
                    <div key={idx} className="flex items-center justify-between p-2 rounded-lg bg-white/5 border border-white/5 text-xs text-slate-200">
                      <span className="flex items-center gap-2">
                        <CheckCircle2 size={13} className="text-yellow-400 shrink-0" />
                        <span>{doc}</span>
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          setVisaFormData(prev => ({
                            ...prev,
                            documents: prev.documents.filter((_, i) => i !== idx)
                          }));
                        }}
                        className="text-slate-500 hover:text-red-400 p-1"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Procedure & Restrictions */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Application Steps (One per line)</label>
                  <textarea
                    rows={4}
                    value={(visaFormData.procedure || []).join("\n")}
                    onChange={(e) => setVisaFormData({
                      ...visaFormData,
                      procedure: e.target.value.split("\n").map(s => s.trim()).filter(Boolean)
                    })}
                    placeholder="1. Fill online application&#10;2. Upload digital passport copy&#10;3. Pay fees"
                    className="w-full p-3 bg-black/40 border border-white/10 rounded-xl text-white text-xs outline-none focus:border-yellow-400 leading-relaxed"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Restrictions & Notes (One per line)</label>
                  <textarea
                    rows={4}
                    value={(visaFormData.restrictions || []).join("\n")}
                    onChange={(e) => setVisaFormData({
                      ...visaFormData,
                      restrictions: e.target.value.split("\n").map(s => s.trim()).filter(Boolean)
                    })}
                    placeholder="Tourist visa strictly prohibits local employment&#10;Non-extendable"
                    className="w-full p-3 bg-black/40 border border-white/10 rounded-xl text-white text-xs outline-none focus:border-yellow-400 leading-relaxed"
                  />
                </div>
              </div>

              {/* Verified Date & Published */}
              <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-black/40 border border-white/10">
                <div className="flex items-center gap-2">
                  <label className="text-xs font-bold text-slate-300 uppercase">Last Verified Date:</label>
                  <input
                    type="date"
                    value={visaFormData.verifiedDate || ""}
                    onChange={(e) => setVisaFormData({ ...visaFormData, verifiedDate: e.target.value })}
                    className="p-2 rounded-lg bg-white/5 border border-white/10 text-white text-xs outline-none focus:border-yellow-400"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="visaPublished"
                    checked={visaFormData.published !== false}
                    onChange={(e) => setVisaFormData({ ...visaFormData, published: e.target.checked })}
                    className="w-4 h-4 rounded text-yellow-400"
                  />
                  <label htmlFor="visaPublished" className="text-xs text-slate-300 font-semibold cursor-pointer">
                    Published in Public Visa Guide
                  </label>
                </div>
              </div>

              <div className="pt-4 border-t border-white/10 flex justify-between items-center">
                <button type="button" onClick={closeForm} className="px-5 py-2.5 rounded-xl font-medium text-slate-400 hover:text-white text-xs">
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-yellow-400 text-slate-950 font-black text-xs hover:bg-yellow-300 transition"
                >
                  Save Visa Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================
          CONFIRMATION DIALOG: DELETE RECORD
      ======================================================== */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-navy-900 border border-red-500/30 w-full max-w-md rounded-3xl p-6 shadow-2xl text-center">
            <div className="w-12 h-12 rounded-full bg-red-500/20 text-red-400 flex items-center justify-center mx-auto mb-4 border border-red-500/30">
              <ShieldAlert size={24} />
            </div>
            <h3 className="text-xl font-black text-white mb-2">Delete {deleteTarget.type}?</h3>
            <p className="text-slate-300 text-xs mb-6">
              Are you sure you want to permanently delete <strong className="text-white">&quot;{deleteTarget.title}&quot;</strong>? This action cannot be undone. Remember to click &quot;Save to Server&quot; afterwards.
            </p>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                className="py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white font-bold text-xs transition"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={executeDelete}
                className="py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-black text-xs transition"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
