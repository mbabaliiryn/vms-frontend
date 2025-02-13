"use client";

import React from "react";
import {Label} from "@/components/ui/label";
import {RadioGroup, RadioGroupItem} from "@/components/ui/radio-group";
import {TiresCheck} from "@/types";

type CheckStatus = "CHECKED_OK" | "REQUIRES_FUTURE_ATTENTION" | "REQUIRES_IMMEDIATE_ATTENTION";

const STATUS_OPTIONS = [
    {label: "Good Condition", value: "CHECKED_OK"},
    {label: "Needs Attention Soon", value: "REQUIRES_FUTURE_ATTENTION"},
    {label: "Needs Immediate Repair", value: "REQUIRES_IMMEDIATE_ATTENTION"},
];

interface TiresCheckFormProps {
    data: TiresCheck;
    onChange: (field: string, value: CheckStatus) => void;
}

const TiresCheckForm: React.FC<TiresCheckFormProps> = ({data, onChange}) => {
    const renderTireCheck = (label: string, field: string) => (
        <div className="space-y-4 p-4 rounded-lg border border-gray-300 shadow-sm">
            <Label className="font-semibold text-lg">{label}</Label>
            <RadioGroup
                className="grid grid-cols-1 sm:grid-cols-2 gap-4"
                value={data[field]}
                onValueChange={(value) => onChange(field, value as CheckStatus)}
            >
                {STATUS_OPTIONS.map((option) => (
                    <div key={option.value} className="flex items-center space-x-2">
                        <RadioGroupItem value={option.value} id={`${field}-${option.value}`}/>
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
            <h2 className="text-2xl font-bold">Tires Check</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-6">
                    {renderTireCheck("Front Left Tire", "tires.frontLeft")}
                    {renderTireCheck("Front Right Tire", "tires.frontRight")}
                    {renderTireCheck("Rear Left Tire", "tires.rearLeft")}
                    {renderTireCheck("Rear Right Tire", "tires.rearRight")}
                </div>
                <div className="space-y-6">
                    {renderTireCheck("Spare Tire", "tires.spare")}
                    {renderTireCheck("Parking Brake Operation", "tires.parkingBrakeOperation")}
                </div>
            </div>
        </div>
    );
};

export default TiresCheckForm;
