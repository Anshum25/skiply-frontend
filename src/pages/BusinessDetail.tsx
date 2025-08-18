import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
import { Separator } from "../components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { Progress } from "../components/ui/progress";
import {
  ArrowLeft,
  MapPin,
  Clock,
  Star,
  Users,
  Phone,
  Globe,
  MessageSquare,
  Calendar,
  Bookmark,
  BookmarkCheck,
  Share2,
  Navigation,
  CheckCircle,
  AlertCircle,
  XCircle,
  Camera,
  Zap,
  Heart,
  ExternalLink,
  MessageCircle,
  TrendingUp,
  Award,
  Shield,
  Wifi,
  CreditCard,
  Clock3,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { StarRating } from "../components/Reviews/StarRating";
import { ReviewCard } from "../components/Reviews/ReviewCard";
import { PhotoGallery } from "../components/PhotoGallery/PhotoGallery";
import BookingCalendar from "../components/Calendar/BookingCalendar";
import { AdvanceBookingModal } from "../components/Calendar/AdvanceBookingModal";
import { AnalyticsChart } from "../components/Charts/AnalyticsChart";
import BusinessMap from "../components/BusinessMap";
import { cn } from "../lib/utils";
import { motion } from "framer-motion";
import { toast } from "sonner";
import LiveQueueBooking from "../components/LiveQueueBooking";

const BusinessDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [business, setBusiness] = useState<any>(null);
  const [reviews, setReviews] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState<string>("");
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
const [isAdvanceBooking, setIsAdvanceBooking] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [imageError, setImageError] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBusiness = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5050/api/businesses/${id}`
        );
        const fetchedBusiness = response.data;

        const transformedBusiness = {
          _id: fetchedBusiness._id, // Ensure _id is included
          name: fetchedBusiness.businessName,
          description: fetchedBusiness.description || "",
          address: fetchedBusiness.address,
          departments: Array.isArray(fetchedBusiness.departments)
            ? fetchedBusiness.departments.map((name: string, i: number) => ({
                id: `dept-${i}`,
                name,
                currentQueueSize: Math.floor(Math.random() * 20),
                maxQueueSize: 20,
                estimatedWaitTime: Math.floor(Math.random() * 30) + 5,
                isActive: true,
              }))
            : [],
          openingHours: fetchedBusiness.openingHours,
          contact: {
            phone: "123-456-7890",
            email: fetchedBusiness.email,
            whatsapp: "",
            website: "",
          },
          location: {
            lat: fetchedBusiness.lat || fetchedBusiness.latitude || 23.02067,
            lng: fetchedBusiness.lng || fetchedBusiness.longitude || 72.4640772,
          },
          rating: 4.5,
          totalReviews: 25,
          isVerified: true,
          images: fetchedBusiness.images || [],
          logo: "",
          coverPhoto: "",
          photos: [],
          queueSettings: {
            maxAdvanceBookingDays: 7,
          },
        };

        setBusiness(transformedBusiness);
        setSelectedDepartment(transformedBusiness.departments[0]?.id || "");

        setReviews([]);
      } catch (err) {
        console.error(err);
        setError("Failed to load business details.");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchBusiness();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading business details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="mx-auto mb-4 h-12 w-12 text-red-500" />
          <p className="text-red-500">{error}</p>
        </div>
      </div>
    );
  }

  const isOpenNow = () => {
    const now = new Date();
    const dayOfWeek = now
      .toLocaleDateString("en-US", { weekday: "long" })
      .toLowerCase();
    const currentTime = now.toTimeString().slice(0, 5);

    const todayHours = business.openingHours[dayOfWeek];
    if (!todayHours || todayHours.closed) return false;

    return currentTime >= todayHours.start && currentTime <= todayHours.end;
  };

  const getQueueStatus = () => {
    const totalQueue = business.departments.reduce(
      (total: number, dept: any) => total + dept.currentQueueSize,
      0
    );
    if (totalQueue === 0)
      return {
        status: "available",
        color: "text-green-600",
        bg: "bg-green-100",
      };
    if (totalQueue < 10)
      return { status: "low", color: "text-yellow-600", bg: "bg-yellow-100" };
    if (totalQueue < 20)
      return {
        status: "medium",
        color: "text-orange-600",
        bg: "bg-orange-100",
      };
    return { status: "high", color: "text-red-600", bg: "bg-red-100" };
  };

  const queueStatus = getQueueStatus();
  const openStatus = isOpenNow();

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
    toast.success(
      isBookmarked ? "Removed from bookmarks" : "Added to bookmarks"
    );
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: business.name,
        text: business.description,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied to clipboard");
    }
  };

  // Handler for live queue booking
  const handleBookNow = () => {
    if (!user) {
      toast.error("Please log in to book an appointment");
      return;
    }
    setIsAdvanceBooking(false);
    setIsBookingModalOpen(true);
  };

  // Handler for advance booking
  const handleAdvanceBook = () => {
    if (!user) {
      toast.error("Please log in to book an appointment");
      return;
    }
    setActiveTab("queue");
  };

  const handleCall = () => {
    if (business.contact.phone) {
      window.open(`tel:${business.contact.phone}`);
    }
  };

  const handleWhatsApp = () => {
    if (business.contact.whatsapp) {
      window.open(
        `https://wa.me/${business.contact.whatsapp.replace(/[^\d]/g, "")}`
      );
    }
  };

  const getDepartmentStatus = (dept: any) => {
    const percentage = (dept.currentQueueSize / dept.maxQueueSize) * 100;
    if (percentage >= 90)
      return { color: "text-red-600", bg: "bg-red-100", status: "Full" };
    if (percentage >= 70)
      return { color: "text-orange-600", bg: "bg-orange-100", status: "Busy" };
    if (percentage >= 30)
      return {
        color: "text-yellow-600",
        bg: "bg-yellow-100",
        status: "Moderate",
      };
    return { color: "text-green-600", bg: "bg-green-100", status: "Available" };
  };

  const trendData = [
    { name: "Mon", value: 45 },
    { name: "Tue", value: 52 },
    { name: "Wed", value: 48 },
    { name: "Thu", value: 61 },
    { name: "Fri", value: 55 },
    { name: "Sat", value: 67 },
    { name: "Sun", value: 43 },
  ];

  const ratingDistribution = [
    { name: "5 Stars", value: 65 },
    { name: "4 Stars", value: 20 },
    { name: "3 Stars", value: 10 },
    { name: "2 Stars", value: 3 },
    { name: "1 Star", value: 2 },
  ];

  const resolvedImageUrl =
    business.images && business.images.length > 0
      ? (business.images[0].startsWith("http") || business.images[0].startsWith("/")
          ? business.images[0]
          : `http://localhost:5050/uploads/${business.images[0]}`)
      : "/no-image.jpg";

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative h-80 overflow-hidden">
        {resolvedImageUrl && !imageError ? (
          <img
            src={resolvedImageUrl}
            alt={business.name}
            className="w-full h-full object-cover"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="w-full h-full bg-gradient-primary flex items-center justify-center">
            <div className="text-white text-8xl font-bold opacity-20">
              {business.name.slice(0, 1)}
            </div>
          </div>
        )}

        <div className="absolute inset-0 bg-black/30" />

        <div className="absolute top-6 left-6">
          <Button
            variant="secondary"
            size="sm"
            className="bg-white/90 hover:bg-white"
            asChild
          >
            <Link to="/user-home">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Link>
          </Button>
        </div>

        <div className="absolute top-6 right-6 flex gap-2">
          <Button
            variant="secondary"
            size="sm"
            className="bg-white/90 hover:bg-white"
            onClick={handleBookmark}
          >
            {isBookmarked ? (
              <BookmarkCheck className="w-4 h-4 text-primary" />
            ) : (
              <Bookmark className="w-4 h-4" />
            )}
          </Button>

          <Button
            variant="secondary"
            size="sm"
            className="bg-white/90 hover:bg-white"
            onClick={handleShare}
          >
            <Share2 className="w-4 h-4" />
          </Button>
        </div>

        <div className="absolute bottom-6 left-6 right-6">
          <div className="flex items-end gap-4">
            <Avatar className="w-16 h-16 border-4 border-white">
              <AvatarImage
                src={resolvedImageUrl}
                alt={business.businessName}
                onError={(e) => {
                  if ((e.target as HTMLImageElement).src.indexOf('/no-image.jpg') === -1) {
                    (e.target as HTMLImageElement).src = '/no-image.jpg';
                  }
                }}
              />
              <AvatarFallback className="bg-gradient-primary text-white text-xl font-bold">
                {business.businessName?.slice(0, 1).toUpperCase()}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1 text-white">
              <div className="flex items-center gap-2 mb-1">
                <h1 className="text-3xl font-bold">{business.name}</h1>
                {business.isVerified && (
                  <Badge className="bg-blue-500 text-white">
                    <Shield className="w-3 h-3 mr-1" />
                    Verified
                  </Badge>
                )}
              </div>

              <div className="flex items-center gap-4 text-white/90">
                <div className="flex items-center gap-1">
                  <StarRating rating={business.rating} readonly size="sm" />
                  <span className="font-medium">{business.rating}</span>
                  <span className="text-sm">
                    ({business.totalReviews} reviews)
                  </span>
                </div>

                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  <span className="text-sm">{business.address}</span>
                </div>

                <Badge
                  className={cn(
                    "text-xs",
                    openStatus
                      ? "bg-green-500 text-white"
                      : "bg-gray-500 text-white"
                  )}
                >
                  {openStatus ? "Open Now" : "Closed"}
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions Bar */}
      <div className="border-b bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Badge
                variant="outline"
                className={cn("text-sm", queueStatus.color)}
              >
                <Users className="w-4 h-4 mr-1" />
                {business.departments.reduce(
                  (total: number, dept: any) => total + dept.currentQueueSize,
                  0
                )}{" "}
                in queue
              </Badge>

              <Badge variant="outline" className="text-sm">
                <Clock className="w-4 h-4 mr-1" />~
                {Math.round(
                  business.departments.reduce(
                    (total: number, dept: any) => total + dept.estimatedWaitTime,
                    0
                  ) / business.departments.length
                )}
                min wait
              </Badge>
            </div>

            <div className="flex items-center gap-2">
              {business.contact.phone && (
                <Button variant="outline" size="sm" onClick={handleCall}>
                  <Phone className="w-4 h-4 mr-2" />
                  Call
                </Button>
              )}

              {business.contact.whatsapp && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleWhatsApp}
                  className="bg-green-50 hover:bg-green-100 text-green-700 border-green-200"
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  WhatsApp
                </Button>
              )}

              <Button className="btn-gradient" onClick={handleBookNow}>
                <Calendar className="w-4 h-4 mr-2" />
                Book Now (Live)
              </Button>
              <Button className="ml-2" variant="outline" onClick={handleAdvanceBook}>
                <Calendar className="w-4 h-4 mr-2" />
                Advance Booking
              </Button>
            </div>
          </div>
        </div> 
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-6"
        >
          <TabsList className="grid w-full grid-cols-4 glass">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
            <TabsTrigger value="photos">Photos</TabsTrigger>
            <TabsTrigger value="info">Info</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <Card className="glass-strong border-0">
  <CardHeader>
    <CardTitle>About</CardTitle>
  </CardHeader>
  <CardContent>
    <p className="text-muted-foreground leading-relaxed">
      {business.description}
    </p>
  </CardContent>
