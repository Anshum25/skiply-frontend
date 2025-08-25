import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import axios from "axios";
import {
  Eye,
  EyeOff,
  User,
  Mail,
  Building2,
  MapPin,
  Lock,
  Loader2,
  Plus,
  Trash2,
  Clock,
  DollarSign,
  BarChart3,
  Users,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { BUSINESS_CATEGORIES } from '../data/mockData';

// Define the schema
const signupSchema = z.object({
  ownerName: z.string().min(2, "Owner name must be at least 2 characters"),
  businessName: z.string().min(2, "Business name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 characters"),
  password: z.string()
    .min(8, "Password must be at least 8 characters")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      "Password must contain at least one uppercase letter, one lowercase letter, and one number"
    ),
  confirmPassword: z.string(),
  category: z.string().min(1, "Please select a business category"),
  address: z.string().min(5, "Please enter a complete address"),
  description: z.string().optional(),
  location: z.object({
    lat: z.number(),
    lng: z.number(),
  }),
  departments: z.array(z.string().min(1, "Department name is required")).min(1, "At least one department is required"),
  openingHours: z.object({
    monday: z.object({ start: z.string(), end: z.string(), closed: z.boolean() }),
    tuesday: z.object({ start: z.string(), end: z.string(), closed: z.boolean() }),
    wednesday: z.object({ start: z.string(), end: z.string(), closed: z.boolean() }),
    thursday: z.object({ start: z.string(), end: z.string(), closed: z.boolean() }),
    friday: z.object({ start: z.string(), end: z.string(), closed: z.boolean() }),
    saturday: z.object({ start: z.string(), end: z.string(), closed: z.boolean() }),
    sunday: z.object({ start: z.string(), end: z.string(), closed: z.boolean() }),
  }),
  images: z.array(z.string().url()).optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type SignupFormData = z.infer<typeof signupSchema>;

// Progress Bar Component
const ProgressBar = ({ currentStep, totalSteps }) => {
  const width = `${(currentStep / totalSteps) * 100}%`;

  return (
    <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700 mb-6">
      <div
        className="bg-gradient-to-r from-blue-600 to-purple-600 h-2.5 rounded-full"
        style={{ width }}
      ></div>
    </div>
  );
};

const SignupBusiness: React.FC = () => {
  // Only declare these once
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [images, setImages] = useState([]);
  const [isStepValid, setIsStepValid] = useState(false);
  const navigate = useNavigate();

  // Define which fields are required for each step
  const stepFields: Record<number, (keyof SignupFormData)[]> = {
    1: ["ownerName", "businessName", "email", "phone"],
    2: ["category", "address"],
    3: ["departments"],
    4: ["openingHours"], // Validate the whole openingHours object for step 4
    5: ["password", "confirmPassword"],
    6: [], // Images are optional
  };

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    trigger,
    formState: { errors },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: (() => {
      const saved = localStorage.getItem('businessSignupForm');
      if (saved) {
        const parsed = JSON.parse(saved);
        // Ensure nested defaults for missing fields
        return {
          ownerName: parsed.ownerName || "",
          businessName: parsed.businessName || "",
          email: parsed.email || "",
          phone: parsed.phone || "",
          password: "",
          confirmPassword: "",
          category: parsed.category || "",
          address: parsed.address || "",
          description: parsed.description || "",
          location: parsed.location || { lat: 0, lng: 0 },
          departments: parsed.departments || ["General Service"],
          openingHours: parsed.openingHours || {
            monday: { start: "09:00", end: "17:00", closed: false },
            tuesday: { start: "09:00", end: "17:00", closed: false },
            wednesday: { start: "09:00", end: "17:00", closed: false },
            thursday: { start: "09:00", end: "17:00", closed: false },
            friday: { start: "09:00", end: "17:00", closed: false },
            saturday: { start: "09:00", end: "17:00", closed: false },
            sunday: { start: "09:00", end: "17:00", closed: true },
          },
          images: [],
        };
      }
      // If no saved data, use hardcoded defaults
      return {
        ownerName: "",
        businessName: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: "",
        category: "",
        address: "",
        description: "",
        location: { lat: 0, lng: 0 },
        departments: ["General Service"],
        openingHours: {
          monday: { start: "09:00", end: "17:00", closed: false },
          tuesday: { start: "09:00", end: "17:00", closed: false },
          wednesday: { start: "09:00", end: "17:00", closed: false },
          thursday: { start: "09:00", end: "17:00", closed: false },
          friday: { start: "09:00", end: "17:00", closed: false },
          saturday: { start: "09:00", end: "17:00", closed: false },
          sunday: { start: "09:00", end: "17:00", closed: true },
        },
        images: [],
      };
    })(),
  });

  const watchedFields = watch(stepFields[currentStep] ?? []);

  const { fields, append, remove } = useFieldArray<SignupFormData, "departments">({
    control,
    name: "departments" as const,
  });

  const password = watch("password");

  // Save form data to localStorage on change
  const watchedData = watch();
  useEffect(() => {
    const dataToStore = { ...watchedData };
    delete dataToStore.password;
    delete dataToStore.confirmPassword;
    localStorage.setItem('businessSignupForm', JSON.stringify(dataToStore));
  }, [watchedData]);

  // Load form data from localStorage on mount
  useEffect(() => {
    const savedData = localStorage.getItem('businessSignupForm');
    if (savedData) {
      const parsedData = JSON.parse(savedData);
      for (const key in parsedData) {
        setValue(key as keyof SignupFormData, parsedData[key]);
      }
    }
  }, [setValue]);

  // Step validation effect
  useEffect(() => {
    const validateStep = async () => {
      if (stepFields[currentStep] && stepFields[currentStep].length > 0) {
        const valid = await trigger(stepFields[currentStep]);
        setIsStepValid(valid);
      } else {
        setIsStepValid(true); // For steps with no required fields
      }
    };
    validateStep();
    // Watch for changes in relevant fields
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentStep, ...stepFields[currentStep]?.map(f => watch(f))]);





  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    const previews = files.map(file => URL.createObjectURL(file));
    setImagePreviews(prev => [...prev, ...previews]);
    setImages(prev => [...prev, ...files]);
  };

  const removeImage = (index) => {
    const newPreviews = [...imagePreviews];
    const newImages = [...images];
    newPreviews.splice(index, 1);
    newImages.splice(index, 1);
    setImagePreviews(newPreviews);
    setImages(newImages);
  };

  // Improved geocoding function
  const tryGeocode = async (address: string): Promise<{lat: number, lng: number} | null> => {
    // Try full address first
    let response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`);
    let data = await response.json();
    if (data && data.length > 0) return { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) };

    // Try by parts, from most general to least
    const parts = address.split(',').map(s => s.trim()).reverse();
    for (const part of parts) {
      if (!part) continue;
      response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(part)}`);
      data = await response.json();
      if (data && data.length > 0) return { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) };
    }

    // Try last word as a keyword
    const words = address.split(' ').filter(Boolean);
    if (words.length > 0) {
      const keyword = words[words.length - 1];
      response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(keyword)}`);
      data = await response.json();
      if (data && data.length > 0) return { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) };
    }

    // If all fail
    return null;
  };

  const onSubmit = async (data: any) => {
    // Ensure latest coordinates for the address before submitting
    if (data.address && (!data.location.lat || !data.location.lng)) {
      try {
        const coords = await tryGeocode(data.address);
        if (coords) {
          data.location.lat = coords.lat;
          data.location.lng = coords.lng;
        }
      } catch {}
    }

    try {
      if (!data.location.lat || !data.location.lng) {
        alert("Location coordinates are required. Please enter a valid address.");
        return;
      }

      const formData = new FormData();

      // Append basic fields
      formData.append("ownerName", data.ownerName);
      formData.append("businessName", data.businessName);
      formData.append("email", data.email);
      formData.append("phone", data.phone);
      formData.append("password", data.password);
      formData.append("category", data.category);
      formData.append("address", data.address);
      formData.append("description", data.description || "");

      // Append JSON fields
      formData.append("departments", JSON.stringify(data.departments));
      formData.append("openingHours", JSON.stringify(data.openingHours));

      // Upload images and append image URLs
      const imageUrls = await uploadImages(images);
      formData.append("images", JSON.stringify(imageUrls));

      // Append location data
      formData.append("latitude", data.location.lat.toString());
      formData.append("longitude", data.location.lng.toString());

      console.log("Submitting form data:", {
        ownerName: data.ownerName,
        businessName: data.businessName,
        email: data.email,
        phone: data.phone,
        category: data.category,
        address: data.address,
        latitude: data.location.lat,
        longitude: data.location.lng,
        departments: data.departments,
        imageCount: imageUrls.length
      });

      // API request
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/businesses/register`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      // Success
      alert(response.data.message + " Please log in to continue.");
      localStorage.removeItem('businessSignupForm');
      navigate("/login");
    } catch (error: any) {
      console.error("Signup failed:", error);
      if (error.response) {
        console.error("Response data:", error.response.data);
        alert(`Signup failed: ${error.response.data.message}`);
      } else {
        alert("Signup failed: Server not responding");
      }
    }
};

  const uploadImages = async (images) => {
    const urls = [];
    for (const image of images) {
      const imageFormData = new FormData();
      imageFormData.append("image", image);

      // Replace with your actual image upload endpoint
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/upload`, imageFormData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      urls.push(response.data.url);
    }
    return urls;
  };

  const benefits = [
    {
      icon: <Users className="w-6 h-6 text-blue-500" />,
      title: "Reduce Wait Times",
      description: "Help customers book ahead and reduce crowding",
    },
    {
      icon: <BarChart3 className="w-6 h-6 text-green-500" />,
      title: "Analytics Dashboard",
      description: "Track queue metrics and optimize efficiency",
    },
    {
      icon: <DollarSign className="w-6 h-6 text-purple-500" />,
      title: "Increase Revenue",
      description: "Better customer experience leads to more business",
    },
    {
      icon: <Clock className="w-6 h-6 text-orange-500" />,
      title: "Save Time",
      description: "Automated queue management saves staff time",
    },
  ];

  const getPasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[^a-zA-Z\d]/.test(password)) strength++;
    return strength;
  };

  const passwordStrength = getPasswordStrength(password);

  const days: (keyof SignupFormData['openingHours'])[] = [
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
    "sunday",
  ];

  const nextStep = () => {
    setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    setCurrentStep(currentStep - 1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-5 gap-12">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-2 hidden lg:block"
          >
            <div className="sticky top-8 space-y-6">
              <div>
                <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                  Transform Your Business with Smart Queue Management
                </h1>
                <p className="text-xl text-gray-600 dark:text-gray-300">
                  Join hundreds of businesses that have revolutionized their
                  customer experience with Skiply.
                </p>
              </div>

              <div className="grid gap-6">
                {benefits.map((benefit, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 + index * 0.1, duration: 0.6 }}
                    className="flex items-start space-x-4"
                  >
                    <div className="flex-shrink-0">{benefit.icon}</div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                        {benefit.title}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300 text-sm">
                        {benefit.description}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="p-6 bg-gradient-to-r from-blue-500/10 to-purple-500/10 dark:from-blue-500/20 dark:to-purple-500/20 rounded-2xl border border-blue-200/50 dark:border-blue-700/50">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                  🚀 Launch Special
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Get started with Skiply for free during our launch period. No
                  setup fees, no monthly charges for the first 3 months!
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-3"
          >
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 dark:border-gray-700/20 p-8">
              <div className="text-center mb-8">
                <Link to="/" className="inline-flex items-center space-x-3 mb-6">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-lg">S</span>
                  </div>
                  <span className="text-xl font-bold text-gray-900 dark:text-white">
                    Skiply
                  </span>
                </Link>

                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  Register Your Business
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  Start managing queues efficiently with Skiply
                </p>
              </div>

              <ProgressBar currentStep={currentStep} totalSteps={6} />

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {currentStep === 1 && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      Basic Information
                    </h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label
                          htmlFor="ownerName"
                          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                        >
                          Owner Name
                        </label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                          <input
                            {...register("ownerName")}
                            type="text"
                            id="ownerName"
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors"
                            placeholder="Your full name"
                          />
                        </div>
                        {errors.ownerName && (
                          <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                            {errors.ownerName.message}
                          </p>
                        )}
                      </div>

                      <div>
                        <label
                          htmlFor="businessName"
                          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                        >
                          Business Name
                        </label>
                        <div className="relative">
                          <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                          <input
                            {...register("businessName")}
                            type="text"
                            id="businessName"
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors"
                            placeholder="Your business name"
                          />
                        </div>
                        {errors.businessName && (
                          <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                            {errors.businessName.message}
                          </p>
                        )}
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="email"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                      >
                        Business Email
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <input
                          {...register("email")}
                          type="email"
                          id="email"
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors"
                          placeholder="business@example.com"
                        />
                      </div>
                      {errors.email && (
                        <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                          {errors.email.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <label
                        htmlFor="phone"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                      >
                        Phone Number
                      </label>
                      <div className="relative">
                        <input
                          {...register("phone")}
                          type="tel"
                          id="phone"
                          className="w-full pl-3 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors"
                          placeholder="Phone number"
                        />
                      </div>
                      {errors.phone && (
                        <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                          {errors.phone.message}
                        </p>
                      )}
                    </div>
                    <Button type="button" onClick={nextStep} disabled={!isStepValid}>
                      Next
                    </Button>
                  </div>
                )}

                {currentStep === 2 && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      Business Details
                    </h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label
                          htmlFor="category"
                          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                        >
                          Business Category
                        </label>
                        <select
                          {...register("category")}
                          id="category"
                          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors"
                        >
                          <option value="">Select category</option>
                          {BUSINESS_CATEGORIES.map((category) => (
                            <option key={category.value} value={category.value}>
                              {category.label}
                            </option>
                          ))}
                        </select>
                        {errors.category && (
                          <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                            {errors.category.message}
                          </p>
                        )}
                      </div>

                      <div>
                        <label
                          htmlFor="address"
                          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                        >
                          Business Address
                        </label>
                        <div className="relative flex items-center">
                          <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                          <Input
                            {...register("address")}
                            id="address"
                            placeholder="Business Address"
                            className="pr-32"
                            autoComplete="off"
                            onBlur={async (e) => {
                              const address = e.target.value;
                              if (!address) return;
                              try {
                                const coords = await tryGeocode(address);
                                if (coords) {
                                  setValue("location.lat", coords.lat);
                                  setValue("location.lng", coords.lng);
                                } else {
                                  setValue("location.lat", 0);
                                  setValue("location.lng", 0);
                                }
                              } catch (e) {
                                setValue("location.lat", 0);
                                setValue("location.lng", 0);
                              }
                            }}
                          />
                          <Button
                            type="button"
                            className="absolute right-2 top-1/2 transform -translate-y-1/2 px-2 py-1 text-xs"
                            onClick={async () => {
                              if (!navigator.geolocation) {
                                alert("Geolocation is not supported by your browser");
                                return;
                              }
                              navigator.geolocation.getCurrentPosition(
                                async (position) => {
                                  const { latitude, longitude } = position.coords;
                                  setValue("location.lat", latitude);
                                  setValue("location.lng", longitude);
                                  try {
                                    const response = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json&addressdetails=1`);
                                    const data = await response.json();
                                    if (data && data.address) {
                                      const addr = data.address;
                                      let precise = '';
                                      if (addr.building) precise += addr.building + ', ';
                                      if (addr.house_number) precise += addr.house_number + ', ';
                                      if (addr.road) precise += addr.road + ', ';
                                      if (addr.neighbourhood) precise += addr.neighbourhood + ', ';
                                      if (addr.suburb) precise += addr.suburb + ', ';
                                      if (addr.city) precise += addr.city + ', ';
                                      if (addr.state) precise += addr.state + ', ';
                                      if (addr.country) precise += addr.country;
                                      precise = precise.replace(/, $/, '');
                                      setValue("address", precise || data.display_name);
                                    } else if (data && data.display_name) {
                                      setValue("address", data.display_name);
                                    } else {
                                      setValue("address", "Location found, but address unavailable");
                                    }
                                  } catch (e) {
                                    setValue("address", "Location found, but address fetch failed");
                                  }
                                },
                                (error) => {
                                  alert("Failed to fetch location. Please enable location services.");
                                }
                              );
                            }}
                          >
                            📍 Use My Location
                          </Button>
                        </div>
                        {errors.address && (
                          <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                            {errors.address.message}
                          </p>
                        )}
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="description"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                      >
                        Business Description (Optional)
                      </label>
                      <textarea
                        {...register("description")}
                        id="description"
                        rows={3}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors"
                        placeholder="Brief description of your business..."
                      />
                    </div>
                    <Button type="button" onClick={prevStep} className="mr-2">
                      Previous
                    </Button>
                    <Button type="button" onClick={nextStep} disabled={!isStepValid}>
                      Next
                    </Button>
                  </div>
                )}



                {currentStep === 3 && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      Departments/Services
                    </h3>

                    <div className="space-y-3">
                      {fields.map((field, index) => (
                        <div
                          key={field.id}
                          className="flex items-center space-x-3"
                        >
                          <input
                            {...register(`departments.${index}` as const)}
                            type="text"
                            className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors"
                            placeholder="Department name"
                          />
                          {fields.length > 1 && (
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              type="button"
                              onClick={() => remove(index)}
                              className="p-3 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </motion.button>
                          )}
                        </div>
                      ))}

                      {errors.departments && (
                        <p className="text-sm text-red-600 dark:text-red-400">
                          {errors.departments.message ||
                            errors.departments.root?.message}
                        </p>
                      )}

                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="button"
                        onClick={() => append("")}
                        className="flex items-center space-x-2 px-4 py-2 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-gray-600 dark:text-gray-400 hover:border-blue-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Add Department</span>
                      </motion.button>
                    </div>
                    <Button type="button" onClick={prevStep} className="mr-2">
                      Previous
                    </Button>
                    <Button type="button" onClick={nextStep} disabled={!isStepValid}>
                      Next
                    </Button>
                  </div>
                )}

                {currentStep === 4 && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      Operating Hours
                    </h3>

                    <div className="space-y-4">
                      {days.map((day) => (
                        <div
                          key={day}
                          className="flex items-center gap-x-2 sm:gap-x-4"
                        >
                          <span className="capitalize font-medium text-gray-700 dark:text-gray-300 w-10 shrink-0">
                            {day.substring(0, 3)}
                          </span>
                          <div className="flex items-center gap-2 flex-grow">
                            <input
                              {...register(`openingHours.${day}.start`)}
                              type="time"
                              className="w-full px-2 py-1 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors"
                            />
                            <span className="text-sm text-gray-500">to</span>
                            <input
                              {...register(`openingHours.${day}.end`)}
                              type="time"
                              className="w-full px-2 py-1 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors"
                            />
                          </div>
                          <div className="flex items-center gap-x-2 shrink-0">
                            <input
                              type="checkbox"
                              id={`${day}-closed`}
                              {...register(`openingHours.${day}.closed`)}
                              className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            <label htmlFor={`${day}-closed`} className="text-sm">Closed</label>
                          </div>
                        </div>
                      ))}
                    </div>
                    <Button type="button" onClick={prevStep} className="mr-2">
                      Previous
                    </Button>
                    <Button type="button" onClick={nextStep} disabled={!isStepValid}>
                      Next
                    </Button>
                  </div>
                )}

                {currentStep === 5 && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      Account Security
                    </h3>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label
                          htmlFor="password"
                          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                        >
                          Password
                        </label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                          <input
                            {...register("password")}
                            type={showPassword ? "text" : "password"}
                            id="password"
                            autoComplete="new-password"
                            className="w-full pl-10 pr-12 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors"
                            placeholder="Create a strong password"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                          >
                            {showPassword ? (
                              <EyeOff className="w-4 h-4" />
                            ) : (
                              <Eye className="w-4 h-4" />
                            )}
                          </button>
                        </div>

                        {password && (
                          <div className="mt-2">
                            <div className="flex space-x-1">
                              {[1, 2, 3, 4, 5].map((level) => (
                                <div
                                  key={level}
                                  className={`h-1 flex-1 rounded ${
                                    level <= passwordStrength
                                      ? passwordStrength < 3
                                        ? "bg-red-400"
                                        : passwordStrength < 4
                                        ? "bg-yellow-400"
                                        : "bg-green-400"
                                      : "bg-gray-200 dark:bg-gray-600"
                                  }`}
                                />
                              ))}
                            </div>
                          </div>
                        )}

                        {errors.password && (
                          <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                            {errors.password.message}
                          </p>
                        )}
                      </div>

                      <div>
                        <label
                          htmlFor="confirmPassword"
                          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                        >
                          Confirm Password
                        </label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                          <input
                            {...register("confirmPassword")}
                            type={showConfirmPassword ? "text" : "password"}
                            id="confirmPassword"
                            autoComplete="new-password"
                            className="w-full pl-10 pr-12 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors"
                            placeholder="Confirm your password"
                          />
                          <button
                            type="button"
                            onClick={() =>
                              setShowConfirmPassword(!showConfirmPassword)
                            }
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                          >
                            {showConfirmPassword ? (
                              <EyeOff className="w-4 h-4" />
                            ) : (
                              <Eye className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                        {errors.confirmPassword && (
                          <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                            {errors.confirmPassword.message}
                          </p>
                        )}
                      </div>
                    </div>
                    <Button type="button" onClick={prevStep} className="mr-2">
                      Previous
                    </Button>
                    <Button type="button" onClick={nextStep} disabled={!isStepValid}>
                      Next
                    </Button>
                  </div>
                )}

                {currentStep === 6 && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      Upload Business Images
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      Upload images of your business to showcase it to your customers.
                    </p>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Business Images
                      </label>
                      <input
                        type="file"
                        multiple
                        onChange={handleImageUpload}
                        className="block w-full text-sm text-gray-500
                          file:mr-4 file:py-2 file:px-4
                          file:rounded-md file:border-0
                          file:text-sm file:font-semibold
                          file:bg-blue-50 file:text-blue-700
                          hover:file:bg-blue-100"
                      />
                    </div>
                    <div className="flex space-x-2">
                      {imagePreviews.map((preview, index) => (
                        <div key={index} className="relative">
                          <img src={preview} alt={`Preview ${index}`} className="w-20 h-20 object-cover rounded" />
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center"
                          >
                            &times;
                          </button>
                        </div>
                      ))}
                    </div>
                    <Button type="button" onClick={prevStep} className="mr-2">
                      Previous
                    </Button>
                    <Button type="submit">
                      Submit
                    </Button>
                  </div>
                )}
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default SignupBusiness;
