"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { inspectionsApi } from "@/app/api";
import BasicInfoForm from "@/components/Inspections/GarageInspections/Forms/BasicInfo";
import GarageSecurityToolsForm from "@/components/Inspections/GarageInspections/Forms/GarageSecurityTools";
import StatutoryRequirementsLocationPremisesForm from "@/components/Inspections/GarageInspections/Forms/StatutoryLocation";
import GarageFacilitiesSafetyAndHealthForm from "@/components/Inspections/GarageInspections/Forms/Garage&Safety";
import WasteManagementProfessionalismForm from "@/components/Inspections/GarageInspections/Forms/Waste&Professionalism";
import { CreateGarageInspectionChecklistInput } from "@/types";
import axios from "axios";

interface ApiResponse {
  success: boolean;
  message: string;
}

const CreateGarageInspectionChecklistPage = () => {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [checklistData, setChecklistData] =
    useState<CreateGarageInspectionChecklistInput>({
      garageId: "",
      inspectorId: "",
      checklist: {
        statutoryRequirements: {
          certificateOfIncorporation: false,
          tinCertificate: false,
          tradingLicense: false,
          otherDocuments: "",
        },
        locationPremises: {
          signpost: false,
          clearAccessRoad: false,
          garageLayout: "Good",
        },
        garageFacilities: {
          office: false,
          workingShade: false,
          sparePartEquipmentStore: false,
          parkingArea: false,
          customerWaitingArea: false,
          otherFacilities: "",
        },
        safetyAndHealth: {
          internalTalkingSignages: false,
          assortedWasteBins: false,
          fireExtinguishers: false,
          emergencyExit: false,
          staffProtectiveGear: false,
          safetyBoots: false,
          cleanToilets: false,
          femaleStaffProvisions: false,
          otherSafetyMeasures: "",
        },
        wasteManagementEnvironment: {
          biodegradableWasteBin: false,
          nonBiodegradableWasteBin: false,
          wasteScrapStore: false,
          wasteOilTank: false,
          generalHygieneSanitation: false,
          otherWasteMeasures: "",
        },
        professionalism: {
          qualifiedStaff: false,
          apprentices: false,
          garageInsurance: false,
          filingTaxReturns: false,
          serviceAdvisor: false,
          recordKeeping: false,
          businessGroupMembership: false,
          otherProfessionalMeasures: "",
        },
        garageSecurity: {
          fencedPremises: false,
          securedGate: false,
          securityMeasures: {
            cameras: false,
            dogs: false,
            guard: false,
            otherSecurityMeasures: "",
          },
        },
        toolsAndEquipment: {
          basicHandToolBoxes: false,
          servicePitHoist: false,
          carStands: false,
          carSprayingBooth: false,
          otherTools: [],
        },
        otherRemarks: "",
      },
      notes: "",
      lastInspectionDate: new Date(),
    });

  const handleChange = (section: string, field: string, value: unknown) => {
    setChecklistData((prev) => {
      if (field.includes(".")) {
        const [parentField, childField, grandchildField] = field.split(".");
        if (grandchildField) {
          return {
            ...prev,
            checklist: {
              ...prev.checklist,
              [parentField]: {
                ...prev.checklist[parentField],
                [childField]: {
                  ...(prev.checklist[parentField] as any)[childField],
                  [grandchildField]: value,
                },
              },
            },
          };
        }
        return {
          ...prev,
          checklist: {
            ...prev.checklist,
            [parentField]: {
              ...prev.checklist[parentField],
              [childField]: value,
            },
          },
        };
      }

      // Handle top-level fields
      if (section === "basicInfo") {
        return {
          ...prev,
          [field]: value,
        };
      }

      return {
        ...prev,
        checklist: {
          ...prev.checklist,
          [section]: {
            ...prev.checklist[section],
            [field]: value,
          },
        },
      };
    });
  };

  const handleNext = () => setStep((prev) => prev + 1);
  const handlePrevious = () => setStep((prev) => prev - 1);

  const handleSubmit = async () => {
    setLoading(true);

    console.log("The Data: --------->", checklistData);
    try {
      const formDataToSubmit = {
        garageId: checklistData.garageId,
        inspectorId: checklistData.inspectorId,
        checklist: checklistData.checklist,
        ...(checklistData.notes?.trim() && {
          notes: checklistData.notes.trim(),
        }),
        ...(checklistData.lastInspectionDate && {
          lastInspectionDate: new Date(checklistData.lastInspectionDate),
        }),
      };

      const response = (await inspectionsApi.createGarageInspectionChecklist(
        formDataToSubmit
      )) as ApiResponse;

      if (response.success) {
        toast.success("Inspection checklist submitted successfully!");
        router.push("/operations/inspections/garages");
      } else {
        toast.error(response.message);
      }
    } catch (err: unknown) {
      if (err instanceof Error && "inner" in err) {
        const newErrors: Record<string, string> = {};
        const validationError = err as {
          inner: Array<{ path?: string; message: string }>;
        };
        validationError.inner.forEach((error) => {
          if (error.path) {
            newErrors[error.path] = error.message;
          }
        });
        toast.error("Inspection creation failed", {
          description: "Please fix the errors in the form.",
        });
      } else if (axios.isAxiosError(err) && err.response) {
        console.error("Full API error response:", err.response.data);

        const apiError = err.response.data as {
          message?: string;
          success?: boolean;
        };

        toast.error("Inspection creation failed", {
          description: apiError.message || "An unknown error occurred.",
        });
      } else if (typeof err === "object" && err !== null && "message" in err) {
        const errorObj = err as { message: string; success?: boolean };

        toast.error("Inspection creation failed", {
          description: errorObj.message || "An unknown error occurred.",
        });
      } else {
        toast.error("Inspection creation failed", {
          description: "An unexpected error occurred.",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4 p-4 bg-white rounded-xl shadow-md">
      <h1 className="text-3xl font-bold">Garage Inspection Checklist</h1>
      <p className="text-gray-600">Step {step} of 5</p>

      {/* Render forms based on step */}
      {step === 1 && (
        <BasicInfoForm
          data={{
            garageId: checklistData.garageId,
            inspectorId: checklistData.inspectorId,
            lastInspectionDate: checklistData.lastInspectionDate,
          }}
          onChange={(field, value) => {
            setChecklistData((prev) => ({
              ...prev,
              [field]: value,
            }));
          }}
        />
      )}
      {step === 2 && (
        <StatutoryRequirementsLocationPremisesForm
          data={checklistData.checklist}
          onChange={(field, value) =>
            handleChange("statutoryRequirements", field, value)
          }
        />
      )}
      {step === 3 && (
        <GarageFacilitiesSafetyAndHealthForm
          data={checklistData.checklist}
          onChange={(field, value) =>
            handleChange("garageFacilities", field, value)
          }
        />
      )}
      {step === 4 && (
        <WasteManagementProfessionalismForm
          data={checklistData.checklist}
          onChange={(field, value) =>
            handleChange("wasteManagementEnvironment", field, value)
          }
        />
      )}
      {step === 5 && (
        <GarageSecurityToolsForm
          data={checklistData.checklist}
          onChange={(field, value) => {
            if (field === "otherRemarks") {
              setChecklistData((prev) => ({
                ...prev,
                checklist: {
                  ...prev.checklist,
                  otherRemarks: value as string,
                },
              }));
            } else {
              handleChange("garageSecurity", field, value);
            }
          }}
        />
      )}

      {/* Navigation buttons */}
      <div className="flex justify-between mt-6">
        {step > 1 && (
          <Button onClick={handlePrevious} variant="outline">
            Previous
          </Button>
        )}
        {step < 5 ? (
          <Button className="bg-orange-500" onClick={handleNext}>
            Next
          </Button>
        ) : (
          <Button
            className="bg-orange-500"
            disabled={loading}
            onClick={handleSubmit}
          >
            {loading ? "Submitting..." : "Submit Checklist"}
          </Button>
        )}
      </div>
    </div>
  );
};

export default CreateGarageInspectionChecklistPage;
