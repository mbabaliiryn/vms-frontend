"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { serviceHistoryApi } from "@/app/api";
import { UpdateServiceHistoryInput } from "@/types";
import Spinner from "@/components/Spinner/Spinner";
import { FaSave } from "react-icons/fa";
import * as Yup from "yup";
import axios from "axios";

interface ApiResponse {
  success: boolean;
  message: string;
  data: UpdateServiceHistoryInput;
}

const EditServiceHistoryPage: React.FC = () => {
  const { id } = useParams();
  const serviceHistoryId = id as string;
  const router = useRouter();

  const [formData, setFormData] = useState<UpdateServiceHistoryInput>({
    serviceHistoryId,
    serviceDate: new Date(),
    description: "",
    cost: undefined,
    mechanicId: "",
  });

  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchServiceHistory = async () => {
      setLoading(true);
      try {
        const response = (await serviceHistoryApi.getServiceHistoryById({
          serviceHistoryId,
        })) as ApiResponse;
        if (response.success) {
          setFormData({
            serviceHistoryId,
            serviceDate: new Date(response.data.serviceDate ?? new Date()),
            description: response.data.description ?? "",
            cost: response.data.cost ?? undefined,
            mechanicId: response.data.mechanicId ?? "",
          });
        } else {
          toast.error("Failed to load service record", {
            description: response.message,
          });
        }
      } catch (error) {
        handleError(error, "loading");
      } finally {
        setLoading(false);
      }
    };

    fetchServiceHistory();
  }, [serviceHistoryId]);

  const handleError = (error: unknown, action: "loading" | "updating") => {
    if (error instanceof Yup.ValidationError) {
      const newErrors: Record<string, string> = {};
      error.inner.forEach((err) => {
        if (err.path) {
          newErrors[err.path] = err.message;
        }
      });
      toast.error(`Service history ${action} failed`, {
        description: `Please fix the errors in the form: ${Object.values(
          newErrors
        ).join(", ")}`,
      });
    } else if (axios.isAxiosError(error) && error.response) {
      console.error("Full API error response:", error.response.data);

      const apiError = error.response.data as { message?: string };

      toast.error(`Service history ${action} failed`, {
        description: apiError.message || "An unknown error occurred.",
      });
    } else if (
      typeof error === "object" &&
      error !== null &&
      "message" in error
    ) {
      const errorObj = error as { message: string; success?: boolean };

      toast.error(`Service history ${action} failed`, {
        description: errorObj.message || "An unknown error occurred.",
      });
    } else {
      toast.error(`Service history ${action} failed`, {
        description: "An unexpected error occurred.",
      });
    }
    console.error("Error details:", error);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: name === "cost" ? parseFloat(value) : value,
    }));
  };

  const handleUpdate = async () => {
    setLoading(true);
    try {
      const response = (await serviceHistoryApi.updateServiceHistory(
        formData
      )) as ApiResponse;
      if (response.success) {
        toast.success("Service record updated successfully!");
        router.push("/operations/service-history");
      } else {
        toast.error("Failed to update service record", {
          description: response.message,
        });
      }
    } catch (err) {
      handleError(err, "updating");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Spinner />;

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-semibold">Edit Service Record</h1>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Service Date</label>
          <Input
            name="serviceDate"
            type="date"
            value={formData.serviceDate?.toISOString().split("T")[0]}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Description</label>
          <Input
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Enter service description"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Cost</label>
          <Input
            name="cost"
            type="number"
            value={formData.cost ?? ""}
            onChange={handleInputChange}
            placeholder="Enter cost"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Mechanic ID</label>
          <Input
            name="mechanicId"
            value={formData.mechanicId}
            onChange={handleInputChange}
            placeholder="Enter mechanic ID"
          />
        </div>

        <div className="flex justify-end space-x-2">
          <Button
            variant="outline"
            onClick={() => router.push("/operations/service-history")}
          >
            Cancel
          </Button>
          <Button onClick={handleUpdate} className="flex items-center gap-2">
            <FaSave /> Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EditServiceHistoryPage;
