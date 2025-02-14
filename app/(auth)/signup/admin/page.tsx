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
import {RegisterInput} from "@/types";
import {motion} from "framer-motion";
import {AiOutlineUser, AiOutlinePhone, AiOutlineLock} from "react-icons/ai";
import {useRouter} from "next/navigation"

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

const SignUpPage = () => {
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
        setFormData({...formData, [e.target.name]: e.target.value});
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await signupSchema.validate(formData, {abortEarly: false});
            setErrors({});

            const formattedPhone = `+256${formData.phoneNumber}`;
            const userData: RegisterInput = {
                ...formData,
                phoneNumber: formattedPhone,
            };

            await authApi.adminSignup(userData);

            toast.success("Sign-up successful!", {
                description: `Welcome, ${formData.firstName} ${formData.lastName}! Your account has been created. Please log in to continue.`,
            });

            router.push("/login");
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

                if (err.response?.data?.message) {
                    console.error("API Error message:", err.response.data.message);
                }
                if (err.response?.data?.errors) {
                    console.error("API validation errors:", err.response.data.errors);
                }
            } else {
                toast.error("Sign-up failed", {
                    description: "An unexpected error occurred.",
                });
            }
        } finally {
            setLoading(false);

            setFormData({
                firstName: "",
                lastName: "",
                phoneNumber: "",
                password: "",
            });
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
                            Register as Admin
                        </h2>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {[
                                    {
                                        name: "firstName",
                                        placeholder: "First Name",
                                        icon: <AiOutlineUser/>,
                                    },
                                    {
                                        name: "lastName",
                                        placeholder: "Last Name",
                                        icon: <AiOutlineUser/>,
                                    },
                                ].map(({name, placeholder, icon}, index) => (
                                    <motion.div
                                        key={name}
                                        initial={{opacity: 0, x: -20}}
                                        animate={{opacity: 1, x: 0}}
                                        transition={{delay: index * 0.1}}
                                    >
                                        <div
                                            className="flex items-center border border-gray-300 rounded-lg px-4 py-3 bg-white shadow-sm focus-within:border-orange-500 transition-all duration-300 hover:shadow-md">
                                            <span className="text-gray-500 text-lg">{icon}</span>
                                            <Input
                                                type="text"
                                                placeholder={placeholder}
                                                name={name}
                                                value={formData[name as keyof typeof formData]}
                                                onChange={handleChange}
                                                className="flex-1 border-none focus:ring-0 focus:outline-none ml-3 text-lg bg-transparent"
                                                disabled={loading}
                                            />
                                        </div>
                                        {errors[name] && (
                                            <p className="text-red-500 text-sm mt-1">
                                                {errors[name]}
                                            </p>
                                        )}
                                    </motion.div>
                                ))}
                            </div>

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
                                    type: "password",
                                },
                            ].map(({name, placeholder, icon, maxLength, type}, index) => (
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
                                    </div>
                                    {errors[name] && (
                                        <p className="text-red-500 text-sm mt-1">{errors[name]}</p>
                                    )}
                                </motion.div>
                            ))}

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
                          className="animate-spin h-5 w-5 mr-3 text-white"
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
                      Signing Up...
                    </span>
                                    ) : (
                                        "Sign Up"
                                    )}
                                </Button>
                            </motion.div>
                        </form>
                        <p className="text-center text-gray-600 text-sm mt-6">
                            Already have an account?{" "}
                            <span className="text-orange-500 cursor-pointer hover:underline"
                                  onClick={() => router.push("/login")}>
                Log in
              </span>
                        </p>
                    </CardContent>
                </Card>
            </motion.div>
        </div>
    );
};

export default SignUpPage;
