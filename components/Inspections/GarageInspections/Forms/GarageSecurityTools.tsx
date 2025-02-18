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
  return (
    <div className="space-y-6">
      {/* Garage Security */}
      <div>
        <h2 className="text-lg font-semibold">Garage Security</h2>
        <div className="space-y-4 mt-2">
          {[
            { label: "Fenced Premises", field: "fencedPremises" },
            { label: "Secured Gate", field: "securedGate" },
          ].map(({ label, field }) => (
            <div key={field}>
              <Label>{label}</Label>
              <RadioGroup
                value={
                  data.garageSecurity[field as keyof typeof data.garageSecurity]
                    ? "yes"
                    : "no"
                }
                onValueChange={(value) =>
                  onChange(`garageSecurity.${field}`, value === "yes")
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

          {/* Security Measures Subsection */}
          <div>
            <Label>Security Measures</Label>
            {[
              { label: "Cameras", field: "cameras" },
              { label: "Dogs", field: "dogs" },
              { label: "Guard", field: "guard" },
            ].map(({ label, field }) => (
              <div key={field}>
                <RadioGroup
                  value={
                    data.garageSecurity.securityMeasures[
                      field as keyof typeof data.garageSecurity.securityMeasures
                    ]
                      ? "yes"
                      : "no"
                  }
                  onValueChange={(value) =>
                    onChange(
                      `garageSecurity.securityMeasures.${field}`,
                      value === "yes"
                    )
                  }
                  className="flex gap-4"
                >
                  <div className="flex items-center gap-2">
                    <RadioGroupItem value="yes" id={`${field}-yes`} />
                    <Label htmlFor={`${field}-yes`}>{label} (Yes)</Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <RadioGroupItem value="no" id={`${field}-no`} />
                    <Label htmlFor={`${field}-no`}>{label} (No)</Label>
                  </div>
                </RadioGroup>
              </div>
            ))}
            <div>
              <Label>Other Security Measures</Label>
              <Input
                type="text"
                placeholder="Enter other security measures..."
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
        </div>
      </div>

      {/* Tools and Equipment */}
      <div>
        <h2 className="text-lg font-semibold">Tools and Equipment</h2>
        <div className="space-y-4 mt-2">
          {[
            { label: "Basic Hand Tool Boxes", field: "basicHandToolBoxes" },
            { label: "Service Pit Hoist", field: "servicePitHoist" },
            { label: "Car Stands", field: "carStands" },
            { label: "Car Spraying Booth", field: "carSprayingBooth" },
          ].map(({ label, field }) => (
            <div key={field}>
              <Label>{label}</Label>
              <RadioGroup
                value={
                  data.toolsAndEquipment[
                    field as keyof typeof data.toolsAndEquipment
                  ]
                    ? "yes"
                    : "no"
                }
                onValueChange={(value) =>
                  onChange(`toolsAndEquipment.${field}`, value === "yes")
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
            <Label>Other Tools</Label>
            <Input
              type="text"
              placeholder="Enter other tools..."
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

      {/* Other Remarks */}
      <div>
        <h2 className="text-lg font-semibold">Other Remarks</h2>
        <div>
          <Label>Enter any other remarks</Label>
          <Input
            type="text"
            placeholder="Any additional information or remarks..."
            value={data.otherRemarks}
            onChange={(e) => onChange("otherRemarks", e.target.value)}
          />
        </div>
      </div>
    </div>
  );
};

export default GarageSecurityToolsForm;
