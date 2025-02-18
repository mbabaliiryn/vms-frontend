"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { customerApi } from "@/app/api";
import { CustomerStatus, UpdateCustomerInput } from "@/types";
import { FaSave } from "react-icons/fa";
import * as Yup from "yup";
import axios from "axios";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectValue,
  SelectItem,
} from "@/components/ui/select";

interface ApiResponse {
  success: boolean;
  message: string;
  data: UpdateCustomerInput;
}

const EditCustomerPage: React.FC = () => {
  const { id } = useParams();
  const customerId = id as string;
  const router = useRouter();

  const [formData, setFormData] = useState<UpdateCustomerInput>({
    customerId,
    name: "",
    contact: "",
    address: "",
    customerType: CustomerStatus.INDIVIDUAL,
  });

  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchCustomer = async () => {
      setLoading(true);
      try {
        const response = (await customerApi.getCustomerById({
          customerId,
        })) as ApiResponse;
        if (response.success) {
          setFormData({
            customerId,
            name: response.data.name || "",
            contact: response.data.contact || "",
            address: response.data.address || "",
            customerType:
              response.data.customerType || CustomerStatus.INDIVIDUAL,
          });
        } else {
          toast.error("Failed to load customer", {
            description: response.message,
          });
        }
      } catch (error) {
        handleError(error, "loading");
      } finally {
        setLoading(false);
      }
    };

    fetchCustomer();
  }, [customerId]);

  const handleError = (error: unknown, action: "loading" | "updating") => {
    if (error instanceof Yup.ValidationError) {
      const newErrors: Record<string, string> = {};
      error.inner.forEach((err) => {
        if (err.path) {
          newErrors[err.path] = err.message;
        }
      });
      toast.error(`Customer ${action} failed`, {
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

      toast.error(`Customer ${action} failed`, {
        description: apiError.message || "An unknown error occurred.",
      });
    } else if (
      typeof error === "object" &&
      error !== null &&
      "message" in error
    ) {
      const errorObj = error as { message: string; success?: boolean };

      toast.error(`Customer ${action} failed`, {
        description: errorObj.message || "An unknown error occurred.",
      });
    } else {
      toast.error(`Customer ${action} failed`, {
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
      const response = (await customerApi.updateCustomer(
        formData
      )) as ApiResponse;
      if (response.success) {
        toast.success("Customer updated successfully!");
        router.push("/operations/customers");
      } else {
        toast.error("Failed to update customer", {
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
        toast.error("Customer update failed", {
          description: "Please fix the errors in the form.",
        });
      } else if (axios.isAxiosError(err) && err.response) {
        console.error("Full API error response:", err.response.data);

        const apiError = err.response.data as {
          message?: string;
          success?: boolean;
        };

        toast.error("Customer update failed", {
          description: apiError.message || "An unknown error occurred.",
        });
      } else if (typeof err === "object" && err !== null && "message" in err) {
        const errorObj = err as { message: string; success?: boolean };

        toast.error("Customer update failed", {
          description: errorObj.message || "An unknown error occurred.",
        });
      } else {
        toast.error("Customer update failed", {
          description: "An unexpected error occurred.",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-semibold">Edit Customer</h1>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Customer Name</label>
          <Input
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="Enter customer name"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Customer Type</label>
          <Select
            value={formData.customerType}
            onValueChange={(value) => {
              setFormData((prevData) => ({
                ...prevData,
                customerType: value as CustomerStatus,
              }));
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select type">
                {formData.customerType}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {Object.values(CustomerStatus).map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="block text-sm font-medium">Contact</label>
          <Input
            name="contact"
            value={formData.contact}
            onChange={handleInputChange}
            placeholder="Enter contact number"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Address</label>
          <Input
            name="address"
            value={formData.address}
            onChange={handleInputChange}
            placeholder="Enter address"
          />
        </div>

        <div className="flex justify-end space-x-2">
          <Button
            variant="outline"
            onClick={() => router.push("/admin/customers")}
          >
            Cancel
          </Button>
          <Button
            onClick={handleUpdate}
            className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600"
          >
            <FaSave /> {loading ? "Please Wait..." : "Save Changes"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EditCustomerPage;
