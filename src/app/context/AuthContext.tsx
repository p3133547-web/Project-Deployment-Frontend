import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { authApi, UserOut } from "@/lib/api";

export type Role = "student" | "staff" | "admin";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: Role;
  initials: string;
  department: string;
  designation: string;
  rollNo?: string;
  employeeId?: string;
  year?: number;
  section?: string;
  avatar?: string;
}

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  login: (email: string, password: string, role: Role) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

function toAuthUser(u: UserOut): AuthUser {
  const parts = u.name.trim().split(" ");
  const initials =
    parts.length >= 2
      ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
      : u.name.slice(0, 2).toUpperCase();
  return {
    id: u.id,
    name: u.name,
    email: u.email,
    role: u.role as Role,
    initials,
    department: u.department,
    designation: u.designation,
    rollNo: u.roll_no,
    employeeId: u.employee_id,
    year: u.year,
    section: u.section,
    avatar: u.avatar_url,
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  // ── Restore session on page load ─────────────────────────────────────────
  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      setLoading(false);
      return;
    }
    authApi
      .me()
      .then((res) => setUser(toAuthUser(res.data)))
      .catch(() => {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
      })
      .finally(() => setLoading(false));
  }, []);

  // ── Login ────────────────────────────────────────────────────────────────
  const login = async (
    email: string,
    password: string,
    role: Role
  ): Promise<boolean> => {
    try {
      console.log("Attempting login with:", { email, role });
      const tokenRes = await authApi.login(email, password, role);
      console.log("Login successful, got tokens");
      const { access_token, refresh_token } = tokenRes.data;
      localStorage.setItem("access_token", access_token);
      localStorage.setItem("refresh_token", refresh_token);

      const meRes = await authApi.me();
      console.log("Got user profile:", meRes.data);
      setUser(toAuthUser(meRes.data));
      return true;
    } catch (err: unknown) {
      console.error("Login failed:", err);
      return false;
    }
  };

  // ── Logout ───────────────────────────────────────────────────────────────
  const logout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
