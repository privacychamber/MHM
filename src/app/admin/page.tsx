"use client";
import { useState, useEffect } from "react";
import { 
  LogOut, 
  Save, 
  Plus, 
  Edit2, 
  Trash2, 
  MapPin, 
  Package, 
  X,
  AlertCircle
} from "lucide-react";

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState("");
  const [loginError, setLoginError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [db, setDb] = useState<{ destinations: Record<string, any>; packages: any[] }>({
    destinations: {},
    packages: [],
  });

  const [activeTab, setActiveTab] = useState<"destinations" | "packages">("destinations");
  const [status, setStatus] = useState({ type: "", message: "" });
  const [isEditing, setIsEditing] = useState<any>(null);
  const [editMode, setEditMode] = useState<"add" | "edit" | null>(null);

  // Form states
  const [formData, setFormData] = useState<any>({});

  useEffect(() => {
    if (isAuthenticated) {
      fetch("/api/data.json?t=" + Date.now())
        .then((res) => res.json())
        .then((json) => {
          if (!json.destinations) json.destinations = {};
          if (!json.packages) json.packages = [];
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
    if (mode === "add") {
      setFormData(
        activeTab === "destinations"
          ? { id: "", name: "", flag: "", rating: 4.5, reviews: "0", image: "", topCities: "", bestTime: "", visa: "", currency: "", timeDiff: "", flightDuration: "", lat: 0, lng: 0, price: "", language: "", topAttractions: "" }
          : { id: "", title: "", category: "Luxury", rating: 5.0, duration: "", destinations: "", price: "", image: "", features: "" }
      );
    } else {
      const editingItem = { ...item };
      if (activeTab === "packages" && Array.isArray(editingItem.features)) {
        editingItem.features = editingItem.features.join(", ");
      }
      setFormData(editingItem);
    }
  };

  const closeForm = () => {
    setEditMode(null);
    setFormData({});
  };

  const saveForm = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (activeTab === "destinations") {
      const key = formData.name || formData.id;
      if (!key) return alert("Destination Name is required.");
      if (!formData.id) formData.id = formData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      
      setDb(prev => ({
        ...prev,
        destinations: {
          ...prev.destinations,
          [key]: formData
        }
      }));
    } else {
      if (!formData.id) formData.id = "pkg_" + Date.now();
      const pkgToSave = { ...formData };
      if (typeof pkgToSave.features === "string") {
        pkgToSave.features = pkgToSave.features.split(",").map((s: string) => s.trim()).filter(Boolean);
      }
      
      setDb(prev => {
        let newPackages = [...prev.packages];
        if (editMode === "edit") {
          const idx = newPackages.findIndex(p => p.id === formData.id);
          if (idx >= 0) newPackages[idx] = pkgToSave;
        } else {
          newPackages.push(pkgToSave);
        }
        return { ...prev, packages: newPackages };
      });
    }
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

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <div className="bg-gray-900 border border-gray-800 p-8 rounded-2xl w-full max-w-md shadow-2xl">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-slate-50 mb-2">Admin Login</h1>
            <p className="text-gray-400 text-sm">Enter your password to access the dashboard</p>
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
              {isLoading ? "Authenticating..." : "Login"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  const destList = Object.entries(db.destinations || {});

  return (
    <div className="min-h-screen bg-black text-slate-50 flex flex-col md:flex-row pt-24 md:pt-0">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-gray-950 border-r border-gray-800 flex flex-col md:h-screen md:sticky md:top-0">
        <div className="p-6 hidden md:block">
          <h1 className="text-2xl font-bold text-yellow-500">MHM Admin</h1>
          <p className="text-xs text-gray-500 mt-1">Content Management</p>
        </div>
        
        <nav className="flex md:flex-col gap-2 p-4 flex-1">
          <button 
            onClick={() => setActiveTab("destinations")}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${activeTab === "destinations" ? "bg-yellow-500/10 text-yellow-500 border border-yellow-500/20" : "text-gray-400 hover:text-slate-50 hover:bg-gray-900"}`}
          >
            <MapPin size={20} />
            <span className="hidden md:inline">Destinations</span>
          </button>
          <button 
            onClick={() => setActiveTab("packages")}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${activeTab === "packages" ? "bg-yellow-500/10 text-yellow-500 border border-yellow-500/20" : "text-gray-400 hover:text-slate-50 hover:bg-gray-900"}`}
          >
            <Package size={20} />
            <span className="hidden md:inline">Packages</span>
          </button>
        </nav>
        
        <div className="p-4 mt-auto">
          <button 
            onClick={() => setIsAuthenticated(false)}
            className="flex items-center gap-3 w-full px-4 py-3 text-gray-400 hover:text-red-400 hover:bg-red-400/10 rounded-xl transition-all font-medium"
          >
            <LogOut size={20} />
            <span className="hidden md:inline">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-10 pb-32">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
          <div>
            <h2 className="text-3xl font-bold capitalize text-white flex items-center gap-3">
              {activeTab}
              <span className="text-sm font-normal text-gray-500 bg-gray-900 px-3 py-1 rounded-full border border-gray-800">
                {activeTab === "destinations" ? destList.length : db.packages.length} total
              </span>
            </h2>
            <p className="text-gray-400 mt-1">Manage your website's {activeTab} data.</p>
          </div>
          
          <div className="flex items-center gap-4">
            <button 
              onClick={() => openForm("add")}
              className="flex items-center gap-2 bg-gray-800 text-white px-5 py-2.5 rounded-xl font-medium hover:bg-gray-700 transition border border-gray-700"
            >
              <Plus size={18} />
              Add New
            </button>
            <button 
              onClick={handleSaveToServer}
              className="flex items-center gap-2 bg-yellow-500 text-black px-6 py-2.5 rounded-xl font-bold hover:bg-yellow-400 transition shadow-lg shadow-yellow-500/20"
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
              <div key={pkg.id} className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden group hover:border-yellow-500/30 transition-colors">
                <div className="h-40 relative">
                  <img src={pkg.image || "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=1000&auto=format&fit=crop"} alt={pkg.title} className="w-full h-full object-cover" />
                  <div className="absolute top-3 left-3 bg-yellow-500 text-black px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                    {pkg.category} • {pkg.duration}
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="font-bold text-lg mb-1">{pkg.title}</h3>
                  <p className="text-gray-400 text-sm mb-4 line-clamp-1">{pkg.destinations}</p>
                  <div className="flex items-center justify-between pt-4 border-t border-gray-800">
                    <span className="text-yellow-500 font-bold">{pkg.price}</span>
                    <div className="flex gap-2">
                      <button onClick={() => openForm("edit", pkg)} className="p-2 text-gray-400 hover:text-white bg-gray-800 rounded-lg hover:bg-gray-700 transition">
                        <Edit2 size={16} />
                      </button>
                      <button onClick={() => deleteItem(pkg.id)} className="p-2 text-gray-400 hover:text-red-400 bg-gray-800 rounded-lg hover:bg-gray-700 transition">
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
            className="bg-gray-900/50 border-2 border-dashed border-gray-800 rounded-2xl h-full min-h-[300px] flex flex-col items-center justify-center text-gray-500 hover:border-yellow-500/50 hover:text-yellow-500 transition cursor-pointer group"
          >
            <div className="w-16 h-16 bg-gray-800 group-hover:bg-yellow-500/10 rounded-full flex items-center justify-center mb-4 transition">
              <Plus size={32} />
            </div>
            <p className="font-medium">Add New {activeTab === "destinations" ? "Destination" : "Package"}</p>
          </div>
        </div>
      </main>

      {/* Editor Modal */}
      {editMode && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 md:p-8 overflow-y-auto">
          <div className="bg-gray-950 border border-gray-800 rounded-2xl w-full max-w-4xl max-h-full overflow-y-auto shadow-2xl relative flex flex-col mt-20 md:mt-0">
            <div className="sticky top-0 bg-gray-950/90 backdrop-blur-md p-6 border-b border-gray-800 flex items-center justify-between z-10">
              <h2 className="text-2xl font-bold text-white capitalize">
                {editMode} {activeTab === "destinations" ? "Destination" : "Package"}
              </h2>
              <button onClick={closeForm} className="p-2 text-gray-400 hover:text-white bg-gray-900 rounded-full hover:bg-gray-800 transition">
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={saveForm} className="p-6 md:p-8 flex-1">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {Object.keys(formData).map((key) => {
                  // Skip system ID field for safety on edits if needed, but we let them see it
                  if (key === 'id' && editMode === 'edit') return null;
                  
                  return (
                    <div key={key} className={key === 'topAttractions' || key === 'inclusions' || key === 'image' ? "md:col-span-2" : ""}>
                      <label className="block text-sm font-medium mb-2 text-gray-400 capitalize">
                        {key.replace(/([A-Z])/g, ' $1').trim()}
                      </label>
                      {key === 'topAttractions' || key === 'inclusions' ? (
                        <textarea
                          value={formData[key]}
                          onChange={(e) => setFormData({...formData, [key]: e.target.value})}
                          className="w-full p-4 bg-gray-900 border border-gray-800 rounded-xl text-slate-50 focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 transition-all outline-none"
                          rows={3}
                        />
                      ) : (
                        <input
                          type={typeof formData[key] === 'number' ? 'number' : 'text'}
                          value={formData[key]}
                          onChange={(e) => setFormData({...formData, [key]: typeof formData[key] === 'number' ? Number(e.target.value) : e.target.value})}
                          className="w-full p-4 bg-gray-900 border border-gray-800 rounded-xl text-slate-50 focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 transition-all outline-none"
                          required={key === 'name' || key === 'title'}
                        />
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="mt-10 pt-6 border-t border-gray-800 flex justify-end gap-4 sticky bottom-0 bg-gray-950 pb-2">
                <button 
                  type="button" 
                  onClick={closeForm}
                  className="px-6 py-3 rounded-xl font-medium text-gray-300 hover:text-white hover:bg-gray-800 transition"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-8 py-3 bg-yellow-500 text-black rounded-xl font-bold hover:bg-yellow-400 transition shadow-lg shadow-yellow-500/20 flex items-center gap-2"
                >
                  <Save size={18} />
                  Save to Pending Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
