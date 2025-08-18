import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Toaster } from "sonner";

// Context Providers
import { AuthProvider } from "./contexts/AuthContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import { NotificationProvider } from "./contexts/NotificationContext";
import { AppProvider } from "./contexts/AppContext";

// Components
import { Navigation } from "./components/Navigation";
import { ProtectedRoute } from "./components/ProtectedRoute";
import ChatbotTrigger from "./components/Chatbot/ChatbotTrigger";

// Pages
const Landing = React.lazy(() => import("./pages/Landing"));
const Login = React.lazy(() => import("./pages/Login"));
const SignupUser = React.lazy(() => import("./pages/SignupUser"));
const SignupBusiness = React.lazy(() => import("./pages/SignupBusiness"));
const UserHome = React.lazy(() => import("./pages/UserHome"));
const BusinessDetail = React.lazy(() => import("./pages/BusinessDetail"));
const QueueTracker = React.lazy(() => import("./pages/QueueTracker"));
const UserProfile = React.lazy(() => import("./pages/UserProfile"));
const BusinessDashboard = React.lazy(() => import("./pages/BusinessDashboard"));
const AdminDashboard = React.lazy(() => import("./pages/AdminDashboard"));
const NotFound = React.lazy(() => import("./pages/NotFound"));
const Help = React.lazy(() => import("./pages/Help"));

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppProvider>
          <NotificationProvider>
            <Router>
              <div className="min-h-screen bg-background text-foreground">
                <Navigation />

                <React.Suspense
                  fallback={
                    <div className="min-h-screen flex items-center justify-center">
                      <div className="flex flex-col items-center space-y-4">
                        <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
                        <p className="text-muted-foreground animate-pulse">
                          Loading...
                        </p>
                      </div>
                    </div>
                  }
                >
                  <Routes>
                    {/* Public Routes */}
                    <Route path="/" element={<Landing />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup-user" element={<SignupUser />} />
                    <Route path="/signup-business" element={<SignupBusiness />} />
                    <Route path="/help" element={<Help />} />

                    {/* Legacy route redirects */}
                    <Route path="/home" element={<Navigate to="/user-home" replace />} />
                    <Route path="/dashboard" element={<Navigate to="/business-dashboard" replace />} />
                    <Route path="/admin" element={<Navigate to="/admin-dashboard" replace />} />

                    {/* Protected User Routes */}
                    <Route
                      path="/user-home"
                      element={
                        <ProtectedRoute allowedRoles={["user"]}>
                          <UserHome />
                        </ProtectedRoute>
                      }
                    />

                    <Route
                      path="/business/:id"
                      element={
                        <ProtectedRoute allowedRoles={["user"]}>
                          <BusinessDetail />
                        </ProtectedRoute>
                      }
                    />

                    {/* Add this route for queue-tracker/:id before /queue-tracker */}
                    <Route
                      path="/queue-tracker/:id"
                      element={
                        <ProtectedRoute allowedRoles={["user"]}>
                          <QueueTracker />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/queue-tracker"
                      element={
                        <ProtectedRoute allowedRoles={["user"]}>
                          <QueueTracker />
                        </ProtectedRoute>
                      }
                    />

                    <Route
                      path="/user-profile"
                      element={
                        <ProtectedRoute allowedRoles={["user", "business", "admin"]}>
                          <UserProfile />
                        </ProtectedRoute>
                      }
                    />

                    {/* Protected Business Routes */}
                    <Route
                      path="/business-dashboard"
                      element={
                        <ProtectedRoute allowedRoles={["business"]}>
                          <BusinessDashboard />
                        </ProtectedRoute>
                      }
                    />

                    {/* Protected Admin Routes */}
                    <Route
                      path="/admin-dashboard"
                      element={
                        <ProtectedRoute allowedRoles={["admin"]}>
                          <AdminDashboard />
                        </ProtectedRoute>
                      }
                    />

                    {/* 404 Route */}
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </React.Suspense>

                {/* Enhanced Toast Notifications */}
                <Toaster
                  position="top-right"
                  expand={true}
                  richColors
                  closeButton
                  toastOptions={{
                    duration: 4000,
                    className: "glass border-0",
                    style: {
                      background: "var(--background)",
                      color: "var(--foreground)",
                      border: "1px solid var(--border)",
                    },
                  }}
                />

                {/* AI Chatbot */}
                <ChatbotTrigger autoShow={true} autoShowDelay={8000} />
              </div>
            </Router>
          </NotificationProvider>
        </AppProvider>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
