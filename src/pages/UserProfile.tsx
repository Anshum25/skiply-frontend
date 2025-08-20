import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Clock,
  Star,
  Eye,
  Edit3,
  Save,
  X,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { mockBookings, mockBusinesses } from "../data/mockData";
import { QueueBooking } from "../types";

const UserProfile: React.FC = () => {
  const { user, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: user?.name || "",
    phone: user?.phone || "",
    location: user?.location || "",
  });
  const [profileImageFile, setProfileImageFile] = useState<File | null>(null);
  const [profileImagePreview, setProfileImagePreview] = useState<string | null>(null);

  const handleProfileImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfileImageFile(file);
      setProfileImagePreview(URL.createObjectURL(file));
    }
  }
  // Get user's bookings
  const userBookings = mockBookings.filter(
    (booking) => booking.userId === user?.id,
  );
  const activeBookings = userBookings.filter(
    (booking) =>
      booking.status === "waiting" ||
      booking.status === "confirmed" ||
      booking.status === "in-progress",
  );
  const pastBookings = userBookings.filter(
    (booking) =>
      booking.status === "completed" || booking.status === "cancelled",
  );

  const handleSaveProfile = async () => {
    try {
      await updateProfile(profileImageFile ? { ...editForm, profileImageFile } : editForm);
      setIsEditing(false);
      setProfileImageFile(null);
      setProfileImagePreview(null);
    } catch (error) {
      console.error("Failed to update profile:", error);
    }
  }

  const getStatusColor = (status: QueueBooking["status"]) => {
    switch (status) {
      case "waiting":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300";
      case "approved":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300";
      case "in-progress":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300";
      case "completed":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300";
      case "cancelled":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300";
    }
  };

  const BookingCard: React.FC<{
    booking: QueueBooking;
    showActions?: boolean;
  }> = ({ booking, showActions = false }) => {
    const business = mockBusinesses.find((b) => b.id === booking.businessId);
    const department = business?.departments.find(
      (d) => d.id === booking.departmentId,
    );

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl border border-white/20 dark:border-gray-700/20 p-4 hover:shadow-lg transition-all duration-200"
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center text-white font-bold">
              #{booking.tokenNumber}
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">
                {business?.name}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {department?.name}
              </p>
            </div>
          </div>
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(booking.status)}`}
          >
            {booking.status}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-3 text-sm">
          <div>
            <span className="text-gray-500">Booked:</span>
            <div className="font-medium">
              {new Date(booking.bookedAt).toLocaleDateString()}
            </div>
          </div>
          <div>
            <span className="text-gray-500">Time:</span>
            <div className="font-medium">
              {new Date(booking.bookedAt).toLocaleTimeString()}
            </div>
          </div>
          <div>
            <span className="text-gray-500">Wait:</span>
            <div className="font-medium">{booking.estimatedWaitTime} min</div>
          </div>
          <div>
            <span className="text-gray-500">Phone:</span>
            <div className="font-medium">{booking.customerPhone}</div>
          </div>
        </div>

        {booking.notes && (
          <div className="mb-3">
            <span className="text-gray-500 text-sm">Notes:</span>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              {booking.notes}
            </p>
          </div>
        )}

        {showActions && (
          <div className="flex space-x-2">
            <Link to={`/queue/${booking.id}`} className="flex-1">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm flex items-center justify-center space-x-1"
              >
                <Eye className="w-3 h-3" />
                <span>Track</span>
              </motion.button>
            </Link>
            <Link to={`/business/${booking.businessId}`} className="flex-1">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm"
              >
                View Business
              </motion.button>
            </Link>
          </div>
        )}

        {booking.status === "completed" && (
          <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-600">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Rate your experience:
              </span>
              <div className="flex space-x-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    className="text-yellow-400 hover:text-yellow-500"
                  >
                    <Star className="w-3 h-3 fill-current" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50/50 via-white to-purple-50/50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            My Profile
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage your account and view your booking history
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Profile Card */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="lg:col-span-1"
          >
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 dark:border-gray-700/20 p-6">
              {/* Avatar */}
              <div className="text-center mb-6">
                <div className="relative w-20 h-20 mx-auto mb-4">
                  {profileImagePreview ? (
                    <img
                      src={profileImagePreview}
                      alt="Profile Preview"
                      className="w-20 h-20 rounded-full object-cover border-4 border-blue-400 shadow"
                    />
                  ) : user?.profileImage ? (
                    <img
                      src={user.profileImage.startsWith('http') ? user.profileImage : `${import.meta.env.VITE_API_URL}${user.profileImage}`}
                      alt="Profile"
                      className="w-20 h-20 rounded-full object-cover border-4 border-blue-400 shadow"
                    />
                  ) : (
                    <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-2xl">
                        {user?.name?.split(' ').map((n) => n[0]).join('').toUpperCase()}
                      </span>
                    </div>
                  )}
                  <label htmlFor="profile-upload" className="absolute bottom-0 right-0 bg-blue-600 rounded-full p-1 cursor-pointer hover:bg-blue-700 transition-colors shadow-lg">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536M9 13l6-6m2 2v6a2 2 0 01-2 2H7a2 2 0 01-2-2V7a2 2 0 012-2h6"></path></svg>
                    <input
                      id="profile-upload"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleProfileImageChange}
                    />
                  </label>
                </div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {user?.name}
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  {user?.email}
                </p>
                <span className="inline-block px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded-full text-sm font-medium mt-2">
                  Customer
                </span>
              </div>

              {/* Profile Information */}
              {isEditing ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={editForm.name}
                      onChange={(e) =>
                        setEditForm({ ...editForm, name: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Phone
                    </label>
                    <input
                      type="tel"
                      value={editForm.phone}
                      onChange={(e) =>
                        setEditForm({ ...editForm, phone: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Location
                    </label>
                    <input
                      type="text"
                      value={editForm.location}
                      onChange={(e) =>
                        setEditForm({ ...editForm, location: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                  <div className="flex space-x-2">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleSaveProfile}
                      className="flex-1 flex items-center justify-center space-x-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <Save className="w-4 h-4" />
                      <span>Save</span>
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setIsEditing(false)}
                      className="flex-1 flex items-center justify-center space-x-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      <X className="w-4 h-4" />
                      <span>Cancel</span>
                    </motion.button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <User className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-700 dark:text-gray-300">
                      {user?.name}
                    </span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Mail className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-700 dark:text-gray-300">
                      {user?.email}
                    </span>
                  </div>
                  {user?.phone && (
                    <div className="flex items-center space-x-3">
                      <Phone className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-700 dark:text-gray-300">
                        {user.phone}
                      </span>
                    </div>
                  )}
                  {user?.location && (
                    <div className="flex items-center space-x-3">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-700 dark:text-gray-300">
                        {user.location}
                      </span>
                    </div>
                  )}
                  <div className="flex items-center space-x-3">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-700 dark:text-gray-300">
                      Member since{" "}
                      {user?.createdAt && !isNaN(new Date(user.createdAt).getTime())
                        ? new Date(user.createdAt).toLocaleDateString()
                        : "N/A"}
                    </span>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setIsEditing(true)}
                    className="w-full flex items-center justify-center space-x-2 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    <Edit3 className="w-4 h-4" />
                    <span>Edit Profile</span>
                  </motion.button>
                </div>
              )}
            </div>

            {/* Stats Card */}
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 dark:border-gray-700/20 p-6 mt-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Your Stats
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">
                    Total Bookings
                  </span>
                  <span className="font-semibold">{userBookings.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">
                    Active Bookings
                  </span>
                  <span className="font-semibold">{activeBookings.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">
                    Completed
                  </span>
                  <span className="font-semibold">
                    {
                      userBookings.filter((b) => b.status === "completed")
                        .length
                    }
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">
                    Average Rating
                  </span>
                  <div className="flex items-center space-x-1">
                    <Star className="w-3 h-3 text-yellow-400 fill-current" />
                    <span className="font-semibold">4.5</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Bookings Section */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="lg:col-span-2 space-y-8"
          >
            {/* Active Bookings */}
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
                <Clock className="w-6 h-6 mr-3 text-blue-600" />
                Active Bookings ({activeBookings.length})
              </h2>

              {activeBookings.length > 0 ? (
                <div className="space-y-4">
                  {activeBookings.map((booking) => (
                    <BookingCard
                      key={booking.id}
                      booking={booking}
                      showActions={true}
                    />
                  ))}
                </div>
              ) : (
                <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 dark:border-gray-700/20 p-12 text-center">
                  <div className="text-6xl mb-4">📋</div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    No Active Bookings
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-6">
                    You don't have any active bookings right now. Ready to skip
                    the wait?
                  </p>
                  <Link to="/user-home">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Find Services
                    </motion.button>
                  </Link>
                </div>
              )}
            </div>

            {/* Booking History */}
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
                <Calendar className="w-6 h-6 mr-3 text-gray-600" />
                Booking History ({pastBookings.length})
              </h2>

              {pastBookings.length > 0 ? (
                <div className="space-y-4">
                  {pastBookings.slice(0, 5).map((booking) => (
                    <BookingCard key={booking.id} booking={booking} />
                  ))}
                  {pastBookings.length > 5 && (
                    <div className="text-center">
                      <button className="text-blue-600 dark:text-blue-400 hover:underline">
                        View all {pastBookings.length} bookings
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 dark:border-gray-700/20 p-12 text-center">
                  <div className="text-6xl mb-4">📚</div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    No Booking History
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Your completed and cancelled bookings will appear here.
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
