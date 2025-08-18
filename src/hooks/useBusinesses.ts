// hooks/useBusinesses.ts
import { useEffect, useState } from "react";
import { Business } from "@/lib/types";

export function useBusinesses() {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:5050/api/businesses/all")
      .then((res) => res.json())
      .then((data) => {
        setBusinesses(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching businesses:", error);
        setLoading(false);
      });
  }, []);

  return { businesses, loading };
}
