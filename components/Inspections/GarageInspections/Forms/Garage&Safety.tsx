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
  // Improved radio group with compact layout
  const renderCompactRadioGroup = (
    section: string,
    field: string,
    label: string,
    value: boolean
  ) => (
    <div key={field} className="flex items-center justify-between py-2">
      <Label className="text-sm font-medium w-2/5">{label}</Label>
      <RadioGroup
        value={value ? "yes" : "no"}
        onValueChange={(val) => onChange(`${section}.${field}`, val === "yes")}
        className="flex gap-4 w-3/5"
      >
        <div className="flex items-center gap-2">
          <RadioGroupItem value="yes" id={`${field}-yes`} className="h-4 w-4" />
          <Label htmlFor={`${field}-yes`} className="text-sm">
            Yes
          </Label>
        </div>
        <div className="flex items-center gap-2">
          <RadioGroupItem value="no" id={`${field}-no`} className="h-4 w-4" />
          <Label htmlFor={`${field}-no`} className="text-sm">
            No
          </Label>
        </div>
      </RadioGroup>
    </div>
  );

  return (
    <div className="space-y-4 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Both sections in a compact grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
        {/* Garage Facilities */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold pb-2">Garage Facilities</h2>
          <div className="space-y-3">
            {[
              { label: "Office", field: "office" },
              { label: "Working Shade", field: "workingShade" },
              {
                label: "Spare Part & Equipment Store",
                field: "sparePartEquipmentStore",
              },
              { label: "Parking Area", field: "parkingArea" },
              { label: "Customer Waiting Area", field: "customerWaitingArea" },
            ].map(({ label, field }) =>
              renderCompactRadioGroup(
                "garageFacilities",
                field,
                label,
                Boolean(
                  data.garageFacilities[
                    field as keyof typeof data.garageFacilities
                  ]
                )
              )
            )}
            <div>
              <Label className="text-sm font-medium">Other Facilities</Label>
              <Input
                type="text"
                placeholder="If any..."
                value={data.garageFacilities.otherFacilities}
                onChange={(e) =>
                  onChange("garageFacilities.otherFacilities", e.target.value)
                }
                className="mt-2 h-8 text-sm py-2 w-full"
              />
            </div>
          </div>
        </div>

        {/* Safety & Health */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold pb-2">Safety & Health</h2>
          <div className="space-y-3">
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
            ].map(({ label, field }) =>
              renderCompactRadioGroup(
                "safetyAndHealth",
                field,
                label,
                Boolean(
                  data.safetyAndHealth[
                    field as keyof typeof data.safetyAndHealth
                  ]
                )
              )
            )}
            <div>
              <Label className="text-sm font-medium">
                Other Safety Measures
              </Label>
              <Input
                type="text"
                placeholder="If any..."
                value={data.safetyAndHealth.otherSafetyMeasures}
                onChange={(e) =>
                  onChange(
                    "safetyAndHealth.otherSafetyMeasures",
                    e.target.value
                  )
                }
                className="mt-2 h-8 text-sm py-2 w-full"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GarageFacilitiesSafetyForm;
