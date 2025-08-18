import {
  User,
  Business,
  QueueBooking,
  BusinessCategory,
  Notification,
  Review,
  TimeSlot,
  Service,
  Message,
  AdminStats,
  BusinessAnalytics,
} from "../types";

export const BUSINESS_CATEGORIES = [
  {
    value: "hospital" as BusinessCategory,
    label: "Hospitals",
    icon: "🏥",
    color: "bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-200",
  },
  {
    value: "salon" as BusinessCategory,
    label: "Salons & Spas",
    icon: "💇‍♀️",
    color: "bg-pink-100 text-pink-800 dark:bg-pink-950 dark:text-pink-200",
  },
  {
    value: "bank" as BusinessCategory,
    label: "Banks",
    icon: "🏦",
    color: "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-200",
  },
  {
    value: "government" as BusinessCategory,
    label: "Government Offices",
    icon: "🏛️",
    color: "bg-gray-100 text-gray-800 dark:bg-gray-950 dark:text-gray-200",
  },
  {
    value: "restaurant" as BusinessCategory,
    label: "Restaurants",
    icon: "🍽️",
    color:
      "bg-orange-100 text-orange-800 dark:bg-orange-950 dark:text-orange-200",
  },
  {
    value: "clinic" as BusinessCategory,
    label: "Clinics",
    icon: "🩺",
    color: "bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-200",
  },
  {
    value: "pharmacy" as BusinessCategory,
    label: "Pharmacies",
    icon: "💊",
    color:
      "bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-200",
  },
  {
    value: "dental" as BusinessCategory,
    label: "Dental Clinics",
    icon: "🦷",
    color: "bg-teal-100 text-teal-800 dark:bg-teal-950 dark:text-teal-200",
  },
  {
    value: "eye-care" as BusinessCategory,
    label: "Eye Care",
    icon: "👁️",
    color:
      "bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-200",
  },
  {
    value: "gym" as BusinessCategory,
    label: "Gyms & Fitness",
    icon: "💪",
    color:
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-950 dark:text-yellow-200",
  },
  {
    value: "auto-service" as BusinessCategory,
    label: "Auto Service",
    icon: "🚗",
    color: "bg-cyan-100 text-cyan-800 dark:bg-cyan-950 dark:text-cyan-200",
  },
  {
    value: "legal" as BusinessCategory,
    label: "Legal Services",
    icon: "⚖️",
    color: "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-200",
  },
];

export let mockUsers: User[] = [
  {
    id: "user-1",
    name: "John Doe",
    email: "john@example.com",
    phone: "+1-555-0123",
    role: "user",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=John",
    location: "New York, NY",
    preferences: {
      notifications: {
        email: true,
        sms: true,
        push: true,
        bookingUpdates: true,
        promotions: false,
      },
      language: "en",
      timeFormat: "12h",
      autoFillInfo: true,
      flexibleTiming: true,
    },
    bookmarks: ["business-1", "business-3"],
    createdAt: "2024-01-15T10:00:00Z",
    updatedAt: "2024-01-15T10:00:00Z",
  },
  {
    id: "user-2",
    name: "Sarah Johnson",
    email: "sarah@example.com",
    phone: "+1-555-0124",
    role: "user",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
    location: "Los Angeles, CA",
    preferences: {
      notifications: {
        email: true,
        sms: false,
        push: true,
        bookingUpdates: true,
        promotions: true,
      },
      language: "en",
      timeFormat: "24h",
      autoFillInfo: false,
      flexibleTiming: false,
    },
    bookmarks: ["business-2", "business-4"],
    createdAt: "2024-01-16T10:00:00Z",
    updatedAt: "2024-01-16T10:00:00Z",
  },
  {
    id: "business-1",
    name: "Dr. Michael Smith",
    email: "michael@cityhospital.com",
    phone: "+1-555-0125",
    role: "business",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Michael",
    createdAt: "2024-01-10T10:00:00Z",
    updatedAt: "2024-01-10T10:00:00Z",
  },
  {
    id: "business-2",
    name: "Lisa Beauty",
    email: "lisa@glamoursalon.com",
    phone: "+1-555-0126",
    role: "business",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Lisa",
    createdAt: "2024-01-12T10:00:00Z",
    updatedAt: "2024-01-12T10:00:00Z",
  },
  {
    id: "admin-1",
    name: "Admin User",
    email: "admin@skiply.com",
    phone: "+1-555-0127",
    role: "admin",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Admin",
    createdAt: "2024-01-01T10:00:00Z",
    updatedAt: "2024-01-01T10:00:00Z",
  },
];

