"use client";
import { useState, useEffect } from "react";

export default function AdminPage() {
  const [data, setData] = useState("");
  const [token, setToken] = useState("");
  const [status, setStatus] = useState("");

  useEffect(() => {
    fetch("/api/data.json?t=" + Date.now())
      .then((res) => res.json())
      .then((json) => setData(JSON.stringify(json, null, 2)))
      .catch((err) => console.error("Error loading data", err));
  }, []);

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

  return (
    <div className="min-h-screen bg-black text-white p-8 pt-32">
      <h1 className="text-3xl font-bold mb-6 text-yellow-500">MHM Travels Admin</h1>
      
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2">Admin Password</label>
          <input 
            type="password" 
            value={token} 
            onChange={(e) => setToken(e.target.value)}
            className="w-full p-3 bg-gray-900 border border-gray-700 rounded-lg text-white"
            placeholder="Enter password..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Raw Data (JSON format)</label>
          <textarea
            value={data}
            onChange={(e) => setData(e.target.value)}
            className="w-full h-[500px] p-4 bg-gray-900 border border-gray-700 rounded-lg font-mono text-sm text-green-400"
          />
        </div>

        <button 
          onClick={handleSave}
          className="bg-yellow-500 text-black px-6 py-3 rounded-full font-semibold hover:bg-yellow-400 transition"
        >
          Save Changes
        </button>

        {status && <p className="mt-4 text-lg">{status}</p>}
      </div>
    </div>
  );
}
