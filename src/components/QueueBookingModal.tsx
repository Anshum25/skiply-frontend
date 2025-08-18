import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Clock, Users, ArrowRight, ArrowLeft } from "lucide-react";
import { Business, Department, BookingForm, QueueBooking } from "@/lib/types";
import { queueAPI } from "@/lib/api";
import { useApp } from "@/contexts/AppContext";
import { motion, AnimatePresence } from "framer-motion";

const bookingSchema = z.object({
  departmentId: z.string().min(1, "Please select a department"),
  userName: z.string().min(2, "Name must be at least 2 characters"),
  userPhone: z.string().min(10, "Please enter a valid phone number"),
  notes: z.string().optional(),
});

interface QueueBookingModalProps {
  business: Business;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (booking: QueueBooking) => void;
  onServiceSelect?: (service: string) => void;
}

type BookingStep = "department" | "details" | "confirm" | "success";

export function QueueBookingModal({
  business,
  isOpen,
  onClose,
  onSuccess,
}: QueueBookingModalProps) {
  const [step, setStep] = useState<BookingStep>("department");
  const [selectedDepartment, setSelectedDepartment] =
    useState<Department | null>(null);
  const [booking, setBooking] = useState<QueueBooking | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { addBooking } = useApp();

  const form = useForm<BookingForm>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      departmentId: "",
      userName: "",
      userPhone: "",
      notes: "",
    },
  });

  const handleDepartmentSelect = (department: Department) => {
    setSelectedDepartment(department);
    form.setValue("departmentId", department.id);
    if (onServiceSelect) {
      onServiceSelect(department.name);
    }
    setStep("details");
  };

  const handleDetailsSubmit = (data: BookingForm) => {
    setStep("confirm");
  };

  const handleConfirmBooking = async () => {
    if (!selectedDepartment) return;

    setIsLoading(true);
    try {
      const bookingData = form.getValues();
      const newBooking = await queueAPI.bookSlot(business.id, bookingData);
      setBooking(newBooking);
      addBooking(newBooking);
      setStep("success");
      onSuccess(newBooking);
    } catch (error) {
      console.error("Booking failed:", error);
      // Handle error
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setStep("department");
    setSelectedDepartment(null);
    setBooking(null);
    form.reset();
    onClose();
  };

  const stepVariants = {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 },
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <span>{business.name}</span>
            <Badge variant="secondary">{business.category}</Badge>
          </DialogTitle>
        </DialogHeader>

        <AnimatePresence mode="wait">
          {step === "department" && (
            <motion.div
              key="department"
              variants={stepVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="space-y-4"
            >
              <div>
                <h3 className="font-medium mb-3">
                  Select a Department/Service
                </h3>
                <div className="space-y-2">
                  {business.departments.map((dept) => (
                    <button
                      key={dept.id}
                      onClick={() => handleDepartmentSelect(dept)}
                      className="w-full p-3 text-left border rounded-lg hover:bg-accent transition-colors focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium">{dept.name}</h4>
                          <div className="flex items-center space-x-4 text-sm text-muted-foreground mt-1">
                            <span className="flex items-center space-x-1">
                              <Clock className="w-3 h-3" />
                              <span>{dept.estimatedWaitTime} min wait</span>
                            </span>
                            <span className="flex items-center space-x-1">
                              <Users className="w-3 h-3" />
                              <span>
                                {dept.currentQueueSize}/{dept.maxQueueSize} in
                                queue
                              </span>
                            </span>
                          </div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-muted-foreground" />
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {step === "details" && selectedDepartment && (
            <motion.div
              key="details"
              variants={stepVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="space-y-4"
            >
              <div className="flex items-center space-x-2 text-sm">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setStep("department")}
                  className="p-0 h-auto"
                >
                  <ArrowLeft className="w-4 h-4 mr-1" />
                  Back
                </Button>
                <span className="text-muted-foreground">•</span>
                <span className="font-medium">{selectedDepartment.name}</span>
              </div>

              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(handleDetailsSubmit)}
                  className="space-y-4"
                >
                  <FormField
                    control={form.control}
                    name="userName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter your full name"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="userPhone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone Number</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter your phone number"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="notes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Additional Notes (Optional)</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Any additional information or special requests..."
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button type="submit" className="w-full">
                    Continue to Confirmation
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </form>
              </Form>
            </motion.div>
          )}

          {step === "confirm" && selectedDepartment && (
            <motion.div
              key="confirm"
              variants={stepVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="space-y-4"
            >
              <div className="flex items-center space-x-2 text-sm">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setStep("details")}
                  className="p-0 h-auto"
                >
                  <ArrowLeft className="w-4 h-4 mr-1" />
                  Back
                </Button>
                <span className="text-muted-foreground">•</span>
                <span className="font-medium">Confirm Booking</span>
              </div>

              <div className="bg-muted/50 p-4 rounded-lg space-y-3">
                <h3 className="font-medium">Booking Summary</h3>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Business:</span>
                    <span className="font-medium">{business.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Service:</span>
                    <span className="font-medium">
                      {selectedDepartment.name}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Name:</span>
                    <span className="font-medium">
                      {form.getValues("userName")}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Phone:</span>
                    <span className="font-medium">
                      {form.getValues("userPhone")}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      Estimated wait:
                    </span>
                    <span className="font-medium">
                      {selectedDepartment.estimatedWaitTime} minutes
                    </span>
                  </div>
                  {form.getValues("notes") && (
                    <div className="pt-2 border-t">
                      <span className="text-muted-foreground block">
                        Notes:
                      </span>
                      <span className="text-sm">{form.getValues("notes")}</span>
                    </div>
                  )}
                </div>
              </div>

              <Button
                onClick={handleConfirmBooking}
                disabled={isLoading}
                className="w-full"
              >
                {isLoading ? "Booking..." : "Confirm Booking"}
              </Button>
            </motion.div>
          )}

          {step === "success" && booking && (
            <motion.div
              key="success"
              variants={stepVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="space-y-4 text-center"
            >
              <div className="flex justify-center">
                <CheckCircle className="w-16 h-16 text-green-500" />
              </div>

              <div>
                <h3 className="text-lg font-semibold text-green-600">
                  Booking Confirmed!
                </h3>
                <p className="text-muted-foreground">
                  Your spot has been reserved
                </p>
              </div>

              <div className="bg-green-50 dark:bg-green-950/20 p-4 rounded-lg space-y-2">
                <div className="text-2xl font-bold text-green-600">
                  Token #{booking.tokenNumber}
                </div>
                <div className="text-sm text-muted-foreground">
                  Estimated wait time: {booking.estimatedWaitTime} minutes
                </div>
              </div>

              <div className="space-y-2">
                <Button onClick={handleClose} className="w-full">
                  Done
                </Button>
                <Button
                  variant="outline"
                  onClick={() =>
                    (window.location.href = `/queue/${booking.id}`)
                  }
                  className="w-full"
                >
                  Track Your Queue
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}