</Card>

<Card className="glass-strong border-0">
  <CardHeader>
    <CardTitle>Location & Directions</CardTitle>
  </CardHeader>
  <CardContent>
    {business.location && typeof business.location.lat === "number" && typeof business.location.lng === "number" ? (
      <BusinessMap
        lat={business.location.lat}
        lng={business.location.lng}
        name={business.name}
        height="300px"
      />
    ) : (
      <div className="text-muted-foreground">Location coordinates not available.</div>
    )}
  </CardContent>
</Card>

                <Card className="glass-strong border-0">
                  <CardHeader>
                    <CardTitle>Services & Departments</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {business.departments.map((dept: any) => {
                      const status = getDepartmentStatus(dept);
                      return (
                        <motion.div
                          key={dept.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="p-4 rounded-lg border bg-card/50"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="font-medium">{dept.name}</h3>
                            <Badge
                              className={cn("text-xs", status.color, status.bg)}
                            >
                              {status.status}
                            </Badge>
                          </div>

                          <p className="text-sm text-muted-foreground mb-3">
                            {dept.description}
                          </p>

                          <div className="space-y-2">
                            <div className="flex items-center justify-between text-sm">
                              <span>Queue Status</span>
                              <span>
                                {dept.currentQueueSize}/{dept.maxQueueSize}{" "}
                                people
                              </span>
                            </div>

                            <Progress
                              value={
                                (dept.currentQueueSize / dept.maxQueueSize) *
                                100
                              }
                              className="h-2"
                            />

                            <div className="flex items-center justify-between text-sm text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <Clock className="w-4 h-4" />
                                <span>~{dept.estimatedWaitTime}min wait</span>
                              </div>
                              {dept.price && (
                                <div className="flex items-center gap-1">
                                  <CreditCard className="w-4 h-4" />
                                  <span>From ${dept.price}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </CardContent>
                </Card>

                <Card className="glass-strong border-0">
                  <CardHeader>
                    <CardTitle>Weekly Queue Trends</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <AnalyticsChart
                      title=""
                      data={trendData}
                      type="area"
                      height={200}
                      valueFormatter={(value) => `${value} bookings`}
                    />
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-6">
                <Card className="glass-strong border-0">
                  <CardHeader>
                    <CardTitle className="text-lg">Quick Stats</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-3 rounded-lg bg-gradient-success/10">
                        <div className="text-2xl font-bold text-green-600">
                          {business.rating}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Rating
                        </div>
                      </div>

                      <div className="text-center p-3 rounded-lg bg-gradient-primary/10">
                        <div className="text-2xl font-bold text-primary">
                          {business.totalReviews}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Reviews
                        </div>
                      </div>

                      <div className="text-center p-3 rounded-lg bg-gradient-secondary/10">
                        <div className="text-2xl font-bold text-pink-600">
                          {business.departments.reduce(
                            (total: number, dept: any) =>
                              total + dept.currentQueueSize,
                            0
                          )}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          In Queue
                        </div>
                      </div>

                      <div className="text-center p-3 rounded-lg bg-gradient-accent/10">
                        <div className="text-2xl font-bold text-teal-600">
                          {Math.round(
                            business.departments.reduce(
                              (total: number, dept: any) =>
                                total + dept.estimatedWaitTime,
                              0
                            ) / business.departments.length
                          )}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Avg Wait (min)
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="glass-strong border-0">
                  <CardHeader>
                    <CardTitle className="text-lg">Opening Hours</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {Object.entries(business.openingHours).map(
                      ([day, hours]: [string, any]) => (
                        <div
                          key={day}
                          className="flex justify-between items-center text-sm"
                        >
                          <span className="capitalize font-medium">{day}</span>
                          <span
                            className={cn(
                              "text-muted-foreground",
                              hours.closed && "text-red-500"
                            )}
                          >
                            {hours.closed
                              ? "Closed"
                              : `${hours.start} - ${hours.end}`}
                          </span>
                        </div>
                      )
                    )}
                  </CardContent>
                </Card>

                <Card className="glass-strong border-0">
                  <CardHeader>
                    <CardTitle className="text-lg">Features</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-2">
                      <Badge variant="outline" className="justify-center p-2">
                        <Wifi className="w-3 h-3 mr-1" />
                        Free WiFi
                      </Badge>
                      <Badge variant="outline" className="justify-center p-2">
                        <CreditCard className="w-3 h-3 mr-1" />
                        Card Payment
                      </Badge>
                      <Badge variant="outline" className="justify-center p-2">
                        <Calendar className="w-3 h-3 mr-1" />
                        Advance Booking
                      </Badge>
                      <Badge variant="outline" className="justify-center p-2">
                        <Clock3 className="w-3 h-3 mr-1" />
                        Real-time Queue
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="queue" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <BookingCalendar business={business} />

              <div className="space-y-6">
                <Card className="glass-strong border-0">
                  <CardHeader>
                    <CardTitle>Select Department</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {business.departments.map((dept: any) => (
                        <Button
                          key={dept.id}
                          variant={
                            selectedDepartment === dept.id
                              ? "default"
                              : "outline"
                          }
                          className="w-full justify-start h-auto p-4"
                          onClick={() => setSelectedDepartment(dept.id)}
                        >
                          <div className="text-left">
                            <div className="font-medium">{dept.name}</div>
                            <div className="text-xs opacity-75">
                              {dept.currentQueueSize} in queue • ~
                              {dept.estimatedWaitTime}min wait
                            </div>
                          </div>
                        </Button>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="reviews" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <div className="space-y-4">
                  {reviews.map((review: any) => (
                    <ReviewCard
                      key={review.id}
                      review={review}
                      showBusinessResponse
                    />
                  ))}
                </div>
              </div>

              <div className="space-y-6">
                <Card className="glass-strong border-0">
                  <CardHeader>
                    <CardTitle>Rating Overview</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center mb-6">
                      <div className="text-4xl font-bold">
                        {business.rating}
                      </div>
                      <StarRating rating={business.rating} readonly size="lg" />
                      <div className="text-sm text-muted-foreground mt-1">
                        Based on {business.totalReviews} reviews
                      </div>
                    </div>

                    <AnalyticsChart
                      title=""
                      data={ratingDistribution}
                      type="pie"
                      height={200}
                      showLegend
                    />
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="photos">
            <PhotoGallery
              photos={
                business.photos?.map((url: string, index: number) => ({
                  id: `photo-${index}`,
                  url,
                  caption: `${business.name} - Photo ${index + 1}`,
                  category: index < 2 ? "exterior" : "interior",
                  uploadedAt: new Date().toISOString(),
                })) || []
              }
              title={`${business.name} Photos`}
              showCategories
            />
          </TabsContent>

          <TabsContent value="info" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="glass-strong border-0">
                <CardHeader>
                  <CardTitle>Contact Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {business.contact.phone && (
                    <div className="flex items-center gap-3">
                      <Phone className="w-5 h-5 text-muted-foreground" />
                      <div>
                        <div className="font-medium">Phone</div>
                        <div className="text-sm text-muted-foreground">
                          {business.contact.phone}
                        </div>
                      </div>
                    </div>
                  )}

                  {business.contact.whatsapp && (
                    <div className="flex items-center gap-3">
                      <MessageCircle className="w-5 h-5 text-green-600" />
                      <div>
                        <div className="font-medium">WhatsApp</div>
                        <div className="text-sm text-muted-foreground">
                          {business.contact.whatsapp}
                        </div>
                      </div>
                    </div>
                  )}

                  {business.contact.email && (
                    <div className="flex items-center gap-3">
                      <MessageSquare className="w-5 h-5 text-muted-foreground" />
                      <div>
                        <div className="font-medium">Email</div>
                        <div className="text-sm text-muted-foreground">
                          {business.contact.email}
                        </div>
                      </div>
                    </div>
                  )}

                  {business.contact.website && (
                    <div className="flex items-center gap-3">
                      <Globe className="w-5 h-5 text-muted-foreground" />
                      <div>
                        <div className="font-medium">Website</div>
                        <a
                          href={business.contact.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-primary hover:underline flex items-center gap-1"
                        >
                          {business.contact.website}
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card className="glass-strong border-0">
                <CardHeader>
                  <CardTitle>Location</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <MapPin className="w-5 h-5 text-muted-foreground mt-0.5" />
                      <div>
                        <div className="font-medium">Address</div>
                        <div className="text-sm text-muted-foreground">
                          {business.address}
                        </div>
                      </div>
                    </div>

                    <div className="h-48 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
                      <div className="text-center text-muted-foreground">
                        <Navigation className="w-8 h-8 mx-auto mb-2" />
                        <p>Map view would be integrated here</p>
                        <p className="text-xs">
                          Google Maps or similar service
                        </p>
                      </div>
                    </div>

                    <Button variant="outline" className="w-full">
                      <Navigation className="w-4 h-4 mr-2" />
                      Get Directions
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Show only one modal at a time based on isAdvanceBooking */}
      {isAdvanceBooking ? (
        <AdvanceBookingModal
          isOpen={isBookingModalOpen}
          onClose={() => setIsBookingModalOpen(false)}
          business={business}
        />
      ) : (
        <LiveQueueBooking
          isOpen={isBookingModalOpen}
          onClose={() => setIsBookingModalOpen(false)}
          business={business}
        />
      )}
    </div>
  );
};

export default BusinessDetail;
