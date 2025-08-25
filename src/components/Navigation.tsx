import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Badge } from "./ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import {
  Menu,
  X,
  User,
  Settings,
  LogOut,
  Home,
  Building2,
  Shield,
  Bell,
  Search,
  Calendar,
  MessageSquare,
  BarChart3,
  Heart,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { useNotifications } from "../contexts/NotificationContext";
import { ThemeToggle } from "./ThemeToggle";
import { NotificationDrawer } from "./Notifications/NotificationDrawer";
import { cn } from "../lib/utils";
import { motion } from "framer-motion";

export const Navigation: React.FC = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const { unreadCount } = useNotifications();
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const getNavigationItems = () => {
    if (!isAuthenticated) return [];

    switch (user?.role) {
      case "user":
        return [
          { href: "/user-home", label: "Browse", icon: Search },
          { href: "/queue-tracker", label: "My Queue", icon: Calendar },
          { href: "/user-profile", label: "Profile", icon: User },
        ];
      case "business":
        return [
          { href: "/business-dashboard", label: "Dashboard", icon: BarChart3 },
          { href: "/user-profile", label: "Profile", icon: User },
        ];
      case "admin":
        return [
          { href: "/admin-dashboard", label: "Admin Panel", icon: Shield },
          { href: "/user-profile", label: "Profile", icon: User },
        ];
      default:
        return [];
    }
  };

  const navigationItems = getNavigationItems();

  const isActive = (href: string) => {
    return location.pathname === href;
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="sticky top-0 z-50 w-full border-b glass backdrop-blur-xl"
    >
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <motion.div
            className="flex items-center"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link to="/" className="flex items-center space-x-3">
              <div
                className={cn(
                  "items-center space-x-2",
                  isAuthenticated ? "hidden md:flex" : "flex",
                )}
              >
                <span className="text-[24px] font-extrabold tracking-widest bg-gradient-to-r from-purple-400 via-pink-500 to-indigo-500 text-transparent bg-clip-text font-[cinzel]">
                  SKIPLY
                </span>
              </div>
              {isAuthenticated && (
                <div className="flex items-center space-x-2 md:hidden">
                  <span className="text-[24px] font-extrabold tracking-[0.15em] bg-gradient-to-r from-purple-400 via-pink-500 to-indigo-500 text-transparent bg-clip-text font-[cinzel]">
                    S
                  </span>
                </div>
              )}
            </Link>
          </motion.div>


          {/* Right Side Items */}
          <div className="flex items-center space-x-3">
            {/* Hide theme toggle on mobile; it will appear inside burger menu */}
            <div className="hidden md:block">
              <ThemeToggle />
            </div>

            <div className="hidden md:flex items-center space-x-3">
              {isAuthenticated && (
                <>
                  {/* Notifications */}
                  <NotificationDrawer>
                    <Button variant="ghost" size="sm" className="relative">
                      <Bell className="h-5 w-5" />
                      {unreadCount > 0 && (
                        <Badge className="notification-badge">
                          {unreadCount > 99 ? "99+" : unreadCount}
                        </Badge>
                      )}
                    </Button>
                  </NotificationDrawer>

                  {/* Messages (for business/admin) */}
                  {(user?.role === "business" || user?.role === "admin") && (
                    <Button variant="ghost" size="sm" className="relative">
                      <MessageSquare className="h-5 w-5" />
                      <Badge className="notification-badge">2</Badge>
                    </Button>
                  )}

                  {/* Bookmarks (for users) */}
                  {user?.role === "user" && (
                    <Button variant="ghost" size="sm">
                      <Heart className="h-5 w-5" />
                    </Button>
                  )}
                </>
              )}
            </div>

            {isAuthenticated ? (
              <div className="hidden md:block">
                <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-10 w-10 rounded-full border-2 border-transparent hover:border-primary/20 transition-all duration-200"
                  >
                    <Avatar className="h-9 w-9">
                      <AvatarImage src={user?.avatar} alt={user?.name} />
                      <AvatarFallback className="bg-gradient-primary text-white font-semibold">
                        {user?.name
                          ?.split(" ")
                          .map((n) => n[0])
                          .join("") || "U"}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className="w-64 glass border-0"
                  align="end"
                  forceMount
                >
                  <DropdownMenuLabel className="font-normal p-4">
                    <div className="flex flex-col space-y-2">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={user?.avatar} alt={user?.name} />
                          <AvatarFallback className="bg-gradient-primary text-white">
                            {user?.name
                              ?.split(" ")
                              .map((n) => n[0])
                              .join("") || "U"}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium leading-none">
                            {user?.name}
                          </p>
                          <p className="text-xs leading-none text-muted-foreground mt-1">
                            {user?.email}
                          </p>
                        </div>
                      </div>
                      <Badge variant="outline" className="w-fit text-xs">
                        {user?.role === "user"
                          ? "Customer"
                          : user?.role === "business"
                            ? "Business Owner"
                            : "Administrator"}
                      </Badge>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {navigationItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <DropdownMenuItem key={item.href} asChild>
                        <Link
                          to={item.href}
                          className="flex items-center gap-3 p-3 hover:bg-gradient-primary/5"
                        >
                          <Icon className="h-4 w-4" />
                          {item.label}
                        </Link>
                      </DropdownMenuItem>
                    );
                  })}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link
                      to="/user-profile"
                      className="flex items-center gap-3 p-3 hover:bg-gradient-primary/5"
                    >
                      <Settings className="h-4 w-4" />
                      Settings
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="flex items-center gap-3 p-3 hover:bg-destructive/5 text-destructive"
                  >
                    <LogOut className="h-4 w-4" />
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              </div>
            ) : (
              // Hide auth buttons on mobile; they will appear inside burger menu
              <div className="hidden md:flex items-center space-x-2">
                <Button
                  variant="ghost"
                  asChild
                  className="hover:scale-105 transition-transform"
                >
                  <Link to="/login">Login</Link>
                </Button>
                <Button
                  asChild
                  className="btn-gradient hover:scale-105 transition-transform"
                >
                  <Link to="/signup-user">Sign Up</Link>
                </Button>
              </div>
            )}

            {/* Home Icon for Mobile */}
            <Link to="/" className="md:hidden">
              <Button variant="ghost">
                <Home className="h-6 w-6" />
              </Button>
            </Link>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              className="md:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-border/50 py-4"
          >
            <div className="flex flex-col space-y-2">
              {navigationItems.map((item, index) => {
                const Icon = item.icon;
                return (
                  <motion.div
                    key={item.href}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Button
                      variant={isActive(item.href) ? "default" : "ghost"}
                      className={cn(
                        "justify-start gap-3 w-full h-12",
                        isActive(item.href) && "bg-gradient-primary text-white",
                      )}
                      asChild
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <Link to={item.href}>
                        <Icon className="h-5 w-5" />
                        {item.label}
                      </Link>
                    </Button>
                  </motion.div>
                );
              })}

              {/* Extra actions for mobile */}

              {/* Auth actions when logged out (mobile only) */}
              {!isAuthenticated && (
                <>
                  <div className="border-t border-border/50 my-2" />
                  <div className="flex flex-col gap-2 px-1 mt-1">
                    <Button
                      variant="ghost"
                      className="justify-start gap-3 w-full h-12"
                      asChild
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <Link to="/login">Login</Link>
                    </Button>
                    <Button
                      className="btn-gradient justify-center gap-3 w-full h-12"
                      asChild
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <Link to="/signup-user">Sign Up</Link>
                    </Button>
                  </div>
                </>
              )}

              {isAuthenticated && (
                <>
                  <div className="border-t border-border/50 my-2" />
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: navigationItems.length * 0.1 }}
                  >
                    <NotificationDrawer>
                      <Button
                        variant="ghost"
                        className="justify-start gap-3 w-full h-12"
                      >
                        <Bell className="h-5 w-5" />
                        Notifications
                        {unreadCount > 0 && (
                          <Badge variant="secondary" className="ml-auto">
                            {unreadCount}
                          </Badge>
                        )}
                      </Button>
                    </NotificationDrawer>
                  </motion.div>
                  {user?.role === "user" && (
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: (navigationItems.length + 1) * 0.1 }}
                    >
                      <Button
                        variant="ghost"
                        className="justify-start gap-3 w-full h-12"
                        asChild
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <Link to="/favorites">
                          <Heart className="h-5 w-5" />
                          Favorites
                        </Link>
                      </Button>
                    </motion.div>
                  )}
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: (navigationItems.length + 1) * 0.1 }}
                  >
                    <Button
                      variant="ghost"
                      className="justify-start gap-3 w-full h-12"
                      asChild
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <Link to="/user-profile">
                        <Settings className="h-5 w-5" />
                        Settings
                      </Link>
                    </Button>
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: (navigationItems.length + 2) * 0.1 }}
                  >
                    <Button
                      variant="ghost"
                      className="justify-start gap-3 w-full h-12 text-destructive hover:text-destructive"
                      onClick={() => {
                        handleLogout();
                        setIsMobileMenuOpen(false);
                      }}
                    >
                      <LogOut className="h-5 w-5" />
                      Log out
                    </Button>
                  </motion.div>
                </>
              )}

              {/* Dark mode toggle row */}
              <div className="border-t border-border/50 my-2" />
              <div className="flex items-center justify-between px-2 py-1">
                <span className="text-sm text-foreground/80">Dark Mode</span>
                <ThemeToggle />
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </motion.nav>
  );
};
