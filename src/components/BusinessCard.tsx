import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, MapPin, Clock, Users } from "lucide-react";
import { Business } from "@/lib/types";
import { BUSINESS_CATEGORIES } from "@/lib/constants";
import { motion } from "framer-motion";
import { useApp } from "@/contexts/AppContext";

interface BusinessCardProps {
  business: Business;
  index?: number;
  openNowActive?: boolean;
}

function getDistanceInKm(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export function BusinessCard({ business, index = 0, openNowActive = false }: BusinessCardProps) {
  const category = BUSINESS_CATEGORIES.find((c) => c.value === business.category);
  const { selectedLocationCoords } = useApp();
  const [metrics, setMetrics] = useState<{ totalInQueue: number; avgWaitMinutes: number } | null>(null);

  const businessLat = business.location?.lat;
  const businessLng = business.location?.lng;

  const distance =
    selectedLocationCoords &&
    businessLat != null &&
    businessLng != null
      ? getDistanceInKm(
          selectedLocationCoords.lat,
          selectedLocationCoords.lng,
          businessLat,
          businessLng
        )
      : null;

  const fallbackTotalQueue =
    business.departments?.reduce((sum, dept) => sum + (dept.currentQueueSize || 0), 0) || 0;

  const fallbackAvgWait =
    business.departments?.length
      ? Math.round(
          business.departments.reduce(
            (sum, dept) => sum + (dept.estimatedWaitTime || 0),
            0
          ) / business.departments.length
        )
      : 0;

  const totalQueueSize = metrics?.totalInQueue ?? fallbackTotalQueue;
  const averageWaitTime = metrics?.avgWaitMinutes ?? fallbackAvgWait;

  useEffect(() => {
    const id = (business as any)._id || (business as any).id;
    if (!id) return;
    let mounted = true;
    const fetchMetrics = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/queues/metrics/${id}`);
        if (res.ok) {
          const data = await res.json();
          if (mounted) setMetrics({ totalInQueue: data.totalInQueue, avgWaitMinutes: data.avgWaitMinutes });
        }
      } catch {}
    };
    fetchMetrics();
    const interval = setInterval(fetchMetrics, 30000);
    return () => { mounted = false; clearInterval(interval); };
  }, [selectedLocationCoords, business.location, business.images]);

  const resolvedImageUrl =
    business.images && business.images.length > 0
      ? (business.images[0].startsWith("http") || business.images[0].startsWith("/")
          ? business.images[0]
          : `${import.meta.env.VITE_API_URL}/uploads/${business.images[0]}`)
      : "/no-image.jpg";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
    >
      <Link to={`/business/${(business as any)._id || (business as any).id}`}>
        <Card className="rounded-lg shadow-md p-0 overflow-hidden border transition transform hover:shadow-lg hover:-translate-y-1">
          <img
            src={resolvedImageUrl}
            alt={business.businessName}
            className="w-full h-40 object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src = "/no-image.jpg";
            }}
          />

          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="text-2xl">{category?.icon}</div>
                <div>
                  <h3 className="font-semibold text-lg">{business.businessName}</h3>
                  <div className="flex items-center space-x-1 text-gray-500">
                    <MapPin className="w-4 h-4" />
                    <span className="text-sm truncate max-w-[200px]">
                      {business.address || "Address not available"}
                    </span>
                  </div>
                </div>
              </div>
              <Badge variant="secondary" className="text-xs">
                {category?.label || "Other"}
              </Badge>
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-1">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-semibold">
                    {typeof business.rating === "number"
                      ? business.rating.toFixed(1)
                      : "5.0"}
                  </span>
                </div>
                <span className="text-sm text-gray-500">
                  ({business.totalReviews || 0} reviews)
                </span>
              </div>

              <div className="flex items-center space-x-1 text-gray-500">
                <MapPin className="w-4 h-4" />
                {selectedLocationCoords == null ? (
                  <span className="text-sm text-orange-400">User location not set</span>
                ) : businessLat == null || businessLng == null ? (
                  <span className="text-sm text-orange-400">Business location missing</span>
                ) : (
                  <span className="text-sm">Distance: {distance?.toFixed(2)} km</span>
                )}
              </div>

              <div className="flex space-x-4 text-sm">
                <div className="flex items-center space-x-1">
                  <Users className="w-4 h-4 text-blue-500" />
                  <span>{totalQueueSize} in queue</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Clock className="w-4 h-4 text-green-500" />
                  <span>{averageWaitTime} min</span>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-sm mb-2">Available Services:</h4>
                {Array.isArray(business.departments) && business.departments.length > 0 ? (
                  <div className="flex flex-wrap gap-1">
                    {business.departments.slice(0, 3).map((dept, deptIdx) => (
                      <Badge key={dept.id || `${dept.name}-${deptIdx}`} variant="secondary" className="text-xs">
                        {dept.name}
                      </Badge>
                    ))}
                    {business.departments.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{business.departments.length - 3} more
                      </Badge>
                    )}
                  </div>
                ) : (
                  <p className="text-xs text-gray-500 italic">No services listed</p>
                )}
              </div>
            </div>

            <div
              className={`flex items-center space-x-2 text-xs mt-4 ${
                openNowActive ? "text-green-600" : business.isAcceptingBookings ? "text-green-600" : "text-red-600"
              }`}
            >
              <div
                className={`w-2 h-2 rounded-full ${
                  openNowActive ? "bg-green-500" : business.isAcceptingBookings ? "bg-green-500" : "bg-red-500"
                }`}
              />
              <span>
                {(openNowActive || business.isAcceptingBookings)
                  ? "Accepting Bookings"
                  : "Closed for Bookings"}
              </span>
            </div>
          </div>
        </Card>
      </Link>
    </motion.div>
  );
}

export default BusinessCard;
