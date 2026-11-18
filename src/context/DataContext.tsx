"use client";
import React, { createContext, useContext, useEffect, useState, useMemo } from "react";
import { Destination, destinationsData as fallbackDestinations } from "@/data/destinations";
import { TravelPackage, defaultPackages } from "@/data/packages";
import { VisaRecord, defaultVisaRecords } from "@/data/visa";

type DataContextType = {
  destinations: Record<string, Destination>;
  destinationList: Destination[];
  packages: TravelPackage[];
  visaRecords: VisaRecord[];
  isLoading: boolean;
  getDestinationById: (id: string) => Destination | undefined;
  getDestinationBySlug: (slug: string) => Destination | undefined;
  getPackagesByDestinationId: (destId: string) => TravelPackage[];
  getVisaRecord: (destCountry: string, nationality: string, purpose?: string) => VisaRecord | undefined;
};

const DataContext = createContext<DataContextType>({
  destinations: fallbackDestinations,
  destinationList: Object.values(fallbackDestinations),
  packages: defaultPackages,
  visaRecords: defaultVisaRecords,
  isLoading: true,
  getDestinationById: () => undefined,
  getDestinationBySlug: () => undefined,
  getPackagesByDestinationId: () => [],
  getVisaRecord: () => undefined,
});

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [destinations, setDestinations] = useState<Record<string, Destination>>(fallbackDestinations);
  const [packages, setPackages] = useState<TravelPackage[]>(defaultPackages);
  const [visaRecords, setVisaRecords] = useState<VisaRecord[]>(defaultVisaRecords);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch('/api/data.json?t=' + new Date().getTime())
      .then(res => res.json())
      .then(data => {
        if (data.destinations && typeof data.destinations === 'object') {
          // Normalize destinations
          const normDest: Record<string, Destination> = {};
          if (Array.isArray(data.destinations)) {
            data.destinations.forEach((d: Destination) => {
              normDest[d.name || d.id] = d;
            });
          } else {
            Object.assign(normDest, data.destinations);
          }
          setDestinations(normDest);
        }
        if (data.packages && Array.isArray(data.packages) && data.packages.length > 0) {
          setPackages(data.packages);
        }
        if (data.visaRecords && Array.isArray(data.visaRecords) && data.visaRecords.length > 0) {
          setVisaRecords(data.visaRecords);
        }
        setIsLoading(false);
      })
      .catch(err => {
        console.error("Failed to load live data, using bundled fallback:", err);
        setIsLoading(false);
      });
  }, []);

  const destinationList = useMemo(() => {
    return Object.values(destinations);
  }, [destinations]);

  const getDestinationById = (id: string): Destination | undefined => {
    if (!id) return undefined;
    const cleanId = id.trim().toLowerCase();
    return destinationList.find(d => 
      (d.id && d.id.toLowerCase() === cleanId) ||
      (d.slug && d.slug.toLowerCase() === cleanId) ||
      (d.name && d.name.toLowerCase() === cleanId)
    );
  };

  const getDestinationBySlug = (slug: string): Destination | undefined => {
    if (!slug) return undefined;
    const cleanSlug = slug.trim().toLowerCase();
    return destinationList.find(d => 
      (d.slug && d.slug.toLowerCase() === cleanSlug) ||
      (d.id && d.id.toLowerCase() === cleanSlug) ||
      (d.name && d.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') === cleanSlug)
    );
  };

  const getPackagesByDestinationId = (destId: string): TravelPackage[] => {
    if (!destId) return [];
    const targetDest = getDestinationById(destId);
    const destIdentifier = targetDest ? targetDest.id.toLowerCase() : destId.toLowerCase();
    const destName = targetDest ? targetDest.name.toLowerCase() : destId.toLowerCase();

    return packages.filter(pkg => {
      // Must be published (or undefined/true)
      if (pkg.published === false) return false;

      // 1. Direct ID match in destinationIds array
      if (pkg.destinationIds && Array.isArray(pkg.destinationIds)) {
        const matchesId = pkg.destinationIds.some(id => id.toLowerCase() === destIdentifier);
        if (matchesId) return true;
      }

      // 2. Fallback: textual match in destinations display string or title
      if (pkg.destinations && pkg.destinations.toLowerCase().includes(destName)) {
        return true;
      }
      if (pkg.title && pkg.title.toLowerCase().includes(destName)) {
        return true;
      }

      return false;
    });
  };

  const getVisaRecord = (destCountry: string, nationality: string, purpose?: string): VisaRecord | undefined => {
    if (!destCountry || !nationality) return undefined;
    const cleanDest = destCountry.trim().toLowerCase();
    const cleanNat = nationality.trim().toLowerCase();
    const cleanPurp = purpose ? purpose.trim().toLowerCase() : "";

    return visaRecords.find(v => {
      if (v.published === false) return false;

      const destMatch = 
        v.destinationCountry.toLowerCase() === cleanDest ||
        v.destinationCountryCode.toLowerCase() === cleanDest;

      const natMatch = 
        v.passportNationality.toLowerCase() === cleanNat ||
        v.passportCountryCode.toLowerCase() === cleanNat;

      if (!destMatch || !natMatch) return false;

      if (cleanPurp) {
        return v.travelPurpose.toLowerCase() === cleanPurp;
      }

      return true;
    });
  };

  return (
    <DataContext.Provider value={{
      destinations,
      destinationList,
      packages,
      visaRecords,
      isLoading,
      getDestinationById,
      getDestinationBySlug,
      getPackagesByDestinationId,
      getVisaRecord
    }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  return useContext(DataContext);
}
