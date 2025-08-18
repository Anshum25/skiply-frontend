import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  X,
  ArrowRight,
  ArrowLeft,
  CheckCircle,
  Clock,
  Users,
  User,
  Phone,
  MessageSquare,
  Calendar,
} from "lucide-react";
import { Business, BookingFormData, QueueBooking } from "../types";
import { useAuth } from "../contexts/AuthContext";
import axios from "axios";
import QRCode from "react-qr-code";
import { toast } from "sonner";

const bookingSchema = z.object({
  departmentId: z.string().min(1, "Please select a department"),
  customerName: z.string().min(2, "Name must be at least 2 characters"),
  customerPhone: z.string().min(10, "Please enter a valid phone number"),
  customerEmail: z.string().email("Please enter a valid email address"),
  notes: z.string().optional(),
});

type FormData = z.infer<typeof bookingSchema>;

interface BookingModalProps {
  business: Business;
  isOpen: boolean;
  onClose: () => void;
  preSelectedDepartmentId?: string;
}

type Step = "department" | "details" | "confirm" | "success";

export const BookingModal: React.FC<BookingModalProps> = ({
  business,
  isOpen,
  onClose,
  preSelectedDepartmentId,
}) => {
  const [currentStep, setCurrentStep] = useState<Step>("department");
  const [isLoading, setIsLoading] = useState(false);
  const [booking, setBooking] = useState<QueueBooking | null>(null);
  const { user } = useAuth();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      departmentId: preSelectedDepartmentId || "",
      customerName: user?.name || "",
      customerPhone: user?.phone || "",
      customerEmail: user?.email || "",
      notes: "",
    },
  });

  const selectedDepartmentId = watch("departmentId");
  const selectedDepartment = business.departments.find(
    (d) => d.id === selectedDepartmentId,
  );

  useEffect(() => {
    if (isOpen) {
      if (preSelectedDepartmentId) {
        setValue("departmentId", preSelectedDepartmentId);
        setCurrentStep("details");
      } else {
        setCurrentStep("department");
      }
      setValue("customerName", user?.name || "");
      setValue("customerPhone", user?.phone || "");
    } else {
      reset();
      setCurrentStep("department");
      setBooking(null);
    }
  }, [isOpen, preSelectedDepartmentId, user, setValue, reset]);

  const handleDepartmentSelect = async (departmentId: string) => {
    setValue("departmentId", departmentId);
    setCurrentStep("details");
  };

  const handleDetailsSubmit = (data: FormData) => {
    setCurrentStep("confirm");
  };

  const handleConfirmBooking = async (data: FormData) => {
    setIsLoading(true);
    try {
      // Use 'id' for lookup, fallback to _id for legacy
      const department = business.departments.find((d) => d.id === data.departmentId);
      if (!department) throw new Error("Department not found");

      const businessId = business.id || business._id;
      if (!businessId) {
        throw new Error('Business ID is missing. Cannot create booking.');
      }
      
      const bookingPayload = {
        business: businessId,
        businessId: businessId,
        businessName: business.name || business.businessName,
        departmentId: data.departmentId,
        departmentName: department.name,
        customerName: data.customerName,
        customerPhone: data.customerPhone,
        customerEmail: data.customerEmail,
        notes: data.notes,
        bookedAt: new Date().toISOString(),
      };
      
      console.log('Sending booking payload:', bookingPayload);
      
      const token = localStorage.getItem("token");
      const res = await axios.post(
        "http://localhost:5050/api/queues/book",
        bookingPayload,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      const bookingRes = res.data;
      setBooking(bookingRes);
      setCurrentStep("success");
      toast.success("Booking confirmed successfully!");
    } catch (error: any) {
      console.error('Booking error:', error);
      toast.error(error.response?.data?.message || "Booking failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };


  const steps = [
    { id: "department", title: "Select Service", icon: Calendar },
    { id: "details", title: "Your Details", icon: User },
    { id: "confirm", title: "Confirm", icon: CheckCircle },
    { id: "success", title: "Success", icon: CheckCircle },
  ];

  const stepVariants = {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 },
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-2xl bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold">{business.name}</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Progress Steps */}
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div
                  className={`
                  flex items-center justify-center w-8 h-8 rounded-full border-2 transition-all
                  ${
                    steps.findIndex((s) => s.id === currentStep) >= index
                      ? "bg-white text-blue-600 border-white"
                      : "border-white/50 text-white/50"
                  }
                `}
                >
                  <step.icon className="w-4 h-4" />
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`
                    w-8 h-0.5 mx-2 transition-all
                    ${
                      steps.findIndex((s) => s.id === currentStep) > index
                        ? "bg-white"
                        : "bg-white/30"
                    }
                  `}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <form
            onSubmit={handleSubmit(
              currentStep === "details"
                ? handleDetailsSubmit
                : handleConfirmBooking,
            )}
          >
            <AnimatePresence mode="wait">
              {/* Step 1: Department Selection */}
              {currentStep === "department" && (
                <motion.div
                  key="department"
                  variants={stepVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  className="space-y-6"
                >
                  <div className="text-center mb-4">
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                      Select a Service
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">
                      Choose the department or service you want to book.
                    </p>
                    <div className="flex justify-center mt-2">
                      <Calendar className="w-8 h-8 text-blue-500" />
                    </div>
                    <hr className="my-4 border-t border-gray-200 dark:border-gray-700" />
                  </div>
                  <div className="space-y-3">
                    {business.departments.map((department) => (
                      <motion.button
                        key={department.id}
                        type="button"
                        onClick={() => handleDepartmentSelect(department.id)}
                        disabled={
                          !department.isActive ||
                          department.currentQueueSize >= department.maxQueueSize
                        }
                        whileHover={{
                          scale:
                            department.isActive &&
                            department.currentQueueSize <
                              department.maxQueueSize
                              ? 1.02
                              : 1,
                        }}
                        whileTap={{ scale: 0.98 }}
                        className={`
                          w-full p-4 text-left border-2 rounded-xl transition-all
                          ${
                            department.isActive &&
                            department.currentQueueSize <
                              department.maxQueueSize
                              ? "border-gray-200 dark:border-gray-600 hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                              : "border-gray-200 dark:border-gray-600 opacity-50 cursor-not-allowed"
                          }
                          ${
                            selectedDepartmentId === department.id
                              ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                              : ""
                          }
                        `}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                              {department.name}
                            </h4>
                            {department.description && (
                              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                                {department.description}
                              </p>
                            )}
                            <div className="flex items-center space-x-4 text-sm text-gray-500">
                              <div className="flex items-center space-x-1">
                                <Clock className="w-3 h-3" />
                                <span>
                                  {department.estimatedWaitTime} min wait
                                </span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <Users className="w-3 h-3" />
                                <span>
                                  {department.currentQueueSize}/
                                  {department.maxQueueSize} in queue
                                </span>
                              </div>
                              {department.price && (
                                <div className="text-green-600 dark:text-green-400 font-semibold">
                                  ${department.price}
                                </div>
                              )}
                            </div>
                          </div>
                          <ArrowRight className="w-5 h-5 text-gray-400" />
                        </div>
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Step 2: Customer Details */}
              {currentStep === "details" && (
                <motion.div
                  key="details"
                  variants={stepVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  className="space-y-6"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                      Your Details
                    </h3>
                    <button
                      type="button"
                      onClick={() => setCurrentStep("department")}
                      className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      <span>Back</span>
                    </button>
                  </div>

                  {selectedDepartment && (
                    <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                      <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-1">
                        Selected Service: {selectedDepartment.name}
                      </h4>
                      <div className="flex items-center space-x-4 text-sm text-blue-700 dark:text-blue-300">
                        <span>
                          Wait time: {selectedDepartment.estimatedWaitTime}{" "}
                          minutes
                        </span>
                        <span>
                          Queue: {selectedDepartment.currentQueueSize}/
                          {selectedDepartment.maxQueueSize}
                        </span>
                      </div>
                    </div>
                  )}

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Full Name
                      </label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <input
                          {...register("customerName")}
                          type="text"
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors"
                          placeholder="Enter your full name"
                        />
                      </div>
                      {errors.customerName && (
                        <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                          {errors.customerName.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Phone Number
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <input
                          {...register("customerPhone")}
                          type="tel"
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors"
                          placeholder="Enter your phone number"
                        />
                      </div>
                      {errors.customerPhone && (
                        <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                          {errors.customerPhone.message}
                        </p>
                      )}
                    </div>

                    <div>
  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
    Email Address
  </label>
  <div className="relative">
    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
    <input
      {...register("customerEmail")}
      type="email"
      className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors"
      placeholder="Enter your email address"
      required
    />
  </div>
</div>
<div>
  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
    Additional Notes (Optional)
  </label>
  <div className="relative">
    <MessageSquare className="absolute left-3 top-3 text-gray-400 w-4 h-4" />
    <textarea
      {...register("notes")}
      rows={3}
      className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors"
      placeholder="Any special requests or additional information..."
    />
  </div>
</div>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-200 flex items-center justify-center space-x-2"
                  >
                    <span>Continue to Confirmation</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </motion.div>
              )}

              {/* Step 3: Confirmation */}
              {currentStep === "confirm" && selectedDepartment && (
                <motion.div
                  key="confirm"
                  variants={stepVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  className="space-y-6"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                      Confirm Your Booking
                    </h3>
                    <button
                      type="button"
                      onClick={() => setCurrentStep("details")}
                      className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      <span>Back</span>
                    </button>
                  </div>

                  <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-xl space-y-4">
                    <h4 className="font-semibold text-gray-900 dark:text-white">
                      Booking Summary
                    </h4>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600 dark:text-gray-400">
                          Business:
                        </span>
                        <div className="font-semibold">{business.name}</div>
                      </div>
                      <div>
                        <span className="text-gray-600 dark:text-gray-400">
                          Service:
                        </span>
                        <div className="font-semibold">
                          {selectedDepartment.name}
                        </div>
                      </div>
                      <div>
                        <span className="text-gray-600 dark:text-gray-400">
                          Name:
                        </span>
                        <div className="font-semibold">
                          {watch("customerName")}
                        </div>
                      </div>
                      <div>
                        <span className="text-gray-600 dark:text-gray-400">
                          Phone:
                        </span>
                        <div className="font-semibold">
                          {watch("customerPhone")}
                        </div>
                      </div>
                      <div>
                        <span className="text-gray-600 dark:text-gray-400">
                          Estimated wait:
                        </span>
                        <div className="font-semibold">
                          {selectedDepartment.estimatedWaitTime} minutes
                        </div>
                      </div>
                      <div>
                        <span className="text-gray-600 dark:text-gray-400">
                          Queue position:
                        </span>
                        <div className="font-semibold">
                          #{selectedDepartment.currentQueueSize + 1}
                        </div>
                      </div>
                    </div>

                    {watch("notes") && (
                      <div>
                        <span className="text-gray-600 dark:text-gray-400 text-sm">
                          Notes:
                        </span>
                        <div className="text-sm mt-1">{watch("notes")}</div>
                      </div>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 rounded-lg font-semibold hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                  >
                    {isLoading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Confirming...</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle className="w-4 h-4" />
                        <span>Confirm Booking</span>
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-200 mb-4"
                    onClick={onClose}
                  >
                    Done
                  </button>
                  <button
                    type="button"
                    className="w-full border border-blue-600 text-blue-600 py-3 rounded-lg font-semibold hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-200"
                    onClick={() => window.location.href = '/my-queue'}
                  >
                    Track My Queue
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </form>
        </div>
      </motion.div>
    </div>
  );
};
