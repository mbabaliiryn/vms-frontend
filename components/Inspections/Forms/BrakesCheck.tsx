"use client";

import React from "react";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { BrakesCheck } from "@/types";

type CheckStatus =
  | "CHECKED_OK"
  | "REQUIRES_FUTURE_ATTENTION"
  | "REQUIRES_IMMEDIATE_ATTENTION";

const STATUS_OPTIONS = [
  { label: "Good Condition", value: "CHECKED_OK" },
  { label: "Needs Attention Soon", value: "REQUIRES_FUTURE_ATTENTION" },
  { label: "Needs Immediate Repair", value: "REQUIRES_IMMEDIATE_ATTENTION" },
];

interface BrakesCheckFormProps {
  data: BrakesCheck;
  onChange: (field: string, value: CheckStatus) => void;
}

const BrakesCheckForm: React.FC<BrakesCheckFormProps> = ({
  data,
  onChange,
}) => {
  const renderComponentCheck = (title: string, field: string) => (
    <div className="space-y-4 p-4 border border-gray-300 rounded-lg shadow-sm hover:shadow-md transition">
      <Label className="font-semibold text-lg">{title}</Label>
      <RadioGroup
        className="grid grid-cols-1 sm:grid-cols-3 gap-4"
        value={data[field]}
        onValueChange={(value) => onChange(field, value as CheckStatus)}
      >
        {STATUS_OPTIONS.map((option) => (
          <div key={option.value} className="flex items-center space-x-2">
            <RadioGroupItem
              value={option.value}
              id={`${field}-${option.value}`}
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
      <h2 className="text-2xl font-bold text-gray-900">Brakes Check</h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          {renderComponentCheck("Front Left Brake", "brakes.frontLeft")}
          {renderComponentCheck("Front Right Brake", "brakes.frontRight")}
        </div>
        <div className="space-y-6">
          {renderComponentCheck("Rear Left Brake", "brakes.rearLeft")}
          {renderComponentCheck("Rear Right Brake", "brakes.rearRight")}
        </div>
      </div>
    </div>
  );
};

export default BrakesCheckForm;
