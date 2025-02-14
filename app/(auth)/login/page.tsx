"use client";

import {useState} from "react";
import * as yup from "yup";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Card, CardContent} from "@/components/ui/card";
import {toast} from "sonner";
import {ValidationError} from "yup";
import {authApi} from "@/app/api";
import axios from "axios";
import {LoginInput, User} from "@/types";
import {motion} from "framer-motion";
import {
    AiOutlinePhone,
    AiOutlineLock,
    AiOutlineEye,
    AiOutlineEyeInvisible,
} from "react-icons/ai";
import Cookies from "js-cookie";
import {useRouter} from "next/navigation";

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

const LoginPage = () => {
    const router = useRouter();
    const [formData, setFormData] = useState({
        phoneNumber: "",
        password: "",
    });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState(false);
    const [passwordVisible, setPasswordVisible] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({...formData, [e.target.name]: e.target.value});
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await loginSchema.validate(formData, {abortEarly: false});
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

            router.push("/dashboard");
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

                if (err.response?.data?.message) {
                    console.error("API Error message:", err.response.data.message);
                }
                if (err.response?.data?.errors) {
                    console.error("API validation errors:", err.response.data.errors);
                }
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
        <div
            className="flex w-full justify-center items-center min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 p-4">
            <motion.div
                initial={{opacity: 0, scale: 0.9}}
                animate={{opacity: 1, scale: 1}}
                transition={{duration: 0.5, ease: "easeOut"}}
                className="w-full max-w-3xl"
            >
                <Card className="shadow-xl rounded-3xl bg-white/80 backdrop-blur-md">
                    <CardContent className="p-8">
                        <h2 className="text-3xl font-semibold text-gray-800 text-center mb-8">
                            Login to Your Account
                        </h2>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {[
                                {
                                    name: "phoneNumber",
                                    placeholder: "Phone Number e.g. (712345678)",
                                    icon: <AiOutlinePhone/>,
                                    maxLength: 9,
                                },
                                {
                                    name: "password",
                                    placeholder: "Password",
                                    icon: <AiOutlineLock/>,
                                    type: passwordVisible ? "text" : "password",
                                    toggleIcon: passwordVisible ? (
                                        <AiOutlineEyeInvisible/>
                                    ) : (
                                        <AiOutlineEye/>
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
                                        initial={{opacity: 0, x: -20}}
                                        animate={{opacity: 1, x: 0}}
                                        transition={{delay: (index + 2) * 0.1}}
                                    >
                                        <div
                                            className="flex items-center border border-gray-300 rounded-lg px-4 py-3 bg-white shadow-sm focus-within:border-orange-500 transition-all duration-300 hover:shadow-md">
                                            <span className="text-gray-500 text-lg">{icon}</span>
                                            <Input
                                                type={type || "text"}
                                                placeholder={placeholder}
                                                name={name}
                                                maxLength={maxLength}
                                                value={formData[name as keyof typeof formData]}
                                                onChange={handleChange}
                                                className="flex-1 border-none focus:ring-0 focus:outline-none ml-3 text-lg bg-transparent"
                                            />
                                            {toggleIcon && (
                                                <span
                                                    className="text-gray-500 cursor-pointer"
                                                    onClick={onTogglePassword}
                                                >
                          {toggleIcon}
                        </span>
                                            )}
                                        </div>
                                        {errors[name] && (
                                            <p className="text-red-500 text-sm mt-1">
                                                {errors[name]}
                                            </p>
                                        )}
                                    </motion.div>
                                )
                            )}

                            <motion.div
                                initial={{scale: 0.9}}
                                animate={{scale: 1}}
                                transition={{duration: 0.3}}
                                className="pt-4"
                            >
                                <Button
                                    type="submit"
                                    className="w-full bg-orange-500 hover:bg-orange-600 py-4 text-lg font-semibold rounded-lg shadow-md transition-all duration-300 transform hover:scale-105 text-white"
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <span className="flex justify-center items-center">
                      <svg
                          className="animate-spin h-8 w-8 mr-3 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                      >
                        <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            strokeWidth="4"
                        ></circle>
                        <path
                            className="opacity-75"
                            fill="none"
                            d="M4 12a8 8 0 0116 0"
                            strokeWidth="4"
                        ></path>
                      </svg>
                      Logging In...
                    </span>
                                    ) : (
                                        "Log In"
                                    )}
                                </Button>
                            </motion.div>
                        </form>
                        <p className="text-center text-gray-600 text-sm mt-6">
                            Don&apos;t have an account?{" "}
                            <span className="text-orange-500 cursor-pointer hover:underline"
                                  onClick={() => router.push("/register")}>
                Sign up
              </span>
                        </p>
                    </CardContent>
                </Card>
            </motion.div>
        </div>
    );
};

export default LoginPage;
