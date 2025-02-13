"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import * as Yup from "yup";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { useFormik } from "formik";
import { User, Branch, CreateBranchInput } from "@/types";
import { authApi, branchApi } from "@/app/api";
import Spinner from "@/components/Spinner/Spinner";
import axios from "axios";

interface ApiResponse {
  success: boolean;
  message: string;
  data: User[] | Branch[];
}

const openingHoursSchema = Yup.object().shape({
  weekdays: Yup.object().shape({
    open: Yup.string().required("Open time is required"),
    close: Yup.string().required("Close time is required"),
  }),
  weekends: Yup.object().shape({
    open: Yup.string().required("Open time is required"),
    close: Yup.string().required("Close time is required"),
  }),
});

const CreateBranchPage = () => {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState<boolean>(false);

  const initialValues = {
    name: "",
    location: "",
    contactNumber: "",
    branchEmail: "",
    isActive: true,
    managerId: "",
    servicesOffered: "",
    openingHours: {
      weekdays: { open: "", close: "" },
      weekends: { open: "", close: "" },
    },
  };

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const response = (await authApi.getUsers()) as ApiResponse;
        if (response.success) {
          setUsers(response.data as User[]);
        } else {
          toast.error("Failed to load users", {
            description:
              response.message || "An error occurred while fetching users.",
          });
        }
      } catch (err: unknown) {
        if (axios.isAxiosError(err)) {
          toast.error("Failed to load users", {
            description:
              err.response?.data?.message ||
              "An error occurred while fetching users.",
          });

          if (err.response?.data?.message) {
            console.error("API Error message:", err.response.data.message);
          }
          if (err.response?.data?.errors) {
            console.error("API validation errors:", err.response.data.errors);
          }
        } else {
          toast.error("Error loading users", {
            description: "An unexpected error occurred.",
          });
        }
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const validationSchema = Yup.object({
    name: Yup.string().min(3).max(100).required("Branch name is required"),
    location: Yup.string().min(3).max(255).required("Location is required"),
    servicesOffered: Yup.string().required(
      "At least one service must be offered"
    ),
    contactNumber: Yup.string()
      .matches(/^\+256\d{9}$/, "Contact number must be in +256XXXXXXXXX format")
      .required("Contact number is required"),
    branchEmail: Yup.string().email("Invalid email").optional(),
    isActive: Yup.boolean(),
    openingHours: openingHoursSchema,
    managerId: Yup.string().optional(),
  });

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: async (values) => {
      setSubmitting(true);
      try {
        const branchData: CreateBranchInput = {
          name: values.name,
          location: values.location,
          contactNumber: values.contactNumber,
          servicesOffered: values.servicesOffered
            .split(",")
            .map((service) => service.trim()),
          branchEmail: values.branchEmail || undefined,
          isActive: values.isActive,
          openingHours: values.openingHours,
          managerId: values.managerId || undefined,
        };

        const response = (await branchApi.createBranch(
          branchData
        )) as ApiResponse;

        if (response.success) {
          toast.success("Branch created successfully!");
          router.push("/admin/branches");
        } else {
          toast.error("Failed to create branch", {
            description: response.message || "Please try again.",
          });
        }
      } catch (err: unknown) {
        if (err instanceof Yup.ValidationError) {
          const newErrors: Record<string, string> = {};
          err.inner.forEach((error) => {
            if (error.path) {
              newErrors[error.path] = error.message;
            }
          });
          formik.setErrors(newErrors);
          toast.error("Branch creation failed", {
            description: "Please fix the errors in the form.",
          });
        } else if (axios.isAxiosError(err) && err.response) {
          console.error("Full API error response:", err.response.data);

          const apiError = err.response.data as { message?: string; success?: boolean };

          toast.error("Branch creation failed", {
            description: apiError.message || "An unknown error occurred.",
          });
        } else if (typeof err === "object" && err !== null && "message" in err) {
          const errorObj = err as { message: string; success?: boolean };

          toast.error("Branch creation failed", {
            description: errorObj.message || "An unknown error occurred.",
          });
        } else {
          toast.error("Branch creation failed", {
            description: "An unexpected error occurred.",
          });
        }
      } finally {
        setSubmitting(false);
      }
    },
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    formik.setFieldValue(e.target.name, e.target.value);
  };

  return (
    <div className="h-screen overflow-y-auto p-6">
      <div className="max-w-5xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Create New Branch</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={formik.handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Name</Label>
                  <Input
                    name="name"
                    value={formik.values.name}
                    onChange={handleChange}
                    onBlur={formik.handleBlur}
                    required
                  />
                  {formik.touched.name && formik.errors.name && (
                    <div className="text-red-500 text-sm mt-1">
                      {formik.errors.name}
                    </div>
                  )}
                </div>
                <div>
                  <Label>Location</Label>
                  <Input
                    name="location"
                    value={formik.values.location}
                    onChange={handleChange}
                    onBlur={formik.handleBlur}
                    required
                  />
                  {formik.touched.location && formik.errors.location && (
                    <div className="text-red-500 text-sm mt-1">
                      {formik.errors.location}
                    </div>
                  )}
                </div>
                <div>
                  <Label>Contact Number</Label>
                  <Input
                    name="contactNumber"
                    value={formik.values.contactNumber}
                    onChange={handleChange}
                    onBlur={formik.handleBlur}
                    placeholder="+256XXXXXXXXX"
                    required
                  />
                  {formik.touched.contactNumber &&
                    formik.errors.contactNumber && (
                      <div className="text-red-500 text-sm mt-1">
                        {formik.errors.contactNumber}
                      </div>
                    )}
                </div>
                <div>
                  <Label>Email</Label>
                  <Input
                    name="branchEmail"
                    type="email"
                    value={formik.values.branchEmail}
                    onChange={handleChange}
                    onBlur={formik.handleBlur}
                  />
                  {formik.touched.branchEmail && formik.errors.branchEmail && (
                    <div className="text-red-500 text-sm mt-1">
                      {formik.errors.branchEmail}
                    </div>
                  )}
                </div>
                <div>
                  <Label>Manager</Label>
                  <Select
                    name="managerId"
                    value={formik.values.managerId}
                    onValueChange={(value) =>
                      formik.setFieldValue("managerId", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Manager" />
                    </SelectTrigger>
                    <SelectContent>
                      {loading ? (
                        <div className="flex justify-center items-center py-2">
                          <Spinner />
                        </div>
                      ) : (
                        users.map((user) => (
                          <SelectItem key={user.id} value={user.id}>
                            {user.firstName} {user.lastName}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label>Services Offered (comma-separated)</Label>
                <Textarea
                  name="servicesOffered"
                  value={formik.values.servicesOffered}
                  onChange={handleChange}
                  onBlur={formik.handleBlur}
                  placeholder="Oil Change, Tire Replacement, etc."
                  required
                />
                {formik.touched.servicesOffered &&
                  formik.errors.servicesOffered && (
                    <div className="text-red-500 text-sm mt-1">
                      {formik.errors.servicesOffered}
                    </div>
                  )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {(["weekdays", "weekends"] as const).map((type) => (
                  <div key={type}>
                    <Label>
                      {type === "weekdays"
                        ? "Weekdays (Mon - Fri)"
                        : "Weekends (Sat - Sun)"}
                    </Label>
                    <div className="flex gap-4">
                      <div className="w-full">
                        <Label>Open Time</Label>
                        <Input
                          name={`openingHours.${type}.open`}
                          value={formik.values.openingHours[type].open}
                          onChange={handleChange}
                          onBlur={formik.handleBlur}
                          placeholder="Open time"
                          required
                        />
                        <Label>Close Time</Label>
                        <Input
                          name={`openingHours.${type}.close`}
                          value={formik.values.openingHours[type].close}
                          onChange={handleChange}
                          onBlur={formik.handleBlur}
                          placeholder="Close time"
                          required
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-2">
                <Switch
                  checked={formik.values.isActive}
                  onCheckedChange={(checked) =>
                    formik.setFieldValue("isActive", checked)
                  }
                />
                <Label>{formik.values.isActive ? "Active" : "Inactive"}</Label>
              </div>

              <div className="mt-6">
                <Button type="submit" className="w-full" disabled={submitting}>
                  {submitting ? "Submitting..." : "Create Branch"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CreateBranchPage;
