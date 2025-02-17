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

interface BrakeComponentCheck {
  pads: CheckStatus;
  rotor: CheckStatus;
  caliper: CheckStatus;
  linesDucts: CheckStatus;
}

interface TireComponentCheck {
  sidewallHealth: CheckStatus;
  treadHealth: CheckStatus;
}

interface VehicleCheck {
  brakes: {
    frontLeft: BrakeComponentCheck;
    frontRight: BrakeComponentCheck;
    rearLeft: BrakeComponentCheck;
    rearRight: BrakeComponentCheck;
  };
  tires: {
    frontLeft: TireComponentCheck;
    frontRight: TireComponentCheck;
    rearLeft: TireComponentCheck;
    rearRight: TireComponentCheck;
    spare: TireComponentCheck;
    parkingBrakeOperation: CheckStatus;
  };
  systemChecks: {
    serviceMessage: CheckStatus;
    engineOil: CheckStatus;
  };
}

interface VehicleInspectionFormProps {
  data: VehicleCheck;
  onChange: (field: string, value: CheckStatus) => void;
}

const BrakesTiresSystemForm: React.FC<VehicleInspectionFormProps> = ({
  data,
  onChange,
}) => {
  const renderCheck = (label: string, field: string, value: CheckStatus) => (
    <div className="p-1.5 rounded-md border border-gray-300 shadow-sm hover:shadow-md transition-all">
      <Label className="font-medium text-xs block truncate">{label}</Label>
      <RadioGroup
        className="flex gap-1 mt-0.5"
        value={value}
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

  const renderBrakeCheck = (
    label: string,
    field: string,
    check: BrakeComponentCheck
  ) => (
    <>
      {Object.keys(check).map((key) =>
        renderCheck(
          `${label} - ${key.charAt(0).toUpperCase() + key.slice(1)}`,
          `${field}.${key}`,
          check[key as keyof BrakeComponentCheck]
        )
      )}
    </>
  );

  const renderTireCheck = (
    label: string,
    field: string,
    check: TireComponentCheck
  ) => (
    <>
      {Object.keys(check).map((key) =>
        renderCheck(
          `${label} - ${key.charAt(0).toUpperCase() + key.slice(1)}`,
          `${field}.${key}`,
          check[key as keyof TireComponentCheck]
        )
      )}
    </>
  );

  return (
    <div className="overflow-y-auto space-y-6 px-1">
      {/* Brakes Section */}
      <section>
        <h2 className="text-sm font-bold sticky top-0 bg-white py-1">
          Brakes Check
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-1.5">
          {renderBrakeCheck(
            "Front Left Brake",
            "brakes.frontLeft",
            data.brakes.frontLeft
          )}
          {renderBrakeCheck(
            "Front Right Brake",
            "brakes.frontRight",
            data.brakes.frontRight
          )}
          {renderBrakeCheck(
            "Rear Left Brake",
            "brakes.rearLeft",
            data.brakes.rearLeft
          )}
          {renderBrakeCheck(
            "Rear Right Brake",
            "brakes.rearRight",
            data.brakes.rearRight
          )}
        </div>
      </section>

      {/* Tires Section */}
      <section>
        <h2 className="text-sm font-bold sticky top-0 bg-white py-1">
          Tires Check
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-1.5">
          {renderTireCheck(
            "Front Left Tire",
            "tires.frontLeft",
            data.tires.frontLeft
          )}
          {renderTireCheck(
            "Front Right Tire",
            "tires.frontRight",
            data.tires.frontRight
          )}
          {renderTireCheck(
            "Rear Left Tire",
            "tires.rearLeft",
            data.tires.rearLeft
          )}
          {renderTireCheck(
            "Rear Right Tire",
            "tires.rearRight",
            data.tires.rearRight
          )}
          {renderTireCheck("Spare Tire", "tires.spare", data.tires.spare)}
          {renderCheck(
            "Parking Brake",
            "tires.parkingBrakeOperation",
            data.tires.parkingBrakeOperation
          )}
        </div>
      </section>

      {/* Systems Section */}
      <section>
        <h2 className="text-sm font-bold sticky top-0 bg-white py-1">
          System Checks
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-1.5">
          {renderCheck(
            "Service Message",
            "systemChecks.serviceMessage",
            data.systemChecks.serviceMessage
          )}
          {renderCheck(
            "Engine Oil",
            "systemChecks.engineOil",
            data.systemChecks.engineOil
          )}
        </div>
      </section>
    </div>
  );
};

export default BrakesTiresSystemForm;
