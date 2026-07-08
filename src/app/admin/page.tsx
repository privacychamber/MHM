"use client";
import { useState, useEffect } from "react";

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [data, setData] = useState("");
  const [token, setToken] = useState("");
  const [status, setStatus] = useState("");
  const [loginError, setLoginError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      fetch("/api/data.json?t=" + Date.now())
        .then((res) => res.json())
        .then((json) => setData(JSON.stringify(json, null, 2)))
        .catch((err) => console.error("Error loading data", err));
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

  const handleSave = async () => {
    setStatus("Saving...");
    try {
      const parsedData = JSON.parse(data);
      const res = await fetch("/api/save.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, data: parsedData }),
      });
      const result = await res.json();
      if (res.ok) {
        setStatus("Success: " + result.message);
      } else {
        setStatus("Error: " + result.error);
      }
    } catch (err) {
      setStatus("Error: Invalid JSON format");
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <div className="bg-gray-900 border border-gray-800 p-8 rounded-2xl w-full max-w-md shadow-2xl">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-white mb-2">Admin Login</h1>
            <p className="text-gray-400 text-sm">Enter your password to access the dashboard</p>
          </div>
          
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <input 
                type="password" 
                value={token} 
                onChange={(e) => setToken(e.target.value)}
                className="w-full p-4 bg-black/50 border border-gray-700 rounded-xl text-white focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 transition-all outline-none"
                placeholder="Admin Password"
                required
              />
            </div>

            {loginError && (
              <p className="text-red-400 text-sm text-center">{loginError}</p>
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

  return (
    <div className="min-h-screen bg-black text-white p-8 pt-32">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-yellow-500">MHM Travels Admin</h1>
          <button 
            onClick={() => setIsAuthenticated(false)}
            className="text-gray-400 hover:text-white transition-colors text-sm"
          >
            Logout
          </button>
        </div>
        
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-300">Database Editor (JSON)</label>
            <textarea
              value={data}
              onChange={(e) => setData(e.target.value)}
              className="w-full h-[600px] p-6 bg-gray-900 border border-gray-700 rounded-2xl font-mono text-sm text-green-400 focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 transition-all outline-none leading-relaxed"
            />
          </div>

          <div className="flex items-center justify-between">
            <button 
              onClick={handleSave}
              className="bg-yellow-500 text-black px-8 py-3 rounded-xl font-bold hover:bg-yellow-400 transition shadow-lg hover:shadow-yellow-500/20"
            >
              Save Database
            </button>

            {status && (
              <p className={`font-medium ${status.includes('Error') ? 'text-red-400' : 'text-green-400'}`}>
                {status}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
