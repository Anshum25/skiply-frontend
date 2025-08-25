import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Clock,
  Users,
  CheckCircle,
  AlertCircle,
  XCircle,
  User,
  Phone,
  ArrowRight,
  ArrowLeft,
  Star,
  Timer,
  Activity,
  DollarSign,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Business, Department, QueueBooking } from "../types";
import { useAuth } from "../contexts/AuthContext";
import { toast } from "sonner";
import { cn } from "../lib/utils";
import QRCode from "react-qr-code";

interface LiveQueueBookingSectionProps {
  business: Business;
  isVisible: boolean;
  onClose: () => void;
}

type BookingStep = "departments" | "details" | "confirm" | "success";

interface BookingData {
  departmentId: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  notes: string;
  tokenNumber?: number;
  estimatedWaitTime?: number;
  bookingId?: string;
  qrCode?: string;
  bookedAt?: string;
  businessName?: string;
  departmentName?: string;
}

const LiveQueueBookingSection: React.FC<LiveQueueBookingSectionProps> = ({
  business,
  isVisible,
  onClose,
}) => {
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState<BookingStep>("departments");
  const [selectedDepartment, setSelectedDepartment] = useState<Department | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [bookingData, setBookingData] = useState<BookingData>({
    departmentId: "",
    customerName: user?.name || "",
    customerPhone: "",
    customerEmail: user?.email || "",
    notes: "",
  });

  // Calculate overall statistics
  const totalQueueSize = business.departments.reduce((total, dept) => total + dept.currentQueueSize, 0);
  const averageWaitTime = Math.round(
    business.departments.reduce((total, dept) => total + dept.estimatedWaitTime, 0) / business.departments.length
  );

  const getDepartmentStatus = (dept: Department) => {
    const percentage = (dept.currentQueueSize / dept.maxQueueSize) * 100;
    if (percentage >= 90) return { color: "text-red-600", bg: "bg-red-100 dark:bg-red-900/20", status: "Full", icon: XCircle };
    if (percentage >= 70) return { color: "text-orange-600", bg: "bg-orange-100 dark:bg-orange-900/20", status: "Busy", icon: AlertCircle };
    if (percentage >= 30) return { color: "text-yellow-600", bg: "bg-yellow-100 dark:bg-yellow-900/20", status: "Moderate", icon: Clock };
    return { color: "text-green-600", bg: "bg-green-100 dark:bg-green-900/20", status: "Available", icon: CheckCircle };
  };

  const handleDepartmentSelect = (dept: Department) => {
    setSelectedDepartment(dept);
    setBookingData(prev => ({ ...prev, departmentId: dept.id }));
  };

  const handleDetailsSubmit = () => {
    if (!bookingData.customerName || !bookingData.customerPhone) {
      toast.error("Please fill in all required fields");
      return;
    }
    
    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(bookingData.customerPhone)) {
      toast.error("Phone number must be exactly 10 digits");
      return;
    }
    
    setCurrentStep("confirm");
  };

  const handleConfirmBooking = async () => {
    if (!selectedDepartment || !user) return;

    setIsLoading(true);
    try {
      const token = localStorage.getItem("token");
      
      const businessId = business.id || (business as any)._id;
      
      if (!businessId) {
        console.error("No business ID found in business object:", business);
        toast.error("Business ID not found. Please try again.");
        return;
      }
      
      const bookingPayload = {
        businessId: businessId,
        businessName: business.name,
        departmentName: selectedDepartment.name,
        customerName: bookingData.customerName,
        customerPhone: bookingData.customerPhone,
        notes: bookingData.notes,
        bookedAt: new Date().toISOString(),
      };
      
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/queues/book`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(bookingPayload),
      });
      
      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Booking failed: ${res.status} - ${errorText}`);
      }
      
      const booking = await res.json();
      
      const qrData = JSON.stringify({
        bookingId: booking._id,
        tokenNumber: booking._id,
        businessName: booking.businessName,
        departmentName: booking.departmentName,
        customerName: booking.customerName,
        date: booking.bookedAt,
        time: new Date(booking.bookedAt).toLocaleTimeString(),
      });
      
      setBookingData(prev => ({
        ...prev,
        tokenNumber: 1,
        estimatedWaitTime: selectedDepartment.estimatedWaitTime,
        bookingId: booking._id,
        qrCode: qrData,
        bookedAt: booking.bookedAt,
        businessName: booking.businessName,
        departmentName: booking.departmentName,
      }));
      setCurrentStep("success");
      toast.success("Your booking has been confirmed!");
    } catch (error) {
      console.error("Booking error:", error);
      toast.error(`Booking failed: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const resetBooking = () => {
    setCurrentStep("departments");
    setSelectedDepartment(null);
    setBookingData({
      departmentId: "",
      customerName: user?.name || "",
      customerPhone: "",
      customerEmail: user?.email || "",
      notes: "",
    });
  };

  const handleClose = () => {
    resetBooking();
    onClose();
  };

  // Scroll to section when it becomes visible
  React.useEffect(() => {
    if (isVisible) {
      setTimeout(() => {
        const element = document.getElementById('live-queue-booking-section');
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    }
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <div id="live-queue-booking-section" className="mt-4">
      <Card className="w-full shadow-sm border-0">
        <CardHeader>
          <div className="flex items-center">
            <Button variant="ghost" size="sm" onClick={handleClose} className="mr-2">
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <CardTitle className="text-xl font-bold">Live Booking with Skiply</CardTitle>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Progress Steps */}
          <div className="flex items-center justify-center mb-6">
            {["departments", "details", "confirm", "success"].map((step, index) => (
              <div key={step} className="flex items-center">
                <div
                  className={cn(
                    "flex items-center justify-center w-8 h-8 rounded-full border-2 transition-all",
                    currentStep === step || 
                    (["departments", "details", "confirm", "success"].indexOf(currentStep) > index)
                      ? "bg-primary text-primary-foreground border-primary"
                      : "border-gray-300 text-gray-400"
                  )}
                >
                  {step === "departments" && <Users className="w-4 h-4" />}
                  {step === "details" && <User className="w-4 h-4" />}
                  {step === "confirm" && <Clock className="w-4 h-4" />}
                  {step === "success" && <CheckCircle className="w-4 h-4" />}
                </div>
                {index < 3 && (
                  <div
                    className={cn(
                      "w-12 h-0.5 mx-2 transition-all",
                      ["departments", "details", "confirm", "success"].indexOf(currentStep) > index
                        ? "bg-primary"
                        : "bg-gray-300"
                    )}
                  />
                )}
              </div>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {/* Step 1: Department Selection */}
            {currentStep === "departments" && (
              <motion.div
                key="departments"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                {/* Overall Statistics */}
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <Card className="glass-strong border-0">
                    <CardContent className="p-4 text-center">
                      <div className="text-2xl font-bold text-primary">{totalQueueSize}</div>
                      <div className="text-sm text-muted-foreground">Total in Queue</div>
                    </CardContent>
                  </Card>
                  <Card className="glass-strong border-0">
                    <CardContent className="p-4 text-center">
                      <div className="text-2xl font-bold text-orange-600">{averageWaitTime}min</div>
                      <p className="text-xs text-muted-foreground">Avg. Wait</p>
                    </CardContent>
                  </Card>
                  <Card className="glass-strong border-0">
                    <CardContent className="p-4 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <Star className="w-4 h-4 text-yellow-500" />
                        <div className="text-2xl font-bold">{business.rating}</div>
                      </div>
                      <div className="text-sm text-muted-foreground">Rating</div>
                    </CardContent>
                  </Card>
                </div>

                <h3 className="text-xl font-semibold mb-4">Select a Department</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {business.departments.map((dept) => {
                    const status = getDepartmentStatus(dept);
                    const StatusIcon = status.icon;
                    
                    return (
                      <motion.div
                        key={dept.id}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Card 
                          className={cn(
                            "cursor-pointer transition-all hover:shadow-lg border-l-4",
                            selectedDepartment?.id === dept.id
                              ? "border-l-primary shadow-lg ring-2 ring-primary"
                              : dept.currentQueueSize >= dept.maxQueueSize 
                                ? "border-l-red-500 opacity-50 cursor-not-allowed" 
                                : "border-l-blue-500 hover:border-l-primary"
                          )}
                          onClick={() => dept.currentQueueSize < dept.maxQueueSize && handleDepartmentSelect(dept)}
                        >
                          <CardContent className="p-6">
                            <div className="flex items-start justify-between mb-4">
                              <div className="flex-1">
                                <h4 className="text-lg font-semibold mb-2">{dept.name}</h4>
                                {dept.description && (
                                  <p className="text-sm text-muted-foreground mb-3">{dept.description}</p>
                                )}
                              </div>
                              <Badge className={cn("ml-2", status.color, status.bg)}>
                                <StatusIcon className="w-3 h-3 mr-1" />
                                {status.status}
                              </Badge>
                            </div>

                            <div className="space-y-3">
                              <div>
                                <div className="flex items-center justify-between text-sm mb-1">
                                  <span className="text-muted-foreground">Queue Status</span>
                                  <span className="font-medium">
                                    {dept.currentQueueSize}/{dept.maxQueueSize} people
                                  </span>
                                </div>
                                <Progress 
                                  value={(dept.currentQueueSize / dept.maxQueueSize) * 100} 
                                  className="h-2"
                                />
                              </div>

                              <div className="grid grid-cols-2 gap-4 text-sm">
                                <div className="flex items-center gap-2">
                                  <Timer className="w-4 h-4 text-muted-foreground" />
                                  <div>
                                    <div className="text-muted-foreground">Wait Time</div>
                                    <div className="font-medium">{dept.estimatedWaitTime} min</div>
                                  </div>
                                </div>
                                
                                {dept.price && (
                                  <div className="flex items-center gap-2">
                                    <DollarSign className="w-4 h-4 text-muted-foreground" />
                                    <div>
                                      <div className="text-muted-foreground">Price</div>
                                      <div className="font-medium text-green-600">${dept.price}</div>
                                    </div>
                                  </div>
                                )}

                                <div className="flex items-center gap-2">
                                  <Users className="w-4 h-4 text-muted-foreground" />
                                  <div>
                                    <div className="text-muted-foreground">Currently</div>
                                    <div className="font-medium">{dept.currentQueueSize} waiting</div>
                                  </div>
                                </div>

                                <div className="flex items-center gap-2">
                                  <Activity className="w-4 h-4 text-muted-foreground" />
                                  <div>
                                    <div className="text-muted-foreground">Status</div>
                                    <div className={cn("font-medium", status.color)}>{status.status}</div>
                                  </div>
                                </div>
                              </div>
                            </div>

                            {dept.currentQueueSize >= dept.maxQueueSize && (
                              <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                                <div className="flex items-center gap-2 text-red-600 text-sm">
                                  <XCircle className="w-4 h-4" />
                                  <span>This department is currently full</span>
                                </div>
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      </motion.div>
                    );
                  })}
                </div>

                <Button 
                  onClick={() => setCurrentStep("details")}
                  className="w-full btn-gradient mt-6"
                  disabled={!selectedDepartment}
                >
                  Next
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </motion.div>
            )}

            {/* Step 2: Customer Details */}
            {currentStep === "details" && selectedDepartment && (
              <motion.div
                key="details"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold">Your Details</h3>
                  <Button variant="ghost" onClick={() => setCurrentStep("departments")}>
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back
                  </Button>
                </div>

                {/* Selected Department Summary */}
                <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-semibold text-blue-900 dark:text-blue-100">
                          {selectedDepartment.name}
                        </h4>
                        <div className="flex items-center gap-4 text-sm text-blue-700 dark:text-blue-300 mt-1">
                          <span>Wait time: ~{selectedDepartment.estimatedWaitTime} min</span>
                          <span>Queue: {selectedDepartment.currentQueueSize}/{selectedDepartment.maxQueueSize}</span>
                          {selectedDepartment.price && <span>Price: ${selectedDepartment.price}</span>}
                        </div>
                      </div>
                      <Badge className="bg-blue-100 text-blue-700">
                        Token #{selectedDepartment.currentQueueSize + 1}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>

                {/* Form */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="customerName">Full Name *</Label>
                      <Input
                        id="customerName"
                        value={bookingData.customerName}
                        onChange={(e) => setBookingData(prev => ({ ...prev, customerName: e.target.value }))}
                        placeholder="Enter your full name"
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label htmlFor="customerPhone">Phone Number *</Label>
                      <Input
                        id="customerPhone"
                        type="tel"
                        value={bookingData.customerPhone}
                        onChange={(e) => {
                          const value = e.target.value.replace(/\D/g, '');
                          if (value.length <= 10) {
                            setBookingData(prev => ({ ...prev, customerPhone: value }));
                          }
                        }}
                        placeholder="Enter 10-digit phone number"
                        maxLength={10}
                        className="mt-1"
                      />
                      {bookingData.customerPhone && bookingData.customerPhone.length !== 10 && (
                        <p className="text-sm text-red-500 mt-1">Phone number must be exactly 10 digits</p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="customerEmail">Email Address</Label>
                      <Input
                        id="customerEmail"
                        type="email"
                        value={bookingData.customerEmail}
                        onChange={(e) => setBookingData(prev => ({ ...prev, customerEmail: e.target.value }))}
                        placeholder="Enter your email"
                        className="mt-1"
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="notes">Additional Notes</Label>
                      <Textarea
                        id="notes"
                        value={bookingData.notes}
                        onChange={(e) => setBookingData(prev => ({ ...prev, notes: e.target.value }))}
                        placeholder="Any special requirements or notes..."
                        rows={6}
                        className="mt-1"
                      />
                    </div>
                  </div>
                </div>

                <Button 
                  onClick={handleDetailsSubmit}
                  className="w-full btn-gradient"
                  disabled={!bookingData.customerName || !bookingData.customerPhone}
                >
                  Continue to Confirmation
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </motion.div>
            )}

            {/* Step 3: Confirmation */}
            {currentStep === "confirm" && selectedDepartment && (
              <motion.div
                key="confirm"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold">Confirm Your Booking</h3>
                  <Button variant="ghost" onClick={() => setCurrentStep("details")}>
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back
                  </Button>
                </div>

                <Card className="glass-strong border-0">
                  <CardHeader>
                    <CardTitle>Booking Summary</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-[auto,1fr] gap-x-4 gap-y-2 text-sm">
                      <span className="text-muted-foreground">Business:</span>
                      <span className="font-medium">{business.name}</span>

                      <span className="text-muted-foreground">Department:</span>
                      <span className="font-medium">{selectedDepartment.name}</span>

                      <span className="text-muted-foreground">Name:</span>
                      <span className="font-medium">{bookingData.customerName}</span>

                      <span className="text-muted-foreground">Phone:</span>
                      <span className="font-medium">{bookingData.customerPhone}</span>

                      <span className="text-muted-foreground">Token Number:</span>
                      <span className="font-medium text-primary">#{selectedDepartment.currentQueueSize + 1}</span>

                      <span className="text-muted-foreground">Estimated Wait:</span>
                      <span className="font-medium">{selectedDepartment.estimatedWaitTime} minutes</span>
                    </div>

                    {bookingData.notes && (
                      <div>
                        <span className="text-sm text-muted-foreground">Notes:</span>
                        <div className="mt-1 text-sm bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                          {bookingData.notes}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Button 
                  onClick={handleConfirmBooking}
                  disabled={isLoading}
                  className="w-full btn-gradient"
                >
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      Confirming...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Confirm Booking
                    </>
                  )}
                </Button>
              </motion.div>
            )}

            {/* Step 4: Success */}
            {currentStep === "success" && bookingData.tokenNumber && (
              <motion.div
                key="success"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="text-center space-y-6"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring" }}
                  className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto"
                >
                  <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
                </motion.div>
                <div>
                  <h3 className="text-2xl font-bold mb-2">Booking Confirmed!</h3>
                  <p className="text-muted-foreground">Your spot in the queue has been reserved</p>
                </div>
                <Card className="bg-green-50 dark:bg-green-900/20 border-green-200">
                  <CardContent className="p-6 text-center">
                    <div className="text-4xl font-bold text-green-600 dark:text-green-400 mb-2">
                      Token #{bookingData.tokenNumber}
                    </div>
                    <div className="space-y-1 text-sm text-muted-foreground">
                      <div>Estimated wait time: {bookingData.estimatedWaitTime} minutes</div>
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
                <div className="space-y-3">
                  <Button onClick={handleClose} className="w-full btn-gradient">
                    Done
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => {
                      if (bookingData.bookingId) {
                        window.location.href = `/queue-tracker/${bookingData.bookingId}`;
                      }
                    }}
                  >
                    <Activity className="w-4 h-4 mr-2" />
                    Track My Queue
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
    </div>
  );
};

export default LiveQueueBookingSection;
