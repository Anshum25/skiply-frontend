import React, { useState } from "react";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import {
  MapPin,
  Clock,
  Star,
  Users,
  Phone,
  Bookmark,
  BookmarkCheck,
  Eye,
  Zap,
  Heart,
  Share2,
  ChevronRight,
  Wifi,
  CreditCard,
  Calendar,
} from "lucide-react";
import { Business, QueueBooking } from "../types";
import { cn } from "../lib/utils";
import { useAuth } from "../contexts/AuthContext";
import { StarRating } from "./Reviews/StarRating";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

interface EnhancedBusinessCardProps {
  business: Business;
  queueData?: QueueBooking[];
  showBookmark?: boolean;
  onBookmarkToggle?: (businessId: string) => void;
  isBookmarked?: boolean;
  className?: string;
  variant?: "default" | "compact" | "featured";
}

export const EnhancedBusinessCard: React.FC<EnhancedBusinessCardProps> = ({
  business,
  queueData = [],
  showBookmark = true,
  onBookmarkToggle,
  isBookmarked = false,
  className,
  variant = "default",
}) => {
  const { user } = useAuth();
  const [imageError, setImageError] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const businessImages = business.images || business.photos || [];

  console.log("EnhancedBusinessCard business.images:", business.images);

  // Calculate queue statistics
  const totalCurrentQueue = business.departments.reduce(
    (total, dept) => total + dept.currentQueueSize,
    0,
  );

  const averageWaitTime =
    business.departments.length > 0
      ? Math.round(
          business.departments.reduce(
            (total, dept) => total + dept.estimatedWaitTime,
            0,
          ) / business.departments.length,
        )
      : 0;

  // Check if business is open now
  const isOpenNow = () => {
    const now = new Date();
    const dayNames = [
      "sunday",
      "monday",
      "tuesday",
      "wednesday",
      "thursday",
      "friday",
      "saturday",
    ];
    const dayOfWeek = dayNames[now.getDay()];
    const currentTime = now.toTimeString().slice(0, 5); // HH:MM

    const todayHours = business.openingHours[dayOfWeek];
    if (!todayHours || todayHours.closed) return false;

    return currentTime >= todayHours.start && currentTime <= todayHours.end;
  };

  const getQueueStatus = () => {
    if (totalCurrentQueue === 0)
      return { status: "available", color: "text-green-600", bg: "bg-green-100" };
    if (totalCurrentQueue < 10)
      return { status: "low", color: "text-yellow-600", bg: "bg-yellow-100" };
    if (totalCurrentQueue < 20)
      return { status: "medium", color: "text-orange-600", bg: "bg-orange-100" };
    return { status: "high", color: "text-red-600", bg: "bg-red-100" };
  };

  const queueStatus = getQueueStatus();
  const openStatus = isOpenNow();

  const handleBookmarkClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onBookmarkToggle?.(business.id);
  };

  const handleShare = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (navigator.share) {
      navigator.share({ title: business.name, text: business.description, url: `${window.location.origin}/business/${business.id}` });
    } else {
      navigator.clipboard.writeText(`${window.location.origin}/business/${business.id}`);
    }
  };

  if (variant === "compact") {
    return (
      <motion.div
        whileHover={{ scale: 1.02 }}
        className={cn("card-hover", className)}
      >
        <Card className="glass border-0 overflow-hidden">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Avatar className="w-12 h-12">
                <AvatarImage
                  src={
                    !imageError && businessImages.length > 0
                      ? (businessImages[0].startsWith("http") || businessImages[0].startsWith("/")
                          ? businessImages[0]
                          : `${import.meta.env.VITE_API_URL}/uploads/${businessImages[0]}`)
                      : undefined
                  }
                  onError={() => setImageError(true)}
                />
                <AvatarFallback className="bg-gradient-primary text-white">
                   {business.name.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-sm truncate">
                   {business.name}
                </h3>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                   <StarRating rating={business.rating} readonly size="sm" />
                   <span>({business.totalReviews})</span>
                </div>
              </div>

              <div className="text-right">
                <Badge
                   variant="outline"
                   className={cn("text-xs", queueStatus.color)}
                >
                   {totalCurrentQueue} in queue
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className={cn("card-hover", className)}
    >
      <Link to={`/business/${business.id}`}>
        <Card className="glass border-0 overflow-hidden group">
          {/* Cover Image */}
          <div className="relative h-48 overflow-hidden bg-gradient-primary">
            {businessImages.length > 0 && !imageError ? (
              <img
                src={
                  businessImages[0].startsWith("http") || businessImages[0].startsWith("/")
                    ? businessImages[0]
                    : `${import.meta.env.VITE_API_URL}/uploads/${businessImages[0]}`
                }
                alt={business.name}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                onError={() => setImageError(true)}
              />
            ) : (
              <div className="w-full h-full bg-gradient-primary flex items-center justify-center">
                <div className="text-white text-6xl font-bold opacity-20">
                   {business.name.slice(0, 1).toUpperCase()}
                </div>
              </div>
            )}

            {/* Badges */}
            <div className="absolute top-3 left-3 flex flex-wrap gap-2">
              <Badge
                 variant={openStatus ? "default" : "secondary"}
                 className={cn(
                   "text-xs",
                   openStatus ? "bg-green-500 text-white" : "bg-gray-500 text-white",
                 )}

              >
                 {openStatus ? "Open Now" : "Closed"}
              </Badge>

              {business.isVerified && (
                <Badge variant="secondary" className="text-xs bg-blue-500 text-white">
                   <Zap className="w-3 h-3 mr-1" />
                   Verified
                </Badge>
              )}

            </div>

            {/* Action Buttons */}
            <div className="absolute top-3 right-3 flex gap-2">
              {showBookmark && (
                <Button
                   variant="secondary"
                   size="sm"
                   className="h-8 w-8 p-0 bg-white/90 hover:bg-white"
                   onClick={handleBookmarkClick}>
                   {isBookmarked ? (
                     <BookmarkCheck className="w-4 h-4 text-primary" />
                   ) : (
                     <Bookmark className="w-4 h-4" />
                   )}

                </Button>
              )}

              <Button
                 variant="secondary"
                 size="sm"
                 className="h-8 w-8 p-0 bg-white/90 hover:bg-white"
                 onClick={handleShare}>
                 <Share2 className="w-4 h-4" />
               </Button>
            </div>

            {/* Business Logo */}
            <div className="absolute -bottom-6 left-4">
              <Avatar className="w-12 h-12 border-4 border-white">
                 <AvatarImage
                   src={
                     !imageError && businessImages.length > 0
                       ? (businessImages[0].startsWith("http") || businessImages[0].startsWith("/")
                           ? businessImages[0]
                           : `${import.meta.env.VITE_API_URL}/uploads/${businessImages[0]}`)
                       : undefined
                   }
                   onError={() => setImageError(true)}
                 />
                 <AvatarFallback className="bg-gradient-primary text-white font-semibold">
                   {business.name.slice(0, 2).toUpperCase()}
                 </AvatarFallback>
               </Avatar>
            </div>
          </div>

          {/* Content Section */}
          <CardContent className="pt-8 pb-4 px-4">
            {/* Title */}
            <div className="mb-3">
              <div className="flex items-start justify-between gap-2">
                 <h3 className="font-semibold text-lg leading-tight line-clamp-1">
                   {business.name}
                 </h3>
                 <motion.div
                   animate={{ x: isHovered ? 4 : 0 }}
                   transition={{ duration: 0.2 }}
                 >
                   <ChevronRight className="w-5 h-5 text-muted-foreground" />
                 </motion.div>
               </div>

               <div className="flex items-center gap-2 mt-1">
                 <StarRating
                   rating={business.rating}
                   readonly
                   size="sm"
                   showValue
                 />
                 <span className="text-sm text-muted-foreground">
                   ({business.totalReviews} reviews)
                 </span>
               </div>
            </div>

            {/* Location */}
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
              <MapPin className="w-4 h-4 flex-shrink-0" />
              <span className="line-clamp-1">{business.address}</span>
            </div>

            {/* Description */}
            {business.description && (
              <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                 {business.description}
               </p>
            )}

            {/* Queue Info */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-muted-foreground" />
                <div>
                   <div className={cn("text-sm font-medium", queueStatus.color)}>
                      {totalCurrentQueue} in queue
                   </div>
                   <div className="text-xs text-muted-foreground">
                     Current wait
                   </div>
                 </div>
               </div>

               <div className="flex items-center gap-2">
                 <Clock className="w-4 h-4 text-muted-foreground" />
                 <div>
                   <div className="text-sm font-medium">
                     ~{averageWaitTime}min
                   </div>
                   <div className="text-xs text-muted-foreground">
                     Avg wait time
                   </div>
                 </div>
               </div>
            </div>

            {/* Features */}
            <div className="flex flex-wrap gap-2 mb-4">
              {business.contact?.phone && (
                <Badge variant="outline" className="text-xs">
                   <Phone className="w-3 h-3 mr-1" />
                   Call
                 </Badge>
               )}

               <Badge variant="outline" className="text-xs">
                 <Calendar className="w-3 h-3 mr-1" />
                 Book ahead
               </Badge>

               <Badge variant="outline" className="text-xs">
                 <Wifi className="w-3 h-3 mr-1" />
                 Free WiFi
               </Badge>
            </div>

            {/* Services */}
            <div className="space-y-2">
              <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                Services Available
              </div>
              <div className="flex flex-wrap gap-1">
                {business.departments.slice(0, 3).map((dept) => (
                   <Badge key={dept.id} variant="secondary" className="text-xs">
                      {dept.name}
                   </Badge>
                 ))}

                 {business.departments.length > 3 && (
                   <Badge variant="outline" className="text-xs">
                      +{business.departments.length - 3} more
                   </Badge>
                 )}

               </div>
            </div>
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  );
};

export default EnhancedBusinessCard;
