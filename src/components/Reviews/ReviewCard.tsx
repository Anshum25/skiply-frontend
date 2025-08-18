import React, { useState } from "react";
import { Card, CardContent } from "../ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Separator } from "../ui/separator";
import {
  ThumbsUp,
  ThumbsDown,
  Flag,
  MoreVertical,
  Camera,
  CheckCircle,
  Reply,
} from "lucide-react";
import { StarRating } from "./StarRating";
import { Review } from "../../types";
import { formatDistanceToNow } from "date-fns";
import { cn } from "../../lib/utils";
import { motion } from "framer-motion";

interface ReviewCardProps {
  review: Review;
  showBusinessResponse?: boolean;
  onHelpfulClick?: (reviewId: string, isHelpful: boolean) => void;
  onReportClick?: (reviewId: string) => void;
  onReplyClick?: (reviewId: string) => void;
  className?: string;
}

export const ReviewCard: React.FC<ReviewCardProps> = ({
  review,
  showBusinessResponse = true,
  onHelpfulClick,
  onReportClick,
  onReplyClick,
  className,
}) => {
  const [helpfulVotes, setHelpfulVotes] = useState(review.helpfulVotes);
  const [hasVoted, setHasVoted] = useState(false);

  const handleHelpfulClick = (isHelpful: boolean) => {
    if (hasVoted) return;

    setHelpfulVotes((prev) => prev + (isHelpful ? 1 : 0));
    setHasVoted(true);
    onHelpfulClick?.(review.id, isHelpful);
  };

  const getRatingColor = (rating: number) => {
    if (rating >= 4) return "text-green-600";
    if (rating >= 3) return "text-yellow-600";
    return "text-red-600";
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={className}
    >
      <Card className="glass-strong border-0 hover:shadow-lg transition-all duration-300">
        <CardContent className="p-6">
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-start gap-3">
              <Avatar className="w-10 h-10">
                <AvatarImage
                  src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${review.userId}`}
                />
                <AvatarFallback className="bg-gradient-primary text-white">
                  {getInitials("Anonymous User")}
                </AvatarFallback>
              </Avatar>

              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-medium">Anonymous User</h4>
                  {review.isVerified && (
                    <Badge variant="secondary" className="text-xs">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Verified
                    </Badge>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <StarRating rating={review.rating} readonly size="sm" />
                  <span
                    className={cn(
                      "text-sm font-medium",
                      getRatingColor(review.rating),
                    )}
                  >
                    {review.rating}.0
                  </span>
                  <span className="text-sm text-muted-foreground">
                    •{" "}
                    {formatDistanceToNow(new Date(review.createdAt), {
                      addSuffix: true,
                    })}
                  </span>
                </div>
              </div>
            </div>

            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <MoreVertical className="w-4 h-4" />
            </Button>
          </div>

          {/* Review Content */}
          {review.comment && (
            <div className="mb-4">
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                {review.comment}
              </p>
            </div>
          )}

          {/* Photos */}
          {review.photos && review.photos.length > 0 && (
            <div className="mb-4">
              <div className="flex gap-2 overflow-x-auto pb-2">
                {review.photos.map((photo, index) => (
                  <div
                    key={index}
                    className="relative flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800"
                  >
                    <img
                      src={photo}
                      alt={`Review photo ${index + 1}`}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-200 cursor-pointer"
                    />
                    <div className="absolute inset-0 bg-black/20 opacity-0 hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                      <Camera className="w-4 h-4 text-white" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                className={cn("text-sm gap-1", hasVoted && "text-primary")}
                onClick={() => handleHelpfulClick(true)}
                disabled={hasVoted}
              >
                <ThumbsUp className="w-4 h-4" />
                Helpful ({helpfulVotes})
              </Button>

              <Button
                variant="ghost"
                size="sm"
                className="text-sm gap-1"
                onClick={() => onReportClick?.(review.id)}
              >
                <Flag className="w-4 h-4" />
                Report
              </Button>
            </div>

            {onReplyClick && (
              <Button
                variant="outline"
                size="sm"
                className="text-sm gap-1"
                onClick={() => onReplyClick(review.id)}
              >
                <Reply className="w-4 h-4" />
                Reply
              </Button>
            )}
          </div>

          {/* Business Response */}
          {showBusinessResponse && review.response && (
            <>
              <Separator className="my-4" />
              <div className="bg-muted/50 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="outline" className="text-xs">
                    Business Response
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    {formatDistanceToNow(
                      new Date(review.response.respondedAt),
                      {
                        addSuffix: true,
                      },
                    )}
                  </span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {review.response.message}
                </p>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};
