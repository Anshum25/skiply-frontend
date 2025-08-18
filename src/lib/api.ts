import {
  User,
  Business,
  QueueBooking,
  LoginForm,
  SignupUserForm,
  SignupBusinessForm,
  BookingForm,
  QueueStatus,
  BusinessCategory,
} from "./types";
import { BUSINESS_CATEGORIES } from "./constants";

// Mock data for development
export const mockBusinesses: Business[] = [
  {
    _id: "1",
    businessName: "City General Hospital",
    category: "hospital",
    address: "123 Medical Center Dr, New York, NY",
    description: "Leading healthcare facility with 24/7 emergency services",
    photo: "/placeholder.svg",
    rating: 4.5,
    totalReviews: 1250,
    departments: [
      {
        id: "d1",
        name: "Emergency",
        estimatedWaitTime: 30,
        currentQueueSize: 0,
        maxQueueSize: 20,
        isActive: true,
      },
      {
        id: "d2",
        name: "Cardiology",
        estimatedWaitTime: 45,
        currentQueueSize: 0,
        maxQueueSize: 15,
        isActive: true,
      },
      {
        id: "d3",
        name: "Orthopedics",
        estimatedWaitTime: 60,
        currentQueueSize: 0,
        maxQueueSize: 10,
        isActive: true,
      },
    ],
    ownerId: "owner1",
    isAcceptingBookings: true,
    location: { lat: 40.7128, lng: -74.006 },
    createdAt: "2024-01-15T08:00:00Z",
  },
  {
    _id: "2",
    businessName: "Glamour Hair Salon",
    category: "salon",
    address: "456 Beauty Ave, New York, NY",
    description: "Premium hair and beauty services",
    photo: "/placeholder.svg",
    rating: 4.8,
    totalReviews: 890,
    departments: [
      {
        id: "d4",
        name: "Hair Cut & Style",
        estimatedWaitTime: 20,
        currentQueueSize: 0,
        maxQueueSize: 12,
        isActive: true,
      },
      {
        id: "d5",
        name: "Hair Color",
        estimatedWaitTime: 90,
        currentQueueSize: 0,
        maxQueueSize: 8,
        isActive: true,
      },
      {
        id: "d6",
        name: "Manicure/Pedicure",
        estimatedWaitTime: 35,
        currentQueueSize: 0,
        maxQueueSize: 10,
        isActive: true,
      },
    ],
    ownerId: "owner2",
    isAcceptingBookings: true,
    location: { lat: 40.7589, lng: -73.9851 },
    createdAt: "2024-01-20T10:30:00Z",
  },
  {
    _id: "3",
    businessName: "First National Bank",
    category: "bank",
    address: "789 Financial St, New York, NY",
    description: "Full-service banking with personal and business solutions",
    photo: "/placeholder.svg",
    rating: 4.2,
    totalReviews: 567,
    departments: [
      {
        id: "d7",
        name: "Customer Service",
        estimatedWaitTime: 15,
        currentQueueSize: 0,
        maxQueueSize: 25,
        isActive: true,
      },
      {
        id: "d8",
        name: "Loan Officer",
        estimatedWaitTime: 45,
        currentQueueSize: 0,
        maxQueueSize: 8,
        isActive: true,
      },
      {
        id: "d9",
        name: "Investment Advisor",
        estimatedWaitTime: 60,
        currentQueueSize: 0,
        maxQueueSize: 6,
        isActive: true,
      },
    ],
    ownerId: "owner3",
    isAcceptingBookings: true,
    location: { lat: 40.7505, lng: -73.9934 },
    createdAt: "2024-02-01T09:00:00Z",
  },
];

const mockUsers: User[] = [
  {
    id: "user1",
    name: "John Doe",
    email: "john@example.com",
    role: "user",
    phone: "555-0123",
    location: "New York, NY",
    createdAt: "2024-01-10T12:00:00Z",
  },
  {
    id: "owner1",
    name: "Dr. Sarah Smith",
    email: "sarah@cityhospital.com",
    role: "business",
    phone: "555-0456",
    createdAt: "2024-01-15T08:00:00Z",
  },
  {
    id: "admin1",
    name: "Admin User",
    email: "admin@skiply.com",
    role: "admin",
    createdAt: "2024-01-01T00:00:00Z",
  },
];

let mockBookings: QueueBooking[] = [
  {
    id: "booking1",
    userId: "user1",
    businessId: "1",
    departmentId: "d1",
    tokenNumber: 15,
    status: "waiting",
    estimatedWaitTime: 25,
    notes: "Chest pain",
    bookedAt: "2024-01-25T14:30:00Z",
    userName: "John Doe",
    userPhone: "555-0123",
  },
];

