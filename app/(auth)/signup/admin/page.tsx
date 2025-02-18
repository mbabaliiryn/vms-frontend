"use client";

import { useState } from "react";
import * as yup from "yup";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { ValidationError } from "yup";
import { authApi } from "@/app/api";
import axios from "axios";
import { RegisterAdminInput } from "@/types";
import { motion } from "framer-motion";
import { AiOutlineUser, AiOutlinePhone, AiOutlineLock } from "react-icons/ai";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

const signupSchema = yup.object().shape({
  firstName: yup.string().required("First name is required"),
  lastName: yup.string().required("Last name is required"),
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
      <linearGradient id="grad2" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" style={{ stopColor: "#f97316", stopOpacity: 0.8 }} />
        <stop
          offset="100%"
          style={{ stopColor: "#fb923c", stopOpacity: 0.9 }}
        />
      </linearGradient>
    </defs>
    <circle cx="250" cy="250" r="200" fill="url(#grad1)" />
    <circle cx="250" cy="250" r="150" fill="white" opacity="0.3" />
    {/* Abstract user icon */}
    <circle cx="250" cy="180" r="40" fill="url(#grad2)" />
    <path
      d="M175,280 Q250,360 325,280"
      stroke="#f97316"
      strokeWidth="12"
      fill="none"
    />
    {/* Decorative elements */}
    <circle cx="150" cy="150" r="20" fill="#fdba74" opacity="0.5" />
    <circle cx="350" cy="150" r="15" fill="#fdba74" opacity="0.5" />
    <circle cx="150" cy="350" r="25" fill="#fdba74" opacity="0.5" />
    <circle cx="350" cy="350" r="30" fill="#fdba74" opacity="0.5" />
  </svg>
);

const SignUpPage = () => {
  useAuth();
  const router = useRouter();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    password: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await signupSchema.validate(formData, { abortEarly: false });
      setErrors({});

      const formattedPhone = `+256${formData.phoneNumber}`;
      const userData: RegisterAdminInput = {
        ...formData,
        phoneNumber: formattedPhone,
      };

      await authApi.adminSignup(userData);

      toast.success("Sign-up successful!", {
        description: `Welcome, ${formData.firstName} ${formData.lastName}! Your account has been created. Please log in to continue.`,
      });

      router.replace("/login");
    } catch (err: unknown) {
      if (err instanceof ValidationError) {
        const newErrors: Record<string, string> = {};
        err.inner.forEach((error) => {
          if (error.path) {
            newErrors[error.path] = error.message;
          }
        });
        setErrors(newErrors);
        toast.error("Sign-up failed", {
          description: "Please fix the errors in the form.",
        });
      } else if (axios.isAxiosError(err)) {
        toast.error("Sign-up failed", {
          description:
            err.response?.data?.message ||
            "An error occurred while signing up.",
        });
      } else {
        toast.error("Sign-up failed", {
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
            Join us! Create your admin account to get started.
          </div>
        </div>

        {/* Right side - Signup Form */}
        <div className="w-full lg:w-1/2 p-8">
          <div className="max-w-md mx-auto">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-8 text-center"
            >
              <h1 className="text-4xl font-bold text-gray-900 mb-2">Sign Up</h1>
              <p className="text-gray-600">Create your admin account</p>
            </motion.div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    name: "firstName",
                    placeholder: "First Name",
                    icon: <AiOutlineUser className="text-orange-500" />,
                  },
                  {
                    name: "lastName",
                    placeholder: "Last Name",
                    icon: <AiOutlineUser className="text-orange-500" />,
                  },
                ].map(({ name, placeholder, icon }, index) => (
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
                          type="text"
                          placeholder={placeholder}
                          name={name}
                          value={formData[name as keyof typeof formData]}
                          onChange={handleChange}
                          className="flex-1 border-none focus:ring-0 focus:outline-none ml-3 text-lg bg-transparent placeholder:text-gray-400"
                          disabled={loading}
                        />
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
                ))}
              </div>

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
                  type: "password",
                },
              ].map(({ name, placeholder, icon, maxLength, type }, index) => (
                <motion.div
                  key={name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: (index + 2) * 0.1 }}
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
              ))}

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
                      Creating Account...
                    </span>
                  ) : (
                    "Create Account"
                  )}
                </Button>
              </motion.div>
            </form>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-center text-gray-600 mt-8"
            >
              Already have an account?{" "}
              <span
                onClick={() => router.push("/login")}
                className="text-orange-500 font-medium cursor-pointer hover:text-orange-600 transition-colors duration-300"
              >
                Log in
              </span>
            </motion.p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default SignUpPage;
