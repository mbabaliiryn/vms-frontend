"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { vehicleApi } from "@/app/api";
import {
  UpdateVehicleInput,
  Vehicle,
  FuelType,
  VehicleModel,
  VehicleMake,
} from "@/types";
// import Spinner from "@/components/Spinner/Spinner";
import { FaSave } from "react-icons/fa";
import * as Yup from "yup";
import axios from "axios";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ApiResponse {
  success: boolean;
  message: string;
  data: Vehicle;
}

const EditVehiclePage: React.FC = () => {
  const { id } = useParams();
  const vehicleId = id as string;
  const router = useRouter();

  const [formData, setFormData] = useState<UpdateVehicleInput>({
    vehicleId: vehicleId,
    make: "",
    model: "",
    year: new Date().getFullYear(),
    plateNumber: "",
    vin: "",
    fuel: "",
    transmission: "",
    bodyShape: "",
    engine: "",
    chassis: "",
  });

  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchVehicle = async () => {
      setLoading(true);
      try {
        const response = (await vehicleApi.getVehicleById({
          vehicleId,
        })) as ApiResponse;
        if (response.success) {
          setFormData({
            vehicleId: vehicleId,
            make: response.data.make || "",
            model: response.data.model || "",
            year: response.data.year || new Date().getFullYear(),
            plateNumber: response.data.plateNumber || "",
            vin: response.data.vin || "",
            fuel: response.data.fuel || "",
            transmission: response.data.transmission || "",
            bodyShape: response.data.bodyShape || "",
            engine: response.data.engine || "",
            chassis: response.data.chassis || "",
          });
        } else {
          toast.error("Failed to load vehicle", {
            description: response.message,
          });
        }
      } catch (error) {
        handleError(error, "loading");
      } finally {
        setLoading(false);
      }
    };

    fetchVehicle();
  }, [vehicleId]);

  const handleError = (error: unknown, action: "loading" | "updating") => {
    if (error instanceof Yup.ValidationError) {
      const newErrors: Record<string, string> = {};
      error.inner.forEach((err) => {
        if (err.path) {
          newErrors[err.path] = err.message;
        }
      });
      toast.error(`Vehicle ${action} failed`, {
        description: `Please fix the errors in the form: ${Object.values(
          newErrors
        ).join(", ")}`,
      });
    } else if (axios.isAxiosError(error) && error.response) {
      console.error("Full API error response:", error.response.data);

      const apiError = error.response.data as { message?: string };

      toast.error(`Vehicle ${action} failed`, {
        description: apiError.message || "An unknown error occurred.",
      });
    } else if (
      typeof error === "object" &&
      error !== null &&
      "message" in error
    ) {
      const errorObj = error as { message: string; success?: boolean };

      toast.error(`Vehicle ${action} failed`, {
        description: errorObj.message || "An unknown error occurred.",
      });
    } else {
      toast.error(`Vehicle ${action} failed`, {
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
      const response = (await vehicleApi.updateVehicle(
        formData
      )) as ApiResponse;
      if (response.success) {
        toast.success("Vehicle updated successfully!");
        router.push("/operations/vehicles");
      } else {
        toast.error("Failed to update vehicle", {
          description: response.message,
        });
      }
    } catch (err: unknown) {
      handleError(err, "updating");
    } finally {
      setLoading(false);
    }
  };

  // if (loading) return <Spinner />;

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-semibold">Edit Vehicle</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium">Make</label>
          <Select
            value={formData.make}
            onValueChange={(value) => {
              setFormData((prev) => ({
                ...prev,
                make: value,
              }));
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select make" />
            </SelectTrigger>
            <SelectContent>
              {Object.values(VehicleMake).map((make) => (
                <SelectItem key={make} value={make}>
                  {make}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="block text-sm font-medium">Model</label>
          <Select
            value={formData.model}
            onValueChange={(value) => {
              setFormData((prev) => ({
                ...prev,
                model: value,
              }));
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select model" />
            </SelectTrigger>
            <SelectContent>
              {Object.values(VehicleModel).map((model) => (
                <SelectItem key={model} value={model}>
                  {model}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="block text-sm font-medium">Year</label>
          <Input
            name="year"
            type="number"
            value={formData.year}
            onChange={handleInputChange}
            placeholder="Enter vehicle year"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Plate Number</label>
          <Input
            name="plateNumber"
            value={formData.plateNumber}
            onChange={handleInputChange}
            placeholder="Enter plate number"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">VIN</label>
          <Input
            name="vin"
            value={formData.vin}
            onChange={handleInputChange}
            placeholder="Enter VIN (optional)"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Fuel Type</label>
          <Select
            value={formData.fuel}
            onValueChange={(value) => {
              setFormData((prev) => ({
                ...prev,
                fuel: value,
              }));
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select fuel type" />
            </SelectTrigger>
            <SelectContent>
              {Object.values(FuelType).map((fuel) => (
                <SelectItem key={fuel} value={fuel}>
                  {fuel}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="block text-sm font-medium">Transmission</label>
          <Input
            name="transmission"
            value={formData.transmission}
            onChange={handleInputChange}
            placeholder="Enter transmission type"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Body Shape</label>
          <Input
            name="bodyShape"
            value={formData.bodyShape}
            onChange={handleInputChange}
            placeholder="Enter body shape"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Engine</label>
          <Input
            name="engine"
            value={formData.engine}
            onChange={handleInputChange}
            placeholder="Enter engine type"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Chassis</label>
          <Input
            name="chassis"
            value={formData.chassis}
            onChange={handleInputChange}
            placeholder="Enter chassis type"
          />
        </div>
      </div>

      <div className="flex justify-end space-x-2 mt-6">
        {!loading && (
          <Button
            variant="outline"
            onClick={() => router.push("/operations/vehicles")}
          >
            Cancel
          </Button>
        )}
        <Button
          onClick={handleUpdate}
          className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600"
          disabled={loading}
        >
          <FaSave /> {loading ? "Please Wait..." : "Save Changes"}
        </Button>
      </div>
    </div>
  );
};

export default EditVehiclePage;
