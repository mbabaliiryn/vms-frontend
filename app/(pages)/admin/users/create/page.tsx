"use client";

import { useState, useEffect } from "react";
import * as yup from "yup";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { toast } from "sonner";
import { ValidationError } from "yup";
import { authApi, garageApi } from "@/app/api";
import axios from "axios";
import { Garage, RegisterInput, Role } from "@/types";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { FaChevronDown } from "react-icons/fa";

const addUserSchema = yup.object().shape({
  firstName: yup.string().required("First name is required"),
  lastName: yup.string().required("Last name is required"),
  phoneNumber: yup
    .string()
    .length(9, "Phone number must be exactly 9 digits")
    .matches(/^\d+$/, "Phone number must contain only digits")
    .required("Phone number is required"),
  role: yup
    .string()
    .oneOf(Object.values(Role), "Invalid role")
    .required("Role is required"),
  garageId: yup.string().required("Garage selection is required"),
});

interface ApiResponse {
  success: boolean;
  message: string;
  data: Garage[];
}

const AddUserPage = () => {
  const { user } = useAuth();
  const router = useRouter();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    role: "",
    garageId: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [garages, setGarages] = useState<Garage[]>([]);

  useEffect(() => {
    const fetchGarages = async () => {
      try {
        if (!user) return;
        const response = (await garageApi.getAdminGarages({
          adminId: user.id,
        })) as ApiResponse;
        setGarages(response.data);
      } catch (error) {
        console.error("Error fetching garages:", error);
        toast.error("Failed to load garages");
      }
    };
    fetchGarages();
  }, [user]);

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await addUserSchema.validate(formData, { abortEarly: false });
      setErrors({});

      const formattedPhone = `+256${formData.phoneNumber}`;
      const userData: RegisterInput = {
        ...formData,
        phoneNumber: formattedPhone,
        role: formData.role as Role,
      };

      await authApi.signup(userData);

      toast.success("User added successfully!");
      router.replace("/admin/users");
    } catch (err) {
      if (err instanceof ValidationError) {
        const newErrors: Record<string, string> = {};
        err.inner.forEach((error) => {
          if (error.path) newErrors[error.path] = error.message;
        });
        setErrors(newErrors);
      } else {
        toast.error("User creation failed", {
          description: axios.isAxiosError(err)
            ? err.response?.data?.message
            : "An unexpected error occurred.",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-6">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-3xl"
      >
        <Card className="shadow-lg rounded-xl bg-white p-6">
          <CardContent>
            <h2 className="text-2xl font-semibold text-center mb-6">
              Add New User
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                placeholder="First Name"
                name="firstName"
                value={formData.firstName}
                onChange={(e) => handleChange("firstName", e.target.value)}
              />
              {errors.firstName && (
                <p className="text-red-500 text-sm">{errors.firstName}</p>
              )}

              <Input
                placeholder="Last Name"
                name="lastName"
                value={formData.lastName}
                onChange={(e) => handleChange("lastName", e.target.value)}
              />
              {errors.lastName && (
                <p className="text-red-500 text-sm">{errors.lastName}</p>
              )}

              <Input
                placeholder="Phone Number"
                name="phoneNumber"
                maxLength={9}
                value={formData.phoneNumber}
                onInput={(e) => {
                  let value = e.currentTarget.value.replace(/\D/g, "");
                  if (value.length > 9) value = value.slice(0, 9);
                  e.currentTarget.value = value;
                }}
                onChange={(e) => handleChange("phoneNumber", e.target.value)}
              />
              {errors.phoneNumber && (
                <p className="text-red-500 text-sm">{errors.phoneNumber}</p>
              )}

              <Popover>
                <PopoverTrigger className="w-full flex items-center justify-between p-3 border rounded-md">
                  {formData.role || "Select Role"} <FaChevronDown />
                </PopoverTrigger>
                <PopoverContent className="w-full">
                  {Object.values(Role).map((role) => (
                    <p
                      key={role}
                      className="p-2 hover:bg-gray-200 cursor-pointer"
                      onClick={() => handleChange("role", role)}
                    >
                      {role}
                    </p>
                  ))}
                </PopoverContent>
              </Popover>
              {errors.role && (
                <p className="text-red-500 text-sm">{errors.role}</p>
              )}

              <Popover>
                <PopoverTrigger className="w-full flex items-center justify-between p-3 border rounded-md">
                  {garages.find((g) => g.id === formData.garageId)?.name ||
                    "Select Garage"}{" "}
                  <FaChevronDown />
                </PopoverTrigger>
                <PopoverContent className="w-full">
                  {garages.map((garage) => (
                    <p
                      key={garage.id}
                      className="p-2 hover:bg-gray-200 cursor-pointer"
                      onClick={() => handleChange("garageId", garage.id)}
                    >
                      {garage.name}
                    </p>
                  ))}
                </PopoverContent>
              </Popover>
              {errors.garageId && (
                <p className="text-red-500 text-sm">{errors.garageId}</p>
              )}

              <Button
                type="submit"
                className="w-full bg-orange-500 hover:bg-orange-600"
                disabled={loading}
              >
                {loading ? "Adding..." : "Add User"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default AddUserPage;
