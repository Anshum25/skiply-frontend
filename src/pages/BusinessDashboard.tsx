import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  BarChart3,
  Users,
  Clock,
  TrendingUp,
  Settings,
  Plus,
  Eye,
  Check,
  X,
  QrCode,
  Building2,
  Calendar,
  DollarSign,
  Edit,
  Save,
  Camera,
  MapPin,
  Phone,
  Mail,
  Globe,
  Star,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  Shield,
  Bell,
  CreditCard,
  FileText,
  Image,
  MessageSquare,
  Download,
  Upload,
  Share2,
  Link,
  Copy,
  Trash2,
  UserPlus,
  UserMinus,
  Palette,
  Zap,
  Target,
  Award,
  Gift,
  Tag,
  Percent,
  Wifi,
  Smartphone,
  Monitor,
  Lock,
  Key,
  Database,
  Cloud,
  RotateCcw,
  BookOpen,
  Headphones,
  ThumbsUp,
  ThumbsDown,
  MessageCircle,
  Send,
  Filter,
  Search,
  SortDesc,
  Calendar as CalendarIcon,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { Badge } from "../components/ui/badge";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../components/ui/dialog";
import { Label } from "../components/ui/label";
import { Switch } from "../components/ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { Progress } from "../components/ui/progress";
import { Separator } from "../components/ui/separator";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../components/ui/accordion";
import { useAuth } from "../contexts/AuthContext";
import { toast } from "sonner";

type BusinessCategory = 'restaurant' | 'retail' | 'hospital' | 'other';

interface OpeningHours {
  [key: string]: {
    start: string;
    end: string;
    closed: boolean;
  };
}

interface TimeSlot {
  id: string;
  time: string;
  date: string;
  available: boolean;
  capacity: number;
  booked: number;
}

interface Service {
  id: string;
  name: string;
  description: string;
  duration: number;
  price: number;
  category: string;
  isActive: boolean;
  image?: string;
}

interface Staff {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar: string;
  isActive: boolean;
  permissions: string[];
}

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  totalBookings: number;
  totalSpent: number;
  lastVisit: string;
  rating: number;
  isVip: boolean;
}

const BUSINESS_CATEGORIES = [
  { value: 'restaurant', label: 'Restaurant', icon: <BarChart3 /> },
  { value: 'retail', label: 'Retail', icon: <Users /> },
  { value: 'hospital', label: 'Hospital', icon: <Clock /> },
  { value: 'other', label: 'Other', icon: <Settings /> },
];

