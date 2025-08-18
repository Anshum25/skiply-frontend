export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: "user" | "business" | "admin";
  avatar?: string;
  location?: string;
  preferences?: UserPreferences;
  bookmarks?: string[]; // business IDs
  createdAt: string;
  updatedAt: string;
}

export interface UserPreferences {
  notifications: {
    email: boolean;
    sms: boolean;
    push: boolean;
    bookingUpdates: boolean;
    promotions: boolean;
  };
  language: "en" | "hi" | "es" | "fr";
  timeFormat: "12h" | "24h";
  autoFillInfo: boolean;
  flexibleTiming: boolean; // willing to wait 15 mins for earlier slot
}

export interface Business {
  id: string;
  name: string;
  ownerId: string;
  category: BusinessCategory;
  address: string;
  description?: string;
  coverPhoto?: string;
  logo?: string;
  photos?: string[]; // gallery images
  images?: string[];
  rating: number;
  totalReviews: number;
  openingHours: {
    [key: string]: { start: string; end: string; closed: boolean };
  };
  departments: Department[];
  services?: Service[];
  isAcceptingBookings: boolean;
  contact: {
    phone?: string;
    whatsapp?: string;
    email?: string;
    website?: string;
  };
  location: {
    lat: number;
    lng: number;
  };
  isVerified: boolean;
  status: BusinessStatus;
  queueSettings: QueueSettings;
  analytics?: BusinessAnalytics;
  createdAt: string;
  updatedAt: string;
}

export interface Department {
  id: string;
  name: string;
  description?: string;
  estimatedWaitTime: number; // in minutes
  maxQueueSize: number;
  currentQueueSize: number;
  isActive: boolean;
  price?: number;
  services?: string[]; // service IDs
  bufferTime?: number; // minutes between appointments
}

export interface Service {
  id: string;
  name: string;
  description?: string;
  duration: number; // in minutes
  price?: number;
  departmentId: string;
  isActive: boolean;
}

export interface QueueBooking {
  id: string;
  userId: string;
  businessId: string;
  departmentId: string;
  serviceId?: string;
  tokenNumber: number;
  status: BookingStatus;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  notes?: string;
  estimatedWaitTime: number;
  actualWaitTime?: number;
  scheduledDate?: string; // for future bookings
  scheduledTime?: string; // preferred time slot
  bookedAt: string;
  checkedInAt?: string;
  completedAt?: string;
  cancelledAt?: string;
  rating?: number;
  review?: string;
  paymentStatus?: PaymentStatus;
  amount?: number;
}

export interface TimeSlot {
  id: string;
  time: string; // HH:MM format
  date: string; // YYYY-MM-DD format
  available: boolean;
  capacity: number;
  booked: number;
  departmentId: string;
  businessId: string;
}

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  data?: any; // additional data
  isRead: boolean;
  createdAt: string;
  expiresAt?: string;
}

export interface Review {
  id: string;
  userId: string;
  businessId: string;
  bookingId: string;
  rating: number; // 1-5
  comment?: string;
  photos?: string[];
  isVerified: boolean;
  helpfulVotes: number;
  response?: BusinessResponse;
  createdAt: string;
  updatedAt: string;
}

export interface BusinessResponse {
  message: string;
  respondedAt: string;
  respondedBy: string; // user ID
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  businessId?: string;
  subject?: string;
  content: string;
  type: MessageType;
  isRead: boolean;
  attachments?: string[];
  createdAt: string;
}

export interface QueuePosition {
  position: number;
  estimatedWaitTime: number;
  peopleAhead: number;
  tokenNumber: number;
  lastUpdated: string;
}

export interface BusinessAnalytics {
  daily: DailyStats[];
  weekly: WeeklyStats[];
  monthly: MonthlyStats[];
  peakHours: PeakHour[];
  topCustomers: CustomerStat[];
  departmentStats: DepartmentStat[];
  revenueStats: RevenueStats;
}

export interface DailyStats {
  date: string;
  totalBookings: number;
  completedBookings: number;
  cancelledBookings: number;
  noShowBookings: number;
  averageWaitTime: number;
  revenue: number;
  newCustomers: number;
  rating: number;
}

export interface WeeklyStats {
  week: string; // YYYY-WW format
  totalBookings: number;
  averageRating: number;
  revenue: number;
}

export interface MonthlyStats {
  month: string; // YYYY-MM format
  totalBookings: number;
  averageRating: number;
  revenue: number;
  growth: number; // percentage
}

export interface PeakHour {
  hour: number; // 0-23
  bookingCount: number;
  day: string; // monday, tuesday, etc.
}

export interface CustomerStat {
  userId: string;
  customerName: string;
  totalBookings: number;
  totalSpent: number;
  lastVisit: string;
  averageRating: number;
}

export interface DepartmentStat {
  departmentId: string;
  departmentName: string;
  totalBookings: number;
  averageWaitTime: number;
  revenue: number;
  rating: number;
}

export interface RevenueStats {
  today: number;
  thisWeek: number;
  thisMonth: number;
  thisYear: number;
  growth: {
    daily: number;
    weekly: number;
    monthly: number;
    yearly: number;
  };
}

