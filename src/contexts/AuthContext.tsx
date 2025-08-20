import React, { createContext, useContext, useState, useEffect } from "react";

type User = {
  id: string;
  name: string;
  email: string;
  role: "user" | "business" | "admin";
  phone?: string;
  location?: string;
  profileImage?: string;
  createdAt?: string;
};

type AuthContextType = {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (
    email: string,
    password: string,
    role: string
  ) => Promise<{ user: User; token: string }>;
  logout: () => void;
  updateProfile: (data: Partial<User> & { profileImageFile?: File }) => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (token && storedUser && storedUser !== "undefined") {
      try {
        const parsedUser: User = JSON.parse(storedUser);
        if (parsedUser && parsedUser.email && parsedUser.role) {
          setUser(parsedUser);
          setIsAuthenticated(true);
        } else {
          throw new Error("Malformed user data");
        }
      } catch (err) {
        console.error("⚠️ Error parsing stored user:", err);
        localStorage.removeItem("user");
        localStorage.removeItem("token");
      }
    }

    setIsLoading(false);
  }, []);

  const login = async (
    email: string,
    password: string,
    role: string
  ): Promise<{ user: User; token: string }> => {
    const endpoint =
      role === "business"
        ? `${import.meta.env.VITE_API_URL}/api/businesses/login`
        : `${import.meta.env.VITE_API_URL}/api/auth/login`;

    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, role }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Login failed");
    }

    if (!data.user || !data.token || !data.user.role) {
      console.error("⚠️ Invalid login response:", data);
      throw new Error("Invalid login response from server");
    }

    const userData: User = {
      id: data.user.id,
      name: data.user.name,
      email: data.user.email,
      role: data.user.role,
    };

    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(userData));

    setUser(userData);
    setIsAuthenticated(true);

    return { user: userData, token: data.token };
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setIsAuthenticated(false);
  };

  // Update user profile
  const updateProfile = async (data: Partial<User> & { profileImageFile?: File }) => {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("Not authenticated");

    let res;
    if (data.profileImageFile) {
      // Send as multipart/form-data
      const formData = new FormData();
      if (data.name) formData.append("name", data.name);
      if (data.phone) formData.append("phone", data.phone);
      if (data.location) formData.append("location", data.location);
      formData.append("profileImage", data.profileImageFile);
      res = await fetch(`${import.meta.env.VITE_API_URL}/api/users/profile`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });
    } else {
      // Send as JSON
      res = await fetch(`${import.meta.env.VITE_API_URL}/api/users/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Profile update failed");
      updatedUser = await res.json();
    }
    setUser(updatedUser);
    localStorage.setItem("user", JSON.stringify(updatedUser));
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, isLoading, login, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
