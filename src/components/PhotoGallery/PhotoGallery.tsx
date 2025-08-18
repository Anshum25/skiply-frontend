import React, { useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "../ui/dialog";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import {
  ChevronLeft,
  ChevronRight,
  X,
  ZoomIn,
  Download,
  Share2,
  Heart,
  Camera,
} from "lucide-react";
import { cn } from "../../lib/utils";
import { motion, AnimatePresence } from "framer-motion";

interface Photo {
  id: string;
  url: string;
  caption?: string;
  category?: string;
  uploadedAt: string;
}

interface PhotoGalleryProps {
  photos: Photo[];
  title?: string;
  className?: string;
  maxPreview?: number;
  showCategories?: boolean;
}

export const PhotoGallery: React.FC<PhotoGalleryProps> = ({
  photos,
  title = "Photos",
  className,
  maxPreview = 6,
  showCategories = false,
}) => {
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Filter photos by category if selected
  const filteredPhotos = selectedCategory
    ? photos.filter((photo) => photo.category === selectedCategory)
    : photos;

  // Get unique categories
  const categories = Array.from(
    new Set(photos.map((photo) => photo.category).filter(Boolean)),
  );

  const previewPhotos = filteredPhotos.slice(0, maxPreview);
  const remainingCount = Math.max(0, filteredPhotos.length - maxPreview);

  const openPhoto = (photo: Photo, index: number) => {
    setSelectedPhoto(photo);
    setCurrentIndex(index);
    setIsFullscreen(true);
  };

  const closePhoto = () => {
    setSelectedPhoto(null);
    setIsFullscreen(false);
  };

  const goToNext = () => {
    const nextIndex = (currentIndex + 1) % filteredPhotos.length;
    setCurrentIndex(nextIndex);
    setSelectedPhoto(filteredPhotos[nextIndex]);
  };

  const goToPrevious = () => {
    const prevIndex =
      currentIndex === 0 ? filteredPhotos.length - 1 : currentIndex - 1;
    setCurrentIndex(prevIndex);
    setSelectedPhoto(filteredPhotos[prevIndex]);
  };

  if (photos.length === 0) {
    return (
      <div className={cn("text-center py-12", className)}>
        <Camera className="w-16 h-16 mx-auto mb-4 text-muted-foreground/50" />
        <h3 className="text-lg font-medium text-muted-foreground mb-2">
          No photos yet
        </h3>
        <p className="text-sm text-muted-foreground/75">
          Photos will appear here when available
        </p>
      </div>
    );
  }

  return (
    <div className={className}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold">{title}</h3>
        <Badge variant="secondary">
          {filteredPhotos.length} photo{filteredPhotos.length !== 1 ? "s" : ""}
        </Badge>
      </div>

      {/* Category Filter */}
      {showCategories && categories.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-6">
          <Button
            variant={selectedCategory === null ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedCategory(null)}
            className="text-xs"
          >
            All ({photos.length})
          </Button>
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category)}
              className="text-xs"
            >
              {category} ({photos.filter((p) => p.category === category).length}
              )
            </Button>
          ))}
        </div>
      )}

      {/* Photo Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {previewPhotos.map((photo, index) => (
          <motion.div
            key={photo.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            className="relative group cursor-pointer"
            onClick={() => openPhoto(photo, index)}
          >
            <div className="aspect-square rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800">
              <img
                src={photo.url}
                alt={photo.caption || `Photo ${index + 1}`}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
              />

              {/* Overlay */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300 flex items-center justify-center">
                <ZoomIn className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
            </div>

            {photo.caption && (
              <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                {photo.caption}
              </p>
            )}
          </motion.div>
        ))}

        {/* Show More Button */}
        {remainingCount > 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: previewPhotos.length * 0.1 }}
            className="aspect-square rounded-lg bg-gradient-primary/10 border-2 border-dashed border-primary/30 flex flex-col items-center justify-center cursor-pointer group hover:bg-gradient-primary/20 transition-colors duration-300"
            onClick={() => setSelectedCategory(null)}
          >
            <Camera className="w-8 h-8 text-primary mb-2 group-hover:scale-110 transition-transform duration-300" />
            <span className="text-primary font-medium">
              +{remainingCount} more
            </span>
          </motion.div>
        )}
      </div>

      {/* Fullscreen Modal */}
      <Dialog open={isFullscreen} onOpenChange={setIsFullscreen}>
        <DialogContent className="max-w-7xl w-full h-full p-0 bg-black/95">
          <div className="relative w-full h-full flex items-center justify-center">
            {/* Close Button */}
            <Button
              variant="ghost"
              size="sm"
              className="absolute top-4 right-4 z-50 text-white hover:bg-white/10"
              onClick={closePhoto}
            >
              <X className="w-6 h-6" />
            </Button>

            {/* Navigation Buttons */}
            {filteredPhotos.length > 1 && (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 z-50 text-white hover:bg-white/10"
                  onClick={goToPrevious}
                >
                  <ChevronLeft className="w-8 h-8" />
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 z-50 text-white hover:bg-white/10"
                  onClick={goToNext}
                >
                  <ChevronRight className="w-8 h-8" />
                </Button>
              </>
            )}

            {/* Action Buttons */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-50 flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                className="text-white hover:bg-white/10"
              >
                <Heart className="w-5 h-5" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-white hover:bg-white/10"
              >
                <Share2 className="w-5 h-5" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-white hover:bg-white/10"
              >
                <Download className="w-5 h-5" />
              </Button>
            </div>

            {/* Photo Counter */}
            {filteredPhotos.length > 1 && (
              <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-50">
                <Badge variant="secondary" className="bg-black/50 text-white">
                  {currentIndex + 1} of {filteredPhotos.length}
                </Badge>
              </div>
            )}

            {/* Main Image */}
            <AnimatePresence mode="wait">
              {selectedPhoto && (
                <motion.img
                  key={selectedPhoto.id}
                  src={selectedPhoto.url}
                  alt={selectedPhoto.caption || "Photo"}
                  className="max-w-full max-h-full object-contain"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                />
              )}
            </AnimatePresence>

            {/* Caption */}
            {selectedPhoto?.caption && (
              <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2 z-50 max-w-2xl">
                <p className="text-white text-center bg-black/50 rounded-lg px-4 py-2">
                  {selectedPhoto.caption}
                </p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
