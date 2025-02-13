"use client";

import React, {useState, useEffect} from "react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {Label} from "@/components/ui/label";
import {Textarea} from "@/components/ui/textarea";
import {toast} from "sonner";
import {authApi, vehicleApi, branchApi} from "@/app/api";
import {Vehicle, Branch, User} from "@/types";
import axios from "axios";

interface ApiResponse {
    success: boolean;
    message: string;
    data: Vehicle[] | Branch[] | User[];
}

interface BasicInfoFormProps {
    data: {
        vehicleId: string;
        branchId: string;
        inspectorId: string;
        signature: string;
    };
    onChange: (field: string, value: string) => void;
}

const BasicInfoForm: React.FC<BasicInfoFormProps> = ({data, onChange}) => {
    const [vehicles, setVehicles] = useState<Vehicle[]>([]);
    const [branches, setBranches] = useState<Branch[]>([]);
    const [inspectors, setInspectors] = useState<User[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [vehicleRes, branchRes, inspectorRes] = await Promise.all([
                    await vehicleApi.getVehicles() as Promise<ApiResponse>,
                    await branchApi.getBranches() as Promise<ApiResponse>,
                    await authApi.getUsers() as Promise<ApiResponse>,
                ]);

                if (vehicleRes.success) setVehicles(vehicleRes.data as Vehicle[]);
                if (branchRes.success) setBranches(branchRes.data as Branch[]);
                if (inspectorRes.success) setInspectors(inspectorRes.data as User[]);
            } catch (err) {
                if (axios.isAxiosError(err)) {
                    toast.error("Error loading data", {
                        description: err.response?.data?.message || "Failed to load required data.",
                    });
                }
            }
        };
        fetchData();
    }, []);

    return (
        <div className="space-y-4">
            {/* Vehicle Select */}
            <div>
                <Label>Vehicle</Label>
                <Select
                    value={data.vehicleId}
                    onValueChange={(value) => onChange("vehicleId", value)}
                >
                    <SelectTrigger>
                        <SelectValue placeholder="Select a vehicle"/>
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

            {/* Branch Select */}
            <div>
                <Label>Branch</Label>
                <Select
                    value={data.branchId}
                    onValueChange={(value) => onChange("branchId", value)}
                >
                    <SelectTrigger>
                        <SelectValue placeholder="Select a branch"/>
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

            {/* Inspector Select */}
            <div>
                <Label>Inspector</Label>
                <Select
                    value={data.inspectorId}
                    onValueChange={(value) => onChange("inspectorId", value)}
                >
                    <SelectTrigger>
                        <SelectValue placeholder="Select an inspector"/>
                    </SelectTrigger>
                    <SelectContent>
                        {inspectors.map((inspector) => (
                            <SelectItem key={inspector.id} value={inspector.id}>
                                {inspector.firstName} {inspector.lastName}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            {/* Signature */}
            <div>
                <Label>Signature</Label>
                <Textarea
                    value={data.signature}
                    placeholder="Inspector's signature"
                    onChange={(e) => onChange("signature", e.target.value)}
                />
            </div>
        </div>
    );
};

export default BasicInfoForm;
