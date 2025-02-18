"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import * as Yup from "yup";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useFormik } from "formik";
import { User, Garage, CreateGarageInput } from "@/types";
import { garageApi } from "@/app/api";
import axios from "axios";
import useAuth from "@/hooks/useAuth";

interface ApiResponse {
  success: boolean;
  message: string;
  data: User[] | Garage[];
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

const CreateGaragePage = () => {
  const router = useRouter();
  const [submitting, setSubmitting] = useState<boolean>(false);
  const { user } = useAuth();

  const initialValues = {
    name: "",
    location: "",
    adminId: user?.id as string,
    contactNumber: "",
    garageEmail: "",
    isActive: true,
    servicesOffered: "",
    openingHours: {
      weekdays: { open: "", close: "" },
      weekends: { open: "", close: "" },
    },
  };

  const validationSchema = Yup.object({
    name: Yup.string().min(3).max(100).required("Garage name is required"),
    location: Yup.string().min(3).max(255).required("Location is required"),
    servicesOffered: Yup.string().required(
      "At least one service must be offered"
    ),
    contactNumber: Yup.string()
      .matches(/^\+256\d{9}$/, "Contact number must be in +256XXXXXXXXX format")
      .required("Contact number is required"),
    garageEmail: Yup.string().email("Invalid email").optional(),
    isActive: Yup.boolean(),
    openingHours: openingHoursSchema,
  });

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: async (values) => {
      setSubmitting(true);
      try {
        const garageData: CreateGarageInput = {
          name: values.name,
          location: values.location,
          adminId: user?.id as string,
          contactNumber: values.contactNumber,
          servicesOffered: values.servicesOffered
            .split(",")
            .map((service) => service.trim()),
          garageEmail: values.garageEmail || undefined,
          isActive: values.isActive,
          openingHours: values.openingHours,
        };

        const response = (await garageApi.createGarage(
          garageData
        )) as ApiResponse;

        if (response.success) {
          toast.success("Garage created successfully!");
          router.push("/admin/garages");
        } else {
          toast.error("Failed to create garage", {
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
          toast.error("Garage creation failed", {
            description: "Please fix the errors in the form.",
          });
        } else if (axios.isAxiosError(err) && err.response) {
          console.error("Full API error response:", err.response.data);

          const apiError = err.response.data as {
            message?: string;
            success?: boolean;
          };

          toast.error("Garage creation failed", {
            description: apiError.message || "An unknown error occurred.",
          });
        } else if (
          typeof err === "object" &&
          err !== null &&
          "message" in err
        ) {
          const errorObj = err as { message: string; success?: boolean };

          toast.error("Garage creation failed", {
            description: errorObj.message || "An unknown error occurred.",
          });
        } else {
          toast.error("Garage creation failed", {
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
    <div className="min-h-[80vh] flex justify-center items-center">
      <div className="w-full max-w-4xl">
        <Card>
          <CardHeader>
            <CardTitle>Create New Garage</CardTitle>
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
                    name="garageEmail"
                    type="email"
                    value={formik.values.garageEmail}
                    onChange={handleChange}
                    onBlur={formik.handleBlur}
                  />
                  {formik.touched.garageEmail && formik.errors.garageEmail && (
                    <div className="text-red-500 text-sm mt-1">
                      {formik.errors.garageEmail}
                    </div>
                  )}
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
                  className="bg-orange-500"
                />
                <Label>{formik.values.isActive ? "Active" : "Inactive"}</Label>
              </div>

              <div className="mt-6">
                <Button
                  type="submit"
                  className="w-full  bg-orange-500 hover:bg-orange-600"
                  disabled={submitting}
                >
                  {submitting ? "Submitting..." : "Create Garage"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CreateGaragePage;
