import React, { useState, useEffect } from "react";
import { queueAPI } from "@/lib/api";
import type { Business } from "@/lib/types";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar as CalendarIcon,
  Clock,
  ChevronLeft,
  ChevronRight,
  Plus,
  Users,
  CheckCircle,
  AlertCircle,
  X,
  Edit,
  Trash2,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { QueueBookingModal } from "../QueueBookingModal";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { toast } from "sonner";
import "./BookingCalendar.css";
import { AdvanceBookingModal } from "./AdvanceBookingModal";

interface TimeSlot {
  id: string;
  time: string;
  available: boolean;
  capacity: number;
  booked: number;
  bookings: BookingSlot[];
}

interface BookingSlot {
  id: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  service: string;
  notes?: string;
  status: "confirmed" | "pending" | "completed" | "cancelled";
  duration: number;
  amount?: number;
}

interface BookingCalendarProps {
  business: Business;
  onBookingCreate?: (booking: BookingSlot) => void;
  onBookingUpdate?: (booking: BookingSlot) => void;
  onBookingDelete?: (bookingId: string) => void;
  isManagementMode?: boolean;
}

const BookingCalendar: React.FC<BookingCalendarProps> = ({
  business,
  onBookingCreate,
  onBookingUpdate,
  onBookingDelete,
  isManagementMode = false,
}) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<TimeSlot | null>(null);
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [slotStartTime, setSlotStartTime] = useState<string | undefined>(undefined);
  const [slotEndTime, setSlotEndTime] = useState<string | undefined>(undefined);
  const [selectedService, setSelectedService] = useState<string>("");
  const [now, setNow] = useState(new Date());
  const [dateSlots, setDateSlots] = useState<{ [key: string]: TimeSlot[] }>(() => {
    // Load date slots from localStorage on component mount
    const saved = localStorage.getItem('dateSlots');
    if (saved) {
      const slots = JSON.parse(saved);
      // Filter out slots older than 7 days
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      const filteredSlots: { [key: string]: TimeSlot[] } = {};
      
      Object.keys(slots).forEach(dateString => {
        const date = new Date(dateString);
        if (date >= sevenDaysAgo) {
          filteredSlots[dateString] = slots[dateString];
        }
      });
      
      // Update localStorage with filtered slots
      localStorage.setItem('dateSlots', JSON.stringify(filteredSlots));
      return filteredSlots;
    }
    return {};
  });
  const [isAdvanceBookingModalOpen, setIsAdvanceBookingModalOpen] = useState(false);
  const [selectedSlotDate, setSelectedSlotDate] = useState<Date | null>(null);
  const [selectedSlotTime, setSelectedSlotTime] = useState<string | null>(null);
  const [recentBookings, setRecentBookings] = useState<Array<{
    id: string;
    tokenNumber: number;
    date: string;
    time: string;
    departmentName: string;
    customerName: string;
  }>>(() => {
    // Load recent bookings from localStorage on component mount
    const saved = localStorage.getItem('recentBookings');
    if (saved) {
      const bookings = JSON.parse(saved);
      // Filter out bookings older than 7 days
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      const filteredBookings = bookings.filter((booking: any) => {
        const bookingDate = new Date(booking.date);
        return bookingDate >= sevenDaysAgo;
      });
      // Update localStorage with filtered bookings
      localStorage.setItem('recentBookings', JSON.stringify(filteredBookings));
      return filteredBookings;
    }
    return [];
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setNow(new Date());
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  // Add this function above the useEffect for slot generation
  const generateTimeSlots = (date: Date): TimeSlot[] => {
    const slots: TimeSlot[] = [];
    const startHour = 9; // 9 AM
    const endHour = 17; // 5 PM
    const interval = 30; // 30 minutes

    for (let hour = startHour; hour < endHour; hour++) {
      for (let minute = 0; minute < 60; minute += interval) {
        const time = `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`;
        slots.push({
          id: `slot-${time}`,
          time,
          available: true,
          capacity: 4,
          booked: 0,
          bookings: [],
        });
      }
    }

    return slots;
  };

  // Restore original slot generation logic
  useEffect(() => {
    const dateString = selectedDate.toDateString();
    if (dateSlots && dateSlots[dateString]) {
      setTimeSlots(dateSlots[dateString]);
    } else {
      const slots = generateTimeSlots(selectedDate);
      setDateSlots((prev) => ({ ...prev, [dateString]: slots }));
      setTimeSlots(slots);
    }
  }, [selectedDate]);

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
  };

  const handleTimeSlotSelect = (slot: TimeSlot) => {
    // Check if slot is full
    if (slot.booked >= slot.capacity) {
      toast.error(`This time slot (${slot.time}) is fully booked. Please select another time.`);
      return;
    }
    
    setSelectedSlotDate(selectedDate);
    setSelectedSlotTime(slot.time);
    setIsAdvanceBookingModalOpen(true);
  };

  const handleSuccessfulBooking = (bookingData: {
    bookingId: string;
    tokenNumber: number;
    date: string;
    time: string;
    departmentName: string;
    customerName: string;
  }) => {
    console.log('handleSuccessfulBooking called with:', bookingData);
    
    // Update recent bookings
    const updatedBookings = [bookingData, ...recentBookings.slice(0, 2)]; // Keep only last 3 bookings
    setRecentBookings(updatedBookings);
    
    // Save to localStorage
    localStorage.setItem('recentBookings', JSON.stringify(updatedBookings));
    
    // Update time slots to reflect the new booking
    const updatedSlots = timeSlots.map(slot => {
      if (slot.time === bookingData.time) {
        console.log(`Updating slot ${slot.time} with new booking`);
        const newBooking: BookingSlot = {
          id: bookingData.bookingId,
          customerName: bookingData.customerName,
          customerPhone: "", // Will be filled from the booking data
          customerEmail: "", // Will be filled from the booking data
          service: bookingData.departmentName,
          notes: "",
          status: "confirmed",
          duration: 30, // Default duration
        };
        
        const updatedBookings = [...slot.bookings, newBooking];
        const updatedSlot = {
          ...slot,
          bookings: updatedBookings,
          booked: updatedBookings.length,
          available: updatedBookings.length < slot.capacity,
        };
        console.log(`Updated slot:`, updatedSlot);
        return updatedSlot;
      }
      return slot;
    });
    
    console.log('Updated slots:', updatedSlots);
    setTimeSlots(updatedSlots);
    
    // Update date slots to persist the change
    const dateString = selectedDate.toDateString();
    const updatedDateSlots = {
      ...dateSlots,
      [dateString]: updatedSlots
    };
    setDateSlots(updatedDateSlots);
    
    // Save to localStorage
    localStorage.setItem('dateSlots', JSON.stringify(updatedDateSlots));
    
    setIsAdvanceBookingModalOpen(false);
    toast.success(`Booking confirmed! Token #${bookingData.tokenNumber}`);
  };

  const handleBookingDelete = (bookingId: string) => {
    const dateString = selectedDate.toDateString();
    const updatedSlots = (timeSlots).map((slot) => {
      if (slot.bookings.some((booking) => booking.id === bookingId)) {
        const updatedBookings = slot.bookings.filter(
          (booking) => booking.id !== bookingId,
        );
        return {
          ...slot,
          bookings: updatedBookings,
          booked: updatedBookings.length,
          available: updatedBookings.length < slot.capacity,
        };
      }
      return slot;
    });

    setTimeSlots(updatedSlots);
    toast.success("Booking deleted successfully!");
  };

  const getBookingCountForDate = (date: Date) => {
    const dateString = date.toDateString();
    const slots = dateSlots[dateString] || [];
    if (!slots || slots.length === 0) return 0;
    const totalBookings = slots.reduce((sum, slot) => sum + (slot.bookings ? slot.bookings.length : 0), 0);
    console.log(`Booking count for ${dateString}:`, totalBookings, 'slots:', slots.length);
    return totalBookings;
  };

  const getDayClass = (date: Date | null) => {
    if (!date) return "";

    // Use the actual current date
    const today = new Date();
    today.setHours(0,0,0,0);
    const isToday = date.toDateString() === today.toDateString();
    const isSelected = date.toDateString() === selectedDate.toDateString();
    const isPast = date < today;
    const bookingCount = getBookingCountForDate(date);

    let classes = "calendar-day";

    if (isToday) classes += " today";
    if (isSelected) classes += " selected";
    if (isPast) classes += " greyed-out";
    if (bookingCount > 15) classes += " busy";
    else if (bookingCount > 8) classes += " moderate";
    else classes += " available";

    return classes;
  };

  const handleBookingSubmit = () => {
    if (!selectedTimeSlot) return;

    if (!slotStartTime || !slotEndTime) {
      toast.error("Time slot details not available.");
      return;
    }

    if (!selectedService) {
      toast.error("Please select a service.");
      return;
    }

    queueAPI.bookSlot(business._id, slotStartTime, slotEndTime, selectedService)
      .then(booking => {
        setIsBookingModalOpen(false);
        if (onBookingCreate) onBookingCreate(booking);
        toast.success("Booking created successfully!");
      })
      .catch(err => {
        toast.error(`Failed to create booking: ${err.message}`);
      });
  };

  const navigateMonth = (direction: "prev" | "next") => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() + (direction === "next" ? 1 : -1));
    setCurrentDate(newDate);
  };

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];

    // Add empty slots for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }

    return days;
  };

  return (
    <div className="space-y-6">
      {/* Recent Bookings Display */}
      {recentBookings.length > 0 && (
        <Card className="bg-green-50 dark:bg-green-900/20 border-green-200">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-green-700 dark:text-green-300">
              <CheckCircle className="w-5 h-5" />
              <span>Recent Bookings</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentBookings.map((booking) => (
                <motion.div
                  key={booking.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg border border-green-200"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                      <span className="text-lg font-bold text-green-600 dark:text-green-400">
                        #{booking.tokenNumber}
                      </span>
                    </div>
                    <div>
                      <div className="font-medium">{booking.customerName}</div>
                      <div className="text-sm text-muted-foreground">
                        {booking.departmentName} • {new Date(booking.date).toLocaleDateString()} at {booking.time}
                      </div>
                    </div>
                  </div>
                  <Badge className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300">
                    Confirmed
                  </Badge>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Calendar Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <CalendarIcon className="w-5 h-5" />
              <span>Booking Calendar</span>
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          {/* Month Navigation */}
          <div className="flex items-center justify-between mb-6">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigateMonth("prev")}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <h2 className="text-xl font-semibold">
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </h2>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigateMonth("next")}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-1 mb-4">
            {dayNames.map((day) => (
              <div
                key={day}
                className="text-center text-sm font-medium text-gray-500 dark:text-gray-400 py-2"
              >
                {day}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-1">
            {getDaysInMonth(currentDate).map((date, index) => {
              console.log(`Calendar day ${index}:`, date, date ? date.getDate() : 'null');
              return (
              <motion.div
                key={index}
                whileHover={date && !(date < new Date('2025-07-22T00:00:00+05:30')) ? { scale: 1.05 } : {}}
                whileTap={date && !(date < new Date('2025-07-22T00:00:00+05:30')) ? { scale: 0.95 } : {}}
                className={`h-20 border border-gray-200 dark:border-gray-700 rounded-lg ${
                  date
                    ? (date < new Date('2025-07-22T00:00:00+05:30')
                        ? "bg-gray-200 dark:bg-gray-800 text-gray-600 dark:text-gray-300 cursor-not-allowed pointer-events-none greyed-out"
                        : "cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800"
                      )
                    : ""
                } ${getDayClass(date)}`}
                onClick={() => date && !(date < new Date('2025-07-22T00:00:00+05:30')) && handleDateSelect(date)}
              >
                {date && (
                  <div className="p-2 h-full flex flex-col">
                    <span className="text-sm font-medium text-foreground dark:text-white">
                      {date.getDate()}
                    </span>
                    <div className="flex-1 flex items-end">
                      <div className="w-full">
                        {/* Only show queue number if NOT a past date */}
                        {(() => {
                          const today = new Date("2025-07-22T10:51:27+05:30");
                          today.setHours(0,0,0,0);
                          if (date >= today && getBookingCountForDate(date) > 0) {
                            return (
                              <Badge
                                variant="secondary"
                                className="text-xs w-full justify-center"
                              >
                                {getBookingCountForDate(date)}
                              </Badge>
                            );
                          }
                          return null;
                        })()}
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Time Slots */}
      {(() => {
        const today = new Date();
        today.setHours(0,0,0,0);
        const isPast = selectedDate < today;
        if (selectedDate && !isPast) {
          return (
            <Card>
              <CardHeader>
                <CardTitle>
                  Available Time Slots - {selectedDate.toLocaleDateString()}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-3">
                  {timeSlots.map((slot) => {
                    const [hour, minute] = slot.time.split(":").map(Number);
                    const slotDate = new Date(selectedDate);
                    slotDate.setHours(hour, minute, 0, 0);
                    const isPast = slotDate < now;
                    const isFull = slot.booked >= slot.capacity;
                    return (
                      <motion.div
                        key={slot.id}
                        whileHover={!isPast && !isFull ? { scale: 1.05 } : {}}
                        whileTap={!isPast && !isFull ? { scale: 0.95 } : {}}
                        className={`p-3 rounded-lg border transition-all ${
                          isPast
                            ? "bg-gray-200 dark:bg-gray-800 text-gray-400 cursor-not-allowed pointer-events-none greyed-out border-gray-200 dark:border-gray-700"
                            : isFull
                              ? "border-red-200 bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-300 cursor-pointer"
                              : slot.available
                                ? "border-green-200 bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-300 hover:bg-green-100 dark:hover:bg-green-900/30 cursor-pointer"
                                : "border-red-200 bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-300 cursor-pointer"
                        }`}
                        onClick={() => !isPast && handleTimeSlotSelect(slot)}
                      >
                        <div className="text-center">
                          <div className="font-medium text-sm">{slot.time}</div>
                          <div className="text-xs mt-1">
                            {slot.booked}/{slot.capacity}
                          </div>
                          {slot.bookings.length > 0 && (
                            <div className="flex justify-center mt-1">
                              <Users className="w-3 h-3" />
                            </div>
                          )}
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          );
        }
        return null;
      })()}

      {/* Booking Details Modal */}
      <Dialog open={isBookingModalOpen} onOpenChange={setIsBookingModalOpen}>
        {business && (
          <QueueBookingModal
            business={business}
            isOpen={isBookingModalOpen}
            onClose={() => setIsBookingModalOpen(false)}
            onSuccess={(booking) => {
              setIsBookingModalOpen(false);
              if (onBookingCreate) onBookingCreate(booking);
            }}
            onServiceSelect={(service) => setSelectedService(service)}
            startTime={slotStartTime}
            endTime={slotEndTime}
          />
        )}
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {isManagementMode ? "Manage Bookings" : "Book Appointment"}
            </DialogTitle>
          </DialogHeader>

          {selectedTimeSlot && (
            <div className="space-y-6">
              {/* Time Slot Info */}
              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">
                    {selectedDate.toLocaleDateString()} at{" "}
                    {selectedTimeSlot.time}
                  </span>
                  <Badge
                    variant={
                      selectedTimeSlot.available ? "default" : "destructive"
                    }
                  >
                    {selectedTimeSlot.booked}/{selectedTimeSlot.capacity}
                  </Badge>
                </div>
              </div>

              {/* Existing Bookings (Management Mode) */}
              {isManagementMode && selectedTimeSlot.bookings.length > 0 && (
                <div className="space-y-3">
                  <h4 className="font-medium">Existing Bookings</h4>
                  {selectedTimeSlot.bookings.map((booking) => (
                    <div
                      key={booking.id}
                      className="border border-gray-200 dark:border-gray-700 rounded-lg p-3"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className="font-medium">{booking.customerName}</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {booking.service}
                          </p>
                          <p className="text-xs text-gray-500">
                            {booking.customerPhone}
                          </p>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Badge
                            variant={
                              booking.status === "confirmed"
                                ? "default"
                                : booking.status === "completed"
                                  ? "outline"
                                  : booking.status === "cancelled"
                                    ? "destructive"
                                    : "secondary"
                            }
                          >
                            {booking.status}
                          </Badge>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setEditingBooking(booking)}
                          >
                            <Edit className="w-3 h-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleBookingDelete(booking.id)}
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {!selectedTimeSlot.available && !isManagementMode && (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  <AlertCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>This time slot is fully booked</p>
                  <p className="text-sm">Please select a different time</p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Render AdvanceBookingModal for advance booking */}
      <AdvanceBookingModal
        isOpen={isAdvanceBookingModalOpen}
        onClose={() => setIsAdvanceBookingModalOpen(false)}
        date={selectedSlotDate}
        time={selectedSlotTime}
        business={business}
        onSuccessfulBooking={handleSuccessfulBooking}
      />

      {/* Legend */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Legend</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4 text-sm">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-green-100 border border-green-200 rounded"></div>
              <span>Available</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-yellow-100 border border-yellow-200 rounded"></div>
              <span>Moderate</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-red-100 border border-red-200 rounded"></div>
              <span>Busy</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-blue-100 border border-blue-200 rounded"></div>
              <span>Selected</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BookingCalendar;