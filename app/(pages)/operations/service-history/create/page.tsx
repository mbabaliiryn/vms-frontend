"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { serviceHistoryApi, vehicleApi, branchApi, authApi } from "@/app/api";
import { CreateServiceHistoryInput, Vehicle, Branch, User } from "@/types";
import axios from "axios";
import * as Yup from "yup";

interface ApiResponse {
  success: boolean;
  message: string;
  data: Vehicle[] | Branch[] | User[];
}

const CreateServiceRecordPage: React.FC = () => {
  const [serviceData, setServiceData] = useState<CreateServiceHistoryInput>({
    vehicleId: "",
    mechanicId: "",
    serviceDate: new Date(),
    description: "",
    cost: undefined,
    branchId: "",
  });
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [mechanics, setMechanics] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [vehicleRes, branchRes, mechanicRes] = await Promise.all([
          (await vehicleApi.getVehicles()) as Promise<ApiResponse>,
          (await branchApi.getBranches()) as Promise<ApiResponse>,
          (await authApi.getUsers()) as Promise<ApiResponse>,
        ]);

        if (vehicleRes.success) setVehicles(vehicleRes.data as Vehicle[]);
        if (branchRes.success) setBranches(branchRes.data as Branch[]);
        if (mechanicRes.success) setMechanics(mechanicRes.data as User[]);
      } catch (err) {
        if (axios.isAxiosError(err)) {
          toast.error("Error loading data", {
            description:
              err.response?.data?.message || "Failed to load required data.",
          });
        }
      }
    };
    fetchData();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setServiceData({ ...serviceData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = (await serviceHistoryApi.createServiceHistory(
        serviceData
      )) as {
        success: boolean;
        message: string;
      };
      if (response.success) {
        toast.success("Service record added successfully!");
        router.push("/operations/service-history");
      } else {
        toast.error("Failed to add service record", {
          description: response.message,
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
        toast.error("Service record creation failed", {
          description: "Please fix the errors in the form.",
        });
      } else if (axios.isAxiosError(err) && err.response) {
        console.error("Full API error response:", err.response.data);

        const apiError = err.response.data as {
          message?: string;
          success?: boolean;
        };

        toast.error("Service record creation failed", {
          description: apiError.message || "An unknown error occurred.",
        });
      } else if (typeof err === "object" && err !== null && "message" in err) {
        const errorObj = err as { message: string; success?: boolean };

        toast.error("Service record creation failed", {
          description: errorObj.message || "An unknown error occurred.",
        });
      } else {
        toast.error("Service record creation failed", {
          description: "An unexpected error occurred.",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-semibold mb-4">Add Service Record</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Vehicle Select */}
        <div>
          <Label>Vehicle</Label>
          <Select
            onValueChange={(value) =>
              setServiceData({ ...serviceData, vehicleId: value })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a vehicle" />
            </SelectTrigger>
            <SelectContent>
              {vehicles.map((vehicle) => (
                <SelectItem key={vehicle.id} value={vehicle.id}>
                  {vehicle.make} {vehicle.model} - {vehicle.plateNumber}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Mechanic Select */}
        <div>
          <Label>Mechanic</Label>
          <Select
            onValueChange={(value) =>
              setServiceData({ ...serviceData, mechanicId: value })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a mechanic" />
            </SelectTrigger>
            <SelectContent>
              {mechanics.map((mechanic) => (
                <SelectItem key={mechanic.id} value={mechanic.id}>
                  {mechanic.firstName} {mechanic.lastName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Branch Select */}
        <div>
          <Label>Branch</Label>
          <Select
            onValueChange={(value) =>
              setServiceData({ ...serviceData, branchId: value })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a branch" />
            </SelectTrigger>
            <SelectContent>
              {branches.map((branch) => (
                <SelectItem key={branch.id} value={branch.id}>
                  {branch.name} - {branch.location}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Service Date */}
        <div>
          <Label>Service Date</Label>
          <Input
            type="date"
            name="serviceDate"
            value={serviceData.serviceDate.toISOString().split("T")[0]}
            onChange={(e) =>
              setServiceData({
                ...serviceData,
                serviceDate: new Date(e.target.value),
              })
            }
            required
          />
        </div>

        {/* Cost */}
        <div>
          <Label>Cost</Label>
          <Input
            type="number"
            name="cost"
            value={serviceData.cost ?? ""}
            onChange={handleChange}
            placeholder="Enter cost (optional)"
          />
        </div>

        {/* Description */}
        <div>
          <Label>Description</Label>
          <Textarea
            name="description"
            value={serviceData.description}
            onChange={handleChange}
            placeholder="Enter service details"
            required
          />
        </div>

        {/* Submit Button */}
        <Button type="submit" disabled={loading} className="w-full">
          {loading ? "Creating..." : "Add Service Record"}
        </Button>
      </form>
    </div>
  );
};

export default CreateServiceRecordPage;
