"use client";

import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface StatutoryLocationFormProps {
  data: {
    statutoryRequirements: {
      certificateOfIncorporation: boolean;
      tinCertificate: boolean;
      tradingLicense: boolean;
      otherDocuments: string;
    };
    locationPremises: {
      signpost: boolean;
      clearAccessRoad: boolean;
      garageLayout: "Good" | "Bad";
    };
  };
  onChange: (field: string, value: string | boolean) => void;
}

const StatutoryLocationForm: React.FC<StatutoryLocationFormProps> = ({
  data,
  onChange,
}) => {
  return (
    <div className="space-y-6">
      {/* Statutory Requirements */}
      <div>
        <h2 className="text-lg font-semibold">Statutory Requirements</h2>
        <div className="space-y-4 mt-2">
          {[
            {
              label: "Certificate of Incorporation",
              field: "certificateOfIncorporation",
            },
            { label: "TIN Certificate", field: "tinCertificate" },
            { label: "Trading License", field: "tradingLicense" },
          ].map(({ label, field }) => (
            <div key={field}>
              <Label>{label}</Label>
              <RadioGroup
                value={
                  data.statutoryRequirements[
                    field as keyof typeof data.statutoryRequirements
                  ]
                    ? "yes"
                    : "no"
                }
                onValueChange={(value) =>
                  onChange(`statutoryRequirements.${field}`, value === "yes")
                }
                className="flex gap-4"
              >
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="yes" id={`${field}-yes`} />
                  <Label htmlFor={`${field}-yes`}>Yes</Label>
                </div>
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="no" id={`${field}-no`} />
                  <Label htmlFor={`${field}-no`}>No</Label>
                </div>
              </RadioGroup>
            </div>
          ))}

          <div>
            <Label>Other Documents (if any)</Label>
            <Input
              type="text"
              placeholder="Enter other documents..."
              value={data.statutoryRequirements.otherDocuments}
              onChange={(e) =>
                onChange("statutoryRequirements.otherDocuments", e.target.value)
              }
            />
          </div>
        </div>
      </div>

      {/* Location & Premises */}
      <div>
        <h2 className="text-lg font-semibold">Location & Premises</h2>
        <div className="space-y-4 mt-2">
          {[
            { label: "Visible Signpost", field: "signpost" },
            { label: "Clear Access Road", field: "clearAccessRoad" },
          ].map(({ label, field }) => (
            <div key={field}>
              <Label>{label}</Label>
              <RadioGroup
                value={
                  data.locationPremises[
                    field as keyof typeof data.locationPremises
                  ]
                    ? "yes"
                    : "no"
                }
                onValueChange={(value) =>
                  onChange(`locationPremises.${field}`, value === "yes")
                }
                className="flex gap-4"
              >
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="yes" id={`${field}-yes`} />
                  <Label htmlFor={`${field}-yes`}>Yes</Label>
                </div>
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="no" id={`${field}-no`} />
                  <Label htmlFor={`${field}-no`}>No</Label>
                </div>
              </RadioGroup>
            </div>
          ))}

          <div>
            <Label>Garage Layout</Label>
            <Select
              value={data.locationPremises.garageLayout}
              onValueChange={(value) =>
                onChange("locationPremises.garageLayout", value)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select garage layout" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Good">Good</SelectItem>
                <SelectItem value="Bad">Bad</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatutoryLocationForm;
