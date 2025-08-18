import { useState } from "react";
import { MapPin, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useApp } from "@/contexts/AppContext";

const SUGGESTED_LOCATIONS = [
  "New York, NY",
  "Los Angeles, CA",
  "Chicago, IL",
  "Houston, TX",
  "Phoenix, AZ",
  "Philadelphia, PA",
];

export function LocationSearch() {
  const { selectedLocation, setSelectedLocation } = useApp();
  const [inputValue, setInputValue] = useState(selectedLocation);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const handleLocationSelect = (location: string) => {
    setInputValue(location);
    setSelectedLocation(location);
    setShowSuggestions(false);
  };

  const handleSearch = () => {
    setSelectedLocation(inputValue);
    setShowSuggestions(false);
  };

  const handleCurrentLocation = () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        const apiKey = "YOUR_LOCATIONIQ_API_KEY"; // Replace with actual key

        try {
          const response = await fetch(
            `https://us1.locationiq.com/v1/reverse?key=${apiKey}&lat=${latitude}&lon=${longitude}&format=json`
          );

          const data = await response.json();
          const location = data.address.city || data.display_name || "Unknown Location";
          const { setSelectedLocation, setSelectedLocationCoords } = useApp();


          handleLocationSelect(location);
          setSelectedLocationCoords({ lat: latitude, lng: longitude });

          // Optionally: Store coords for distance calculation

        } catch (error) {
          console.error("Reverse geocoding failed:", error);
          handleLocationSelect("New York, NY"); // Fallback
        }
      },
      (error) => {
        console.error("Error getting geolocation:", error);
        handleLocationSelect("Ahmedabad");
      }
    );
  } else {
    handleLocationSelect("Ahmedabad");
  }
};

  const filteredSuggestions = SUGGESTED_LOCATIONS.filter((location) =>
    location.toLowerCase().includes(inputValue.toLowerCase()),
  );

  return (
    <div className="relative w-full max-w-md">
      <div className="flex space-x-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Enter your location..."
            value={inputValue}
            onChange={(e) => {
              setInputValue(e.target.value);
              setShowSuggestions(true);
            }}
            onFocus={() => setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
            className="pl-9 pr-4"
          />

          {showSuggestions &&
            (inputValue || filteredSuggestions.length > 0) && (
              <div className="absolute z-50 w-full mt-1 bg-popover border border-border rounded-md shadow-lg max-h-60 overflow-auto">
                {filteredSuggestions.map((location) => (
                  <button
                    key={location}
                    className="w-full px-3 py-2 text-left hover:bg-accent hover:text-accent-foreground transition-colors text-sm"
                    onMouseDown={() => handleLocationSelect(location)}
                  >
                    <MapPin className="inline w-3 h-3 mr-2 text-muted-foreground" />
                    {location}
                  </button>
                ))}
              </div>
            )}
        </div>

        <Button variant="outline" size="icon" onClick={handleCurrentLocation}>
          <MapPin className="h-4 w-4" />
        </Button>

        <Button onClick={handleSearch}>Search</Button>
      </div>
    </div>
  );
}
