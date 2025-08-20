import React, { createContext, useContext, useState, useEffect } from "react";

type User = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  location?: string;
  profileImage?: string;
  role: "user" | "business" | "admin";
  createdAt?: string;
  updatedAt?: string;
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
  updateProfile: (data: Partial<User>) => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      // Always fetch the latest profile from backend
      fetch(`${import.meta.env.VITE_API_URL}/api/users/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then(async (res) => {
          if (!res.ok) throw new Error("Failed to fetch profile");
          return res.json();
        })
        .then((profile: User) => {
          setUser(profile);
          setIsAuthenticated(true);
          localStorage.setItem("user", JSON.stringify(profile));
        })
        .catch((err) => {
          console.error("⚠️ Error fetching user profile:", err);
          setUser(null);
          setIsAuthenticated(false);
          localStorage.removeItem("user");
          localStorage.removeItem("token");
        })
        .finally(() => setIsLoading(false));
    } else {
      setUser(null);
      setIsAuthenticated(false);
      setIsLoading(false);
    }
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

    localStorage.setItem("token", data.token);
    // Immediately fetch the full profile after login
    const profileRes = await fetch(`${import.meta.env.VITE_API_URL}/api/users/profile`, {
      headers: { Authorization: `Bearer ${data.token}` },
    });
    const profile: User = await profileRes.json();
    localStorage.setItem("user", JSON.stringify(profile));
    setUser(profile);
    setIsAuthenticated(true);
    return { user: profile, token: data.token };
  }

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setIsAuthenticated(false);
  };

  // Update user profile
  const updateProfile = async (data: Partial<User>) => {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("Not authenticated");
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/users/profile`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
    const result = await res.json();
    if (!res.ok) {
      throw new Error(result.message || "Failed to update profile");
    }
    // Update local user state
    const updatedUser = { ...user, ...data, ...result };
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
