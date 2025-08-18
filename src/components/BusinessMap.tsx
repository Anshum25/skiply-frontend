// BusinessMap.tsx
import React from "react";
import { GoogleMap, Marker, useLoadScript } from "@react-google-maps/api";

interface BusinessMapProps {
  lat: number;
  lng: number;
  name: string;
  height?: string;
  width?: string;
  mapId?: string; // Optional, for advanced map styling
}

const containerStyleDefault: React.CSSProperties = {
  width: "100%",
  height: "300px",
};

function getGoogleMapsApiKey(): string {
  // Vite: import.meta.env.VITE_GOOGLE_MAPS_API_KEY
  // CRA: import.meta.env.REACT_APP_GOOGLE_MAPS_API_KEY (for compatibility, but Vite does not polyfill process.env)
  if (typeof import.meta !== 'undefined' && import.meta.env) {
    return (
      import.meta.env.VITE_GOOGLE_MAPS_API_KEY ||
      import.meta.env.REACT_APP_GOOGLE_MAPS_API_KEY ||
      ""
    );
  }
  // If not running in an environment that supports import.meta.env, return empty string
  return "";
}

export const BusinessMap: React.FC<BusinessMapProps> = ({ lat, lng, name, height, width, mapId }) => {
  const apiKey = getGoogleMapsApiKey();
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: apiKey,
    mapIds: mapId ? [mapId] : undefined,
  });

  if (!apiKey) {
    return (
      <div className="text-red-500">
        Google Maps API key is missing.<br />
        Please set <code>REACT_APP_GOOGLE_MAPS_API_KEY</code> (CRA) or <code>VITE_GOOGLE_MAPS_API_KEY</code> (Vite) in your <code>.env</code> file.
      </div>
    );
  }
  if (loadError) return <div className="text-red-500">Map cannot be loaded: {String(loadError)}</div>;
  if (!isLoaded) return <div>Loading map...</div>;

  return (
    <GoogleMap
      mapContainerStyle={{ ...containerStyleDefault, height: height || containerStyleDefault.height, width: width || containerStyleDefault.width } as React.CSSProperties}
      center={{ lat, lng }}
      zoom={16}
      options={{ mapTypeControl: false, streetViewControl: false, mapId }}
    >
      <Marker position={{ lat, lng }} title={name} />
    </GoogleMap>
  );
};

export default BusinessMap;