export let mockServices: Service[] = [
  {
    id: "service-1",
    name: "General Consultation",
    description: "Initial consultation with doctor",
    duration: 30,
    price: 150,
    departmentId: "dept-1",
    isActive: true,
  },
  {
    id: "service-2",
    name: "X-Ray",
    description: "Digital X-Ray imaging",
    duration: 15,
    price: 100,
    departmentId: "dept-2",
    isActive: true,
  },
  {
    id: "service-3",
    name: "Hair Cut & Style",
    description: "Professional haircut and styling",
    duration: 45,
    price: 75,
    departmentId: "dept-4",
    isActive: true,
  },
  {
    id: "service-4",
    name: "Hair Color",
    description: "Full hair coloring service",
    duration: 120,
    price: 200,
    departmentId: "dept-4",
    isActive: true,
  },
];

export let mockBusinesses: Business[] = [
  {
    id: "business-1",
    name: "City General Hospital",
    ownerId: "business-1",
    category: "hospital",
    address: "123 Medical Center Dr, New York, NY 10001",
    description:
      "Leading healthcare facility with 24/7 emergency services and specialized departments. We provide comprehensive medical care with state-of-the-art equipment and experienced medical professionals.",
    coverPhoto:
      "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800",
    logo: "https://images.unsplash.com/photo-1516549655169-df83a0774514?w=200",
    photos: [
      "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800",
      "https://images.unsplash.com/photo-1516549655169-df83a0774514?w=800",
      "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800",
      "https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=800",
      "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800",
    ],
    rating: 4.5,
    totalReviews: 1248,
    openingHours: {
      monday: { start: "00:00", end: "23:59", closed: false },
      tuesday: { start: "00:00", end: "23:59", closed: false },
      wednesday: { start: "00:00", end: "23:59", closed: false },
      thursday: { start: "00:00", end: "23:59", closed: false },
      friday: { start: "00:00", end: "23:59", closed: false },
      saturday: { start: "00:00", end: "23:59", closed: false },
      sunday: { start: "00:00", end: "23:59", closed: false },
    },
    departments: [
      {
        id: "dept-1",
        name: "Emergency Department",
        description: "Immediate medical attention for urgent cases",
        estimatedWaitTime: 45,
        maxQueueSize: 50,
        currentQueueSize: 12,
        isActive: true,
        price: 200,
        services: ["service-1"],
        bufferTime: 10,
      },
      {
        id: "dept-2",
        name: "Radiology",
        description: "X-rays, CT scans, and MRI services",
        estimatedWaitTime: 30,
        maxQueueSize: 25,
        currentQueueSize: 5,
        isActive: true,
        price: 150,
        services: ["service-2"],
        bufferTime: 15,
      },
      {
        id: "dept-3",
        name: "General Medicine",
        description: "Routine checkups and general health consultations",
        estimatedWaitTime: 25,
        maxQueueSize: 30,
        currentQueueSize: 8,
        isActive: true,
        price: 100,
        bufferTime: 5,
      },
    ],
    services: ["service-1", "service-2"],
    isAcceptingBookings: true,
    contact: {
      phone: "+1-555-HOSPITAL",
      whatsapp: "+1-555-0125",
      email: "info@cityhospital.com",
      website: "https://cityhospital.com",
    },
    location: {
      lat: 40.7128,
      lng: -74.006,
    },
    isVerified: true,
    status: "approved",
    queueSettings: {
      maxAdvanceBookingDays: 30,
      allowWalkIns: true,
      autoApprove: false,
      reminderSettings: {
        enabled: true,
        timeBefore: 30,
        methods: ["email", "sms"],
      },
      slotDuration: 30,
      bufferTime: 10,
      maxSlotsPerHour: 4,
      holidays: ["2024-12-25", "2024-01-01"],
    },
    analytics: {
      daily: [
        {
          date: "2024-01-20",
          totalBookings: 45,
          completedBookings: 40,
          cancelledBookings: 3,
          noShowBookings: 2,
          averageWaitTime: 32,
          revenue: 4500,
          newCustomers: 8,
          rating: 4.5,
        },
        {
          date: "2024-01-21",
          totalBookings: 52,
          completedBookings: 48,
          cancelledBookings: 2,
          noShowBookings: 2,
          averageWaitTime: 28,
          revenue: 5200,
          newCustomers: 12,
          rating: 4.6,
        },
      ],
      weekly: [
        {
          week: "2024-W03",
          totalBookings: 320,
          averageRating: 4.5,
          revenue: 32000,
        },
      ],
      monthly: [
        {
          month: "2024-01",
          totalBookings: 1250,
          averageRating: 4.5,
          revenue: 125000,
          growth: 12.5,
        },
      ],
      peakHours: [
        { hour: 9, bookingCount: 25, day: "monday" },
        { hour: 14, bookingCount: 30, day: "tuesday" },
      ],
      topCustomers: [
        {
          userId: "user-1",
          customerName: "John Doe",
          totalBookings: 15,
          totalSpent: 1500,
          lastVisit: "2024-01-20",
          averageRating: 4.8,
        },
      ],
      departmentStats: [
        {
          departmentId: "dept-1",
          departmentName: "Emergency",
          totalBookings: 150,
          averageWaitTime: 45,
          revenue: 15000,
          rating: 4.3,
        },
      ],
      revenueStats: {
        today: 2500,
        thisWeek: 15000,
        thisMonth: 50000,
        thisYear: 500000,
        growth: {
          daily: 5.2,
          weekly: 8.7,
          monthly: 12.3,
          yearly: 15.8,
        },
      },
    },
    createdAt: "2024-01-10T10:00:00Z",
    updatedAt: "2024-01-20T10:00:00Z",
  },
  {
    id: "business-2",
    name: "Glamour Beauty Salon",
    ownerId: "business-2",
    category: "salon",
    address: "456 Beauty Street, Los Angeles, CA 90210",
    description:
      "Premium beauty salon offering the latest trends in hair styling, coloring, and beauty treatments. Our expert stylists provide personalized services in a luxurious environment.",
    coverPhoto:
      "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800",
    logo: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=200",
    photos: [
      "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800",
      "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800",
      "https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?w=800",
      "https://images.unsplash.com/photo-1562322140-8baeececf3df?w=800",
    ],
    rating: 4.8,
    totalReviews: 892,
    openingHours: {
      monday: { start: "09:00", end: "19:00", closed: false },
      tuesday: { start: "09:00", end: "19:00", closed: false },
      wednesday: { start: "09:00", end: "19:00", closed: false },
      thursday: { start: "09:00", end: "21:00", closed: false },
      friday: { start: "09:00", end: "21:00", closed: false },
      saturday: { start: "08:00", end: "20:00", closed: false },
      sunday: { start: "10:00", end: "18:00", closed: false },
    },
    departments: [
      {
        id: "dept-4",
        name: "Hair Styling",
        description: "Professional hair cutting, styling, and treatments",
        estimatedWaitTime: 60,
        maxQueueSize: 15,
        currentQueueSize: 3,
        isActive: true,
        price: 85,
        services: ["service-3", "service-4"],
        bufferTime: 15,
      },
      {
        id: "dept-5",
        name: "Nail Care",
        description: "Manicure, pedicure, and nail art services",
        estimatedWaitTime: 45,
        maxQueueSize: 10,
        currentQueueSize: 2,
        isActive: true,
        price: 50,
        bufferTime: 10,
      },
    ],
    services: ["service-3", "service-4"],
    isAcceptingBookings: true,
    contact: {
      phone: "+1-555-BEAUTY",
      whatsapp: "+1-555-0126",
      email: "info@glamoursalon.com",
      website: "https://glamoursalon.com",
    },
    location: {
      lat: 34.0522,
      lng: -118.2437,
    },
    isVerified: true,
    status: "approved",
    queueSettings: {
      maxAdvanceBookingDays: 14,
      allowWalkIns: true,
      autoApprove: true,
      reminderSettings: {
        enabled: true,
        timeBefore: 60,
        methods: ["email", "push"],
      },
      slotDuration: 60,
      bufferTime: 15,
      maxSlotsPerHour: 2,
      holidays: ["2024-12-25", "2024-01-01"],
    },
    createdAt: "2024-01-12T10:00:00Z",
    updatedAt: "2024-01-20T10:00:00Z",
  },
  // Add more businesses with complete data...
  {
    id: "business-3",
    name: "First National Bank",
    ownerId: "business-1",
    category: "bank",
    address: "789 Financial District, Chicago, IL 60601",
    description:
      "Full-service banking with personal and business solutions. Experience fast, efficient service with our digital queue management system.",
    coverPhoto:
      "https://images.unsplash.com/photo-1541354329998-f4d9a9f9297f?w=800",
    logo: "https://images.unsplash.com/photo-1616077167599-a4e1e6adc95e?w=200",
    photos: [
      "https://images.unsplash.com/photo-1541354329998-f4d9a9f9297f?w=800",
      "https://images.unsplash.com/photo-1616077167599-a4e1e6adc95e?w=800",
    ],
    rating: 4.2,
    totalReviews: 456,
    openingHours: {
      monday: { start: "09:00", end: "17:00", closed: false },
      tuesday: { start: "09:00", end: "17:00", closed: false },
      wednesday: { start: "09:00", end: "17:00", closed: false },
      thursday: { start: "09:00", end: "18:00", closed: false },
      friday: { start: "09:00", end: "18:00", closed: false },
      saturday: { start: "09:00", end: "15:00", closed: false },
      sunday: { start: "00:00", end: "00:00", closed: true },
    },
    departments: [
      {
        id: "dept-6",
        name: "Customer Service",
        description: "General banking inquiries and account services",
        estimatedWaitTime: 15,
        maxQueueSize: 20,
        currentQueueSize: 6,
        isActive: true,
        bufferTime: 5,
      },
      {
        id: "dept-7",
        name: "Loan Department",
        description: "Personal and business loan consultations",
        estimatedWaitTime: 30,
        maxQueueSize: 10,
        currentQueueSize: 2,
        isActive: true,
        bufferTime: 10,
      },
    ],
    isAcceptingBookings: true,
    contact: {
      phone: "+1-555-BANK",
      email: "info@firstnational.com",
      website: "https://firstnational.com",
    },
    location: {
      lat: 41.8781,
      lng: -87.6298,
    },
    isVerified: true,
    status: "approved",
    queueSettings: {
      maxAdvanceBookingDays: 7,
      allowWalkIns: true,
      autoApprove: true,
      reminderSettings: {
        enabled: true,
        timeBefore: 15,
        methods: ["email"],
      },
      slotDuration: 15,
      bufferTime: 5,
      maxSlotsPerHour: 8,
      holidays: ["2024-12-25", "2024-01-01"],
    },
    createdAt: "2024-01-15T10:00:00Z",
    updatedAt: "2024-01-20T10:00:00Z",
  },
];

