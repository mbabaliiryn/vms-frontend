"use client";

import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface GarageSecurityToolsFormProps {
  data: {
    garageSecurity: {
      fencedPremises: boolean;
      securedGate: boolean;
      securityMeasures: {
        cameras: boolean;
        dogs: boolean;
        guard: boolean;
        otherSecurityMeasures: string;
      };
    };
    toolsAndEquipment: {
      basicHandToolBoxes: boolean;
      servicePitHoist: boolean;
      carStands: boolean;
      carSprayingBooth: boolean;
      otherTools: string[];
    };
    otherRemarks: string;
  };
  onChange: (field: string, value: string | boolean | string[]) => void;
}

const GarageSecurityToolsForm: React.FC<GarageSecurityToolsFormProps> = ({
  data,
  onChange,
}) => {
  const renderRadioButtons = (
    parentKey: string,
    field: string,
    value: boolean
  ) => (
    <RadioGroup
      value={value ? "yes" : "no"}
      onValueChange={(val) => onChange(`${parentKey}.${field}`, val === "yes")}
      className="flex gap-2"
    >
      <div className="flex items-center gap-1">
        <RadioGroupItem value="yes" id={`${field}-yes`} className="h-4 w-4" />
        <Label htmlFor={`${field}-yes`} className="text-sm">
          Yes
        </Label>
      </div>
      <div className="flex items-center gap-1">
        <RadioGroupItem value="no" id={`${field}-no`} className="h-4 w-4" />
        <Label htmlFor={`${field}-no`} className="text-sm">
          No
        </Label>
      </div>
    </RadioGroup>
  );

  return (
    <div className="space-y-4">
      {/* Garage Security */}
      <div>
        <h2 className="text-base font-semibold border-b pb-1 mb-3">
          Garage Security
        </h2>

        <div className="grid grid-cols-2 gap-x-4 gap-y-3">
          {/* Column 1: Premises Security */}
          <div className="space-y-3">
            {/* Fenced & Gate controls in a 2-column grid */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="font-medium text-sm mb-1 block">
                  Fenced Premises
                </Label>
                {renderRadioButtons(
                  "garageSecurity",
                  "fencedPremises",
                  Boolean(data.garageSecurity.fencedPremises)
                )}
              </div>

              <div>
                <Label className="font-medium text-sm mb-1 block">
                  Secured Gate
                </Label>
                {renderRadioButtons(
                  "garageSecurity",
                  "securedGate",
                  Boolean(data.garageSecurity.securedGate)
                )}
              </div>
            </div>

            {/* Other Security Measures Input */}
            <div>
              <Label className="font-medium text-sm mb-1 block">
                Other Security Measures
              </Label>
              <Input
                type="text"
                placeholder="Specify..."
                className="h-7 text-sm"
                value={
                  data.garageSecurity.securityMeasures.otherSecurityMeasures
                }
                onChange={(e) =>
                  onChange(
                    "garageSecurity.securityMeasures.otherSecurityMeasures",
                    e.target.value
                  )
                }
              />
            </div>
          </div>

          {/* Column 2: Security Measures */}
          <div>
            <Label className="font-medium text-sm mb-1 block">
              Security Measures
            </Label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { label: "Cameras", field: "cameras" },
                { label: "Dogs", field: "dogs" },
                { label: "Guard", field: "guard" },
              ].map(({ label, field }) => (
                <div key={field}>
                  <Label className="text-sm block mb-1">{label}</Label>
                  {renderRadioButtons(
                    "garageSecurity.securityMeasures",
                    field,
                    Boolean(
                      data.garageSecurity.securityMeasures[
                        field as keyof typeof data.garageSecurity.securityMeasures
                      ]
                    )
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Tools and Equipment */}
      <div>
        <h2 className="text-base font-semibold border-b pb-1 mb-3">
          Tools and Equipment
        </h2>

        <div className="grid grid-cols-2 gap-x-4 gap-y-3">
          {/* Tools arranged in a 2x2 grid */}
          <div className="grid grid-cols-2 col-span-2 gap-x-4 gap-y-3">
            {[
              { label: "Hand Tool Boxes", field: "basicHandToolBoxes" },
              { label: "Service Pit Hoist", field: "servicePitHoist" },
              { label: "Car Stands", field: "carStands" },
              { label: "Spray Booth", field: "carSprayingBooth" },
            ].map(({ label, field }) => (
              <div key={field}>
                <Label className="font-medium text-sm mb-1 block">
                  {label}
                </Label>
                {renderRadioButtons(
                  "toolsAndEquipment",
                  field,
                  Boolean(
                    data.toolsAndEquipment[
                      field as keyof typeof data.toolsAndEquipment
                    ]
                  )
                )}
              </div>
            ))}
          </div>

          {/* Other Tools - Full width */}
          <div className="col-span-2 mt-1">
            <Label className="font-medium text-sm mb-1 block">
              Other Tools
            </Label>
            <Input
              type="text"
              placeholder="Enter other tools, separated by commas..."
              className="h-7 text-sm"
              value={data.toolsAndEquipment.otherTools.join(", ")}
              onChange={(e) =>
                onChange(
                  "toolsAndEquipment.otherTools",
                  e.target.value.split(",").map((tool) => tool.trim())
                )
              }
            />
          </div>
        </div>
      </div>

      {/* Other Remarks - Full width */}
      <div>
        <h2 className="text-base font-semibold border-b pb-1 mb-3">
          Other Remarks
        </h2>
        <Label className="font-medium text-sm mb-1 block">
          Additional Information
        </Label>
        <Input
          type="text"
          placeholder="Any additional information or remarks..."
          className="h-7 text-sm"
          value={data.otherRemarks}
          onChange={(e) => onChange("otherRemarks", e.target.value)}
        />
      </div>
    </div>
  );
};

export default GarageSecurityToolsForm;
