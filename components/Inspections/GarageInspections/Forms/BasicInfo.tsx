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
import { garageApi } from "@/app/api";
import { Garage } from "@/types";
import axios from "axios";
import Spinner from "@/components/Spinner/Spinner";
import { useAuth } from "@/hooks/useAuth";

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T[];
}

interface BasicInfoFormProps {
  data: {
    garageId: string;
    inspectorId: string;
    lastInspectionDate?: Date;
  };
  onChange: (field: string, value: string) => void;
}

const BasicInfoForm: React.FC<BasicInfoFormProps> = ({ data, onChange }) => {
  const [garages, setGarages] = useState<Garage[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchGarages = async () => {
      try {
        const garageRes = (await garageApi.getGarages()) as ApiResponse<Garage>;

        if (garageRes.success) setGarages(garageRes.data);
      } catch (err) {
        if (axios.isAxiosError(err)) {
          toast.error("Error loading garages", {
            description:
              err.response?.data?.message || "Failed to load required data.",
          });
        }
      } finally {
        setLoading(false);
      }
    };

    fetchGarages();
  }, []);

  useEffect(() => {
    if (user?.id && !data.inspectorId) {
      onChange("inspectorId", user.id);
    }
  }, [user, data.inspectorId, onChange]);

  return (
    <div className="space-y-4">
      {loading ? (
        <Spinner />
      ) : (
        <>
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

          {/* Last Inspection Date */}
          <div>
            <Label>Last Inspection Date (Optional)</Label>
            <Input
              type="date"
              value={
                data.lastInspectionDate
                  ? data.lastInspectionDate.toISOString().split("T")[0]
                  : ""
              }
              onChange={(e) => onChange("lastInspectionDate", e.target.value)}
            />
          </div>

          {/* Hidden Inspector ID */}
          <input type="hidden" value={user?.id} />
        </>
      )}
    </div>
  );
};

export default BasicInfoForm;