export let mockReviews: Review[] = [
  {
    id: "review-1",
    userId: "user-1",
    businessId: "business-1",
    bookingId: "booking-1",
    rating: 5,
    comment:
      "Excellent service! The staff was very professional and the wait time was minimal. The facilities are clean and modern. Highly recommend this hospital for anyone needing medical care.",
    photos: ["https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400"],
    isVerified: true,
    helpfulVotes: 12,
    response: {
      message:
        "Thank you for your kind words! We're thrilled to hear about your positive experience. Our team works hard to provide the best care possible.",
      respondedAt: "2024-01-21T14:30:00Z",
      respondedBy: "business-1",
    },
    createdAt: "2024-01-20T10:00:00Z",
    updatedAt: "2024-01-20T10:00:00Z",
  },
  {
    id: "review-2",
    userId: "user-2",
    businessId: "business-1",
    bookingId: "booking-2",
    rating: 4,
    comment:
      "Good service overall, but the wait was a bit longer than expected. The medical staff was knowledgeable and helpful.",
    isVerified: true,
    helpfulVotes: 8,
    createdAt: "2024-01-19T15:30:00Z",
    updatedAt: "2024-01-19T15:30:00Z",
  },
  {
    id: "review-3",
    userId: "user-1",
    businessId: "business-2",
    bookingId: "booking-3",
    rating: 5,
    comment:
      "Amazing haircut and color! Lisa is incredibly talented and really listened to what I wanted. The salon has a great atmosphere and I felt pampered throughout my visit.",
    photos: ["https://images.unsplash.com/photo-1562322140-8baeececf3df?w=400"],
    isVerified: true,
    helpfulVotes: 15,
    response: {
      message:
        "Thank you so much! We're delighted you loved your new look. Lisa will be thrilled to hear this feedback!",
      respondedAt: "2024-01-19T11:00:00Z",
      respondedBy: "business-2",
    },
    createdAt: "2024-01-18T16:45:00Z",
    updatedAt: "2024-01-18T16:45:00Z",
  },
];

