import React, { useEffect, useState } from "react";
import { MapPin } from "lucide-react";

const LOCATIONIQ_API_KEY = "pk.3447cb895677c89dc253a7927db3ad83";

interface Suggestion {
  display_name: string;
  lat: string;
  lon: string;
  address?: any;
}

const LocationAutocomplete: React.FC<{
  value: string;
  onChange: (val: string) => void;
  className?: string;
  placeholder?: string;
}> = ({ value, onChange, className = "", placeholder = "Enter your city" }) => {
  const [inputValue, setInputValue] = useState(value);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Keep inputValue in sync with value from parent
  useEffect(() => {
    setInputValue(value);
  }, [value]);

  // Auto-detect location on mount
  useEffect(() => {
    if (!value && "geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(async (pos) => {
        const { latitude, longitude } = pos.coords;
        const res = await fetch(
          `https://api.locationiq.com/v1/reverse?key=${LOCATIONIQ_API_KEY}&lat=${latitude}&lon=${longitude}&format=json`
        );
        const data = await res.json();
        const address = data.address || {};
        const district =
          address.district ||
          address.city_district ||
          address.suburb ||
          address.city ||
          address.town ||
          address.village ||
          address.state ||
          "";
        if (district) {
          setInputValue(district);
          onChange(district);
        }
      });
    }
    // eslint-disable-next-line
  }, []);

  // Fetch suggestions as user types
  useEffect(() => {
    if (inputValue.length < 2) {
      setSuggestions([]);
      return;
    }
    setLoading(true);
    const timeout = setTimeout(async () => {
      const res = await fetch(
        `https://api.locationiq.com/v1/autocomplete?key=${LOCATIONIQ_API_KEY}&q=${encodeURIComponent(
          inputValue
        )}&countrycodes=in&limit=5&dedupe=1&normalizecity=1&format=json`
      );
      const data = await res.json();
      setSuggestions(data);
      setLoading(false);
    }, 300); // debounce
    return () => clearTimeout(timeout);
  }, [inputValue]);

  // Helper to extract district name from address
  const getDistrictName = (suggestion: Suggestion) => {
    if (suggestion && suggestion.address) {
      const address = suggestion.address;
      return (
        address.district ||
        address.city_district ||
        address.suburb ||
        address.city ||
        address.town ||
        address.village ||
        address.state ||
        getCityName(suggestion.display_name)
      );
    }
    return getCityName(suggestion.display_name);
  };

  // Helper to extract city name from display_name
  const getCityName = (displayName: string) => {
    return displayName.split(",")[0];
  };

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    setShowSuggestions(true);
  };

  // Handle suggestion select
  const handleSuggestionSelect = (district: string) => {
    setInputValue(district);
    onChange(district);
    setShowSuggestions(false);
  };

  // Handle Enter key
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      onChange(inputValue);
      setShowSuggestions(false);
    }
  };

  return (
    <div style={{ position: "relative" }} className={className}>
      <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
      <input
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        autoComplete="off"
        onFocus={() => setShowSuggestions(true)}
        onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
        className="w-full pl-10 h-12 form-input rounded"
        style={{ paddingLeft: 40 }}
      />
      {loading && <div className="absolute left-0 top-full bg-white p-2 text-xs">Loading...</div>}
      {showSuggestions && suggestions.length > 0 && (
        <ul
          style={{
            position: "absolute",
            zIndex: 10,
            background: "#fff",
            width: "100%",
            border: "1px solid #ccc",
            margin: 0,
            padding: 0,
            listStyle: "none",
            maxHeight: 200,
            overflowY: "auto",
          }}
        >
          {suggestions.map((s, i) => (
            <li
              key={i}
              className="px-3 py-2 cursor-pointer text-black hover:bg-gray-100"
              onMouseDown={() => handleSuggestionSelect(getDistrictName(s))}
            >
              {getDistrictName(s)}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default LocationAutocomplete; 