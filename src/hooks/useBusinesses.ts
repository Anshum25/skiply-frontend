// hooks/useBusinesses.ts
import { useEffect, useState } from "react";
import { Business } from "@/lib/types";

export function useBusinesses() {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchBusinesses = () => {
    setLoading(true);
    fetch(`${import.meta.env.VITE_API_URL}/api/businesses/all`)
      .then((res) => res.json())
      .then((data) => {
        setBusinesses(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching businesses:", error);
        setLoading(false);
      });
  };
  useEffect(() => {
    fetchBusinesses();
  }, []);
  return { businesses, loading, refetchBusinesses: fetchBusinesses };

  return { businesses, loading };
}