export let mockTimeSlots: TimeSlot[] = [
  // Hospital slots for today
  {
    id: "slot-1",
    time: "09:00",
    date: "2024-01-21",
    available: true,
    capacity: 4,
    booked: 2,
    departmentId: "dept-1",
    businessId: "business-1",
  },
  {
    id: "slot-2",
    time: "09:30",
    date: "2024-01-21",
    available: true,
    capacity: 4,
    booked: 4,
    departmentId: "dept-1",
    businessId: "business-1",
  },
  {
    id: "slot-3",
    time: "10:00",
    date: "2024-01-21",
    available: true,
    capacity: 4,
    booked: 1,
    departmentId: "dept-1",
    businessId: "business-1",
  },
  // Salon slots for today
  {
    id: "slot-4",
    time: "10:00",
    date: "2024-01-21",
    available: true,
    capacity: 2,
    booked: 0,
    departmentId: "dept-4",
    businessId: "business-2",
  },
  {
    id: "slot-5",
    time: "11:00",
    date: "2024-01-21",
    available: true,
    capacity: 2,
    booked: 1,
    departmentId: "dept-4",
    businessId: "business-2",
  },
];

export let mockNotifications: Notification[] = [
  {
    id: "notif-1",
    userId: "user-1",
    type: "booking_confirmed",
    title: "Booking Confirmed",
    message:
      "Your appointment at City General Hospital has been confirmed for tomorrow at 2:00 PM.",
    data: {
      bookingId: "booking-1",
      businessId: "business-1",
      actionUrl: "/queue-tracker/booking-1",
    },
    isRead: false,
    createdAt: "2024-01-20T14:30:00Z",
  },
  {
    id: "notif-2",
    userId: "user-1",
    type: "turn_approaching",
    title: "Your Turn is Coming Up",
    message:
      "You're next in line at City General Hospital. Please arrive in the next 10 minutes.",
    data: {
      bookingId: "booking-1",
      businessId: "business-1",
      estimatedTime: 10,
    },
    isRead: false,
    createdAt: "2024-01-20T13:45:00Z",
  },
  {
    id: "notif-3",
    userId: "user-1",
    type: "review_request",
    title: "How was your experience?",
    message:
      "Please take a moment to review your recent visit to Glamour Beauty Salon.",
    data: {
      bookingId: "booking-3",
      businessId: "business-2",
    },
    isRead: true,
    createdAt: "2024-01-19T18:00:00Z",
  },
];