// Simulate API delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Auth API
export const authAPI = {
  async login(credentials: LoginForm): Promise<{ user: User; token: string }> {
    await delay(1000);

    const user = mockUsers.find(
      (u) =>
        u.email === credentials.email &&
        (credentials.role === "user" ? u.role === "user" : u.role !== "user"),
    );

    if (!user) {
      throw new Error("Invalid credentials");
    }

    const token = `mock-jwt-token-${user.id}`;
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));

    return { user, token };
  },

  async signupUser(
    data: SignupUserForm,
  ): Promise<{ user: User; token: string }> {
    await delay(1000);

    if (data.password !== data.confirmPassword) {
      throw new Error("Passwords do not match");
    }

    const existingUser = mockUsers.find((u) => u.email === data.email);
    if (existingUser) {
      throw new Error("Email already exists");
    }

    const newUser: User = {
      id: `user_${Date.now()}`,
      name: data.name,
      email: data.email,
      role: "user",
      phone: data.phone,
      createdAt: new Date().toISOString(),
    };

    mockUsers.push(newUser);
    const token = `mock-jwt-token-${newUser.id}`;
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(newUser));

    return { user: newUser, token };
  },

  async signupBusiness(
    data: SignupBusinessForm,
  ): Promise<{ user: User; token: string }> {
    await delay(1000);

    if (data.password !== data.confirmPassword) {
      throw new Error("Passwords do not match");
    }

    const existingUser = mockUsers.find((u) => u.email === data.email);
    if (existingUser) {
      throw new Error("Email already exists");
    }

    const businessId = `business_${Date.now()}`;
    const ownerId = `owner_${Date.now()}`;

    const newBusiness: Business = {
      id: businessId,
      name: data.businessName,
      category: data.category,
      address: data.address,
      description: data.description,
      photo: "/placeholder.svg",
      rating: 0,
      totalReviews: 0,
      departments: [
        {
          id: `dept_${Date.now()}`,
          name: "General Service",
          estimatedWaitTime: 30,
          currentQueueSize: 0,
          maxQueueSize: 15,
          isActive: true,
        },
      ],
      ownerId,
      isAcceptingBookings: true,
      location: { lat: 40.7128, lng: -74.006 },
      createdAt: new Date().toISOString(),
    };

    const newOwner: User = {
      id: ownerId,
      name: data.ownerName,
      email: data.email,
      role: "business",
      createdAt: new Date().toISOString(),
    };

    mockBusinesses.push(newBusiness);
    mockUsers.push(newOwner);

    const token = `mock-jwt-token-${newOwner.id}`;
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(newOwner));

    return { user: newOwner, token };
  },

  async getCurrentUser(): Promise<User | null> {
    await delay(500);
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  },

  logout(): void {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  },
};

// Business API
export const businessAPI = {
  async getAll(
    category?: BusinessCategory,
    location?: string,
  ): Promise<Business[]> {
    await delay(800);

    let filtered = [...mockBusinesses];

    if (category && category !== "all") {
      filtered = filtered.filter((b) => b.category === category);
    }

    // In real app, would filter by location proximity
    return filtered;
  },

  async getById(id: string): Promise<Business | null> {
    await delay(500);
    return mockBusinesses.find((b) => b.id === id) || null;
  },

  async getByOwnerId(ownerId: string): Promise<Business | null> {
    await delay(500);
    return mockBusinesses.find((b) => b.ownerId === ownerId) || null;
  },

  async updateBusiness(
    id: string,
    updates: Partial<Business>,
  ): Promise<Business> {
    await delay(800);
    const index = mockBusinesses.findIndex((b) => b.id === id);
    if (index === -1) throw new Error("Business not found");

    mockBusinesses[index] = { ...mockBusinesses[index], ...updates };
    return mockBusinesses[index];
  },
};

// Queue API
export const queueAPI = {
  async bookSlot(
    businessId: string,
    booking: BookingForm,
  ): Promise<QueueBooking> {
    await delay(1000);

    const business = mockBusinesses.find((b) => b.id === businessId);
    if (!business) throw new Error("Business not found");

    const department = business.departments.find(
      (d) => d.id === booking.departmentId,
    );
    if (!department) throw new Error("Department not found");

    if (department.currentQueueSize >= department.maxQueueSize) {
      throw new Error("Queue is full");
    }

    const newBooking: QueueBooking = {
      id: `booking_${Date.now()}`,
      userId: "user1", // Would get from auth context
      businessId,
      departmentId: booking.departmentId,
      tokenNumber: department.currentQueueSize + 1,
      status: "waiting",
      estimatedWaitTime: department.estimatedWaitTime,
      notes: booking.notes,
      bookedAt: new Date().toISOString(),
      userName: booking.userName,
      userPhone: booking.userPhone,
    };

    mockBookings.push(newBooking);
    department.currentQueueSize++;

    return newBooking;
  },

  async getQueueStatus(bookingId: string): Promise<QueueStatus> {
    await delay(500);

    const booking = mockBookings.find((b) => b.id === bookingId);
    if (!booking) throw new Error("Booking not found");

    const currentPosition = Math.max(1, booking.tokenNumber - 2); // Simulate movement

    return {
      currentPosition,
      estimatedWaitTime: currentPosition * 15,
      peopleAhead: currentPosition - 1,
      tokenNumber: booking.tokenNumber,
    };
  },

  async cancelBooking(bookingId: string): Promise<void> {
    await delay(800);

    const index = mockBookings.findIndex((b) => b.id === bookingId);
    if (index === -1) throw new Error("Booking not found");

    mockBookings[index].status = "cancelled";
  },

  async getUserBookings(userId: string): Promise<QueueBooking[]> {
    await delay(600);
    return mockBookings.filter((b) => b.userId === userId);
  },

  async getBusinessQueue(businessId: string): Promise<QueueBooking[]> {
    await delay(600);
    return mockBookings.filter(
      (b) => b.businessId === businessId && b.status !== "cancelled",
    );
  },
};

// Admin API
export const adminAPI = {
  async getAllUsers(): Promise<User[]> {
    await delay(800);
    return mockUsers;
  },

  async getAllBusinesses(): Promise<Business[]> {
    await delay(800);
    return mockBusinesses;
  },

  async getAllBookings(): Promise<QueueBooking[]> {
    await delay(800);
    return mockBookings;
  },

  async deleteUser(userId: string): Promise<void> {
    await delay(600);
    const index = mockUsers.findIndex((u) => u.id === userId);
    if (index !== -1) {
      mockUsers.splice(index, 1);
    }
  },

  async deleteBusiness(businessId: string): Promise<void> {
    await delay(600);
    const index = mockBusinesses.findIndex((b) => b.id === businessId);
    if (index !== -1) {
      mockBusinesses.splice(index, 1);
    }
  },
};
