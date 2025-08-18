import { BusinessCategory } from "./types";

export const BUSINESS_CATEGORIES: {
  value: BusinessCategory;
  label: string;
  icon: string;
}[] = [
  { value: "hospital", label: "Hospitals", icon: "🏥" },
  { value: "salon", label: "Salons & Spas", icon: "💇" },
  { value: "government", label: "Government Offices", icon: "🏛️" },
  { value: "bank", label: "Banks", icon: "🏦" },
  { value: "restaurant", label: "Restaurants", icon: "🍽️" },
  { value: "clinic", label: "Clinics", icon: "🩺" },
  { value: "pharmacy", label: "Pharmacies", icon: "💊" },
  { value: "other", label: "Other Services", icon: "🏢" },
];

export const QUEUE_STATUS_COLORS = {
  waiting: "bg-yellow-100 text-yellow-800 border-yellow-200",
  "in-progress": "bg-blue-100 text-blue-800 border-blue-200",
  completed: "bg-green-100 text-green-800 border-green-200",
  cancelled: "bg-red-100 text-red-800 border-red-200",
};

export const DEFAULT_LOCATION = "New York, NY";

export const API_BASE_URL = `${import.meta.env.VITE_API_URL}/api`;

export const SOCKET_URL = import.meta.env.VITE_API_URL.replace(/\/api$/, "");

export const ITEMS_PER_PAGE = 12;

export const MAX_QUEUE_SIZE = 50;

export const REFRESH_INTERVAL = 30000; // 30 seconds
