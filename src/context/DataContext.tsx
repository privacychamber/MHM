"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
import { Destination, destinationsData as fallbackData } from "@/data/destinations";

type DataContextType = {
  destinations: Record<string, Destination>;
  isLoading: boolean;
};

const DataContext = createContext<DataContextType>({ destinations: fallbackData, isLoading: true });

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [destinations, setDestinations] = useState<Record<string, Destination>>(fallbackData);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch('/api/data.json?t=' + new Date().getTime())
      .then(res => res.json())
      .then(data => {
        if (data.destinations) {
          setDestinations(data.destinations);
        }
        setIsLoading(false);
      })
      .catch(err => {
        console.error("Failed to load live data, using fallback:", err);
        setIsLoading(false);
      });
  }, []);

  return (
    <DataContext.Provider value={{ destinations, isLoading }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  return useContext(DataContext);
}
