import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Clock,
  Users,
  Phone,
  MapPin,
  RefreshCw,
  XCircle,
  CheckCircle,
  AlertTriangle,
  Star,
  Calendar,
  DollarSign,
  User,
  MessageSquare,
  Activity,
  Timer,
  Filter,
  Search,
  SortDesc,
  Grid3X3,
  List,
  Zap,
  TrendingUp,
  Award,
  Eye,
  QrCode,
  Navigation,
  ExternalLink,
  AlertCircle,
} from "lucide-react";
import { mockQueueBookings, mockBusinesses, getBookingsByUserId } from "../data/mockData";
import { QueueBooking, Business } from "../types";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../components/ui/alert-dialog";
import { useAuth } from "../contexts/AuthContext";
import { toast } from "sonner";
import QRCode from "react-qr-code";

const QueueTracker: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [booking, setBooking] = useState<QueueBooking | null>(null);
  const [business, setBusiness] = useState<Business | null>(null);
  const [userBookings, setUserBookings] = useState<QueueBooking[]>([]);
  const [completedBookings, setCompletedBookings] = useState<QueueBooking[]>([]);
  const [queuePosition, setQueuePosition] = useState(1);
  const [estimatedWait, setEstimatedWait] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [activeFilter, setActiveFilter] = useState<'all' | 'waiting' | 'confirmed' | 'checked-in'>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [showQrCode, setShowQrCode] = useState(false);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);

  useEffect(() => {
    if (id) {
      const fetchBooking = async () => {
        try {
          const token = localStorage.getItem("token");
          let foundBooking = null;
          let foundBusiness = null;

          // Try to fetch from API first
          if (token) {
            try {
              const res = await fetch(`${import.meta.env.VITE_API_URL}/api/queues/my-bookings`, {
                headers: { "Authorization": `Bearer ${token}` }
              });
              
              if (res.ok) {
                const bookings = await res.json();
                foundBooking = bookings.find((b: any) => b._id === id || b.id === id);
                foundBusiness = foundBooking?.business || null;
              }
            } catch (apiError) {
              console.log("API call failed, falling back to mock data");
            }
          }

          // Fallback to mock data if not found in real data
          if (!foundBooking) {
            foundBooking = mockQueueBookings.find((b) => b.id === id || b._id === id);
            foundBusiness = foundBooking ? 
              (mockBusinesses.find((b) => b.id === foundBooking.businessId) || null) : 
              null;
          }

          if (foundBooking) {
            setBooking(foundBooking);
            setBusiness(foundBusiness);
            setQueuePosition(foundBooking.queuePosition || 1);
            setEstimatedWait(foundBooking.estimatedWaitTime || 0);
          } else {
            console.log("Booking not found for ID:", id);
          }
        } catch (error) {
          console.error("Error fetching booking:", error);
        }
      };
      
      fetchBooking();
    } else if (user) {
      const fetchBookings = async () => {
        try {
          const token = localStorage.getItem("token");
          let bookings = [];

          // Try API first
          if (token) {
            try {
              const res = await fetch(`${import.meta.env.VITE_API_URL}/api/queues/my-bookings`, {
                headers: {
                  "Authorization": `Bearer ${token}`,
                },
              });
              
              if (res.ok) {
                bookings = await res.json();
              }
            } catch (apiError) {
              console.log("API call failed, using mock data");
            }
          }

          // Fallback to mock data
          if (bookings.length === 0 && user) {
            bookings = getBookingsByUserId(user.id) || [];
          }

          setUserBookings(bookings);
        } catch (error) {
          console.error("Error fetching bookings:", error);
          setUserBookings([]);
        }
      };
      
      fetchBookings();
    }
  }, [id, user]);

  // Auto-refresh every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      if (booking && queuePosition > 1) {
        // Simulate queue movement
        const newPosition = Math.max(
          1,
          queuePosition - Math.floor(Math.random() * 2),
        );
        setQueuePosition(newPosition);
        setEstimatedWait(newPosition * 15);
        setLastUpdated(new Date());

        if (newPosition === 1) {
          toast.success("🎉 It's your turn! Please proceed to the counter.");
        } else if (newPosition <= 3) {
          toast.info("⏰ You're next in line! Please stay nearby.");
        }
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [booking, queuePosition]);

  const handleRefresh = () => {
    setIsLoading(true);
    setTimeout(() => {
      const newPosition = Math.max(
        1,
        queuePosition - Math.floor(Math.random() * 2),
      );
      setQueuePosition(newPosition);
      setEstimatedWait(newPosition * 15);
      setLastUpdated(new Date());
      setIsLoading(false);
    }, 1000);
  };

  const handleCancelBooking = () => {
    toast.success("Booking cancelled successfully");
    // In a real app, this would make an API call
    setTimeout(() => {
      navigate("/queue-tracker");
    }, 1000);
    setCancelDialogOpen(false);
  };

  const generateQrCodeUrl = () => {
    const qrData = {
      bookingId: booking?.id || booking?._id,
      tokenNumber: booking?.tokenNumber,
      businessName: business?.name,
      customerName: booking?.customerName,
      status: booking?.status,
      timestamp: new Date().toISOString()
    };
    return JSON.stringify(qrData);
  };

  const getDirectionsUrl = () => {
    if (!business?.address) return '#';
    const encodedAddress = encodeURIComponent(business.address);
    return `https://www.google.com/maps/dir/?api=1&destination=${encodedAddress}`;
  };

  // Fix progress calculation:
  const getProgressPercentage = () => {
    if (!booking || !booking.tokenNumber || booking.tokenNumber <= 1) return 0;
    const totalAhead = booking.tokenNumber - 1;
    const completed = totalAhead - (queuePosition - 1);
    if (totalAhead <= 0) return 0;
    return Math.min(100, (completed / totalAhead) * 100);
  };

  const getStatusColor = () => {
    if (queuePosition === 1) return "text-green-600";
    if (queuePosition <= 3) return "text-yellow-600";
    return "text-blue-600";
  };

  const getStatusMessage = () => {
    if (queuePosition === 1)
      return "🎉 It's your turn! Please proceed to the counter.";
    if (queuePosition <= 3)
      return "⏰ You're next in line! Please stay nearby.";
    return `⏳ You have ${queuePosition - 1} people ahead of you.`;
  };

  // If no ID provided, show user's bookings list
  if (!id) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-6 flex items-center gap-2">
            <Activity className="w-8 h-8" />
            My Queue Tracker
          </h1>
          <div className="mb-6 text-muted-foreground">Track all your active bookings</div>
          
          {userBookings.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📋</div>
              <h3 className="text-xl font-semibold mb-2">No Active Bookings</h3>
              <p className="text-muted-foreground mb-6">You don't have any active queue bookings at the moment.</p>
              <Link to="/browse">
                <Button className="btn-gradient">
                  Browse Services
                </Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {userBookings
                .filter((bookingItem) => {
                  const now = new Date();
                  return new Date(bookingItem.bookedAt) >= now;
                })
                .map((bookingItem) => {
                const bookingBusiness = bookingItem.business || 
                  mockBusinesses.find((b) => b.id === bookingItem.businessId) || 
                  { name: 'Unknown Business', rating: '4.0' };
                
                return (
                  <motion.div
                    key={bookingItem._id || bookingItem.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass-strong border-0 rounded-xl overflow-hidden"
                  >
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <Badge 
                          className={`${
                            bookingItem.status === 'confirmed' ? 'bg-green-100 text-green-700' : 
                            bookingItem.status === 'waiting' ? 'bg-yellow-100 text-yellow-700' : 
                            bookingItem.status === 'checked-in' ? 'bg-blue-100 text-blue-700' : 
                            'bg-gray-100 text-gray-700'
                          }`}
                        >
                          {bookingItem.status?.replace(/-/g, ' ').toUpperCase()}
                        </Badge>
                        <div className="text-2xl font-bold text-primary">
                          #{bookingItem.tokenNumber || bookingItem.token || 1}
                        </div>
                      </div>
                      
                      <h3 className="font-semibold text-lg mb-2">
                        {bookingBusiness.businessName || bookingBusiness.name || 'Business'}
                      </h3>
                      
                      <p className="text-sm text-muted-foreground mb-4">
                        {bookingItem.departmentName || bookingItem.department || 'Department'}
                      </p>
                      
                      <div className="grid grid-cols-3 gap-2 text-xs mb-4">
                        <div className="text-center">
                          <div className="font-bold text-orange-600">
                            {bookingItem.estimatedWaitTime || 0}min
                          </div>
                          <div className="text-muted-foreground">Wait Time</div>
                        </div>
                        <div className="text-center">
                          <div className="font-bold">
                            {new Date(bookingItem.bookedAt).toLocaleDateString()}
                          </div>
                          <div className="text-muted-foreground">Booked</div>
                        </div>
                        <div className="text-center">
                          <div className="font-bold flex items-center justify-center gap-1">
                            <Star className="w-3 h-3 text-yellow-500" />
                            {bookingBusiness.rating || '4.0'}
                          </div>
                          <div className="text-muted-foreground">Rating</div>
                        </div>
                      </div>
                      
                      <Link to={`/queue-tracker/${bookingItem._id || bookingItem.id}`}>
                        <Button className="w-full btn-gradient">
                          <Activity className="w-4 h-4 mr-2" />
                          Track Live Queue
                        </Button>
                      </Link>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    );
  }

  // If ID provided but booking not found
  if (id && !booking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">📋</div>
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
            Booking Not Found
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            The booking you're looking for doesn't exist or has been cancelled.
          </p>
          <div className="space-y-4">
            <Link to="/queue-tracker">
              <Button variant="outline">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to My Bookings
              </Button>
            </Link>
            <Link to="/browse">
              <Button className="btn-gradient">
                Browse Services
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const isMock = !!booking?.id && !booking?._id;
  const detailBusiness = isMock
    ? mockBusinesses.find(b => b.id === booking.businessId)
    : business;
  const detailDepartment = detailBusiness?.departments?.find(d => d.id === booking.departmentId);
  const businessImage = detailBusiness?.photos?.[0] || detailBusiness?.images?.[0];
  const qrValue = booking?.qrCode || booking?.id || booking?._id;
  const tokenNumber = booking?.tokenNumber || booking?.token || 1;

  // Use the same image resolution logic as BusinessCard:
  let resolvedImageUrl = "/no-image.jpg";
  if (detailBusiness?.images && detailBusiness.images.length > 0) {
    const img = detailBusiness.images[0];
    resolvedImageUrl = (img.startsWith("http") || img.startsWith("/"))
      ? img
      : `${import.meta.env.VITE_API_URL}/uploads/${img}`;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center gap-4 mb-6">
          <Link to="/queue-tracker">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center space-x-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Queue List</span>
            </motion.button>
          </Link>
          <span className="text-muted-foreground">•</span>
          <Link to="/user-home">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center space-x-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <span>Home</span>
            </motion.button>
          </Link>
        </div>

        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-primary/10 rounded-xl">
              <Activity className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">
                Queue Tracker
              </h1>
              <p className="text-muted-foreground">
                Real-time updates for your booking
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 space-y-6">
        {/* Status Alert */}
        {queuePosition === 1 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-4"
          >
            <div className="flex items-center space-x-3">
              <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
              <div>
                <h3 className="font-semibold text-green-800 dark:text-green-200">
                  It's Your Turn!
                </h3>
                <p className="text-green-700 dark:text-green-300 text-sm">
                  Please proceed to the service counter immediately.
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Main Status Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="glass-strong border-0 rounded-2xl overflow-hidden"
        >
          {/* Business Image or Placeholder */}
          {/* In the detailed tracker view, update the top card layout: */}
          <div className="rounded-t-2xl overflow-hidden" style={{background: 'linear-gradient(135deg, #8f5cf6 0%, #4f8cfb 100%)'}}>
            {resolvedImageUrl !== "/no-image.jpg" ? (
              <img
                src={resolvedImageUrl}
                alt={detailBusiness?.name || 'Business'}
                className="w-full h-32 object-cover"
                style={{minHeight: '128px', maxHeight: '128px'}}
              />
            ) : (
              <div className="w-full h-32 bg-gradient-primary" style={{minHeight: '128px', maxHeight: '128px'}} />
            )}
            <div className="p-6 text-center">
              <div className="text-5xl font-bold mb-2">#{tokenNumber}</div>
              <div className="text-lg font-semibold mb-1">Your Token Number</div>
              <div className="flex items-center justify-center gap-2 text-sm text-white/90">
                <Star className="w-4 h-4" />
                <span>{detailBusiness?.rating || '4.0'}</span>
                <span className="mx-1">·</span>
                <MapPin className="w-4 h-4" />
                <span>{detailBusiness?.name || 'Business'}</span>
              </div>
            </div>
          </div>

          <div className="p-6 space-y-6">
            {/* Progress Bar */}
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span>Queue Progress</span>
                <span className="font-semibold">
                  {isNaN(getProgressPercentage()) ? '0%' : `${Math.round(getProgressPercentage())}%`}
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${isNaN(getProgressPercentage()) ? 0 : getProgressPercentage()}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 h-3 rounded-full"
                />
              </div>
            </div>

            {/* Current Status */}
            <div className="text-center space-y-3">
              <div className={`text-4xl font-bold ${getStatusColor()}`}>
                {queuePosition === 1 ? "Your Turn!" : `Position #${queuePosition}`}
              </div>
              <p className="text-gray-600 dark:text-gray-400">
                {getStatusMessage()}
              </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                <Users className="w-8 h-8 text-blue-600 dark:text-blue-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {queuePosition - 1}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  People ahead
                </div>
              </div>

              <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-xl">
                <Clock className="w-8 h-8 text-green-600 dark:text-green-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {estimatedWait}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Minutes left
                </div>
              </div>
            </div>

            {/* Additional Stats */}
            <div className="mt-6 grid grid-cols-3 gap-3 text-center">
              <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                <Calendar className="w-5 h-5 text-purple-600 dark:text-purple-400 mx-auto mb-1" />
                <div className="text-sm font-medium text-purple-600 dark:text-purple-400">
                  {new Date(booking?.bookedAt).toLocaleDateString()}
                </div>
                <div className="text-xs text-muted-foreground">Booked Date</div>
              </div>

              <div className="p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                <Timer className="w-5 h-5 text-orange-600 dark:text-orange-400 mx-auto mb-1" />
                <div className="text-sm font-medium text-orange-600 dark:text-orange-400">
                  {new Date(booking?.bookedAt).toLocaleTimeString()}
                </div>
                <div className="text-xs text-muted-foreground">Booked Time</div>
              </div>

              {booking?.amount && (
                <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <DollarSign className="w-5 h-5 text-green-600 dark:text-green-400 mx-auto mb-1" />
                  <div className="text-sm font-medium text-green-600 dark:text-green-400">
                    ${booking.amount}
                  </div>
                  <div className="text-xs text-muted-foreground">Amount</div>
                </div>
              )}
            </div>
          </div>
        </motion.div>

        {/* Business Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="glass-strong border-0 rounded-2xl p-6"
        >
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <MapPin className="w-5 h-5 mr-2 text-primary" />
            Business Information
          </h3>

          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-primary/10 rounded-xl">
                <MapPin className="w-6 h-6 text-primary" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-lg">
                  {detailBusiness?.name || 'Business Name'}
                </h4>
                <p className="text-muted-foreground">
                  {detailBusiness?.address || 'No address available'}
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <Star className="w-4 h-4 text-yellow-500" />
                  <span className="font-medium">{detailBusiness?.rating || '4.0'}</span>
                  <span className="text-sm text-muted-foreground">({detailBusiness?.totalReviews || 0} reviews)</span>
                </div>
              </div>
            </div>

            {detailBusiness?.contact?.phone && (
              <div className="flex items-center gap-3 p-3 bg-card rounded-lg">
                <Phone className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm">{detailBusiness.contact.phone}</span>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <User className="w-4 h-4 text-blue-600" />
                  <span className="text-sm font-medium text-blue-600">Service Details</span>
                </div>
                <div className="space-y-1">
                  <div className="font-semibold">{detailDepartment?.name || booking?.departmentName || 'Service'}</div>
                  <div className="text-sm text-muted-foreground">{detailDepartment?.description || 'No description available'}</div>
                  {detailDepartment?.price && (
                    <div className="text-sm font-medium text-green-600">${detailDepartment.price}</div>
                  )}
                </div>
              </div>

              <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Activity className="w-4 h-4 text-green-600" />
                  <span className="text-sm font-medium text-green-600">Booking Status</span>
                </div>
                <div className="space-y-1">
                  <div className="font-semibold capitalize">{booking?.status}</div>
                  <div className="text-sm text-muted-foreground">
                    Customer: {booking?.customerName || 'N/A'}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Phone: {booking?.customerPhone || 'N/A'}
                  </div>
                </div>
              </div>
            </div>

            {booking?.notes && (
              <div className="p-4 bg-card rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <MessageSquare className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Notes</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  {booking.notes || 'No notes available'}
                </p>
              </div>
            )}
          </div>
        </motion.div>

        {/* QR Code Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="glass-strong border-0 rounded-2xl p-6"
        >
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <QrCode className="w-5 h-5 mr-2 text-primary" />
            Show QR Code to Business
          </h3>

          <div className="text-center space-y-4">
            <div className="bg-white p-4 rounded-xl inline-block">
              <QRCode value={qrValue} size={192} />
            </div>
            <p className="text-sm text-muted-foreground max-w-md mx-auto">
              Present this QR code to the business staff for quick verification of your booking details.
            </p>
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="grid grid-cols-3 gap-4"
        >
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleRefresh}
            disabled={isLoading}
            className="flex flex-col items-center justify-center space-y-2 px-4 py-4 glass border border-primary/20 hover:bg-primary/5 transition-all disabled:opacity-50 rounded-lg"
          >
            <RefreshCw
              className={`w-5 h-5 ${isLoading ? "animate-spin" : ""}`}
            />
            <span className="text-sm font-medium">Refresh</span>
          </motion.button>

          <motion.a
            href={getDirectionsUrl()}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex flex-col items-center justify-center space-y-2 px-4 py-4 glass border border-green-500/20 hover:bg-green-500/5 transition-all rounded-lg text-green-600 dark:text-green-400"
          >
            <Navigation className="w-5 h-5" />
            <span className="text-sm font-medium">Directions</span>
          </motion.a>

          <AlertDialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
            <AlertDialogTrigger asChild>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex flex-col items-center justify-center space-y-2 px-4 py-4 glass border border-red-500/20 hover:bg-red-500/5 transition-all rounded-lg text-red-600 dark:text-red-400"
              >
                <XCircle className="w-5 h-5" />
                <span className="text-sm font-medium">Cancel</span>
              </motion.button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle className="flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-red-500" />
                  Cancel Booking Confirmation
                </AlertDialogTitle>
                <AlertDialogDescription className="space-y-2">
                  <p>Are you sure you want to cancel this booking?</p>
                  <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg space-y-1">
                    <p className="font-semibold">Booking Details:</p>
                    <p className="text-sm">• Token #{booking?.tokenNumber}</p>
                    <p className="text-sm">• Business: {detailBusiness?.name || 'N/A'}</p>
                    <p className="text-sm">• Customer: {booking?.customerName || 'N/A'}</p>
                    <p className="text-sm">• Current Position: #{queuePosition}</p>
                  </div>
                  <p className="text-red-600 dark:text-red-400 font-medium">
                    This action cannot be undone. You will lose your place in the queue.
                  </p>
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Keep Booking</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleCancelBooking}
                  className="bg-red-600 hover:bg-red-700 text-white"
                >
                  Yes, Cancel Booking
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </motion.div>

        {/* Last Updated */}
        <div className="text-center text-xs text-gray-500">
          Last updated: {lastUpdated.toLocaleTimeString()}
        </div>

        {/* Tips */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="glass-strong border-0 border-primary/20 rounded-xl p-6"
        >
          <h4 className="font-semibold text-primary mb-4 flex items-center">
            <AlertTriangle className="w-5 h-5 mr-2" />
            💡 Tips & Guidelines
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                <span className="text-sm">Stay nearby when you're in the top 3 positions</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                <span className="text-sm">This page refreshes automatically every 30 seconds</span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                <span className="text-sm">You'll get notifications when it's almost your turn</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                <span className="text-sm">You can cancel your booking anytime if plans change</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default QueueTracker;