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

interface UndercarriageCheckFormProps {
  data: Record<string, CheckStatus>;
  onChange: (field: string, value: CheckStatus) => void;
}

const UndercarriageCheckForm: React.FC<UndercarriageCheckFormProps> = ({
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
      <h2 className="text-2xl font-bold text-gray-900">Undercarriage Check</h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Undercarriage Left Column */}
        <div className="space-y-6">
          {renderCheck("Shocks (Leakage & Damage)", "shocksLeakageDamage")}
          {renderCheck("Bushings", "bushings")}
          {renderCheck("CV Axle Boots", "cvAxleBoots")}
          {renderCheck("Brake Inspection", "brakeInspection")}
        </div>

        {/* Undercarriage Right Column */}
        <div className="space-y-6">
          {renderCheck("Exhaust System", "exhaustSystem")}
          {renderCheck("Steering Components", "steeringComponents")}
          {renderCheck("Ball Joints", "ballJoints")}
          {renderCheck("Stabilizer Links", "stabilizerLinks")}
        </div>
      </div>
    </div>
  );
};

export default UndercarriageCheckForm;
