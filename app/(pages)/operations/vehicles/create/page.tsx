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
import { vehicleApi, customerApi, branchApi } from "@/app/api";
import { CreateVehicleInput, Customer, Branch } from "@/types";
import axios from "axios";
import * as Yup from "yup";

interface ApiResponse {
  success: boolean;
  message: string;
  data: Branch[] | Customer[];
}

const CreateVehiclePage: React.FC = () => {
  const [vehicleData, setVehicleData] = useState<CreateVehicleInput>({
    customerId: "",
    branchId: "",
    make: "",
    model: "",
    year: new Date().getFullYear(),
    plateNumber: "",
    vin: "",
  });
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [customerRes, branchRes] = await Promise.all([
          (await customerApi.getCustomers()) as Promise<ApiResponse>,
          (await branchApi.getBranches()) as Promise<ApiResponse>,
        ]);

        if (customerRes.success && branchRes.success) {
          setCustomers(customerRes.data as Customer[]);
          setBranches(branchRes.data as Branch[]);
        } else {
          toast.error("Failed to load data", {
            description:
              "An error occurred while fetching customers and branches.",
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
          } else if (err.config?.url?.includes("branches")) {
            toast.error("Failed to load branches", {
              description:
                err.response?.data?.message ||
                "An error occurred while fetching branches.",
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
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-semibold mb-4">Create Vehicle</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label>Customer</Label>
          <Select
            onValueChange={(value) =>
              setVehicleData({ ...vehicleData, customerId: value })
            }
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

        <div>
          <Label>Branch</Label>
          <Select
            onValueChange={(value) =>
              setVehicleData({ ...vehicleData, branchId: value })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a branch" />
            </SelectTrigger>
            <SelectContent>
              {branches.map((branch) => (
                <SelectItem key={branch.id} value={branch.id}>
                  {branch.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>Make</Label>
          <Input
            name="make"
            value={vehicleData.make}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <Label>Model</Label>
          <Input
            name="model"
            value={vehicleData.model}
            onChange={handleChange}
            required
          />
        </div>

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

        <div>
          <Label>Plate Number</Label>
          <Input
            name="plateNumber"
            value={vehicleData.plateNumber}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <Label>VIN (optional)</Label>
          <Input name="vin" value={vehicleData.vin} onChange={handleChange} />
        </div>

        <Button type="submit" disabled={loading} className="w-full">
          {loading ? "Creating..." : "Create Vehicle"}
        </Button>
      </form>
    </div>
  );
};

export default CreateVehiclePage;
