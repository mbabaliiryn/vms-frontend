"use client";

import React, { useState, useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { authApi, vehicleApi, garageApi } from "@/app/api";
import { Vehicle, Garage, User } from "@/types";
import axios from "axios";
import Spinner from "@/components/Spinner/Spinner";

interface ApiResponse {
  success: boolean;
  message: string;
  data: Vehicle[] | Garage[] | User[];
}

interface BasicInfoFormProps {
  data: {
    vehicleId: string;
    garageId: string;
    inspectorId: string;
    lastInspectionDate?: string;
  };
  onChange: (field: string, value: string) => void;
}

const BasicInfoForm: React.FC<BasicInfoFormProps> = ({ data, onChange }) => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [garages, setBranches] = useState<Garage[]>([]);
  const [inspectors, setInspectors] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [vehicleRes, garageRes, inspectorRes] = await Promise.all([
          (await vehicleApi.getVehicles()) as Promise<ApiResponse>,
          (await garageApi.getGarages()) as Promise<ApiResponse>,
          (await authApi.getUsers()) as Promise<ApiResponse>,
        ]);

        if (vehicleRes.success) setVehicles(vehicleRes.data as Vehicle[]);
        if (garageRes.success) setBranches(garageRes.data as Garage[]);
        if (inspectorRes.success) setInspectors(inspectorRes.data as User[]);
      } catch (err) {
        if (axios.isAxiosError(err)) {
          toast.error("Error loading data", {
            description:
              err.response?.data?.message || "Failed to load required data.",
          });
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="space-y-4">
      {loading ? (
        <Spinner />
      ) : (
        <>
          {/* Vehicle Select */}
          <div>
            <Label>Vehicle</Label>
            <Select
              value={data.vehicleId}
              onValueChange={(value) => onChange("vehicleId", value)}
              disabled={loading}
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

          {/* Garage Select */}
          <div>
            <Label>Garage</Label>
            <Select
              value={data.garageId}
              onValueChange={(value) => onChange("garageId", value)}
              disabled={loading}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a garage" />
              </SelectTrigger>
              <SelectContent>
                {garages.map((garage) => (
                  <SelectItem key={garage.id} value={garage.id}>
                    {garage.name} - {garage.location}
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
              disabled={loading}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select an inspector" />
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

          {/* Last Inspection Date */}
          <div>
            <Label>Last Inspection Date (Leave empty if none)</Label>
            <Input
              type="date"
              value={data.lastInspectionDate}
              onChange={(e) => onChange("lastInspectionDate", e.target.value)}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default BasicInfoForm;
