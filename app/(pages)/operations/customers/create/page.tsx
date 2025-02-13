"use client";

import React, {useState, useEffect} from "react";
import {useRouter} from "next/navigation";
import {useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup";
import * as yup from "yup";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {toast} from "sonner";
import {customerApi, branchApi} from "@/app/api";
import {CreateCustomerInput, Branch} from "@/types";
import axios from "axios";
import * as Yup from "yup";

interface ApiResponse {
    success: boolean;
    message: string;
    data: Branch[];
}

interface CreateResponse {
    success: boolean;
    message: string;
}

const schema = yup.object().shape({
    name: yup.string().required("Name is required"),
    contact: yup.string().required("Contact is required"),
    address: yup.string().required("Address is required"),
    branchId: yup.string().required("Branch is required"),
});

const CreateCustomerPage: React.FC = () => {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [branches, setBranches] = useState<Branch[]>([]);

    const {
        register,
        handleSubmit,
        setValue,
        formState: {errors},
    } = useForm<CreateCustomerInput>({
        resolver: yupResolver(schema),
    });

    useEffect(() => {
        const fetchBranches = async () => {
            try {
                const response = (await branchApi.getBranches() as ApiResponse);
                if (response.success) {
                    setBranches(response.data);
                } else {
                    toast.error("Failed to load branches", {
                        description: response.message || "An error occurred while fetching branches.",
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
                setLoading(false);
            }
        };

        fetchBranches();
    }, []);

    const onSubmit = async (data: CreateCustomerInput) => {
        setLoading(true);
        try {
            const response = (await customerApi.createCustomer(data) as CreateResponse);
            if (response.success) {
                toast.success("Customer created successfully!");
                router.push("/operations/customers");
            } else {
                toast.error("Failed to create customer", {
                    description: response.message || "An error occurred.",
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
                toast.error("Customer creation failed", {
                    description: "Please fix the errors in the form.",
                });
            } else if (axios.isAxiosError(err) && err.response) {
                console.error("Full API error response:", err.response.data);

                const apiError = err.response.data as { message?: string; success?: boolean };

                toast.error("Customer creation failed", {
                    description: apiError.message || "An unknown error occurred.",
                });
            } else if (typeof err === "object" && err !== null && "message" in err) {
                const errorObj = err as { message: string; success?: boolean };

                toast.error("Customer creation failed", {
                    description: errorObj.message || "An unknown error occurred.",
                });
            } else {
                toast.error("Customer creation failed", {
                    description: "An unexpected error occurred.",
                });
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6 max-w-lg mx-auto">
            <h1 className="text-2xl font-semibold mb-4">Create Customer</h1>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                    <Label htmlFor="name">Name</Label>
                    <Input id="name" {...register("name")} />
                    {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
                </div>

                <div>
                    <Label htmlFor="contact">Contact</Label>
                    <Input id="contact" {...register("contact")} />
                    {errors.contact && <p className="text-red-500 text-sm">{errors.contact.message}</p>}
                </div>

                <div>
                    <Label htmlFor="address">Address</Label>
                    <Input id="address" {...register("address")} />
                    {errors.address && <p className="text-red-500 text-sm">{errors.address.message}</p>}
                </div>

                <div>
                    <Label>Branch</Label>
                    <Select onValueChange={(value) => setValue("branchId", value)}>
                        <SelectTrigger>
                            <SelectValue placeholder="Select a branch"/>
                        </SelectTrigger>
                        <SelectContent>
                            {branches.map((branch) => (
                                <SelectItem key={branch.id} value={branch.id}>
                                    {branch.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    {errors.branchId && <p className="text-red-500 text-sm">{errors.branchId.message}</p>}
                </div>

                <Button type="submit" disabled={loading} className="w-full">
                    {loading ? "Creating..." : "Create Customer"}
                </Button>
            </form>
        </div>
    );
};

export default CreateCustomerPage;
