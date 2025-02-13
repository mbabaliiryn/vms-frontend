"use client";

import React, {useEffect, useState} from "react";
import {useParams, useRouter} from "next/navigation";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {toast} from "sonner";
import {branchApi} from "@/app/api";
import {Branch, UpdateBranchInput} from "@/types";
import Spinner from "@/components/Spinner/Spinner";
import {FaSave} from "react-icons/fa";
import * as Yup from "yup";
import axios from "axios";
import {Switch} from "@/components/ui/switch";
import {Label} from "@/components/ui/label";

interface ApiResponse {
    success: boolean;
    message: string;
    data: Branch;
}

const EditBranchPage: React.FC = () => {
    const {id} = useParams();
    const branchId = id as string;
    const router = useRouter();

    const [formData, setFormData] = useState<UpdateBranchInput>({
        branchId: branchId,
        name: "",
        location: "",
        contactNumber: "",
        servicesOffered: [],
        branchEmail: "",
        isActive: true,
        openingHours: {},
        managerId: "",
    });

    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        const fetchBranch = async () => {
            setLoading(true);
            try {
                const response = (await branchApi.getBranchById({branchId}) as ApiResponse);
                if (response.success) {
                    // eslint-disable-next-line @typescript-eslint/no-unused-vars
                    const {id: _, ...branchData} = response.data;
                    setFormData({
                        branchId: branchId,
                        name: branchData.name,
                        location: branchData.location,
                        contactNumber: branchData.contactNumber,
                        servicesOffered: branchData.servicesOffered || [],
                        branchEmail: branchData.branchEmail || "",
                        isActive: branchData.isActive,
                        openingHours: branchData.openingHours || {},
                        managerId: branchData.managerId,
                    });
                } else {
                    toast.error("Failed to load branch", {
                        description: response.message,
                    });
                }
            } catch (error) {
                handleError(error, "loading");
            } finally {
                setLoading(false);
            }
        };

        fetchBranch();
    }, [branchId]);
    
    const handleError = (error: unknown, action: "loading" | "updating") => {
        if (error instanceof Yup.ValidationError) {
            const newErrors: Record<string, string> = {};
            error.inner.forEach((err) => {
                if (err.path) {
                    newErrors[err.path] = err.message;
                }
            });
            toast.error(`Branch ${action} failed`, {
                description: `Please fix the errors in the form: ${Object.values(newErrors).join(", ")}`,
            });
        } else if (axios.isAxiosError(error) && error.response) {
            console.error("Full API error response:", error.response.data);

            const apiError = error.response.data as { message?: string; success?: boolean };

            toast.error(`Branch ${action} failed`, {
                description: apiError.message || "An unknown error occurred.",
            });
        } else if (typeof error === "object" && error !== null && "message" in error) {
            const errorObj = error as { message: string; success?: boolean };

            toast.error(`Branch ${action} failed`, {
                description: errorObj.message || "An unknown error occurred.",
            });
        } else {
            toast.error(`Branch ${action} failed`, {
                description: "An unexpected error occurred.",
            });
        }
        console.error("Error details:", error);
    };


    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleUpdate = async () => {
        setLoading(true);
        try {
            // Ensure we're sending only the fields defined in UpdateBranchInput
            const updateData: UpdateBranchInput = {
                branchId: formData.branchId,
                name: formData.name,
                location: formData.location,
                contactNumber: formData.contactNumber,
                servicesOffered: formData.servicesOffered,
                branchEmail: formData.branchEmail,
                isActive: formData.isActive,
                openingHours: formData.openingHours,
                managerId: formData.managerId,
            };

            const response = (await branchApi.updateBranch(updateData) as ApiResponse);
            if (response.success) {
                toast.success("Branch updated successfully!");
                router.push("/admin/branches");
            } else {
                toast.error("Failed to update branch", {
                    description: response.message,
                });
            }
        } catch (error) {
            handleError(error, "updating");
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <Spinner/>;

    return (
        <div className="p-6 space-y-6">
            <h1 className="text-2xl font-semibold">Edit Branch</h1>
            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium">Branch Name</label>
                    <Input
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="Enter branch name"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium">Location</label>
                    <Input
                        name="location"
                        value={formData.location}
                        onChange={handleInputChange}
                        placeholder="Enter branch location"
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
                                servicesOffered: e.target.value.split(",").map((item) => item.trim()),
                            }))
                        }
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium">Email</label>
                    <Input
                        name="branchEmail"
                        value={formData.branchEmail}
                        onChange={handleInputChange}
                        placeholder="Enter branch email"
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
                    <Button variant="outline" onClick={() => router.push("/admin/branches")}>
                        Cancel
                    </Button>
                    <Button onClick={handleUpdate} className="flex items-center gap-2">
                        <FaSave/> Save Changes
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default EditBranchPage;