const BusinessDashboard: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");
  const [editingProfile, setEditingProfile] = useState(false);
  const [editingHours, setEditingHours] = useState(false);

  const [business, setBusiness] = useState({
    id: "1",
    name: "Sample Business",
    description: "This is a sample business description.",
    address: "123 Sample St",
    ownerId: user?.id || "1",
    category: "restaurant" as BusinessCategory,
    contact: {
      phone: "123-456-7890",
      email: "contact@sample.com",
      website: "www.sample.com",
    },
    isVerified: true,
    rating: 4.5,
    totalReviews: 100,
    openingHours: {
      monday: { start: "09:00", end: "17:00", closed: false },
      tuesday: { start: "09:00", end: "17:00", closed: false },
      wednesday: { start: "09:00", end: "17:00", closed: false },
      thursday: { start: "09:00", end: "17:00", closed: false },
      friday: { start: "09:00", end: "17:00", closed: false },
      saturday: { start: "09:00", end: "15:00", closed: false },
      sunday: { start: "00:00", end: "00:00", closed: true },
    },
    coverPhoto: "",
    logo: "",
    photos: [],
  });

  const [businessForm, setBusinessForm] = useState({
    name: business?.name || "",
    description: business?.description || "",
    address: business?.address || "",
    phone: business?.contact?.phone || "",
    email: business?.contact?.email || "",
    website: business?.contact?.website || "",
    category: business?.category || "restaurant",
    slogan: "Your trusted service provider",
    founded: "2020",
    employees: "10-50",
    coverImage: business?.coverPhoto || "",
    logo: business?.logo || "",
  });

  const [openingHours, setOpeningHours] = useState<OpeningHours>(business.openingHours);

  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);

  const [services, setServices] = useState<Service[]>([
    {
      id: "1",
      name: "General Consultation",
      description: "Standard consultation service",
      duration: 30,
      price: 150,
      category: "General",
      isActive: true,
    },
    {
      id: "2",
      name: "Specialist Consultation",
      description: "Specialized medical consultation",
      duration: 45,
      price: 250,
      category: "Specialist",
      isActive: true,
    },
  ]);

  const [staff, setStaff] = useState<Staff[]>([
    {
      id: "1",
      name: "Dr. Sarah Johnson",
      email: "sarah@business.com",
      role: "Doctor",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
      isActive: true,
      permissions: ["manage_bookings", "view_analytics"],
    },
    {
      id: "2",
      name: "Mike Anderson",
      email: "mike@business.com",
      role: "Receptionist",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Mike",
      isActive: true,
      permissions: ["manage_bookings"],
    },
  ]);

  const [customers, setCustomers] = useState<Customer[]>([
    {
      id: "1",
      name: "John Smith",
      email: "john@example.com",
      phone: "+1-555-0123",
      totalBookings: 15,
      totalSpent: 2250,
      lastVisit: "2024-01-20",
      rating: 4.8,
      isVip: true,
    },
    {
      id: "2",
      name: "Emma Wilson",
      email: "emma@example.com",
      phone: "+1-555-0124",
      totalBookings: 8,
      totalSpent: 1200,
      lastVisit: "2024-01-18",
      rating: 4.5,
      isVip: false,
    },
  ]);

  const [notifications, setNotifications] = useState({
    email: true,
    sms: true,
    push: true,
    bookingConfirmations: true,
    cancellations: true,
    noShows: true,
    reviews: true,
    marketing: false,
  });

  const [paymentSettings, setPaymentSettings] = useState({
    acceptCash: true,
    acceptCard: true,
    acceptDigital: true,
    requireDeposit: false,
    depositAmount: 0,
    refundPolicy: "flexible",
    cancellationFee: 0,
  });

  const businessBookings = [
    {
      id: "1",
      businessId: business.id,
      customerName: "John Smith",
      scheduledDate: "2024-06-12",
      scheduledTime: "10:00",
      status: "waiting",
      tokenNumber: "T1001",
      paymentStatus: "paid",
      amount: 150,
    },
  ];

  const todayBookings = businessBookings.filter(
    (booking) => new Date(booking.scheduledDate).toDateString() === new Date().toDateString()
  );

  const activeBookings = businessBookings.filter(
    (booking) => booking.status === "waiting" || booking.status === "in-progress"
  );

  const revenue = businessBookings
    .filter((b) => b.paymentStatus === "paid" && b.amount)
    .reduce((sum, b) => sum + (b.amount || 0), 0);

  useEffect(() => {
    if (selectedDate && business) {
      const date = new Date(selectedDate);
      const dayNames = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
      const dayName = dayNames[date.getDay()];
      const dayHours = openingHours[dayName];

      if (!dayHours || dayHours.closed) {
        setTimeSlots([]);
        return;
      }

      const slots: TimeSlot[] = [];
      const startTime = new Date(`${selectedDate}T${dayHours.start}`);
      const endTime = new Date(`${selectedDate}T${dayHours.end}`);

      while (startTime < endTime) {
        const timeString = startTime.toTimeString().slice(0, 5);
        const existingBookings = businessBookings.filter(
          (b) => b.scheduledDate === selectedDate && b.scheduledTime === timeString
        ).length;

        slots.push({
          id: `slot-${timeString}`,
          time: timeString,
          date: selectedDate,
          available: existingBookings < 4,
          capacity: 4,
          booked: existingBookings,
        });

        startTime.setMinutes(startTime.getMinutes() + 30);
      }

      setTimeSlots(slots);
    }
  }, [selectedDate, openingHours, business]);

  const handleSaveProfile = () => {
    if (business) {
      setBusiness({
        ...business,
        name: businessForm.name,
        description: businessForm.description,
        address: businessForm.address,
        category: businessForm.category as BusinessCategory,
        contact: {
          ...business.contact,
          phone: businessForm.phone,
          email: businessForm.email,
          website: businessForm.website,
        },
      });
      setEditingProfile(false);
      toast.success("Business profile updated successfully!");
    }
  };

  const handleSaveHours = () => {
    if (business) {
      setBusiness({
        ...business,
        openingHours,
      });
      setEditingHours(false);
      toast.success("Opening hours updated successfully!");
    }
  };

  const handleHourChange = (day: string, field: string, value: string | boolean) => {
    setOpeningHours((prev) => ({
      ...prev,
      [day]: {
        ...prev[day],
        [field]: value,
      },
    }));
  };

  const handleAddService = () => {
    const newService: Service = {
      id: Date.now().toString(),
      name: "New Service",
      description: "Service description",
      duration: 30,
      price: 100,
      category: "General",
      isActive: true,
    };
    setServices([...services, newService]);
    toast.success("New service added!");
  };

  const handleAddStaff = () => {
    const newStaff: Staff = {
      id: Date.now().toString(),
      name: "New Staff Member",
      email: "staff@business.com",
      role: "Staff",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=New",
      isActive: true,
      permissions: ["manage_bookings"],
    };
    setStaff([...staff, newStaff]);
    toast.success("New staff member added!");
  };

  const handleDeleteService = (serviceId: string) => {
    setServices(services.filter((s) => s.id !== serviceId));
    toast.success("Service deleted!");
  };

  const handleDeleteStaff = (staffId: string) => {
    setStaff(staff.filter((s) => s.id !== staffId));
    toast.success("Staff member removed!");
  };

  const StatCard = ({ icon, title, value, change, color, trend }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      className="relative overflow-hidden"
    >
      <Card className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 border-0 shadow-lg">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                {title}
              </p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">
                {value}
              </p>
              {change && (
                <div
                  className={`flex items-center mt-2 text-sm ${trend === "up" ? "text-green-600" : "text-red-600"}`}
                >
                  {trend === "up" ? (
                    <TrendingUp className="w-4 h-4 mr-1" />
                  ) : (
                    <TrendingUp className="w-4 h-4 mr-1 rotate-180" />
                  )}
                  {change}% from last period
                </div>
              )}
            </div>
            <div className={`p-3 rounded-2xl ${color}`}>{icon}</div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-blue-900/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Avatar className="h-16 w-16">
                <AvatarImage src={business.logo} />
                <AvatarFallback>{business.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <Button
                size="sm"
                variant="secondary"
                className="absolute -bottom-1 -right-1 h-6 w-6 rounded-full p-0"
              >
                <Camera className="w-3 h-3" />
              </Button>
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                {business.name}
              </h1>
              <div className="flex items-center space-x-4">
                <Badge variant={business.isVerified ? "default" : "secondary"}>
                  {business.isVerified ? "✓ Verified" : "Pending Verification"}
                </Badge>
                <Badge variant="outline">
                  {BUSINESS_CATEGORIES.find((c) => c.value === business.category)?.label}
                </Badge>
                <div className="flex items-center space-x-1">
                  <Star className="w-4 h-4 text-yellow-500 fill-current" />
                  <span className="font-medium">{business.rating}</span>
                  <span className="text-gray-500">({business.totalReviews})</span>
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-4 mt-4 md:mt-0">
            <Button variant="outline">
              <Share2 className="w-4 h-4 mr-2" />
              Share Profile
            </Button>
            <Button variant="outline">
              <QrCode className="w-4 h-4 mr-2" />
              QR Code
            </Button>
            <Button>
              <Eye className="w-4 h-4 mr-2" />
              Preview
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            icon={<Calendar className="w-6 h-6 text-white" />}
            title="Today's Bookings"
            value={todayBookings.length}
            change={12.5}
            trend="up"
            color="bg-gradient-to-r from-blue-500 to-blue-600"
          />
          <StatCard
            icon={<Users className="w-6 h-6 text-white" />}
            title="Active Bookings"
            value={activeBookings.length}
            change={8.7}
            trend="up"
            color="bg-gradient-to-r from-green-500 to-green-600"
          />
          <StatCard
            icon={<DollarSign className="w-6 h-6 text-white" />}
            title="Monthly Revenue"
            value={`$${(revenue / 1000).toFixed(1)}K`}
            change={22.1}
            trend="up"
            color="bg-gradient-to-r from-purple-500 to-purple-600"
          />
          <StatCard
            icon={<Star className="w-6 h-6 text-white" />}
            title="Rating"
            value={business.rating}
            change={5.2}
            trend="up"
            color="bg-gradient-to-r from-orange-500 to-orange-600"
          />
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 md:grid-cols-6 lg:grid-cols-10 lg:w-auto">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="bookings">Bookings</TabsTrigger>
            <TabsTrigger value="services">Services</TabsTrigger>
            <TabsTrigger value="staff">Staff</TabsTrigger>
            <TabsTrigger value="customers">Customers</TabsTrigger>
            <TabsTrigger value="schedule">Schedule</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="marketing">Marketing</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
            <TabsTrigger value="profile">Profile</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>Recent Activity</span>
                      <Button variant="outline" size="sm">
                        <Eye className="w-4 h-4 mr-2" />
                        View All
                      </Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {todayBookings.slice(0, 5).map((booking) => (
                      <div key={booking.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <Avatar>
                            <AvatarFallback>{booking.customerName.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white">
                              {booking.customerName}
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {booking.scheduledTime || "No time set"} • Token #{booking.tokenNumber}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge className="bg-yellow-100 text-yellow-800">
                            {booking.status}
                          </Badge>
                          <Button size="sm" variant="outline">
                            <MessageSquare className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                    {todayBookings.length === 0 && (
                      <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                        <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
                        <p>No bookings for today</p>
                        <Button className="mt-4">
                          <Plus className="w-4 h-4 mr-2" />
                          Add Manual Booking
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Quick Actions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button className="w-full justify-start" variant="outline">
                      <Plus className="w-4 h-4 mr-2" />
                      Add Booking
                    </Button>
                    <Button className="w-full justify-start" variant="outline">
                      <UserPlus className="w-4 h-4 mr-2" />
                      Add Customer
                    </Button>
                    <Button className="w-full justify-start" variant="outline">
                      <Calendar className="w-4 h-4 mr-2" />
                      Manage Schedule
                    </Button>
                    <Button className="w-full justify-start" variant="outline">
                      <MessageSquare className="w-4 h-4 mr-2" />
                      Send Notifications
                    </Button>
                    <Button className="w-full justify-start" variant="outline">
                      <Download className="w-4 h-4 mr-2" />
                      Export Data
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Performance</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium">Booking Rate</span>
                        <span className="text-sm font-medium">87%</span>
                      </div>
                      <Progress value={87} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium">Customer Satisfaction</span>
                        <span className="text-sm font-medium">{business.rating}/5.0</span>
                      </div>
                      <Progress value={(business.rating / 5) * 100} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium">On-Time Performance</span>
                        <span className="text-sm font-medium">92%</span>
                      </div>
                      <Progress value={92} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium">No-Show Rate</span>
                        <span className="text-sm font-medium">8%</span>
                      </div>
                      <Progress value={8} className="h-2" />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="services" className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Service Management</h2>
              <div className="flex items-center space-x-4 mt-4 md:mt-0">
                <Button onClick={handleAddService}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Service
                </Button>
                <Button variant="outline">
                  <Upload className="w-4 h-4 mr-2" />
                  Import Services
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map((service) => (
                <motion.div key={service.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} whileHover={{ scale: 1.02 }}>
                  <Card className="h-full">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-2">{service.name}</h3>
                          <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">{service.description}</p>
                          <div className="flex items-center space-x-4 text-sm">
                            <div className="flex items-center">
                              <Clock className="w-4 h-4 mr-1 text-gray-400" />
                              <span>{service.duration} min</span>
                            </div>
                            <div className="flex items-center">
                              <DollarSign className="w-4 h-4 mr-1 text-gray-400" />
                              <span>${service.price}</span>
                            </div>
                          </div>
                        </div>
                        <Switch checked={service.isActive} />
                      </div>

                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline" className="flex-1">
                          <Edit className="w-4 h-4 mr-2" />
                          Edit
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => handleDeleteService(service.id)}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="staff" className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Staff Management</h2>
              <div className="flex items-center space-x-4 mt-4 md:mt-0">
                <Button onClick={handleAddStaff}>
                  <UserPlus className="w-4 h-4 mr-2" />
                  Add Staff
                </Button>
                <Button variant="outline">
                  <Send className="w-4 h-4 mr-2" />
                  Invite Staff
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {staff.map((member) => (
                <motion.div key={member.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} whileHover={{ scale: 1.02 }}>
                  <Card className="h-full">
                    <CardContent className="p-6">
                      <div className="flex items-center space-x-4 mb-4">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={member.avatar} />
                          <AvatarFallback>{member.name.split(" ").map((n) => n[0]).join("")}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 dark:text-white">{member.name}</h3>
                          <p className="text-gray-600 dark:text-gray-400 text-sm">{member.role}</p>
                          <p className="text-gray-500 text-xs">{member.email}</p>
                        </div>
                        <Switch checked={member.isActive} />
                      </div>

                      <div className="space-y-2 mb-4">
                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Permissions:</p>
                        <div className="flex flex-wrap gap-1">
                          {member.permissions.map((permission) => (
                            <Badge key={permission} variant="secondary" className="text-xs">
                              {permission.replace("_", " ")}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline" className="flex-1">
                          <Edit className="w-4 h-4 mr-2" />
                          Edit
                        </Button>
                        <Button size="sm" variant="outline">
                          <MessageSquare className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => handleDeleteStaff(member.id)}>
                          <UserMinus className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="customers" className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Customer Management</h2>
              <div className="flex items-center space-x-4 mt-4 md:mt-0">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input placeholder="Search customers..." className="pl-10 w-64" />
                </div>
                <Button variant="outline">
                  <Filter className="w-4 h-4 mr-2" />
                  Filter
                </Button>
                <Button variant="outline">
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
              </div>
            </div>

            <Card>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 dark:bg-gray-800">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Customer</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Contact</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Bookings</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Spent</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Rating</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                      {customers.map((customer) => (
                        <tr key={customer.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <Avatar className="h-10 w-10">
                                <AvatarFallback>{customer.name.split(" ").map((n) => n[0]).join("")}</AvatarFallback>
                              </Avatar>
                              <div className="ml-4">
                                <div className="flex items-center space-x-2">
                                  <span className="text-sm font-medium text-gray-900 dark:text-white">{customer.name}</span>
                                  {customer.isVip && <Badge variant="default" className="text-xs">VIP</Badge>}
                                </div>
                                <div className="text-sm text-gray-500 dark:text-gray-400">Last visit: {new Date(customer.lastVisit).toLocaleDateString()}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900 dark:text-white">{customer.email}</div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">{customer.phone}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{customer.totalBookings}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">${customer.totalSpent.toLocaleString()}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <Star className="w-4 h-4 text-yellow-500 fill-current mr-1" />
                              <span className="text-sm">{customer.rating}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                            <Button size="sm" variant="outline">
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button size="sm" variant="outline">
                              <MessageSquare className="w-4 h-4" />
                            </Button>
                            <Button size="sm" variant="outline">
                              <Calendar className="w-4 h-4" />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="profile" className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Business Profile</h2>
              <div className="flex items-center space-x-4 mt-4 md:mt-0">
                <Button onClick={() => setEditingProfile(true)} disabled={editingProfile}>
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Profile
                </Button>
                <Button variant="outline">
                  <Camera className="w-4 h-4 mr-2" />
                  Update Photos
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle>Basic Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Business Name</Label>
                    {editingProfile ? (
                      <Input id="name" value={businessForm.name} onChange={(e) => setBusinessForm({ ...businessForm, name: e.target.value })} />
                    ) : (
                      <p className="text-sm text-gray-600 dark:text-gray-400">{business.name}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    {editingProfile ? (
                      <Select value={businessForm.category} onValueChange={(value) => setBusinessForm({ ...businessForm, category: value })}>
                        <SelectTrigger id="category">
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          {BUSINESS_CATEGORIES.map((cat) => (
                            <SelectItem key={cat.value} value={cat.value}>
                              {cat.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : (
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {BUSINESS_CATEGORIES.find((c) => c.value === business.category)?.label}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="founded">Founded</Label>
                      {editingProfile ? (
                        <Input id="founded" value={businessForm.founded} onChange={(e) => setBusinessForm({ ...businessForm, founded: e.target.value })} />
                      ) : (
                        <p className="text-sm text-gray-600 dark:text-gray-400">{businessForm.founded}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="employees">Employees</Label>
                      {editingProfile ? (
                        <Select value={businessForm.employees} onValueChange={(value) => setBusinessForm({ ...businessForm, employees: value })}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1-10">1-10</SelectItem>
                            <SelectItem value="10-50">10-50</SelectItem>
                            <SelectItem value="50-100">50-100</SelectItem>
                            <SelectItem value="100+">100+</SelectItem>
                          </SelectContent>
                        </Select>
                      ) : (
                        <p className="text-sm text-gray-600 dark:text-gray-400">{businessForm.employees}</p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    {editingProfile ? (
                      <Textarea id="description" value={businessForm.description} onChange={(e) => setBusinessForm({ ...businessForm, description: e.target.value })} rows={4} />
                    ) : (
                      <p className="text-sm text-gray-600 dark:text-gray-400">{business.description}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address">Address</Label>
                    {editingProfile ? (
                      <Textarea id="address" value={businessForm.address} onChange={(e) => setBusinessForm({ ...businessForm, address: e.target.value })} rows={2} />
                    ) : (
                      <p className="text-sm text-gray-600 dark:text-gray-400">{business.address}</p>
                    )}
                  </div>

                  {editingProfile && (
                    <div className="flex space-x-2">
                      <Button onClick={handleSaveProfile}>
                        <Save className="w-4 h-4 mr-2" />
                        Save Changes
                      </Button>
                      <Button variant="outline" onClick={() => setEditingProfile(false)}>
                        Cancel
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>

              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Contact Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone</Label>
                      {editingProfile ? (
                        <Input id="phone" value={businessForm.phone} onChange={(e) => setBusinessForm({ ...businessForm, phone: e.target.value })} />
                      ) : (
                        <div className="flex items-center space-x-2">
                          <Phone className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-600 dark:text-gray-400">{business.contact?.phone || "Not provided"}</span>
                        </div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      {editingProfile ? (
                        <Input id="email" type="email" value={businessForm.email} onChange={(e) => setBusinessForm({ ...businessForm, email: e.target.value })} />
                      ) : (
                        <div className="flex items-center space-x-2">
                          <Mail className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-600 dark:text-gray-400">{business.contact?.email || "Not provided"}</span>
                        </div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="website">Website</Label>
                      {editingProfile ? (
                        <Input id="website" value={businessForm.website} onChange={(e) => setBusinessForm({ ...businessForm, website: e.target.value })} />
                      ) : (
                        <div className="flex items-center space-x-2">
                          <Globe className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-600 dark:text-gray-400">{business.contact?.website || "Not provided"}</span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Photos & Media</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label>Cover Photo</Label>
                      <div className="mt-2 border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                        {business.coverPhoto ? (
                          <img src={business.coverPhoto} alt="Cover" className="w-full h-32 object-cover rounded-lg mb-4" />
                        ) : (
                          <Image className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        )}
                        <Button variant="outline">
                          <Upload className="w-4 h-4 mr-2" />
                          Upload Cover Photo
                        </Button>
                      </div>
                    </div>

                    <div>
                      <Label>Business Gallery</Label>
                      <div className="mt-2 grid grid-cols-3 gap-2">
                        {business.photos?.slice(0, 5).map((photo, index) => (
                          <img key={index} src={photo} alt={`Gallery ${index + 1}`} className="w-full h-20 object-cover rounded-lg" />
                        ))}
                        <div className="w-full h-20 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
                          <Plus className="w-6 h-6 text-gray-400" />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Opening Hours</span>
                  <Button variant="outline" onClick={() => setEditingHours(true)} disabled={editingHours}>
                    <Edit className="w-4 h-4 mr-2" />
                    Edit Hours
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Object.entries(openingHours).map(([day, hours]) => (
                    <div key={day} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <span className="font-medium capitalize w-20">{day}</span>
                        {editingHours && (
                          <Switch checked={!hours.closed} onCheckedChange={(checked) => handleHourChange(day, "closed", !checked)} />
                        )}
                      </div>

                      {hours.closed ? (
                        <span className="text-red-600 font-medium">Closed</span>
                      ) : editingHours ? (
                        <div className="flex items-center space-x-2">
                          <Input type="time" value={hours.start} onChange={(e) => handleHourChange(day, "start", e.target.value)} className="w-24" />
                          <span>to</span>
                          <Input type="time" value={hours.end} onChange={(e) => handleHourChange(day, "end", e.target.value)} className="w-24" />
                        </div>
                      ) : (
                        <span className="text-gray-600 dark:text-gray-400">{hours.start} - {hours.end}</span>
                      )}
                    </div>
                  ))}

                  {editingHours && (
                    <div className="flex space-x-2">
                      <Button onClick={handleSaveHours}>
                        <Save className="w-4 h-4 mr-2" />
                        Save Hours
                      </Button>
                      <Button variant="outline" onClick={() => setEditingHours(false)}>
                        Cancel
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default BusinessDashboard;
