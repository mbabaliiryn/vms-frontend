"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { garageApi } from "@/app/api";
import { Garage, UpdateGarageInput } from "@/types";
import Spinner from "@/components/Spinner/Spinner";
import { FaSave } from "react-icons/fa";
import * as Yup from "yup";
import axios from "axios";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface ApiResponse {
  success: boolean;
  message: string;
  data: Garage;
}

const EditGaragePage: React.FC = () => {
  const { id } = useParams();
  const garageId = id as string;
  const router = useRouter();

  const [formData, setFormData] = useState<UpdateGarageInput>({
    garageId: garageId,
    name: "",
    location: "",
    contactNumber: "",
    servicesOffered: [],
    garageEmail: "",
    isActive: true,
    openingHours: {},
  });

  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchGarage = async () => {
      setLoading(true);
      try {
        const response = (await garageApi.getGarageById({
          garageId,
        })) as ApiResponse;
        if (response.success) {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { id: _, ...garageData } = response.data;
          setFormData({
            garageId: garageId,
            name: garageData.name,
            location: garageData.location,
            contactNumber: garageData.contactNumber,
            servicesOffered: garageData.servicesOffered || [],
            garageEmail: garageData.garageEmail || "",
            isActive: garageData.isActive,
            openingHours: garageData.openingHours || {},
          });
        } else {
          toast.error("Failed to load garage", {
            description: response.message,
          });
        }
      } catch (error) {
        handleError(error, "loading");
      } finally {
        setLoading(false);
      }
    };

    fetchGarage();
  }, [garageId]);

  const handleError = (error: unknown, action: "loading" | "updating") => {
    if (error instanceof Yup.ValidationError) {
      const newErrors: Record<string, string> = {};
      error.inner.forEach((err) => {
        if (err.path) {
          newErrors[err.path] = err.message;
        }
      });
      toast.error(`Garage ${action} failed`, {
        description: `Please fix the errors in the form: ${Object.values(
          newErrors
        ).join(", ")}`,
      });
    } else if (axios.isAxiosError(error) && error.response) {
      console.error("Full API error response:", error.response.data);

      const apiError = error.response.data as {
        message?: string;
        success?: boolean;
      };

      toast.error(`Garage ${action} failed`, {
        description: apiError.message || "An unknown error occurred.",
      });
    } else if (
      typeof error === "object" &&
      error !== null &&
      "message" in error
    ) {
      const errorObj = error as { message: string; success?: boolean };

      toast.error(`Garage ${action} failed`, {
        description: errorObj.message || "An unknown error occurred.",
      });
    } else {
      toast.error(`Garage ${action} failed`, {
        description: "An unexpected error occurred.",
      });
    }
    console.error("Error details:", error);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleUpdate = async () => {
    setLoading(true);
    try {
      const updateData: UpdateGarageInput = {
        garageId: formData.garageId,
        name: formData.name,
        location: formData.location,
        contactNumber: formData.contactNumber,
        servicesOffered: formData.servicesOffered,
        garageEmail: formData.garageEmail,
        isActive: formData.isActive,
        openingHours: formData.openingHours,
      };

      const response = (await garageApi.updateGarage(
        updateData
      )) as ApiResponse;
      if (response.success) {
        toast.success("Garage updated successfully!");
        router.push("/admin/garages");
      } else {
        toast.error("Failed to update garage", {
          description: response.message,
        });
      }
    } catch (error) {
      handleError(error, "updating");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Spinner />;

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-semibold">Edit Garage</h1>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Garage Name</label>
          <Input
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="Enter garage name"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Location</label>
          <Input
            name="location"
            value={formData.location}
            onChange={handleInputChange}
            placeholder="Enter garage location"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Contact Number</label>
          <Input
            name="contactNumber"
            value={formData.contactNumber}
            onChange={handleInputChange}
            placeholder="Enter contact number"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Services Offered</label>
          <Input
            name="servicesOffered"
            value={(formData.servicesOffered ?? []).join(", ")}
            onChange={(e) =>
              setFormData((prevData) => ({
                ...prevData,
                servicesOffered: e.target.value
                  .split(",")
                  .map((item) => item.trim()),
              }))
            }
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Email</label>
          <Input
            name="garageEmail"
            value={formData.garageEmail}
            onChange={handleInputChange}
            placeholder="Enter garage email"
            type="email"
          />
        </div>
        <div className="flex items-center gap-2">
          <Switch
            checked={formData.isActive}
            onCheckedChange={(checked) =>
              setFormData((prevData) => ({
                ...prevData,
                isActive: checked,
              }))
            }
          />
          <Label>{formData.isActive ? "Active" : "Inactive"}</Label>
        </div>

        <div className="flex justify-end space-x-2">
          <Button
            variant="outline"
            onClick={() => router.push("/admin/garages")}
          >
            Cancel
          </Button>
          <Button
            onClick={handleUpdate}
            className="flex items-center gap-2  bg-orange-500 hover:bg-orange-600"
          >
            <FaSave /> Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EditGaragePage;
