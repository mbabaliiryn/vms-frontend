"use client";

import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface WasteManagementProfessionalismFormProps {
  data: {
    wasteManagementEnvironment: {
      biodegradableWasteBin: boolean;
      nonBiodegradableWasteBin: boolean;
      wasteScrapStore: boolean;
      wasteOilTank: boolean;
      generalHygieneSanitation: boolean;
      otherWasteMeasures: string;
    };
    professionalism: {
      qualifiedStaff: boolean;
      apprentices: boolean;
      garageInsurance: boolean;
      filingTaxReturns: boolean;
      serviceAdvisor: boolean;
      recordKeeping: boolean;
      businessGroupMembership: boolean;
      otherProfessionalMeasures: string;
    };
  };
  onChange: (field: string, value: string | boolean) => void;
}

const WasteManagementProfessionalismForm: React.FC<
  WasteManagementProfessionalismFormProps
> = ({ data, onChange }) => {
  return (
    <div className="space-y-6">
      {/* Waste Management & Environment */}
      <div>
        <h2 className="text-lg font-semibold">
          Waste Management & Environment
        </h2>
        <div className="space-y-4 mt-2">
          {[
            {
              label: "Biodegradable Waste Bin",
              field: "biodegradableWasteBin",
            },
            {
              label: "Non-Biodegradable Waste Bin",
              field: "nonBiodegradableWasteBin",
            },
            { label: "Waste Scrap Store", field: "wasteScrapStore" },
            { label: "Waste Oil Tank", field: "wasteOilTank" },
            {
              label: "General Hygiene Sanitation",
              field: "generalHygieneSanitation",
            },
          ].map(({ label, field }) => (
            <div key={field}>
              <Label>{label}</Label>
              <RadioGroup
                value={
                  data.wasteManagementEnvironment[
                    field as keyof typeof data.wasteManagementEnvironment
                  ]
                    ? "yes"
                    : "no"
                }
                onValueChange={(value) =>
                  onChange(
                    `wasteManagementEnvironment.${field}`,
                    value === "yes"
                  )
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
            <Label>Other Waste Measures (if any)</Label>
            <Input
              type="text"
              placeholder="Enter other waste measures..."
              value={data.wasteManagementEnvironment.otherWasteMeasures}
              onChange={(e) =>
                onChange(
                  "wasteManagementEnvironment.otherWasteMeasures",
                  e.target.value
                )
              }
            />
          </div>
        </div>
      </div>

      {/* Professionalism */}
      <div>
        <h2 className="text-lg font-semibold">Professionalism</h2>
        <div className="space-y-4 mt-2">
          {[
            { label: "Qualified Staff", field: "qualifiedStaff" },
            { label: "Apprentices", field: "apprentices" },
            { label: "Garage Insurance", field: "garageInsurance" },
            { label: "Filing Tax Returns", field: "filingTaxReturns" },
            { label: "Service Advisor", field: "serviceAdvisor" },
            { label: "Record Keeping", field: "recordKeeping" },
            {
              label: "Business Group Membership",
              field: "businessGroupMembership",
            },
          ].map(({ label, field }) => (
            <div key={field}>
              <Label>{label}</Label>
              <RadioGroup
                value={
                  data.professionalism[
                    field as keyof typeof data.professionalism
                  ]
                    ? "yes"
                    : "no"
                }
                onValueChange={(value) =>
                  onChange(`professionalism.${field}`, value === "yes")
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
            <Label>Other Professional Measures (if any)</Label>
            <Input
              type="text"
              placeholder="Enter other professional measures..."
              value={data.professionalism.otherProfessionalMeasures}
              onChange={(e) =>
                onChange(
                  "professionalism.otherProfessionalMeasures",
                  e.target.value
                )
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default WasteManagementProfessionalismForm;