export let mockMessages: Message[] = [
  {
    id: "msg-1",
    senderId: "user-1",
    receiverId: "business-1",
    businessId: "business-1",
    subject: "Question about my appointment",
    content:
      "Hi, I need to reschedule my appointment for tomorrow. Is there availability for next week?",
    type: "booking_change",
    isRead: false,
    createdAt: "2024-01-20T15:30:00Z",
  },
  {
    id: "msg-2",
    senderId: "business-1",
    receiverId: "user-1",
    businessId: "business-1",
    content:
      "Hello! Yes, we have availability next Tuesday at 2:00 PM or Wednesday at 10:00 AM. Which would work better for you?",
    type: "booking_change",
    isRead: true,
    createdAt: "2024-01-20T16:15:00Z",
  },
];

export let mockQueueBookings: QueueBooking[] = [
  {
    id: "booking-1",
    userId: "user-1",
    businessId: "business-1",
    departmentId: "dept-1",
    serviceId: "service-1",
    tokenNumber: 45,
    status: "confirmed",
    customerName: "John Doe",
    customerPhone: "+1-555-0123",
    customerEmail: "john@example.com",
    notes: "Feeling unwell, need general checkup",
    estimatedWaitTime: 30,
    scheduledDate: "2024-01-21",
    scheduledTime: "14:00",
    bookedAt: "2024-01-20T10:30:00Z",
    paymentStatus: "paid",
    amount: 150,
  },
  {
    id: "booking-2",
    userId: "user-2",
    businessId: "business-1",
    departmentId: "dept-2",
    tokenNumber: 23,
    status: "waiting",
    customerName: "Sarah Johnson",
    customerPhone: "+1-555-0124",
    notes: "X-ray for knee pain",
    estimatedWaitTime: 15,
    bookedAt: "2024-01-20T09:15:00Z",
  },
  {
    id: "booking-3",
    userId: "user-1",
    businessId: "business-2",
    departmentId: "dept-4",
    serviceId: "service-3",
    tokenNumber: 8,
    status: "completed",
    customerName: "John Doe",
    customerPhone: "+1-555-0123",
    notes: "Haircut and style for wedding",
    estimatedWaitTime: 45,
    actualWaitTime: 50,
    scheduledDate: "2024-01-18",
    scheduledTime: "15:00",
    bookedAt: "2024-01-17T14:20:00Z",
    checkedInAt: "2024-01-18T14:55:00Z",
    completedAt: "2024-01-18T16:30:00Z",
    rating: 5,
    review: "Excellent service!",
    paymentStatus: "paid",
    amount: 75,
  },
];

