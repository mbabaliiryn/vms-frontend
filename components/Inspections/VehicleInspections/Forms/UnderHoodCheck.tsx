"use client";

import React from "react";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

type CheckStatus =
  | "CHECKED_OK"
  | "REQUIRES_FUTURE_ATTENTION"
  | "REQUIRES_IMMEDIATE_ATTENTION";

const STATUS_OPTIONS = [
  { label: "Good", value: "CHECKED_OK" },
  { label: "Attention Soon", value: "REQUIRES_FUTURE_ATTENTION" },
  { label: "Immediate Repair", value: "REQUIRES_IMMEDIATE_ATTENTION" },
];

interface UnderHoodCheckFormProps {
  data: Record<string, CheckStatus>;
  onChange: (field: string, value: CheckStatus) => void;
}

const UnderHoodCheckForm: React.FC<UnderHoodCheckFormProps> = ({
  data,
  onChange,
}) => {
  const renderCheck = (label: string, field: string) => (
    <div className="p-1.5 rounded-md border border-gray-300 shadow-sm hover:shadow-md transition-all">
      <Label className="font-medium text-xs block truncate" title={label}>
        {label}
      </Label>
      <RadioGroup
        className="flex gap-1 mt-0.5"
        value={data[field]}
        onValueChange={(value) => onChange(field, value as CheckStatus)}
      >
        {STATUS_OPTIONS.map((option) => (
          <div key={option.value} className="flex items-center gap-0.5">
            <RadioGroupItem
              value={option.value}
              id={`${field}-${option.value}`}
              className="size-3 hover:ring-1 hover:ring-gray-500 transition"
            />
            <Label htmlFor={`${field}-${option.value}`} className="text-xs">
              {option.label}
            </Label>
          </div>
        ))}
      </RadioGroup>
    </div>
  );

  return (
    <div className="overflow-y-auto px-1">
      <div className="space-y-3">
        <h2 className="text-sm font-bold sticky top-0 bg-white py-1">
          Under Hood Check
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-1.5">
          {renderCheck(
            "Radiator Hoses & Clamps",
            "underHood.radiatorHosesClamps"
          )}
          {renderCheck(
            "Battery Terminals & Cables",
            "underHood.batteryTerminalsCables"
          )}
          {renderCheck("Horn", "underHood.horn")}
          {renderCheck("Drive Belt", "underHood.driveBelt")}
          {renderCheck("Air Filter", "underHood.airFilter")}
          {renderCheck("Transmission Fluid", "underHood.transmissionFluid")}
          {renderCheck("Brake Fluid", "underHood.brakeFluid")}
          {renderCheck("Power Steering Fluid", "underHood.powerSteeringFluid")}
          {renderCheck("Heater Hoses & Clamps", "underHood.heaterHosesClamps")}
          {renderCheck(
            "Ignition Coils & Wires",
            "underHood.ignitionCoilsWires"
          )}
          {renderCheck(
            "Vacuum Pump Condition",
            "underHood.vacuumPumpCondition"
          )}
          {renderCheck("EGR System", "underHood.egrSystem")}
          {renderCheck("PCV System", "underHood.pcvSystem")}
          {renderCheck(
            "Diesel System Inspection",
            "underHood.dieselSystemInspection"
          )}
        </div>
      </div>
    </div>
  );
};

export default UnderHoodCheckForm;
