// src/contexts/AppContext.tsx

import React, { createContext, useContext, useReducer, useEffect, useState } from "react";
import {
  Business,
  QueueBooking,
  AppState,
  BusinessCategory,
} from "@/lib/types";
import { businessAPI, queueAPI } from "@/lib/api";
import { DEFAULT_LOCATION } from "@/lib/constants";
import { useAuth } from "./AuthContext";

interface AppContextType extends AppState {
  setSelectedLocation: (location: string) => void;
  setSelectedCategory: (category: BusinessCategory | "all") => void;
  loadBusinesses: () => Promise<void>;
  loadUserBookings: () => Promise<void>;
  addBooking: (booking: QueueBooking) => void;
  removeBooking: (bookingId: string) => void;
  isLoading: boolean;
  selectedLocationCoords: { lat: number; lng: number } | null;
  setSelectedLocationCoords: (coords: { lat: number; lng: number } | null) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

type AppAction =
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_BUSINESSES"; payload: Business[] }
  | { type: "SET_NEARBY_BUSINESSES"; payload: Business[] }
  | { type: "SET_LOCATION"; payload: string }
  | { type: "SET_CATEGORY"; payload: BusinessCategory | "all" }
  | { type: "SET_USER_BOOKINGS"; payload: QueueBooking[] }
  | { type: "ADD_BOOKING"; payload: QueueBooking }
  | { type: "REMOVE_BOOKING"; payload: string }
  | { type: "UPDATE_BOOKING"; payload: QueueBooking };

const appReducer = (
  state: AppState & { isLoading: boolean },
  action: AppAction,
): AppState & { isLoading: boolean } => {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, isLoading: action.payload };
    case "SET_BUSINESSES":
      return { ...state, businesses: action.payload };
    case "SET_NEARBY_BUSINESSES":
      return { ...state, nearbyBusinesses: action.payload };
    case "SET_LOCATION":
      return { ...state, selectedLocation: action.payload };
    case "SET_CATEGORY":
      return { ...state, selectedCategory: action.payload };
    case "SET_USER_BOOKINGS":
      return { ...state, userBookings: action.payload };
    case "ADD_BOOKING":
      return { ...state, userBookings: [...state.userBookings, action.payload] };
    case "REMOVE_BOOKING":
      return { ...state, userBookings: state.userBookings.filter((b) => b.id !== action.payload) };
    case "UPDATE_BOOKING":
      return {
        ...state,
        userBookings: state.userBookings.map((b) =>
          b.id === action.payload.id ? action.payload : b,
        ),
      };
    default:
      return state;
  }
};

const initialState: AppState & { isLoading: boolean } = {
  businesses: [],
  nearbyBusinesses: [],
  selectedLocation: DEFAULT_LOCATION,
  selectedCategory: "all",
  userBookings: [],
  isLoading: false,
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);
  const { user, isAuthenticated } = useAuth();

  // ✅ State for coordinates
  const [selectedLocationCoords, setSelectedLocationCoords] = useState<{
    lat: number;
    lng: number;
  } | null>(null);

  const setSelectedLocation = (location: string) => {
    dispatch({ type: "SET_LOCATION", payload: location });
  };

  const setSelectedCategory = (category: BusinessCategory | "all") => {
    dispatch({ type: "SET_CATEGORY", payload: category });
  };

  const loadBusinesses = async () => {
    dispatch({ type: "SET_LOADING", payload: true });
    try {
      const businesses = await businessAPI.getAll(
        state.selectedCategory === "all" ? undefined : state.selectedCategory,
        state.selectedLocation,
      );
      dispatch({ type: "SET_BUSINESSES", payload: businesses });
      dispatch({ type: "SET_NEARBY_BUSINESSES", payload: businesses.slice(0, 6) });
    } catch (error) {
      console.error("Failed to load businesses:", error);
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  };

  const loadUserBookings = async () => {
    if (!user || !isAuthenticated) return;
    try {
      const bookings = await queueAPI.getUserBookings(user.id);
      dispatch({ type: "SET_USER_BOOKINGS", payload: bookings });
    } catch (error) {
      console.error("Failed to load user bookings:", error);
    }
  };

  const addBooking = (booking: QueueBooking) => {
    dispatch({ type: "ADD_BOOKING", payload: booking });
  };

  const removeBooking = (bookingId: string) => {
    dispatch({ type: "REMOVE_BOOKING", payload: bookingId });
  };

  // 📦 Load businesses on location/category change
  useEffect(() => {
    loadBusinesses();
  }, [state.selectedLocation, state.selectedCategory]);

  // 📦 Load bookings on login
  useEffect(() => {
    if (isAuthenticated && user) {
      loadUserBookings();
    }
  }, [user, isAuthenticated]);

  // 📍 Get current user location on mount
  useEffect(() => {
    if (!selectedLocationCoords && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setSelectedLocationCoords({ lat: latitude, lng: longitude });
          console.log("📍 User location set:", latitude, longitude);
        },
        (error) => {
          console.error("❌ Failed to get user location:", error.message);
        }
      );
    }
  }, []);

  return (
    <AppContext.Provider
      value={{
        businesses: state.businesses,
        nearbyBusinesses: state.nearbyBusinesses,
        selectedLocation: state.selectedLocation,
        selectedCategory: state.selectedCategory,
        userBookings: state.userBookings,
        isLoading: state.isLoading,
        setSelectedLocation,
        setSelectedCategory,
        loadBusinesses,
        loadUserBookings,
        addBooking,
        removeBooking,
        selectedLocationCoords,
        setSelectedLocationCoords,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error("useApp must be used within an AppProvider");
  return context;
};