export interface AdminStats {
  totalUsers: number;
  totalBusinesses: number;
  totalBookings: number;
  activeBookings: number;
  completedBookings: number;
  cancelledBookings: number;
  userGrowth: number;
  businessGrowth: number;
  bookingGrowth: number;
  revenue: {
    total: number;
    thisMonth: number;
    growth: number;
  };
  platformUsage: PlatformUsage[];
  cityStats: CityStats[];
}

export interface PlatformUsage {
  date: string;
  activeUsers: number;
  newSignups: number;
  bookingsMade: number;
}

export interface CityStats {
  city: string;
  userCount: number;
  businessCount: number;
  bookingCount: number;
  growth: number;
}

export interface QueueSettings {
  maxAdvanceBookingDays: number;
  allowWalkIns: boolean;
  autoApprove: boolean;
  reminderSettings: {
    enabled: boolean;
    timeBefore: number; // minutes
    methods: ("email" | "sms" | "push")[];
  };
  slotDuration: number; // minutes
  bufferTime: number; // minutes between slots
  maxSlotsPerHour: number;
  holidays: string[]; // YYYY-MM-DD format
}

export type BookingStatus =
  | "pending"
  | "confirmed"
  | "waiting"
  | "checked-in"
  | "in-progress"
  | "completed"
  | "cancelled"
  | "no-show"
  | "rescheduled";

export type BusinessStatus = "pending" | "approved" | "suspended" | "rejected";

export type PaymentStatus = "pending" | "paid" | "failed" | "refunded";

export type NotificationType =
  | "booking_confirmed"
  | "booking_cancelled"
  | "queue_update"
  | "turn_approaching"
  | "booking_complete"
  | "business_message"
  | "review_request"
  | "promotion"
  | "system_update";

export type MessageType =
  | "customer_support"
  | "business_inquiry"
  | "complaint"
  | "compliment"
  | "booking_change"
  | "general";

export type BusinessCategory =
  | "hospital"
  | "salon"
  | "bank"
  | "government"
  | "restaurant"
  | "clinic"
  | "pharmacy"
  | "dental"
  | "eye-care"
  | "gym"
  | "spa"
  | "auto-service"
  | "legal"
  | "education"
  | "other";

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (
    email: string,
    password: string,
    role: "user" | "business",
  ) => Promise<void>;
  signupUser: (data: UserSignupData) => Promise<void>;
  signupBusiness: (data: BusinessSignupData) => Promise<void>;
  logout: () => void;
  updateProfile: (data: Partial<User>) => Promise<void>;
}

export interface ThemeContextType {
  theme: "light" | "dark";
  toggleTheme: () => void;
}

export interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (
    notification: Omit<Notification, "id" | "createdAt">,
  ) => void;
  markAsRead: (notificationId: string) => void;
  markAllAsRead: () => void;
  removeNotification: (notificationId: string) => void;
  clearAll: () => void;
}

export interface UserSignupData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone?: string;
}

export interface BusinessSignupData {
  ownerName: string;
  businessName: string;
  email: string;
  password: string;
  confirmPassword: string;
  category: BusinessCategory;
  address: string;
  description?: string;
  departments: string[];
  openingHours: {
    [key: string]: { start: string; end: string; closed: boolean };
  };
  contact: {
    phone?: string;
    whatsapp?: string;
    website?: string;
  };
}

export interface BookingFormData {
  departmentId: string;
  serviceId?: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  notes?: string;
  scheduledDate?: string;
  scheduledTime?: string;
  isFlexible?: boolean; // flexible with timing
}

export interface SearchFilters {
  category?: BusinessCategory;
  location?: string;
  radius?: number; // in km
  openNow?: boolean;
  rating?: number; // minimum rating
  sortBy?: "distance" | "rating" | "wait_time" | "popularity";
  priceRange?: {
    min: number;
    max: number;
  };
}

export interface CalendarDay {
  date: string;
  slots: TimeSlot[];
  isHoliday: boolean;
  dayOfWeek: string;
}

export interface WeekView {
  week: string;
  days: CalendarDay[];
}

export interface MonthView {
  month: string;
  weeks: WeekView[];
}

export interface Toast {
  id: string;
  title: string;
  description?: string;
  type: "success" | "error" | "warning" | "info";
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export interface AppConfig {
  maintenanceMode: boolean;
  announcement?: {
    title: string;
    message: string;
    type: "info" | "warning" | "success";
    showUntil?: string;
  };
  features: {
    queueBooking: boolean;
    advanceBooking: boolean;
    payments: boolean;
    reviews: boolean;
    notifications: boolean;
    chat: boolean;
  };
  limits: {
    maxAdvanceBookingDays: number;
    maxQueueSize: number;
    maxPhotosPerBusiness: number;
  };
}

// Utility types
export type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
export type RequiredBy<T, K extends keyof T> = T & Required<Pick<T, K>>;

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: string[];
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Chart data types for analytics
export interface ChartData {
  labels: string[];
  datasets: ChartDataset[];
}

export interface ChartDataset {
  label: string;
  data: number[];
  backgroundColor?: string | string[];
  borderColor?: string | string[];
  borderWidth?: number;
  fill?: boolean;
}
