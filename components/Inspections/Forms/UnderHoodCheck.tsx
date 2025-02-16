"use client";

import React from "react";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

type CheckStatus =
  | "CHECKED_OK"
  | "REQUIRES_FUTURE_ATTENTION"
  | "REQUIRES_IMMEDIATE_ATTENTION";

const STATUS_OPTIONS = [
  { label: "Good Condition", value: "CHECKED_OK" },
  { label: "Needs Attention Soon", value: "REQUIRES_FUTURE_ATTENTION" },
  { label: "Needs Immediate Repair", value: "REQUIRES_IMMEDIATE_ATTENTION" },
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
    <div className="space-y-4 p-4 rounded-lg border border-gray-300 shadow-sm hover:shadow-md transition-all">
      <Label className="font-semibold text-lg">{label}</Label>
      <RadioGroup
        className="grid grid-cols-1 sm:grid-cols-2 gap-4"
        value={data[field]}
        onValueChange={(value) => onChange(field, value as CheckStatus)}
      >
        {STATUS_OPTIONS.map((option) => (
          <div key={option.value} className="flex items-center space-x-2">
            <RadioGroupItem
              value={option.value}
              id={`${field}-${option.value}`}
              className="hover:ring-2 hover:ring-gray-500 transition"
            />
            <Label htmlFor={`${field}-${option.value}`} className="text-sm">
              {option.label}
            </Label>
          </div>
        ))}
      </RadioGroup>
    </div>
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <h2 className="text-2xl font-bold text-gray-900">Under Hood Check</h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Under Hood Left Column */}
        <div className="space-y-6">
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
        </div>

        {/* Under Hood Right Column */}
        <div className="space-y-6">
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
