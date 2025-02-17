import React from "react";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ExteriorCheck } from "@/types";

type CheckStatus =
  | "CHECKED_OK"
  | "REQUIRES_FUTURE_ATTENTION"
  | "REQUIRES_IMMEDIATE_ATTENTION";

const STATUS_OPTIONS = [
  { label: "Good", value: "CHECKED_OK" },
  { label: "Attention Soon", value: "REQUIRES_FUTURE_ATTENTION" },
  { label: "Immediate Repair", value: "REQUIRES_IMMEDIATE_ATTENTION" },
];

interface ExteriorCheckFormProps {
  data: ExteriorCheck;
  onChange: (field: string, value: CheckStatus) => void;
}

const ExteriorCheckForm: React.FC<ExteriorCheckFormProps> = ({
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
          Exterior Check
        </h2>

        {/* Front Exterior Section */}
        <div className="border border-gray-300 rounded-lg p-2 shadow-md bg-white">
          <h3 className="text-sm font-semibold mb-1.5">Front Exterior</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-1.5">
            {renderCheck("Windshield", "front.windshield")}
            {renderCheck("Washer System", "front.washerSystem")}
            {renderCheck("Wiper Arm", "front.wiperArm")}
            {renderCheck("Fog Lamp", "front.fogLamp")}
            {renderCheck("Indicator Lights", "front.indicator")}
            {renderCheck("Hazard Lights", "front.hazardLight")}
            {renderCheck("Daytime Running Lights", "front.drl")}
            {renderCheck("High Beam", "front.headlights.hiBeam")}
            {renderCheck("Low Beam", "front.headlights.loBeam")}
          </div>
        </div>

        {/* Rear Exterior Section */}
        <div className="border border-gray-300 rounded-lg p-2 shadow-md bg-white">
          <h3 className="text-sm font-semibold mb-1.5">Rear Exterior</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-1.5">
            {renderCheck("Brake Light", "rear.brakeLight")}
            {renderCheck("Rear Indicator", "rear.indicator")}
            {renderCheck("Hazard Light", "rear.hazardLight")}
            {renderCheck("Reverse Light", "rear.reverseLight")}
            {renderCheck("Rear Washer System", "rear.washerSystem")}
            {renderCheck("Rear Wiper Arm", "rear.wiperArm")}
            {renderCheck("License Plate Light", "rear.regPlateLamp")}
            {renderCheck("Top Brake Light", "rear.topBrakeLight")}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExteriorCheckForm;
