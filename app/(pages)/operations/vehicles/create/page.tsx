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
import { toast } from "sonner";
import { vehicleApi, customerApi, garageApi } from "@/app/api";
import {
  CreateVehicleInput,
  Customer,
  Garage,
  FuelType,
  VehicleModel,
  VehicleMake,
} from "@/types";
import axios from "axios";
import * as Yup from "yup";

interface ApiResponse {
  success: boolean;
  message: string;
  data: Garage[] | Customer[];
}

const CreateVehiclePage: React.FC = () => {
  const [vehicleData, setVehicleData] = useState<CreateVehicleInput>({
    customerId: "",
    garageId: "",
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
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [garages, setGarages] = useState<Garage[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [customerRes, garageRes] = await Promise.all([
          (await customerApi.getCustomers()) as Promise<ApiResponse>,
          (await garageApi.getGarages()) as Promise<ApiResponse>,
        ]);

        if (customerRes.success && garageRes.success) {
          setCustomers(customerRes.data as Customer[]);
          setGarages(garageRes.data as Garage[]);
        } else {
          toast.error("Failed to load data", {
            description:
              "An error occurred while fetching customers and garages.",
          });
        }
      } catch (err) {
        if (axios.isAxiosError(err)) {
          if (err.config?.url?.includes("customers")) {
            toast.error("Failed to load customers", {
              description:
                err.response?.data?.message ||
                "An error occurred while fetching customers.",
            });
          } else if (err.config?.url?.includes("garages")) {
            toast.error("Failed to load garages", {
              description:
                err.response?.data?.message ||
                "An error occurred while fetching garages.",
            });
          }
        } else {
          toast.error("An unexpected error occurred", {
            description: "Please try again later.",
          });
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVehicleData({ ...vehicleData, [e.target.name]: e.target.value });
  };

  const handleSelectChange = (field: string, value: string) => {
    setVehicleData({ ...vehicleData, [field]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = (await vehicleApi.createVehicle(vehicleData)) as {
        success: boolean;
        message: string;
      };
      if (response.success) {
        toast.success("Vehicle added successfully!");
        router.push("/operations/vehicles");
      } else {
        toast.error("Failed to add vehicle", { description: response.message });
      }
    } catch (err: unknown) {
      if (err instanceof Yup.ValidationError) {
        const newErrors: Record<string, string> = {};
        err.inner.forEach((error) => {
          if (error.path) {
            newErrors[error.path] = error.message;
          }
        });
        toast.error("Vehicle creation failed", {
          description: "Please fix the errors in the form.",
        });
      } else if (axios.isAxiosError(err) && err.response) {
        console.error("Full API error response:", err.response.data);

        const apiError = err.response.data as {
          message?: string;
          success?: boolean;
        };

        toast.error("Vehicle creation failed", {
          description: apiError.message || "An unknown error occurred.",
        });
      } else if (typeof err === "object" && err !== null && "message" in err) {
        const errorObj = err as { message: string; success?: boolean };

        toast.error("Vehicle creation failed", {
          description: errorObj.message || "An unknown error occurred.",
        });
      } else {
        toast.error("Vehicle creation failed", {
          description: "An unexpected error occurred.",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-semibold mb-4">Create Vehicle</h1>
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        {/* Customer */}
        <div>
          <Label>Customer</Label>
          <Select
            onValueChange={(value) => handleSelectChange("customerId", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a customer" />
            </SelectTrigger>
            <SelectContent>
              {customers.map((customer) => (
                <SelectItem key={customer.id} value={customer.id}>
                  {customer.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Garage */}
        <div>
          <Label>Garage</Label>
          <Select
            onValueChange={(value) => handleSelectChange("garageId", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a garage" />
            </SelectTrigger>
            <SelectContent>
              {garages.map((garage) => (
                <SelectItem key={garage.id} value={garage.id}>
                  {garage.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Make */}
        <div>
          <Label>Make</Label>
          <Select onValueChange={(value) => handleSelectChange("make", value)}>
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

        {/* Model */}
        <div>
          <Label>Model</Label>
          <Select onValueChange={(value) => handleSelectChange("model", value)}>
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

        {/* Year */}
        <div>
          <Label>Year</Label>
          <Input
            type="number"
            name="year"
            value={vehicleData.year}
            onChange={handleChange}
            required
          />
        </div>

        {/* Plate Number */}
        <div>
          <Label>Plate Number</Label>
          <Input
            name="plateNumber"
            value={vehicleData.plateNumber}
            onChange={handleChange}
            required
          />
        </div>

        {/* VIN */}
        <div>
          <Label>VIN (optional)</Label>
          <Input name="vin" value={vehicleData.vin} onChange={handleChange} />
        </div>

        {/* Fuel */}
        <div>
          <Label>Fuel</Label>
          <Select onValueChange={(value) => handleSelectChange("fuel", value)}>
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

        {/* Transmission */}
        <div>
          <Label>Transmission</Label>
          <Select
            onValueChange={(value) => handleSelectChange("transmission", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select transmission type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Automatic">Automatic</SelectItem>
              <SelectItem value="Manual">Manual</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Body Shape */}
        <div>
          <Label>Body Shape</Label>
          <Select
            onValueChange={(value) => handleSelectChange("bodyShape", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select body shape" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Sedan">Sedan</SelectItem>
              <SelectItem value="SUV">SUV</SelectItem>
              <SelectItem value="Truck">Truck</SelectItem>
              <SelectItem value="Coupe">Coupe</SelectItem>
              <SelectItem value="Motorcycle">Motorcycle</SelectItem>
              <SelectItem value="Bus">Bus</SelectItem>
              <SelectItem value="Van">Van</SelectItem>
              <SelectItem value="Taxi">Taxi</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Engine */}
        <div>
          <Label>Engine</Label>
          <Input
            name="engine"
            value={vehicleData.engine}
            onChange={handleChange}
          />
        </div>

        {/* Chassis */}
        <div>
          <Label>Chassis</Label>
          <Input
            name="chassis"
            value={vehicleData.chassis}
            onChange={handleChange}
          />
        </div>

        <Button
          type="submit"
          disabled={loading}
          className="w-full col-span-2 bg-orange-500 hover:bg-orange-600"
        >
          {loading ? "Creating..." : "Create Vehicle"}
        </Button>
      </form>
    </div>
  );
};

export default CreateVehiclePage;
