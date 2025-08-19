import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Clock,
  Users,
  CheckCircle,
  AlertCircle,
  XCircle,
  User,
  Phone,
  Calendar as CalendarIcon,
  MapPin,
  DollarSign,
  TrendingUp,
  ArrowRight,
  ArrowLeft,
  X,
  MessageSquare,
  Star,
  Timer,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Progress } from "../ui/progress";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { useAuth } from "../../contexts/AuthContext";
import { toast } from "sonner";
import { cn } from "../../lib/utils";
import QRCode from "react-qr-code";


interface Department {
  id: string;
  name: string;
  estimatedWaitTime: number;
  currentQueueSize: number;
  maxQueueSize: number;
  isActive: boolean;
  description?: string;
  price?: number;
}

interface AdvanceBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  business?: any;
  date?: Date | null;
  time?: string | null;
  onSuccessfulBooking?: (bookingData: {
    bookingId: string;
    tokenNumber: number;
    date: string;
    time: string;
    departmentName: string;
    customerName: string;
  }) => void;
}

interface BookingData {
  departmentId: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  notes: string;
  date?: string;
  time?: string;
  tokenNumber?: number;
  estimatedWaitTime?: number;
  bookingId?: string;
  qrCode?: string;
  bookedAt?: string;
  businessName?: string;
  departmentName?: string;
}

