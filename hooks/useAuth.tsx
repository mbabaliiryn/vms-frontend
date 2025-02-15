import {useEffect, useState, useCallback} from "react";
import Cookies from "js-cookie";
import {jwtDecode} from "jwt-decode";
import {useRouter, usePathname} from "next/navigation";
import {User} from "@/types";

export const useAuth = () => {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const router = useRouter();
    const pathname = usePathname();

    const logout = useCallback(() => {
        Cookies.remove("token");
        Cookies.remove("user");
        router.push("/login");
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

            // Redirect if authenticated and on a public route
            if (publicRoutes.includes(pathname)) {
                router.push("/dashboard");
            }
        } else {
            return;
        }

        const interval = setInterval(() => {
            if (!checkTokenValidity()) {
                logout();
            }
        }, 60000);

        return () => clearInterval(interval);
    }, [checkTokenValidity, logout, router, pathname]);

    return {user, token, logout};
};

export default useAuth;
