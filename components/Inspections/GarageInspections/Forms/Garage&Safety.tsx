"use client";

import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface GarageFacilitiesSafetyFormProps {
  data: {
    garageFacilities: {
      office: boolean;
      workingShade: boolean;
      sparePartEquipmentStore: boolean;
      parkingArea: boolean;
      customerWaitingArea: boolean;
      otherFacilities: string;
    };
    safetyAndHealth: {
      internalTalkingSignages: boolean;
      assortedWasteBins: boolean;
      fireExtinguishers: boolean;
      emergencyExit: boolean;
      staffProtectiveGear: boolean;
      safetyBoots: boolean;
      cleanToilets: boolean;
      femaleStaffProvisions: boolean;
      otherSafetyMeasures: string;
    };
  };
  onChange: (field: string, value: boolean | string) => void;
}

const GarageFacilitiesSafetyForm: React.FC<GarageFacilitiesSafetyFormProps> = ({
  data,
  onChange,
}) => {
  return (
    <div className="space-y-6">
      {/* Garage Facilities */}
      <div>
        <h2 className="text-lg font-semibold">Garage Facilities</h2>
        <div className="space-y-4 mt-2">
          {[
            { label: "Office", field: "office" },
            { label: "Working Shade", field: "workingShade" },
            {
              label: "Spare Part & Equipment Store",
              field: "sparePartEquipmentStore",
            },
            { label: "Parking Area", field: "parkingArea" },
            { label: "Customer Waiting Area", field: "customerWaitingArea" },
          ].map(({ label, field }) => (
            <div key={field}>
              <Label>{label}</Label>
              <RadioGroup
                value={
                  data.garageFacilities[
                    field as keyof typeof data.garageFacilities
                  ]
                    ? "yes"
                    : "no"
                }
                onValueChange={(value) =>
                  onChange(`garageFacilities.${field}`, value === "yes")
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
            <Label>Other Facilities (if any)</Label>
            <Input
              type="text"
              placeholder="Enter other facilities..."
              value={data.garageFacilities.otherFacilities}
              onChange={(e) =>
                onChange("garageFacilities.otherFacilities", e.target.value)
              }
            />
          </div>
        </div>
      </div>

      {/* Safety & Health */}
      <div>
        <h2 className="text-lg font-semibold">Safety & Health</h2>
        <div className="space-y-4 mt-2">
          {[
            {
              label: "Internal Talking Signages",
              field: "internalTalkingSignages",
            },
            { label: "Assorted Waste Bins", field: "assortedWasteBins" },
            { label: "Fire Extinguishers", field: "fireExtinguishers" },
            { label: "Emergency Exit", field: "emergencyExit" },
            { label: "Staff Protective Gear", field: "staffProtectiveGear" },
            { label: "Safety Boots", field: "safetyBoots" },
            { label: "Clean Toilets", field: "cleanToilets" },
            {
              label: "Female Staff Provisions",
              field: "femaleStaffProvisions",
            },
          ].map(({ label, field }) => (
            <div key={field}>
              <Label>{label}</Label>
              <RadioGroup
                value={
                  data.safetyAndHealth[
                    field as keyof typeof data.safetyAndHealth
                  ]
                    ? "yes"
                    : "no"
                }
                onValueChange={(value) =>
                  onChange(`safetyAndHealth.${field}`, value === "yes")
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
            <Label>Other Safety Measures (if any)</Label>
            <Input
              type="text"
              placeholder="Enter other safety measures..."
              value={data.safetyAndHealth.otherSafetyMeasures}
              onChange={(e) =>
                onChange("safetyAndHealth.otherSafetyMeasures", e.target.value)
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default GarageFacilitiesSafetyForm;
