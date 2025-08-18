import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Clock, Users, Eye } from "lucide-react";
import { QueueBooking, Business } from "@/lib/types";
import { QUEUE_STATUS_COLORS } from "@/lib/constants";
import { motion } from "framer-motion";

interface QueueCardProps {
  booking: QueueBooking;
  business?: Business;
  showProgress?: boolean;
  index?: number;
}

export function QueueCard({
  booking,
  business,
  showProgress = false,
  index = 0,
}: QueueCardProps) {
  const getProgressPercentage = () => {
    // Simulate progress based on token number and estimated time
    const estimatedProgress = Math.max(0, 100 - booking.tokenNumber * 10);
    return Math.min(100, estimatedProgress);
  };

  const getStatusIcon = () => {
    switch (booking.status) {
      case "waiting":
        return <Clock className="w-4 h-4" />;
      case "in-progress":
        return <Users className="w-4 h-4" />;
      case "completed":
        return <Eye className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
    >
      <Card className="hover:shadow-md transition-all duration-300 bg-card/50 backdrop-blur-sm border border-border/50">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div
                className={`w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold text-sm ${
                  booking.status === "waiting"
                    ? "bg-gradient-to-r from-blue-500 to-blue-600"
                    : booking.status === "in-progress"
                      ? "bg-gradient-to-r from-green-500 to-green-600"
                      : booking.status === "completed"
                        ? "bg-gradient-to-r from-gray-400 to-gray-500"
                        : "bg-gradient-to-r from-red-500 to-red-600"
                }`}
              >
                #{booking.tokenNumber}
              </div>
              <div>
                <h3 className="font-semibold text-sm">
                  {business?.name || "Business Name"}
                </h3>
                <p className="text-xs text-muted-foreground">
                  {business?.departments.find(
                    (d) => d.id === booking.departmentId,
                  )?.name || "Service"}
                </p>
              </div>
            </div>
            <Badge
              className={`${QUEUE_STATUS_COLORS[booking.status]} border text-xs`}
              variant="outline"
            >
              <span className="flex items-center space-x-1">
                {getStatusIcon()}
                <span className="capitalize">{booking.status}</span>
              </span>
            </Badge>
          </div>

          {showProgress && booking.status === "waiting" && (
            <div className="mb-4 space-y-2">
              <div className="flex justify-between text-xs">
                <span>Queue Progress</span>
                <span>{Math.round(getProgressPercentage())}%</span>
              </div>
              <Progress value={getProgressPercentage()} className="h-2" />
            </div>
          )}

          <div className="grid grid-cols-2 gap-3 mb-4 text-xs">
            <div className="text-center p-2 bg-muted/50 rounded-md">
              <Clock className="w-3 h-3 mx-auto mb-1 text-muted-foreground" />
              <div className="font-medium">{booking.estimatedWaitTime}m</div>
              <div className="text-muted-foreground">Est. wait</div>
            </div>
            <div className="text-center p-2 bg-muted/50 rounded-md">
              <Users className="w-3 h-3 mx-auto mb-1 text-muted-foreground" />
              <div className="font-medium">
                {booking.status === "waiting"
                  ? `#${booking.tokenNumber}`
                  : "Done"}
              </div>
              <div className="text-muted-foreground">Position</div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="text-xs text-muted-foreground">
              <strong>Booked:</strong>{" "}
              {new Date(booking.bookedAt).toLocaleString()}
            </div>

            {booking.notes && (
              <div className="text-xs text-muted-foreground">
                <strong>Notes:</strong> {booking.notes}
              </div>
            )}

            <div className="text-xs text-muted-foreground">
              <strong>Contact:</strong> {booking.userPhone}
            </div>
          </div>

          {booking.status === "waiting" && (
            <div className="mt-4 flex space-x-2">
              <Button
                asChild
                size="sm"
                variant="outline"
                className="flex-1 text-xs"
              >
                <Link to={`/queue/${booking.id}`}>
                  <Eye className="w-3 h-3 mr-1" />
                  Track
                </Link>
              </Button>
              <Button asChild size="sm" className="flex-1 text-xs">
                <Link to={`/business/${booking.businessId}`}>
                  View Business
                </Link>
              </Button>
            </div>
          )}

          {booking.status === "completed" && (
            <div className="mt-4">
              <Button size="sm" variant="outline" className="w-full text-xs">
                Rate Experience
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
