import React from "react";
import {Label} from "@/components/ui/label";
import {RadioGroup, RadioGroupItem} from "@/components/ui/radio-group";
import {ExteriorCheck} from "@/types";

type CheckStatus = "CHECKED_OK" | "REQUIRES_FUTURE_ATTENTION" | "REQUIRES_IMMEDIATE_ATTENTION";

const STATUS_OPTIONS = [
    {label: "Good Condition", value: "CHECKED_OK"},
    {label: "Needs Attention Soon", value: "REQUIRES_FUTURE_ATTENTION"},
    {label: "Needs Immediate Repair", value: "REQUIRES_IMMEDIATE_ATTENTION"},
];

interface ExteriorCheckFormProps {
    data: ExteriorCheck;
    onChange: (field: string, value: CheckStatus) => void;
}

const ExteriorCheckForm: React.FC<ExteriorCheckFormProps> = ({data, onChange}) => {
    const renderCheck = (label: string, field: string) => (
        <div className="space-y-4 p-4 rounded-lg border border-gray-300 shadow-sm hover:shadow-md transition-all">
            <Label className="font-semibold text-lg">{label}</Label>
            <RadioGroup
                className="grid grid-cols-1 sm:grid-cols-2 gap-4"
                value={data[field]}
                onValueChange={(value) => onChange(field, value as CheckStatus)}
            >
                {STATUS_OPTIONS.map((option) => (
                    <div key={option.value} className="flex items-center space-x-2">
                        <RadioGroupItem
                            value={option.value}
                            id={`${field}-${option.value}`}
                            className="hover:ring-2 hover:ring-indigo-500 transition"
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
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Front Exterior Column */}
                <div className="space-y-6">
                    <h2 className="text-2xl font-bold text-gray-900">Front Exterior</h2>
                    {renderCheck("Windshield", "front.windshield")}
                    {renderCheck("Washer System", "front.washerSystem")}
                    {renderCheck("Wiper Arm", "front.wiperArm")}
                    {renderCheck("Fog Lamp", "front.fogLamp")}
                    {renderCheck("Indicator Lights", "front.indicator")}
                    {renderCheck("Hazard Lights", "front.hazardLight")}
                    {renderCheck("Daytime Running Lights (DRL)", "front.drl")}

                    <h3 className="font-semibold text-xl text-gray-900 mt-6">Headlights</h3>
                    {renderCheck("High Beam", "front.headlights.hiBeam")}
                    {renderCheck("Low Beam", "front.headlights.loBeam")}
                </div>

                {/* Rear Exterior Column */}
                <div className="space-y-6">
                    <h2 className="text-2xl font-bold text-gray-900">Rear Exterior</h2>
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
    );
};

export default ExteriorCheckForm;
