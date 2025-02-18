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
  const renderRadioGroup = (
    section: string,
    field: string,
    label: string,
    value: boolean
  ) => (
    <div key={field} className="flex items-center justify-between">
      <Label className="text-sm w-1/2">{label}</Label>
      <RadioGroup
        value={value ? "yes" : "no"}
        onValueChange={(val) => onChange(`${section}.${field}`, val === "yes")}
        className="flex gap-4 w-1/2 justify-end"
      >
        <div className="flex items-center gap-2">
          <RadioGroupItem value="yes" id={`${field}-yes`} className="h-4 w-4" />
          <Label htmlFor={`${field}-yes`} className="text-sm">
            Yes
          </Label>
        </div>
        <div className="flex items-center gap-2">
          <RadioGroupItem value="no" id={`${field}-no`} className="h-4 w-4" />
          <Label htmlFor={`${field}-no`} className="text-sm">
            No
          </Label>
        </div>
      </RadioGroup>
    </div>
  );

  return (
    <div className="space-y-4 w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-10">
      <div className="grid grid-cols-2 gap-12">
        {/* Waste Management & Environment */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold border-b pb-2">
            Waste Management & Environment
          </h2>
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
          ].map(({ label, field }) =>
            renderRadioGroup(
              "wasteManagementEnvironment",
              field,
              label,
              Boolean(
                data.wasteManagementEnvironment[
                  field as keyof typeof data.wasteManagementEnvironment
                ]
              )
            )
          )}
          <div>
            <Label className="text-sm">Other Waste Measures (if any)</Label>
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
              className="mt-2 h-10 text-sm py-2 w-full"
            />
          </div>
        </div>

        {/* Professionalism */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold border-b pb-2">
            Professionalism
          </h2>
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
          ].map(({ label, field }) =>
            renderRadioGroup(
              "professionalism",
              field,
              label,
              Boolean(
                data.professionalism[field as keyof typeof data.professionalism]
              )
            )
          )}
          <div>
            <Label className="text-sm">
              Other Professional Measures (if any)
            </Label>
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
              className="mt-2 h-10 text-sm py-2 w-full"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default WasteManagementProfessionalismForm;