export const mockAdminStats: AdminStats = {
  totalUsers: 15420,
  totalBusinesses: 1250,
  totalBookings: 45780,
  activeBookings: 1230,
  completedBookings: 42350,
  cancelledBookings: 2200,
  userGrowth: 12.5,
  businessGrowth: 8.7,
  bookingGrowth: 15.3,
  revenue: {
    total: 2450000,
    thisMonth: 340000,
    growth: 18.5,
  },
  platformUsage: [
    {
      date: "2024-01-15",
      activeUsers: 1250,
      newSignups: 45,
      bookingsMade: 320,
    },
    {
      date: "2024-01-16",
      activeUsers: 1380,
      newSignups: 52,
      bookingsMade: 385,
    },
    {
      date: "2024-01-17",
      activeUsers: 1420,
      newSignups: 38,
      bookingsMade: 410,
    },
    {
      date: "2024-01-18",
      activeUsers: 1510,
      newSignups: 61,
      bookingsMade: 445,
    },
    {
      date: "2024-01-19",
      activeUsers: 1350,
      newSignups: 43,
      bookingsMade: 380,
    },
    {
      date: "2024-01-20",
      activeUsers: 1680,
      newSignups: 67,
      bookingsMade: 520,
    },
  ],
  cityStats: [
    {
      city: "New York",
      userCount: 3450,
      businessCount: 280,
      bookingCount: 12500,
      growth: 15.2,
    },
    {
      city: "Los Angeles",
      userCount: 2890,
      businessCount: 225,
      bookingCount: 9800,
      growth: 12.8,
    },
    {
      city: "Chicago",
      userCount: 2150,
      businessCount: 180,
      bookingCount: 7200,
      growth: 18.5,
    },
    {
      city: "Houston",
      userCount: 1780,
      businessCount: 145,
      bookingCount: 5900,
      growth: 22.1,
    },
  ],
};

