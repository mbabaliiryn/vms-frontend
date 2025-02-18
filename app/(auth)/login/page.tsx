"use client";

import { useState } from "react";
import * as yup from "yup";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { ValidationError } from "yup";
import { authApi } from "@/app/api";
import axios from "axios";
import { LoginInput, User } from "@/types";
import { motion } from "framer-motion";
import {
  AiOutlinePhone,
  AiOutlineLock,
  AiOutlineEye,
  AiOutlineEyeInvisible,
} from "react-icons/ai";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

const loginSchema = yup.object().shape({
  phoneNumber: yup
    .string()
    .matches(/^\d{9}$/, "Phone number must have 9 digits")
    .required("Phone number is required"),
  password: yup
    .string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});

const IllustrationSVG = () => (
  <svg viewBox="0 0 500 500" className="w-full h-full">
    <defs>
      <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style={{ stopColor: "#f97316", stopOpacity: 0.2 }} />
        <stop
          offset="100%"
          style={{ stopColor: "#fb923c", stopOpacity: 0.6 }}
        />
      </linearGradient>
    </defs>
    <circle cx="250" cy="250" r="200" fill="url(#grad1)" />
    <path
      d="M150,250 Q250,150 350,250 T550,250"
      stroke="#f97316"
      strokeWidth="4"
      fill="none"
    />
    <circle cx="250" cy="220" r="100" fill="#fdba74" opacity="0.3" />
    <rect
      x="200"
      y="180"
      width="100"
      height="140"
      rx="10"
      fill="#f97316"
      opacity="0.8"
    />
    <circle cx="250" cy="160" r="20" fill="#f97316" />
    <rect x="220" y="230" width="60" height="10" rx="5" fill="white" />
    <rect x="220" y="250" width="60" height="10" rx="5" fill="white" />
    <rect x="220" y="270" width="60" height="10" rx="5" fill="white" />
  </svg>
);

const LoginPage = () => {
  useAuth();
  const router = useRouter();
  const [formData, setFormData] = useState({
    phoneNumber: "",
    password: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await loginSchema.validate(formData, { abortEarly: false });
      setErrors({});

      const formattedPhone = `+256${formData.phoneNumber}`;
      const userData: LoginInput = {
        ...formData,
        phoneNumber: formattedPhone,
      };

      await authApi.login(userData);

      const user: User | undefined = Cookies.get("user")
        ? JSON.parse(Cookies.get("user") as string)
        : undefined;

      toast.success("Login successful!", {
        description: `Welcome back! ${user?.firstName || ""}`,
      });

      router.replace("/dashboard");
    } catch (err: unknown) {
      if (err instanceof ValidationError) {
        const newErrors: Record<string, string> = {};
        err.inner.forEach((error) => {
          if (error.path) {
            newErrors[error.path] = error.message;
          }
        });
        setErrors(newErrors);
        toast.error("Login failed", {
          description: "Please fix the errors in the form.",
        });
      } else if (axios.isAxiosError(err)) {
        toast.error("Login failed", {
          description:
            err.response?.data?.message ||
            "An error occurred while logging in.",
        });
      } else {
        toast.error("Login failed", {
          description: "An unexpected error occurred.",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(249,115,22,0.1)_1px,transparent_0)] [background-size:40px_40px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-6xl flex rounded-3xl bg-white/95 shadow-2xl overflow-hidden"
      >
        {/* Left side - Illustration */}
        <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-orange-100 to-orange-50 p-12 items-center justify-center relative">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="w-full max-w-md"
          >
            <IllustrationSVG />
          </motion.div>
          <div className="absolute bottom-8 left-8 right-8 text-center text-orange-800 font-medium">
            Welcome back! Sign in to access your account.
          </div>
        </div>

        {/* Right side - Login Form */}
        <div className="w-full lg:w-1/2 p-8">
          <div className="max-w-md mx-auto">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-8 text-center"
            >
              <h1 className="text-4xl font-bold text-gray-900 mb-2">Login</h1>
              <p className="text-gray-600">Please sign in to continue</p>
            </motion.div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {[
                {
                  name: "phoneNumber",
                  placeholder: "Phone Number",
                  icon: <AiOutlinePhone className="text-orange-500" />,
                  maxLength: 9,
                },
                {
                  name: "password",
                  placeholder: "Password",
                  icon: <AiOutlineLock className="text-orange-500" />,
                  type: passwordVisible ? "text" : "password",
                  toggleIcon: passwordVisible ? (
                    <AiOutlineEyeInvisible className="text-orange-500" />
                  ) : (
                    <AiOutlineEye className="text-orange-500" />
                  ),
                  onTogglePassword: () => setPasswordVisible(!passwordVisible),
                },
              ].map(
                (
                  {
                    name,
                    placeholder,
                    icon,
                    maxLength,
                    type,
                    toggleIcon,
                    onTogglePassword,
                  },
                  index
                ) => (
                  <motion.div
                    key={name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div className="group">
                      <div className="flex items-center border-2 border-gray-200 rounded-xl px-4 py-3 bg-white shadow-sm transition-all duration-300 hover:border-orange-300 focus-within:border-orange-500 focus-within:ring-2 focus-within:ring-orange-200">
                        <span className="text-xl transition-colors duration-300 group-hover:text-orange-500">
                          {icon}
                        </span>
                        <Input
                          type={type || "text"}
                          placeholder={placeholder}
                          name={name}
                          maxLength={maxLength}
                          value={formData[name as keyof typeof formData]}
                          onChange={handleChange}
                          className="flex-1 border-none focus:ring-0 focus:outline-none ml-3 text-lg bg-transparent placeholder:text-gray-400"
                        />
                        {toggleIcon && (
                          <span
                            className="text-xl cursor-pointer transition-colors duration-300 hover:text-orange-600"
                            onClick={onTogglePassword}
                          >
                            {toggleIcon}
                          </span>
                        )}
                      </div>
                      {errors[name] && (
                        <motion.p
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="text-red-500 text-sm mt-2 ml-2"
                        >
                          {errors[name]}
                        </motion.p>
                      )}
                    </div>
                  </motion.div>
                )
              )}

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="pt-6"
              >
                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 py-6 text-lg font-semibold rounded-xl shadow-lg transition-all duration-300 transform hover:scale-[1.02] hover:shadow-orange-200 text-white disabled:opacity-70"
                  disabled={loading}
                >
                  {loading ? (
                    <span className="flex justify-center items-center">
                      <svg
                        className="animate-spin h-6 w-6 mr-3"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                          fill="none"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      Logging In...
                    </span>
                  ) : (
                    "Sign In"
                  )}
                </Button>
              </motion.div>
            </form>

            {/* <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-center text-gray-600 mt-8"
            >
              Don&apos;t have an account?{" "}
              <span
                onClick={() => router.push("/signup")}
                className="text-orange-500 font-medium cursor-pointer hover:text-orange-600 transition-colors duration-300"
              >
                Sign up
              </span>
            </motion.p> */}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;
