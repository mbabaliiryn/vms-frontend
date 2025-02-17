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

interface Combined {
  fluids: {
    coolantLevel: CheckStatus;
    clutchHydraulicFluid: CheckStatus;
    differentialTransferCase: CheckStatus;
    oilLevel: CheckStatus;
  };
  undercarriage: {
    shocksLeakageDamage: CheckStatus;
    bushings: CheckStatus;
    cvAxleBoots: CheckStatus;
    brakeInspection: CheckStatus;
    exhaustSystem: CheckStatus;
    steeringComponents: CheckStatus;
    ballJoints: CheckStatus;
    stabilizerLinks: CheckStatus;
  };
}

interface CombinedCheckFormProps {
  data: Combined;
  onChange: (field: string, value: CheckStatus) => void;
}

const CombinedFluidsUndercarriageForm: React.FC<CombinedCheckFormProps> = ({
  data,
  onChange,
}) => {
  const renderCheck = (label: string, field: string) => (
    <div className="border rounded-md p-1.5 bg-gray-50 shadow-sm">
      <Label className="text-sm">{label}</Label>
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
              className="size-3"
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
      <div className="space-y-4">
        <h2 className="text-base font-bold sticky top-0 bg-white py-2">
          Fluids & Undercarriage Check
        </h2>

        {/* Fluids Check Section */}
        <div className="border border-gray-300 rounded-lg p-2 shadow-md bg-white">
          <h3 className="text-sm font-semibold mb-1.5">Fluids Check</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-1.5">
            {renderCheck("Coolant Level", "fluids.coolantLevel")}
            {renderCheck(
              "Clutch Hydraulic Fluid",
              "fluids.clutchHydraulicFluid"
            )}
            {renderCheck(
              "Differential/Transfer Case Fluid",
              "fluids.differentialTransferCase"
            )}
            {renderCheck("Oil Level", "fluids.oilLevel")}
          </div>
        </div>

        {/* Undercarriage Check Section */}
        <div className="border border-gray-300 rounded-lg p-2 shadow-md bg-white">
          <h3 className="text-sm font-semibold mb-1.5">Undercarriage Check</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-1.5">
            {renderCheck("Shocks (Leakage & Damage)", "shocksLeakageDamage")}
            {renderCheck("Bushings", "bushings")}
            {renderCheck("CV Axle Boots", "cvAxleBoots")}
            {renderCheck("Brake Inspection", "brakeInspection")}
            {renderCheck("Exhaust System", "exhaustSystem")}
            {renderCheck("Steering Components", "steeringComponents")}
            {renderCheck("Ball Joints", "ballJoints")}
            {renderCheck("Stabilizer Links", "stabilizerLinks")}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CombinedFluidsUndercarriageForm;