// Utility functions
export const getBusinessById = (id: string): Business | undefined => {
  return mockBusinesses.find((business) => business.id === id);
};

export const getBookingsByUserId = (userId: string): QueueBooking[] => {
  return mockQueueBookings.filter((booking) => booking.userId === userId);
};

export const getBookingsByBusinessId = (businessId: string): QueueBooking[] => {
  return mockQueueBookings.filter(
    (booking) => booking.businessId === businessId,
  );
};

export const getReviewsByBusinessId = (businessId: string): Review[] => {
  return mockReviews.filter((review) => review.businessId === businessId);
};

export const getNotificationsByUserId = (userId: string): Notification[] => {
  return mockNotifications.filter(
    (notification) => notification.userId === userId,
  );
};

export const getMessagesByUserId = (userId: string): Message[] => {
  return mockMessages.filter(
    (message) => message.senderId === userId || message.receiverId === userId,
  );
};

export const addNotification = (
  notification: Omit<Notification, "id" | "createdAt">,
) => {
  const newNotification: Notification = {
    ...notification,
    id: `notif-${Date.now()}`,
    createdAt: new Date().toISOString(),
  };
  mockNotifications.unshift(newNotification);
  return newNotification;
};

export const addBooking = (
  booking: Omit<QueueBooking, "id" | "tokenNumber" | "bookedAt">,
) => {
  const newBooking: QueueBooking = {
    ...booking,
    id: `booking-${Date.now()}`,
    tokenNumber: Math.floor(Math.random() * 100) + 1,
    bookedAt: new Date().toISOString(),
  };
  mockQueueBookings.push(newBooking);
  return newBooking;
};

export const updateBookingStatus = (
  bookingId: string,
  status: QueueBooking["status"],
) => {
  const booking = mockQueueBookings.find((b) => b.id === bookingId);
  if (booking) {
    booking.status = status;
    if (status === "checked-in") {
      booking.checkedInAt = new Date().toISOString();
    } else if (status === "completed") {
      booking.completedAt = new Date().toISOString();
    } else if (status === "cancelled") {
      booking.cancelledAt = new Date().toISOString();
    }
  }
  return booking;
};

export const addUser = (user: Omit<User, "id" | "createdAt" | "updatedAt">) => {
  const newUser: User = {
    ...user,
    id: `user-${Date.now()}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  mockUsers.push(newUser);
  return newUser;
};

export const addBusiness = (
  business: Omit<Business, "id" | "createdAt" | "updatedAt">,
) => {
  const newBusiness: Business = {
    ...business,
    id: `business-${Date.now()}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  mockBusinesses.push(newBusiness);
  return newBusiness;
};

// Export mockBookings as an alias for mockQueueBookings for compatibility
export const mockBookings = mockQueueBookings;
