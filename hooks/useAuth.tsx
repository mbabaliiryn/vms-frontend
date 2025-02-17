import { useEffect, useState, useCallback } from "react";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { useRouter, usePathname } from "next/navigation";
import { User } from "@/types";
import { toast } from "sonner";

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const router = useRouter();
  const pathname = usePathname();

  const logout = useCallback(() => {
    toast.info("Session expired, logging out...");
    Cookies.remove("token");
    Cookies.remove("user");
    router.push("/");
  }, [router]);

  const checkTokenValidity = useCallback(() => {
    const token = Cookies.get("token");
    if (!token) return false;

    try {
      const decodedToken: { exp?: number } = jwtDecode(token);
      if (!decodedToken.exp) return false;
      return decodedToken.exp * 1000 > Date.now();
    } catch {
      return false;
    }
  }, []);

  useEffect(() => {
    const token = Cookies.get("token");
    const user = Cookies.get("user");
    const publicRoutes = ["/login", "/signup", "/signup/admin", "/"];

    if (token && user && checkTokenValidity()) {
      setUser(JSON.parse(user));
      setToken(token);

      if (publicRoutes.includes(pathname)) {
        toast.loading("Redirecting to dashboard, please wait...");
        router.push("/dashboard");
      }
    } else {
      if (!publicRoutes.includes(pathname)) {
        toast.warning("You are not authenticated. Redirecting to login...");
        router.push("/");
      }
    }

    const interval = setInterval(() => {
      if (!checkTokenValidity()) {
        logout();
      }
    }, 60000);

    return () => clearInterval(interval);
  }, [checkTokenValidity, logout, router, pathname]);

  return { user, token, logout };
};

export default useAuth;
