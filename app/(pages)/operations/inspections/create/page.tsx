"use client";

import React, {useState} from "react";
import BasicInfo from "@/components/Inspections/Forms/BasicInfo";
import ExteriorCheck from "@/components/Inspections/Forms/ExteriorCheck";
import UnderHoodCheck from "@/components/Inspections/Forms/UnderHoodCheck";
import FluidsCheck from "@/components/Inspections/Forms/FluidsCheck";
import UndercarriageCheck from "@/components/Inspections/Forms/UnderCarriageCheck";
import BrakesCheck from "@/components/Inspections/Forms/BrakesCheck";
import TiresCheck from "@/components/Inspections/Forms/TireCheck";
import SystemChecksForm from "@/components/Inspections/Forms/SystemCheck";
import {Button} from "@/components/ui/button";
import {toast} from "sonner";
import {inspectionsApi} from "@/app/api";
import {CreateInspectionChecklistInput, CheckStatus} from "@/types";
import * as Yup from "yup";
import axios from "axios";
import {useRouter} from "next/navigation"

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
        branchId: "",
        inspectorId: "",
        signature: "",
        exterior: {
            front: {
                windshield: CheckStatus.CHECKED_OK,
                washerSystem: CheckStatus.CHECKED_OK,
                wiperArm: CheckStatus.CHECKED_OK,
                headlights: {hiBeam: CheckStatus.CHECKED_OK, loBeam: CheckStatus.CHECKED_OK},
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
            }
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
            }
        },
        tires: {
            frontLeft: {sidewallHealth: CheckStatus.CHECKED_OK, treadHealth: CheckStatus.CHECKED_OK},
            frontRight: {sidewallHealth: CheckStatus.CHECKED_OK, treadHealth: CheckStatus.CHECKED_OK},
            rearLeft: {sidewallHealth: CheckStatus.CHECKED_OK, treadHealth: CheckStatus.CHECKED_OK},
            rearRight: {sidewallHealth: CheckStatus.CHECKED_OK, treadHealth: CheckStatus.CHECKED_OK},
            spare: {sidewallHealth: CheckStatus.CHECKED_OK, treadHealth: CheckStatus.CHECKED_OK},
            parkingBrakeOperation: CheckStatus.CHECKED_OK,
        },
        systemChecks: {
            serviceMessage: CheckStatus.CHECKED_OK,
            engineOil: CheckStatus.CHECKED_OK,
        }
    });

    const handleChange = (section: string, field: string, value: unknown) => {
        if (section === "basicInfo") {
            setChecklistData((prev) => ({
                ...prev,
                [field]: value,
            }));
        } else {
            // Handle nested section data
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
            const dataToSubmit: CreateInspectionChecklistInput = {
                vehicleId: checklistData.vehicleId,
                branchId: checklistData.branchId,
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
                signature: checklistData.signature,
            };

            const response = (await inspectionsApi.createInspectionChecklist(dataToSubmit) as ApiResponse);
            if (response.success) {
                toast.success("Inspection submitted successfully!");

                router.push("/operations/inspections");
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
                toast.error("Customer creation failed", {
                    description: "Please fix the errors in the form.",
                });
            } else if (axios.isAxiosError(err) && err.response) {
                console.error("Full API error response:", err.response.data);

                const apiError = err.response.data as { message?: string; success?: boolean };

                toast.error("Customer creation failed", {
                    description: apiError.message || "An unknown error occurred.",
                });
            } else if (typeof err === "object" && err !== null && "message" in err) {
                const errorObj = err as { message: string; success?: boolean };

                toast.error("Customer creation failed", {
                    description: errorObj.message || "An unknown error occurred.",
                });
            } else {
                toast.error("Customer creation failed", {
                    description: "An unexpected error occurred.",
                });
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6 p-6 bg-white rounded-xl shadow-md">
            <h1 className="text-3xl font-bold">Vehicle Inspection Checklist</h1>
            <p className="text-gray-600">Step {step} of 8</p>

            {/* Render forms based on step */}
            {step === 1 && (
                <BasicInfo
                    data={{
                        vehicleId: checklistData.vehicleId,
                        branchId: checklistData.branchId,
                        inspectorId: checklistData.inspectorId,
                        signature: checklistData.signature,
                    }}
                    onChange={(field, value) => handleChange("basicInfo", field, value)}
                />
            )}
            {step === 2 && (
                <ExteriorCheck data={checklistData.exterior} onChange={(f, v) => handleChange("exterior", f, v)}/>
            )}
            {step === 3 && (
                <UnderHoodCheck data={checklistData.underHood} onChange={(f, v) => handleChange("underHood", f, v)}/>
            )}
            {step === 4 && (
                <FluidsCheck data={checklistData.fluids} onChange={(f, v) => handleChange("fluids", f, v)}/>
            )}
            {step === 5 && (
                <UndercarriageCheck data={checklistData.undercarriage}
                                    onChange={(f, v) => handleChange("undercarriage", f, v)}/>
            )}
            {step === 6 && (
                <BrakesCheck data={checklistData.brakes} onChange={(f, v) => handleChange("brakes", f, v)}/>
            )}
            {step === 7 && (
                <TiresCheck data={checklistData.tires} onChange={(f, v) => handleChange("tires", f, v)}/>
            )}
            {step === 8 && (
                <SystemChecksForm data={checklistData.systemChecks}
                                  onChange={(f, v) => handleChange("systemChecks", f, v)}/>
            )}

            {/* Navigation buttons */}
            <div className="flex justify-between mt-6">
                {step > 1 && (
                    <Button onClick={handlePrevious} variant="outline">
                        Previous
                    </Button>
                )}
                {step < 8 ? (
                    <Button onClick={handleNext}>Next</Button>
                ) : (
                    <Button disabled={loading} onClick={handleSubmit} className="bg-green-600 hover:bg-green-700">
                        {loading ? "Submitting..." : "Submit Inspection"}
                    </Button>
                )}
            </div>
        </div>
    );
};

export default InspectionChecklistPage;
