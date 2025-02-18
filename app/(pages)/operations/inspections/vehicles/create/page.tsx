"use client";

import React, { useState } from "react";
import BasicInfo from "@/components/Inspections/VehicleInspections/Forms/BasicInfo";
import ExteriorCheck from "@/components/Inspections/VehicleInspections/Forms/ExteriorCheck";
import UnderHoodCheck from "@/components/Inspections/VehicleInspections/Forms/UnderHoodCheck";
import CombinedFluidsUndercarriageForm from "@/components/Inspections/VehicleInspections/Forms/Fluids&UnderCarriage";
import BrakesTiresSystemForm from "@/components/Inspections/VehicleInspections/Forms/BrakesSystemTires";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { inspectionsApi } from "@/app/api";
import { CreateVehicleInspectionChecklistInput, CheckStatus } from "@/types";
import * as Yup from "yup";
import axios from "axios";
import { useRouter } from "next/navigation";

interface ApiResponse {
  success: boolean;
  message: string;
}

const InspectionChecklistPage = () => {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [checklistData, setChecklistData] = useState({
    vehicleId: "",
    garageId: "",
    inspectorId: "",
    lastInspectionDate: "",
    exterior: {
      front: {
        windshield: CheckStatus.CHECKED_OK,
        washerSystem: CheckStatus.CHECKED_OK,
        wiperArm: CheckStatus.CHECKED_OK,
        headlights: {
          hiBeam: CheckStatus.CHECKED_OK,
          loBeam: CheckStatus.CHECKED_OK,
        },
        fogLamp: CheckStatus.CHECKED_OK,
        indicator: CheckStatus.CHECKED_OK,
        hazardLight: CheckStatus.CHECKED_OK,
        drl: CheckStatus.CHECKED_OK,
      },
      rear: {
        brakeLight: CheckStatus.CHECKED_OK,
        indicator: CheckStatus.CHECKED_OK,
        hazardLight: CheckStatus.CHECKED_OK,
        reverseLight: CheckStatus.CHECKED_OK,
        washerSystem: CheckStatus.CHECKED_OK,
        wiperArm: CheckStatus.CHECKED_OK,
        regPlateLamp: CheckStatus.CHECKED_OK,
        topBrakeLight: CheckStatus.CHECKED_OK,
      },
    },
    underHood: {
      radiatorHosesClamps: CheckStatus.CHECKED_OK,
      batteryTerminalsCables: CheckStatus.CHECKED_OK,
      horn: CheckStatus.CHECKED_OK,
      driveBelt: CheckStatus.CHECKED_OK,
      airFilter: CheckStatus.CHECKED_OK,
      transmissionFluid: CheckStatus.CHECKED_OK,
      brakeFluid: CheckStatus.CHECKED_OK,
      powerSteeringFluid: CheckStatus.CHECKED_OK,
      heaterHosesClamps: CheckStatus.CHECKED_OK,
      ignitionCoilsWires: CheckStatus.CHECKED_OK,
      vacuumPumpCondition: CheckStatus.CHECKED_OK,
      egrSystem: CheckStatus.CHECKED_OK,
      pcvSystem: CheckStatus.CHECKED_OK,
      dieselSystemInspection: CheckStatus.CHECKED_OK,
    },
    fluids: {
      coolantLevel: CheckStatus.CHECKED_OK,
      clutchHydraulicFluid: CheckStatus.CHECKED_OK,
      differentialTransferCase: CheckStatus.CHECKED_OK,
      oilLevel: CheckStatus.CHECKED_OK,
    },
    undercarriage: {
      shocksLeakageDamage: CheckStatus.CHECKED_OK,
      bushings: CheckStatus.CHECKED_OK,
      cvAxleBoots: CheckStatus.CHECKED_OK,
      brakeInspection: CheckStatus.CHECKED_OK,
      exhaustSystem: CheckStatus.CHECKED_OK,
      steeringComponents: CheckStatus.CHECKED_OK,
      ballJoints: CheckStatus.CHECKED_OK,
      stabilizerLinks: CheckStatus.CHECKED_OK,
    },
    brakes: {
      frontLeft: {
        pads: CheckStatus.CHECKED_OK,
        rotor: CheckStatus.CHECKED_OK,
        caliper: CheckStatus.CHECKED_OK,
        linesDucts: CheckStatus.CHECKED_OK,
      },
      frontRight: {
        pads: CheckStatus.CHECKED_OK,
        rotor: CheckStatus.CHECKED_OK,
        caliper: CheckStatus.CHECKED_OK,
        linesDucts: CheckStatus.CHECKED_OK,
      },
      rearLeft: {
        pads: CheckStatus.CHECKED_OK,
        rotor: CheckStatus.CHECKED_OK,
        caliper: CheckStatus.CHECKED_OK,
        linesDucts: CheckStatus.CHECKED_OK,
      },
      rearRight: {
        pads: CheckStatus.CHECKED_OK,
        rotor: CheckStatus.CHECKED_OK,
        caliper: CheckStatus.CHECKED_OK,
        linesDucts: CheckStatus.CHECKED_OK,
      },
    },
    tires: {
      frontLeft: {
        sidewallHealth: CheckStatus.CHECKED_OK,
        treadHealth: CheckStatus.CHECKED_OK,
      },
      frontRight: {
        sidewallHealth: CheckStatus.CHECKED_OK,
        treadHealth: CheckStatus.CHECKED_OK,
      },
      rearLeft: {
        sidewallHealth: CheckStatus.CHECKED_OK,
        treadHealth: CheckStatus.CHECKED_OK,
      },
      rearRight: {
        sidewallHealth: CheckStatus.CHECKED_OK,
        treadHealth: CheckStatus.CHECKED_OK,
      },
      spare: {
        sidewallHealth: CheckStatus.CHECKED_OK,
        treadHealth: CheckStatus.CHECKED_OK,
      },
      parkingBrakeOperation: CheckStatus.CHECKED_OK,
    },
    systemChecks: {
      serviceMessage: CheckStatus.CHECKED_OK,
      engineOil: CheckStatus.CHECKED_OK,
    },
  });

  const handleChange = (section: string, field: string, value: unknown) => {
    if (section === "basicInfo") {
      setChecklistData((prev) => ({
        ...prev,
        [field]: value,
      }));
    } else {
      setChecklistData((prev) => ({
        ...prev,
        [section]: {
          ...prev[section],
          [field]: value,
        },
      }));
    }
  };

  const handleNext = () => setStep((prev) => prev + 1);
  const handlePrevious = () => setStep((prev) => prev - 1);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const dataToSubmit: CreateVehicleInspectionChecklistInput = {
        vehicleId: checklistData.vehicleId,
        garageId: checklistData.garageId,
        inspectorId: checklistData.inspectorId,
        checklist: {
          exterior: checklistData.exterior,
          underHood: checklistData.underHood,
          fluids: checklistData.fluids,
          undercarriage: checklistData.undercarriage,
          brakes: checklistData.brakes,
          tires: checklistData.tires,
          systemChecks: checklistData.systemChecks,
        },
      };

      const response = (await inspectionsApi.createVehicleInspectionChecklist(
        dataToSubmit
      )) as ApiResponse;
      if (response.success) {
        toast.success("Inspection submitted successfully!");

        router.push("/operations/inspections/vehicles");
      } else {
        toast.error(response.message);
      }
    } catch (err: unknown) {
      if (err instanceof Yup.ValidationError) {
        const newErrors: Record<string, string> = {};
        err.inner.forEach((error) => {
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
    <div className="space-y-1 p-4 bg-white rounded-xl shadow-md">
      <h1 className="text-3xl font-bold">Vehicle Inspection Checklist</h1>
      <p className="text-gray-600">Step {step} of 5</p>

      {/* Render forms based on step */}
      {step === 1 && (
        <BasicInfo
          data={{
            vehicleId: checklistData.vehicleId,
            garageId: checklistData.garageId,
            inspectorId: checklistData.inspectorId,
            lastInspectionDate: checklistData.lastInspectionDate,
          }}
          onChange={(field, value) => handleChange("basicInfo", field, value)}
        />
      )}
      {step === 2 && (
        <ExteriorCheck
          data={checklistData.exterior}
          onChange={(f, v) => handleChange("exterior", f, v)}
        />
      )}
      {step === 3 && (
        <UnderHoodCheck
          data={checklistData.underHood}
          onChange={(f, v) => handleChange("underHood", f, v)}
        />
      )}
      {step === 4 && (
        <CombinedFluidsUndercarriageForm
          data={{
            fluids: checklistData.fluids,
            undercarriage: checklistData.undercarriage,
          }}
          onChange={(field, value) => {
            if (field.startsWith("fluids")) {
              handleChange("fluids", field.split(".")[1], value);
            } else if (field.startsWith("undercarriage")) {
              handleChange("undercarriage", field.split(".")[1], value);
            }
          }}
        />
      )}
      {step === 5 && (
        <BrakesTiresSystemForm
          data={{
            brakes: checklistData.brakes,
            tires: checklistData.tires,
            systemChecks: checklistData.systemChecks,
          }}
          onChange={(field, value) => {
            if (field.startsWith("brakes")) {
              handleChange("brakes", field.split(".")[1], value);
            } else if (field.startsWith("tires")) {
              handleChange("tires", field.split(".")[1], value);
            } else if (field.startsWith("systemChecks")) {
              handleChange("systemChecks", field.split(".")[1], value);
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
          <Button onClick={handleNext}>Next</Button>
        ) : (
          <Button
            disabled={loading}
            onClick={handleSubmit}
            className="bg-green-600 hover:bg-green-700"
          >
            {loading ? "Submitting..." : "Submit Inspection"}
          </Button>
        )}
      </div>
    </div>
  );
};

export default InspectionChecklistPage;
