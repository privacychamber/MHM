"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
import { Destination, destinationsData as fallbackData } from "@/data/destinations";
import { TravelPackage, defaultPackages } from "@/data/packages";

type DataContextType = {
  destinations: Record<string, Destination>;
  packages: TravelPackage[];
  isLoading: boolean;
};

const DataContext = createContext<DataContextType>({ destinations: fallbackData, packages: defaultPackages, isLoading: true });

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [destinations, setDestinations] = useState<Record<string, Destination>>(fallbackData);
  const [packages, setPackages] = useState<TravelPackage[]>(defaultPackages);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch('/api/data.json?t=' + new Date().getTime())
      .then(res => res.json())
      .then(data => {
        if (data.destinations) {
          setDestinations(data.destinations);
        }
        if (data.packages && Array.isArray(data.packages) && data.packages.length > 0) {
          setPackages(data.packages);
        }
        setIsLoading(false);
      })
      .catch(err => {
        console.error("Failed to load live data, using fallback:", err);
        setIsLoading(false);
      });
  }, []);

  return (
    <DataContext.Provider value={{ destinations, packages, isLoading }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  return useContext(DataContext);
}