const AdvanceBookingModal: React.FC<AdvanceBookingModalProps> = ({ isOpen, onClose, business, date, time, onSuccessfulBooking }): JSX.Element => {
  // Debug: Log the business object to understand its structure
  console.log("AdvanceBookingModal - Business object:", business);
  console.log("AdvanceBookingModal - Business ID:", business?._id);
  console.log("AdvanceBookingModal - Business name:", business?.name);
  console.log("AdvanceBookingModal - Business businessName:", business?.businessName);
  
  // Defensive fallback: ensure departments is always an array of objects
  let safeBusiness = business;
  if (business && Array.isArray(business.departments) && typeof business.departments[0] === 'string') {
    safeBusiness = {
      ...business,
      departments: business.departments.map((name: string, i: number) => ({
        id: `dept-${i}`,
        name,
        currentQueueSize: 0,
        maxQueueSize: 20,
        estimatedWaitTime: 10,
        isActive: true,
      }))
    };
  }

  const { user } = useAuth();
  
  // Create a default department if none exists
  const defaultDepartment: Department = {
    id: "default",
    name: "General Service",
    currentQueueSize: 0,
    maxQueueSize: 20,
    estimatedWaitTime: 10,
    isActive: true,
  };
  
  // Use the first available department or default
  const autoDepartment = safeBusiness?.departments && safeBusiness.departments.length > 0 
    ? safeBusiness.departments[0] 
    : defaultDepartment;
    
  const [selectedDepartment, setSelectedDepartment] = useState<Department | null>(autoDepartment);
  const [step, setStep] = useState<"details" | "confirm" | "success">("details");

  const [bookingData, setBookingData] = useState<BookingData>({
    departmentId: "",
    customerName: user?.name || "",
          customerPhone: "",
    customerEmail: user?.email,
    notes: "",
    date: date ? date.toISOString() : undefined,
    time: time || undefined,
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleDetailsSubmit = () => {
    if (!bookingData.customerName || !bookingData.customerPhone) {
      toast.error("Please fill in all required fields");
      return;
    }
    
    // Validate phone number is exactly 10 digits
    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(bookingData.customerPhone)) {
      toast.error("Phone number must be exactly 10 digits");
      return;
    }
    
    setStep("confirm");
  };

  const handleConfirmBooking = async () => {
    if (!user) return;
    
    // Check if business exists
    if (!business) {
      toast.error("Business information not available. Please try again.");
      return;
    }
    
    // Use default department if none selected
    const department = selectedDepartment || {
      id: "default",
      name: "General Service",
      estimatedWaitTime: 10,
    };
    setIsLoading(true);
    try {
      const token = localStorage.getItem("token");
      
      // Get business ID with fallbacks
      const businessId = business._id || business.id || (business as any)._id;
      const businessName = business.businessName || business.name || "Unknown Business";
      
      console.log("Business object:", business);
      console.log("Business ID:", businessId);
      console.log("Business Name:", businessName);
      
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/queues/book`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          businessId: businessId,
          businessName: businessName,
          departmentName: department.name,
          customerName: bookingData.customerName,
          customerPhone: bookingData.customerPhone,
          notes: bookingData.notes,
          bookedAt: date ? date.toISOString() : new Date().toISOString(),
          time: time || undefined,
        }),
      });
      
      console.log("Response status:", res.status);
      console.log("Response headers:", res.headers);
      
      if (!res.ok) {
        const errorText = await res.text();
        console.error("Booking failed with status:", res.status);
        console.error("Error response:", errorText);
        throw new Error(`Booking failed: ${res.status} - ${errorText}`);
      }
      
      const booking = await res.json();
      
      console.log("Booking response:", booking); // Debug log
      
      // Generate QR code data using the booking response
      const qrData = JSON.stringify({
        bookingId: booking._id,
        tokenNumber: booking._id, // Use booking ID as token since backend doesn't provide tokenNumber
        businessName: booking.businessName,
        departmentName: booking.departmentName,
        customerName: booking.customerName,
        date: booking.bookedAt,
        time: new Date(booking.bookedAt).toLocaleTimeString(),
      });
      
      // Update booking data with the actual response from server
      setBookingData(prev => ({
        ...prev,
        tokenNumber: 1, // Default to 1 since backend doesn't provide tokenNumber
        estimatedWaitTime: department.estimatedWaitTime,
        bookingId: booking._id,
        qrCode: qrData,
        // Store the actual booking response for display
        bookedAt: booking.bookedAt,
        businessName: booking.businessName,
        departmentName: booking.departmentName,
      }));
      
      // Call the success handler if provided
      if (onSuccessfulBooking) {
        onSuccessfulBooking({
          bookingId: booking._id,
          tokenNumber: bookingData.tokenNumber || 1,
          date: date ? date.toISOString() : new Date().toISOString(),
          time: time || new Date().toLocaleTimeString(),
          departmentName: bookingData.departmentName || selectedDepartment?.name || "General Service",
          customerName: bookingData.customerName,
        });
      }
      
      setStep("success");
      toast.success("Your booking has been confirmed!");
    } catch (error) {
      console.error("Booking error:", error);
      const errorMessage = error instanceof Error ? error.message : "Booking failed. Please try again.";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const resetBooking = () => {
    setStep("details");
    setSelectedDepartment(autoDepartment);
    setBookingData({
      departmentId: autoDepartment?.id || "",
      customerName: user?.name || "",
      customerPhone: "",
      customerEmail: user?.email,
      notes: "",
      date: date ? date.toISOString() : undefined,
      time: time || undefined,
    });
  };

  const handleClose = () => {
    resetBooking();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-lg w-full">
        <DialogHeader>
          <DialogTitle>Book an Appointment</DialogTitle>
        </DialogHeader>
        <div className="flex justify-between items-center mb-6">
          {["details", "confirm", "success"].map((s, idx) => (
            <div key={s} className="flex items-center">
              <div
                className={`w-8 h-8 flex items-center justify-center rounded-full border-2 font-bold transition-colors duration-200 ` +
                  (step === s
                    ? "bg-primary text-primary-foreground border-primary"
                    : "border-gray-300 text-gray-400 bg-white")
                }
              >
                {idx + 1}
              </div>
              {idx < 2 && <div className="w-8 h-1 bg-gray-300 mx-1 rounded" />}
            </div>
          ))}
        </div>

        {/* Step: User Details */}
        {step === "details" && (
          <div className="space-y-4">
            <div className="flex items-center space-x-2 text-sm">
              <Button variant="ghost" size="sm" onClick={() => setStep("details")} className="p-0 h-auto">
                <ArrowLeft className="w-4 h-4 mr-1" /> Back
              </Button>
              <span className="text-muted-foreground">•</span>
              <span className="font-medium">{selectedDepartment?.name || "General Service"}</span>
            </div>
            <form onSubmit={e => { e.preventDefault(); handleDetailsSubmit(); }} className="space-y-4">
              <div>
                <label className="block font-medium mb-1">Full Name</label>
                <Input
                  required
                  placeholder="Enter your full name"
                  value={bookingData.customerName}
                  onChange={e => setBookingData(f => ({ ...f, customerName: e.target.value }))}
                />
              </div>
              <div>
                <label className="block font-medium mb-1">Phone Number</label>
                <Input
                  required
                  type="tel"
                  placeholder="Enter 10-digit phone number"
                  value={bookingData.customerPhone}
                  onChange={e => {
                    // Only allow digits
                    const value = e.target.value.replace(/\D/g, '');
                    // Limit to 10 digits
                    if (value.length <= 10) {
                      setBookingData(f => ({ ...f, customerPhone: value }));
                    }
                  }}
                  maxLength={10}
                />
                {bookingData.customerPhone && bookingData.customerPhone.length !== 10 && (
                  <p className="text-sm text-red-500 mt-1">Phone number must be exactly 10 digits</p>
                )}
              </div>
              <div>
  <label className="block font-medium mb-1">Email Address</label>
  <Input
    required
    type="email"
    placeholder="Enter your email address"
    value={bookingData.customerEmail || ''}
    onChange={e => setBookingData(f => ({ ...f, customerEmail: e.target.value }))}
  />
</div>
<div>
  <label className="block font-medium mb-1">Additional Notes (Optional)</label>
  <Textarea
    placeholder="Any additional information or special requests..."
    value={bookingData.notes}
    onChange={e => setBookingData(f => ({ ...f, notes: e.target.value }))}
  />
</div>
              <Button type="submit" className="w-full">
                Continue to Confirmation <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </form>
          </div>
        )}

        {/* Step: Confirm */}
        {step === "confirm" && (
          <div className="space-y-4">
            <div className="flex items-center space-x-2 text-sm">
              <Button variant="ghost" size="sm" onClick={() => setStep('details')} className="p-0 h-auto">
                <ArrowLeft className="w-4 h-4 mr-1" /> Back
              </Button>
              <span className="text-muted-foreground">•</span>
              <span className="font-medium">Confirm Booking</span>
            </div>
            <div className="bg-muted/50 p-4 rounded-lg space-y-3">
              <h3 className="font-medium">Booking Summary</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Business:</span>
                  <span className="font-medium">
                    {business?.businessName || business?.name || business?.id || business?._id || "N/A"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Service:</span>
                  <span className="font-medium">{selectedDepartment?.name || "General Service"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Date:</span>
                  <span className="font-medium">{date ? date.toLocaleDateString() : new Date().toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Time:</span>
                  <span className="font-medium">{time || new Date().toLocaleTimeString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Name:</span>
                  <span className="font-medium">{bookingData.customerName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Phone:</span>
                  <span className="font-medium">{bookingData.customerPhone}</span>
                </div>
                {bookingData.notes && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Notes:</span>
                    <span className="font-medium">{bookingData.notes}</span>
                  </div>
                )}
              </div>
            </div>
            <Button className="w-full" onClick={handleConfirmBooking} disabled={isLoading}>
              {isLoading ? "Booking..." : "Confirm & Book"}
            </Button>
          </div>
        )}

        {/* Step: Success */}
        {step === "success" && (
          <div className="text-center space-y-6 my-8">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <h3 className="text-2xl font-bold mb-2">Booking Confirmed!</h3>
              <p className="text-muted-foreground">Your appointment has been scheduled</p>
            </div>
            <Card className="bg-green-50 dark:bg-green-900/20 border-green-200">
              <CardContent className="p-6 text-center">
                <div className="text-4xl font-bold text-green-600 dark:text-green-400 mb-2">
                  Token #{bookingData.tokenNumber || 1}
                </div>
                <div className="space-y-1 text-sm text-muted-foreground">
                  <div>Estimated wait time: {bookingData.estimatedWaitTime || selectedDepartment?.estimatedWaitTime} minutes</div>
                  <div>Booked at: {bookingData.bookedAt ? new Date(bookingData.bookedAt).toLocaleTimeString() : new Date().toLocaleTimeString()}</div>
                  <div>Department: {bookingData.departmentName || selectedDepartment?.name}</div>
                </div>
                {bookingData.qrCode && (
                  <div className="mt-6 flex flex-col items-center">
                    <div className="mb-2 font-semibold">Your QR Code</div>
                    <QRCode value={bookingData.qrCode} size={128} />
                    <div className="text-xs text-muted-foreground mt-2">Show this QR code at the counter</div>
                  </div>
                )}
              </CardContent>
            </Card>
            <div className="mt-6">
              <Button onClick={handleClose} className="w-full btn-gradient">
                Done
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

// --- Named export for modal below ---
export { AdvanceBookingModal };