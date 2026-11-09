"use client";
import { useState, useEffect } from "react";
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
  Layers
} from "lucide-react";
import { TravelPackage, ItineraryDay, defaultPackages } from "@/data/packages";

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState("");
  const [loginError, setLoginError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [db, setDb] = useState<{ destinations: Record<string, any>; packages: TravelPackage[] }>({
    destinations: {},
    packages: defaultPackages,
  });

  const [activeTab, setActiveTab] = useState<"destinations" | "packages">("packages");
  const [status, setStatus] = useState({ type: "", message: "" });
  const [editMode, setEditMode] = useState<"add" | "edit" | null>(null);

  // Form states
  const [destFormData, setDestFormData] = useState<any>({});
  
  // Package form state
  const [pkgFormData, setPkgFormData] = useState<TravelPackage>({
    id: "",
    title: "",
    category: "Luxury",
    rating: 5.0,
    duration: "",
    destinations: "",
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

  // Package Form Internal Tab: 'general' | 'overview' | 'itinerary' | 'inclusions' | 'tips'
  const [pkgModalTab, setPkgModalTab] = useState<"general" | "overview" | "itinerary" | "inclusions" | "tips">("general");

  useEffect(() => {
    if (isAuthenticated) {
      fetch("/api/data.json?t=" + Date.now())
        .then((res) => res.json())
        .then((json) => {
          if (!json.destinations) json.destinations = {};
          if (!json.packages || json.packages.length === 0) {
            json.packages = defaultPackages;
          }
          setDb(json);
        })
        .catch((err) => {
          console.error("Error loading data", err);
          setStatus({ type: "error", message: "Failed to load database from server." });
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
    setStatus({ type: "info", message: "Saving to server..." });
    try {
      const res = await fetch("/api/save.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, data: db }),
      });
      const result = await res.json();
      if (res.ok) {
        setStatus({ type: "success", message: "Database saved successfully!" });
        setTimeout(() => setStatus({ type: "", message: "" }), 3000);
      } else {
        setStatus({ type: "error", message: "Error: " + result.error });
      }
    } catch (err) {
      setStatus({ type: "error", message: "Network error while saving." });
    }
  };

  const openForm = (mode: "add" | "edit", item: any = null) => {
    setEditMode(mode);
    setPkgModalTab("general");

    if (activeTab === "destinations") {
      if (mode === "add") {
        setDestFormData({
          id: "",
          name: "",
          flag: "",
          rating: 4.8,
          reviews: "1,000",
          image: "",
          topCities: "",
          bestTime: "",
          visa: "",
          currency: "",
          timeDiff: "",
          flightDuration: "",
          lat: 0,
          lng: 0,
          price: "",
          language: "",
          topAttractions: ""
        });
      } else {
        setDestFormData({ ...item });
      }
    } else {
      // Packages form
      if (mode === "add") {
        setPkgFormData({
          id: "pkg_" + Date.now(),
          title: "",
          category: "Luxury",
          rating: 4.9,
          duration: "",
          destinations: "",
          price: "",
          image: "",
          heroImage: "",
          features: [],
          overview: "",
          highlights: [],
          itinerary: [
            {
              day: 1,
              title: "Arrival & Hotel Check-in",
              subtitle: "Welcome to your dream destination",
              image: "",
              activities: [
                "Airport arrival and private transfer to luxury hotel",
                "Hotel check-in and evening at leisure",
                "Welcome dinner"
              ]
            }
          ],
          inclusions: [
            "Handpicked luxury hotel accommodations",
            "Daily buffet breakfast",
            "Private airport & sightseeing transfers",
            "All entry vouchers and permits"
          ],
          exclusions: [
            "International flights",
            "Visa fees",
            "Personal expenses and tips"
          ],
          travelTips: [
            "Carry valid passport with at least 6 months validity.",
            "Credit cards are accepted in most establishments.",
            "Pack comfortable walking footwear and weather-appropriate layers."
          ]
        });
      } else {
        setPkgFormData({
          ...item,
          features: Array.isArray(item.features) ? item.features : [],
          highlights: Array.isArray(item.highlights) ? item.highlights : [],
          itinerary: Array.isArray(item.itinerary) ? item.itinerary : [],
          inclusions: Array.isArray(item.inclusions) ? item.inclusions : [],
          exclusions: Array.isArray(item.exclusions) ? item.exclusions : [],
          travelTips: Array.isArray(item.travelTips) ? item.travelTips : []
        });
      }
    }
  };

  const closeForm = () => {
    setEditMode(null);
    setDestFormData({});
  };

  const saveDestinationForm = (e: React.FormEvent) => {
    e.preventDefault();
    const key = destFormData.name || destFormData.id;
    if (!key) return alert("Destination Name is required.");
    if (!destFormData.id) destFormData.id = destFormData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');

    setDb(prev => ({
      ...prev,
      destinations: {
        ...prev.destinations,
        [key]: destFormData
      }
    }));
    closeForm();
  };

  const savePackageForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pkgFormData.title) return alert("Package Title is required.");
    if (!pkgFormData.id) {
      pkgFormData.id = pkgFormData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    }

    setDb(prev => {
      const newPackages = [...prev.packages];
      if (editMode === "edit") {
        const idx = newPackages.findIndex(p => p.id === pkgFormData.id);
        if (idx >= 0) newPackages[idx] = pkgFormData;
        else newPackages.push(pkgFormData);
      } else {
        newPackages.push(pkgFormData);
      }
      return { ...prev, packages: newPackages };
    });
    closeForm();
  };

  const deleteItem = (id: string, keyName?: string) => {
    if (!confirm("Are you sure you want to delete this item?")) return;
    
    if (activeTab === "destinations" && keyName) {
      setDb(prev => {
        const newDests = { ...prev.destinations };
        delete newDests[keyName];
        return { ...prev, destinations: newDests };
      });
    } else if (activeTab === "packages") {
      setDb(prev => ({
        ...prev,
        packages: prev.packages.filter(p => p.id !== id)
      }));
    }
  };

  // Itinerary Day Helpers
  const addItineraryDay = () => {
    setPkgFormData(prev => {
      const currentDays = prev.itinerary || [];
      const newDayNum = currentDays.length + 1;
      const newDay: ItineraryDay = {
        day: newDayNum,
        title: `Day ${newDayNum} Sightseeing & Excursion`,
        subtitle: "Adventure continues",
        image: "",
        activities: ["Morning breakfast at hotel", "Guided city tour", "Overnight stay"]
      };
      return { ...prev, itinerary: [...currentDays, newDay] };
    });
  };

  const updateItineraryDay = (index: number, field: keyof ItineraryDay, value: any) => {
    setPkgFormData(prev => {
      const updated = [...(prev.itinerary || [])];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, itinerary: updated };
    });
  };

  const removeItineraryDay = (index: number) => {
    setPkgFormData(prev => {
      const updated = (prev.itinerary || [])
        .filter((_, idx) => idx !== index)
        .map((day, idx) => ({ ...day, day: idx + 1 })); // renumber days
      return { ...prev, itinerary: updated };
    });
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <div className="bg-gray-900 border border-gray-800 p-8 rounded-2xl w-full max-w-md shadow-2xl">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-slate-50 mb-2">MHM Admin Login</h1>
            <p className="text-gray-400 text-sm">Enter password to manage packages & itinerary details</p>
          </div>
          
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <input 
                type="password" 
                value={token} 
                onChange={(e) => setToken(e.target.value)}
                className="w-full p-4 bg-black/50 border border-gray-700 rounded-xl text-slate-50 focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 transition-all outline-none"
                placeholder="Admin Password"
                required
              />
            </div>

            {loginError && (
              <p className="text-red-400 text-sm text-center flex items-center justify-center gap-2">
                <AlertCircle size={16} /> {loginError}
              </p>
            )}

            <button 
              type="submit"
              disabled={isLoading}
              className="w-full bg-yellow-500 text-black py-4 rounded-xl font-bold hover:bg-yellow-400 transition-all disabled:opacity-50"
            >
              {isLoading ? "Authenticating..." : "Login to Dashboard"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  const destList = Object.entries(db.destinations || {});

  return (
    <div className="min-h-screen bg-black text-slate-50 flex flex-col md:flex-row pt-20 md:pt-0">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-gray-950 border-r border-gray-800 flex flex-col md:h-screen md:sticky md:top-0">
        <div className="p-6 hidden md:block">
          <h1 className="text-2xl font-black text-yellow-500 tracking-tight">MHM Admin</h1>
          <p className="text-xs text-gray-500 mt-1">Tour Packages & Itinerary Manager</p>
        </div>
        
        <nav className="flex md:flex-col gap-2 p-4 flex-1">
          <button 
            onClick={() => setActiveTab("packages")}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-semibold ${activeTab === "packages" ? "bg-yellow-500/10 text-yellow-500 border border-yellow-500/20 shadow-md" : "text-gray-400 hover:text-slate-50 hover:bg-gray-900"}`}
          >
            <Package size={20} />
            <span>Tour Packages</span>
          </button>
          <button 
            onClick={() => setActiveTab("destinations")}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-semibold ${activeTab === "destinations" ? "bg-yellow-500/10 text-yellow-500 border border-yellow-500/20 shadow-md" : "text-gray-400 hover:text-slate-50 hover:bg-gray-900"}`}
          >
            <MapPin size={20} />
            <span>Destinations</span>
          </button>
        </nav>
        
        <div className="p-4 mt-auto border-t border-gray-800/60">
          <button 
            onClick={() => setIsAuthenticated(false)}
            className="flex items-center gap-3 w-full px-4 py-3 text-gray-400 hover:text-red-400 hover:bg-red-400/10 rounded-xl transition-all font-medium"
          >
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-10 pb-32 overflow-y-auto">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pb-6 border-b border-gray-800">
          <div>
            <h2 className="text-3xl font-black capitalize text-white flex items-center gap-3">
              {activeTab === "packages" ? "Tour Packages & Detailed Itineraries" : "Destinations"}
              <span className="text-sm font-normal text-gray-400 bg-gray-900 px-3 py-1 rounded-full border border-gray-800">
                {activeTab === "destinations" ? destList.length : db.packages.length} items
              </span>
            </h2>
            <p className="text-gray-400 text-sm mt-1">
              Manage complete packages, day-wise itineraries, inclusions, exclusions, and travel tips.
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <button 
              onClick={() => openForm("add")}
              className="flex items-center gap-2 bg-gray-800 text-white px-5 py-2.5 rounded-xl font-bold hover:bg-gray-700 transition border border-gray-700"
            >
              <Plus size={18} />
              Add {activeTab === "packages" ? "Package" : "Destination"}
            </button>
            <button 
              onClick={handleSaveToServer}
              className="flex items-center gap-2 bg-yellow-500 text-black px-6 py-2.5 rounded-xl font-black hover:bg-yellow-400 transition shadow-lg shadow-yellow-500/20 active:scale-95"
            >
              <Save size={18} />
              Publish Changes
            </button>
          </div>
        </header>

        {status.message && (
          <div className={`p-4 mb-8 rounded-xl flex items-center gap-3 border ${status.type === 'error' ? 'bg-red-500/10 text-red-400 border-red-500/20' : status.type === 'success' ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-blue-500/10 text-blue-400 border-blue-500/20'}`}>
            <AlertCircle size={20} />
            {status.message}
          </div>
        )}

        {/* List View */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {activeTab === "destinations" ? (
            destList.map(([key, dest]) => (
              <div key={key} className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden group hover:border-yellow-500/30 transition-colors">
                <div className="h-40 relative">
                  <img src={dest.image || "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=1000&auto=format&fit=crop"} alt={dest.name} className="w-full h-full object-cover" />
                  <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-xs font-medium border border-white/10">
                    {dest.flag} {key}
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="font-bold text-lg mb-1">{dest.name}</h3>
                  <p className="text-gray-400 text-sm mb-4 line-clamp-1">{dest.topAttractions}</p>
                  <div className="flex items-center justify-between pt-4 border-t border-gray-800">
                    <span className="text-yellow-500 font-bold">{dest.price}</span>
                    <div className="flex gap-2">
                      <button onClick={() => openForm("edit", dest)} className="p-2 text-gray-400 hover:text-white bg-gray-800 rounded-lg hover:bg-gray-700 transition">
                        <Edit2 size={16} />
                      </button>
                      <button onClick={() => deleteItem(dest.id, key)} className="p-2 text-gray-400 hover:text-red-400 bg-gray-800 rounded-lg hover:bg-gray-700 transition">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            db.packages.map((pkg) => (
              <div key={pkg.id} className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden group hover:border-yellow-500/30 transition-colors flex flex-col justify-between">
                <div>
                  <div className="h-44 relative">
                    <img src={pkg.image || "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=1000&auto=format&fit=crop"} alt={pkg.title} className="w-full h-full object-cover" />
                    <div className="absolute top-3 left-3 bg-yellow-500 text-black px-3 py-1 rounded-full text-xs font-black shadow-lg">
                      {pkg.category} • {pkg.duration}
                    </div>
                    {pkg.itinerary && pkg.itinerary.length > 0 && (
                      <div className="absolute bottom-3 right-3 bg-black/70 backdrop-blur-md text-white text-[11px] font-bold px-2.5 py-1 rounded-md border border-white/10">
                        {pkg.itinerary.length} Days Itinerary
                      </div>
                    )}
                  </div>
                  <div className="p-5">
                    <h3 className="font-bold text-lg mb-1 leading-snug line-clamp-2">{pkg.title}</h3>
                    <p className="text-gray-400 text-xs mb-3 line-clamp-1">{pkg.destinations}</p>
                    <div className="text-yellow-500 font-black text-xl mb-4">{pkg.price}</div>
                  </div>
                </div>

                <div className="p-5 pt-0">
                  <div className="flex items-center justify-between pt-4 border-t border-gray-800/80 gap-2">
                    <Link
                      href={`/package?id=${pkg.id}`}
                      target="_blank"
                      className="inline-flex items-center gap-1.5 text-xs text-slate-300 hover:text-yellow-400 bg-gray-800/60 hover:bg-gray-800 px-3 py-2 rounded-lg transition-colors border border-gray-700/60"
                    >
                      <ExternalLink size={13} />
                      <span>View Live</span>
                    </Link>

                    <div className="flex gap-2">
                      <button 
                        onClick={() => openForm("edit", pkg)} 
                        className="flex items-center gap-1 px-3 py-2 text-xs font-bold text-black bg-yellow-500 hover:bg-yellow-400 rounded-lg transition"
                      >
                        <Edit2 size={13} /> Edit
                      </button>
                      <button 
                        onClick={() => deleteItem(pkg.id)} 
                        className="p-2 text-gray-400 hover:text-red-400 bg-gray-800 rounded-lg hover:bg-gray-700 transition"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
          
          {/* Add New Placeholder Card */}
          <div 
            onClick={() => openForm("add")}
            className="bg-gray-900/50 border-2 border-dashed border-gray-800 rounded-2xl h-full min-h-[300px] flex flex-col items-center justify-center text-gray-500 hover:border-yellow-500/50 hover:text-yellow-500 transition cursor-pointer group p-6"
          >
            <div className="w-16 h-16 bg-gray-800 group-hover:bg-yellow-500/10 rounded-full flex items-center justify-center mb-4 transition">
              <Plus size={32} />
            </div>
            <p className="font-bold">Add New {activeTab === "destinations" ? "Destination" : "Tour Package"}</p>
            <p className="text-xs text-gray-500 mt-1">Configure itinerary, pricing, and tips</p>
          </div>
        </div>
      </main>

      {/* DESTINATIONS MODAL */}
      {editMode && activeTab === "destinations" && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 md:p-8 overflow-y-auto">
          <div className="bg-gray-950 border border-gray-800 rounded-2xl w-full max-w-4xl max-h-full overflow-y-auto shadow-2xl relative flex flex-col">
            <div className="sticky top-0 bg-gray-950/90 backdrop-blur-md p-6 border-b border-gray-800 flex items-center justify-between z-10">
              <h2 className="text-2xl font-bold text-white capitalize">
                {editMode} Destination
              </h2>
              <button onClick={closeForm} className="p-2 text-gray-400 hover:text-white bg-gray-900 rounded-full hover:bg-gray-800 transition">
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={saveDestinationForm} className="p-6 md:p-8 flex-1">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {Object.keys(destFormData).map((key) => {
                  if (key === 'id' && editMode === 'edit') return null;
                  return (
                    <div key={key} className={key === 'topAttractions' || key === 'image' ? "md:col-span-2" : ""}>
                      <label className="block text-sm font-medium mb-2 text-gray-400 capitalize">
                        {key.replace(/([A-Z])/g, ' $1').trim()}
                      </label>
                      {key === 'topAttractions' ? (
                        <textarea
                          value={destFormData[key] || ""}
                          onChange={(e) => setDestFormData({...destFormData, [key]: e.target.value})}
                          className="w-full p-4 bg-gray-900 border border-gray-800 rounded-xl text-slate-50 focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 transition-all outline-none"
                          rows={3}
                        />
                      ) : (
                        <input
                          type={typeof destFormData[key] === 'number' ? 'number' : 'text'}
                          value={destFormData[key] || ""}
                          onChange={(e) => setDestFormData({...destFormData, [key]: typeof destFormData[key] === 'number' ? Number(e.target.value) : e.target.value})}
                          className="w-full p-4 bg-gray-900 border border-gray-800 rounded-xl text-slate-50 focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 transition-all outline-none"
                          required={key === 'name'}
                        />
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="mt-8 pt-6 border-t border-gray-800 flex justify-end gap-4">
                <button type="button" onClick={closeForm} className="px-6 py-3 rounded-xl font-medium text-gray-300 hover:text-white hover:bg-gray-800 transition">Cancel</button>
                <button type="submit" className="px-8 py-3 bg-yellow-500 text-black rounded-xl font-bold hover:bg-yellow-400 transition shadow-lg shadow-yellow-500/20">Save Destination</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* COMPREHENSIVE PACKAGE & ITINERARY MODAL */}
      {editMode && activeTab === "packages" && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-3 md:p-6 overflow-y-auto">
          <div className="bg-gray-950 border border-gray-800 rounded-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden shadow-2xl flex flex-col">
            
            {/* Modal Header */}
            <div className="p-5 md:p-6 bg-gray-950 border-b border-gray-800 flex items-center justify-between shrink-0">
              <div>
                <h2 className="text-2xl font-black text-white">
                  {editMode === "add" ? "Create New Tour Package" : `Edit: ${pkgFormData.title || "Package"}`}
                </h2>
                <p className="text-xs text-gray-400 mt-0.5">Configure itinerary timeline, inclusions, exclusions, and travel advice</p>
              </div>
              <button onClick={closeForm} className="p-2 text-gray-400 hover:text-white bg-gray-900 rounded-full hover:bg-gray-800 transition">
                <X size={20} />
              </button>
            </div>

            {/* Modal Navigation Tabs */}
            <div className="flex items-center gap-2 px-6 border-b border-gray-800 bg-gray-900/60 overflow-x-auto shrink-0">
              <button
                type="button"
                onClick={() => setPkgModalTab("general")}
                className={`py-3 px-4 text-xs md:text-sm font-bold border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${
                  pkgModalTab === "general"
                    ? "border-yellow-500 text-yellow-500"
                    : "border-transparent text-gray-400 hover:text-white"
                }`}
              >
                <FileText size={16} />
                <span>General Info</span>
              </button>

              <button
                type="button"
                onClick={() => setPkgModalTab("overview")}
                className={`py-3 px-4 text-xs md:text-sm font-bold border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${
                  pkgModalTab === "overview"
                    ? "border-yellow-500 text-yellow-500"
                    : "border-transparent text-gray-400 hover:text-white"
                }`}
              >
                <Sparkles size={16} />
                <span>Overview & Highlights</span>
              </button>

              <button
                type="button"
                onClick={() => setPkgModalTab("itinerary")}
                className={`py-3 px-4 text-xs md:text-sm font-bold border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${
                  pkgModalTab === "itinerary"
                    ? "border-yellow-500 text-yellow-500"
                    : "border-transparent text-gray-400 hover:text-white"
                }`}
              >
                <Calendar size={16} />
                <span>Day-by-Day Itinerary ({pkgFormData.itinerary?.length || 0} Days)</span>
              </button>

              <button
                type="button"
                onClick={() => setPkgModalTab("inclusions")}
                className={`py-3 px-4 text-xs md:text-sm font-bold border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${
                  pkgModalTab === "inclusions"
                    ? "border-yellow-500 text-yellow-500"
                    : "border-transparent text-gray-400 hover:text-white"
                }`}
              >
                <ShieldCheck size={16} />
                <span>Inclusions & Exclusions</span>
              </button>

              <button
                type="button"
                onClick={() => setPkgModalTab("tips")}
                className={`py-3 px-4 text-xs md:text-sm font-bold border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${
                  pkgModalTab === "tips"
                    ? "border-yellow-500 text-yellow-500"
                    : "border-transparent text-gray-400 hover:text-white"
                }`}
              >
                <Compass size={16} />
                <span>Travel Tips</span>
              </button>
            </div>

            {/* Modal Body / Scrollable Form */}
            <form onSubmit={savePackageForm} className="p-6 md:p-8 flex-1 overflow-y-auto space-y-6">
              
              {/* TAB 1: GENERAL INFO */}
              {pkgModalTab === "general" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-2">Package Title *</label>
                    <input 
                      type="text" 
                      value={pkgFormData.title}
                      onChange={(e) => setPkgFormData({ ...pkgFormData, title: e.target.value })}
                      placeholder="e.g. Natural Wonders of New Zealand – 10 Nights / 11 Days"
                      className="w-full p-4 bg-gray-900 border border-gray-800 rounded-xl text-white outline-none focus:border-yellow-500 text-base font-semibold"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-2">Package Category</label>
                    <select
                      value={pkgFormData.category}
                      onChange={(e) => setPkgFormData({ ...pkgFormData, category: e.target.value })}
                      className="w-full p-4 bg-gray-900 border border-gray-800 rounded-xl text-white outline-none focus:border-yellow-500"
                    >
                      <option value="Luxury">Luxury</option>
                      <option value="Honeymoon">Honeymoon</option>
                      <option value="Family">Family</option>
                      <option value="Group Tour">Group Tour</option>
                      <option value="Adventure">Adventure</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-2">Duration *</label>
                    <input 
                      type="text" 
                      value={pkgFormData.duration}
                      onChange={(e) => setPkgFormData({ ...pkgFormData, duration: e.target.value })}
                      placeholder="e.g. 11 Days / 10 Nights"
                      className="w-full p-4 bg-gray-900 border border-gray-800 rounded-xl text-white outline-none focus:border-yellow-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-2">Price (Display Text) *</label>
                    <input 
                      type="text" 
                      value={pkgFormData.price}
                      onChange={(e) => setPkgFormData({ ...pkgFormData, price: e.target.value })}
                      placeholder="e.g. ₹2,49,999"
                      className="w-full p-4 bg-gray-900 border border-gray-800 rounded-xl text-white outline-none focus:border-yellow-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-2">Guest Rating (1.0 - 5.0)</label>
                    <input 
                      type="number" 
                      step="0.1" 
                      min="1" 
                      max="5"
                      value={pkgFormData.rating}
                      onChange={(e) => setPkgFormData({ ...pkgFormData, rating: Number(e.target.value) })}
                      className="w-full p-4 bg-gray-900 border border-gray-800 rounded-xl text-white outline-none focus:border-yellow-500"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-2">Destinations Covered</label>
                    <input 
                      type="text" 
                      value={pkgFormData.destinations}
                      onChange={(e) => setPkgFormData({ ...pkgFormData, destinations: e.target.value })}
                      placeholder="e.g. Auckland • Rotorua • Queenstown • Milford Sound • Christchurch"
                      className="w-full p-4 bg-gray-900 border border-gray-800 rounded-xl text-white outline-none focus:border-yellow-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-2">Thumbnail Card Image URL</label>
                    <input 
                      type="text" 
                      value={pkgFormData.image}
                      onChange={(e) => setPkgFormData({ ...pkgFormData, image: e.target.value })}
                      placeholder="https://images.unsplash.com/..."
                      className="w-full p-4 bg-gray-900 border border-gray-800 rounded-xl text-white outline-none focus:border-yellow-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-2">Hero Banner Image URL (High-Res)</label>
                    <input 
                      type="text" 
                      value={pkgFormData.heroImage || ""}
                      onChange={(e) => setPkgFormData({ ...pkgFormData, heroImage: e.target.value })}
                      placeholder="https://images.unsplash.com/..."
                      className="w-full p-4 bg-gray-900 border border-gray-800 rounded-xl text-white outline-none focus:border-yellow-500"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-2">
                      Card Features (comma or line separated)
                    </label>
                    <textarea 
                      rows={3}
                      value={pkgFormData.features.join("\n")}
                      onChange={(e) => setPkgFormData({
                        ...pkgFormData,
                        features: e.target.value.split("\n").map(s => s.trim()).filter(Boolean)
                      })}
                      placeholder="4-Star & 5-Star Handpicked Stays&#10;Milford Sound Cruise with Lunch&#10;TranzAlpine Scenic Train Journey"
                      className="w-full p-4 bg-gray-900 border border-gray-800 rounded-xl text-white outline-none focus:border-yellow-500 text-sm"
                    />
                  </div>
                </div>
              )}

              {/* TAB 2: OVERVIEW & HIGHLIGHTS */}
              {pkgModalTab === "overview" && (
                <div className="space-y-6">
                  <div>
                    <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-2">
                      Trip Overview Paragraph
                    </label>
                    <textarea 
                      rows={4}
                      value={pkgFormData.overview || ""}
                      onChange={(e) => setPkgFormData({ ...pkgFormData, overview: e.target.value })}
                      placeholder="Describe what makes this journey unforgettable..."
                      className="w-full p-4 bg-gray-900 border border-gray-800 rounded-xl text-white outline-none focus:border-yellow-500 text-sm leading-relaxed"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-2">
                      Key Highlights (One per line)
                    </label>
                    <textarea 
                      rows={6}
                      value={(pkgFormData.highlights || []).join("\n")}
                      onChange={(e) => setPkgFormData({
                        ...pkgFormData,
                        highlights: e.target.value.split("\n").map(s => s.trim()).filter(Boolean)
                      })}
                      placeholder="Guided boat tour through the illuminated Waitomo Caves&#10;Full-length scenic fjord cruise in world-famous Milford Sound&#10;Historic TranzAlpine train ride through the Southern Alps"
                      className="w-full p-4 bg-gray-900 border border-gray-800 rounded-xl text-white outline-none focus:border-yellow-500 text-sm leading-relaxed"
                    />
                  </div>
                </div>
              )}

              {/* TAB 3: DAY-BY-DAY ITINERARY BUILDER (Matches user's screenshot) */}
              {pkgModalTab === "itinerary" && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between pb-4 border-b border-gray-800">
                    <div>
                      <h3 className="text-lg font-bold text-white">Daily Itinerary Schedule</h3>
                      <p className="text-xs text-gray-400">Add or edit the day-by-day itinerary cards shown on the inner page</p>
                    </div>
                    <button
                      type="button"
                      onClick={addItineraryDay}
                      className="bg-yellow-500 hover:bg-yellow-400 text-black font-black text-xs px-4 py-2.5 rounded-xl transition flex items-center gap-1.5 shadow-md"
                    >
                      <Plus size={16} />
                      Add Next Day
                    </button>
                  </div>

                  <div className="space-y-5">
                    {pkgFormData.itinerary && pkgFormData.itinerary.map((dayItem, idx) => (
                      <div key={idx} className="bg-gray-900 border border-gray-800 rounded-xl p-5 space-y-4 relative group">
                        <div className="flex items-center justify-between">
                          <span className="bg-yellow-500 text-black text-xs font-black px-3 py-1 rounded-md">
                            Day {dayItem.day}
                          </span>
                          <button
                            type="button"
                            onClick={() => removeItineraryDay(idx)}
                            className="text-gray-500 hover:text-red-400 p-1.5 rounded-lg hover:bg-red-400/10 transition"
                            title="Delete this day"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">Day Title *</label>
                            <input 
                              type="text" 
                              value={dayItem.title}
                              onChange={(e) => updateItineraryDay(idx, "title", e.target.value)}
                              placeholder="e.g. Arrival in Auckland"
                              className="w-full p-3 bg-black/50 border border-gray-800 rounded-lg text-white text-sm outline-none focus:border-yellow-500"
                              required
                            />
                          </div>

                          <div>
                            <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">Subtitle / Highlight</label>
                            <input 
                              type="text" 
                              value={dayItem.subtitle || ""}
                              onChange={(e) => updateItineraryDay(idx, "subtitle", e.target.value)}
                              placeholder="e.g. Welcome to the City of Sails"
                              className="w-full p-3 bg-black/50 border border-gray-800 rounded-lg text-white text-sm outline-none focus:border-yellow-500"
                            />
                          </div>

                          <div className="md:col-span-2">
                            <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">Day Photo URL</label>
                            <input 
                              type="text" 
                              value={dayItem.image || ""}
                              onChange={(e) => updateItineraryDay(idx, "image", e.target.value)}
                              placeholder="https://images.unsplash.com/..."
                              className="w-full p-3 bg-black/50 border border-gray-800 rounded-lg text-white text-sm outline-none focus:border-yellow-500"
                            />
                          </div>

                          <div className="md:col-span-2">
                            <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                              Day Activities (One activity per line)
                            </label>
                            <textarea 
                              rows={4}
                              value={(dayItem.activities || []).join("\n")}
                              onChange={(e) => updateItineraryDay(
                                idx, 
                                "activities", 
                                e.target.value.split("\n").map(s => s.trim()).filter(Boolean)
                              )}
                              placeholder="Meet & greet at Airport&#10;Transfer to hotel & check-in&#10;Evening at leisure"
                              className="w-full p-3 bg-black/50 border border-gray-800 rounded-lg text-white text-sm outline-none focus:border-yellow-500 leading-relaxed"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={addItineraryDay}
                    className="w-full py-4 border-2 border-dashed border-gray-800 hover:border-yellow-500/50 hover:text-yellow-500 text-gray-400 rounded-xl transition flex items-center justify-center gap-2 font-bold text-sm"
                  >
                    <Plus size={18} />
                    Add Another Day
                  </button>
                </div>
              )}

              {/* TAB 4: INCLUSIONS & EXCLUSIONS */}
              {pkgModalTab === "inclusions" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold text-green-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                      <ShieldCheck size={16} />
                      What's Included (One item per line)
                    </label>
                    <textarea 
                      rows={8}
                      value={(pkgFormData.inclusions || []).join("\n")}
                      onChange={(e) => setPkgFormData({
                        ...pkgFormData,
                        inclusions: e.target.value.split("\n").map(s => s.trim()).filter(Boolean)
                      })}
                      placeholder="10 Nights handpicked 4-Star & 5-Star stays&#10;Daily buffet breakfast&#10;All transfers in luxury AC vehicle&#10;Guided sightseeing and boat tours"
                      className="w-full p-4 bg-gray-900 border border-gray-800 rounded-xl text-white outline-none focus:border-green-500 text-sm leading-relaxed"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-red-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                      <X size={16} />
                      What's Excluded (One item per line)
                    </label>
                    <textarea 
                      rows={8}
                      value={(pkgFormData.exclusions || []).join("\n")}
                      onChange={(e) => setPkgFormData({
                        ...pkgFormData,
                        exclusions: e.target.value.split("\n").map(s => s.trim()).filter(Boolean)
                      })}
                      placeholder="International airfare&#10;Tourist Visa fees&#10;Personal expenses and gratuities&#10;Travel insurance"
                      className="w-full p-4 bg-gray-900 border border-gray-800 rounded-xl text-white outline-none focus:border-red-500 text-sm leading-relaxed"
                    />
                  </div>
                </div>
              )}

              {/* TAB 5: TRAVEL TIPS */}
              {pkgModalTab === "tips" && (
                <div>
                  <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-2">
                    Essential Travel Tips (One tip per line)
                  </label>
                  <textarea 
                    rows={8}
                    value={(pkgFormData.travelTips || []).join("\n")}
                    onChange={(e) => setPkgFormData({
                      ...pkgFormData,
                      travelTips: e.target.value.split("\n").map(s => s.trim()).filter(Boolean)
                    })}
                    placeholder="Best Time: October to April offers pleasant weather for sightseeing.&#10;Visa: Passport requires minimum 6 months validity. Complete assistance provided.&#10;Currency: Credit cards are universally accepted."
                    className="w-full p-4 bg-gray-900 border border-gray-800 rounded-xl text-white outline-none focus:border-yellow-500 text-sm leading-relaxed"
                  />
                </div>
              )}

              {/* Modal Footer */}
              <div className="pt-6 border-t border-gray-800 flex justify-between items-center shrink-0">
                <button 
                  type="button" 
                  onClick={closeForm}
                  className="px-6 py-3 rounded-xl font-medium text-gray-400 hover:text-white hover:bg-gray-800 transition text-sm"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-8 py-3 bg-yellow-500 text-black rounded-xl font-black hover:bg-yellow-400 transition shadow-lg shadow-yellow-500/20 text-sm flex items-center gap-2"
                >
                  <Save size={18} />
                  Save Package Details
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
