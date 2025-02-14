import {useEffect, useState, useCallback} from "react";
import Cookies from "js-cookie";
import {jwtDecode} from "jwt-decode";
import {useRouter} from "next/navigation";
import {User} from "@/types";

export const useAuth = () => {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const router = useRouter();

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

        if (token && user && checkTokenValidity()) {
            setUser(JSON.parse(user));
            setToken(token);
        } else {
            logout();
        }

        const interval = setInterval(() => {
            if (!checkTokenValidity()) {
                logout();
            }
        }, 60000);

        return () => clearInterval(interval);
    }, [checkTokenValidity, logout]);

    return {user, token, logout};
};

export default useAuth;
