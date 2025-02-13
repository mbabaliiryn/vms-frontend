export enum CheckStatus {
    CHECKED_OK = "CHECKED_OK",
    REQUIRES_FUTURE_ATTENTION = "REQUIRES_FUTURE_ATTENTION",
    REQUIRES_IMMEDIATE_ATTENTION = "REQUIRES_IMMEDIATE_ATTENTION",
}


interface HeadlightsCheck {
    hiBeam: CheckStatus;
    loBeam: CheckStatus;
}

interface FrontExteriorCheck {
    windshield: CheckStatus;
    washerSystem: CheckStatus;
    wiperArm: CheckStatus;
    headlights: HeadlightsCheck;
    fogLamp: CheckStatus;
    indicator: CheckStatus;
    hazardLight: CheckStatus;
    drl: CheckStatus;
}

interface RearExteriorCheck {
    brakeLight: CheckStatus;
    indicator: CheckStatus;
    hazardLight: CheckStatus;
    reverseLight: CheckStatus;
    washerSystem: CheckStatus;
    wiperArm: CheckStatus;
    regPlateLamp: CheckStatus;
    topBrakeLight: CheckStatus;
}

export interface ExteriorCheck {
    front: FrontExteriorCheck;
    rear: RearExteriorCheck;
}

interface UnderHoodCheck {
    radiatorHosesClamps: CheckStatus;
    batteryTerminalsCables: CheckStatus;
    horn: CheckStatus;
    driveBelt: CheckStatus;
    airFilter: CheckStatus;
    transmissionFluid: CheckStatus;
    brakeFluid: CheckStatus;
    powerSteeringFluid: CheckStatus;
    heaterHosesClamps: CheckStatus;
    ignitionCoilsWires: CheckStatus;
    vacuumPumpCondition: CheckStatus;
    egrSystem: CheckStatus;
    pcvSystem: CheckStatus;
    dieselSystemInspection: CheckStatus;
}

interface FluidsCheck {
    coolantLevel: CheckStatus;
    clutchHydraulicFluid: CheckStatus;
    differentialTransferCase: CheckStatus;
    oilLevel: CheckStatus;
}

interface UndercarriageCheck {
    shocksLeakageDamage: CheckStatus;
    bushings: CheckStatus;
    cvAxleBoots: CheckStatus;
    brakeInspection: CheckStatus;
    exhaustSystem: CheckStatus;
    steeringComponents: CheckStatus;
    ballJoints: CheckStatus;
    stabilizerLinks: CheckStatus;
}

interface BrakeComponentCheck {
    pads: CheckStatus;
    rotor: CheckStatus;
    caliper: CheckStatus;
    linesDucts: CheckStatus;
}

export interface BrakesCheck {
    frontLeft: BrakeComponentCheck;
    frontRight: BrakeComponentCheck;
    rearLeft: BrakeComponentCheck;
    rearRight: BrakeComponentCheck;
}

interface TireHealthCheck {
    sidewallHealth: CheckStatus;
    treadHealth: CheckStatus;
}

export interface TiresCheck {
    frontLeft: TireHealthCheck;
    frontRight: TireHealthCheck;
    rearLeft: TireHealthCheck;
    rearRight: TireHealthCheck;
    spare: TireHealthCheck;
    parkingBrakeOperation: CheckStatus;
}

interface SystemChecks {
    serviceMessage: CheckStatus;
    engineOil: CheckStatus;
}

export interface InspectionChecklist {
    exterior: ExteriorCheck;
    underHood: UnderHoodCheck;
    fluids: FluidsCheck;
    undercarriage: UndercarriageCheck;
    brakes: BrakesCheck;
    tires: TiresCheck;
    systemChecks: SystemChecks;
}

export interface CreateInspectionChecklistInput {
    vehicleId: string;
    branchId: string;
    inspectorId: string;
    checklist: InspectionChecklist;
    signature?: string;
}

export interface UpdateInspectionChecklistInput {
    checklistId: string;
    checklist?: Partial<InspectionChecklist>;
    signature?: string;
    updatedAt?: string;
}

export interface GetInspectionChecklistByIdInput {
    checklistId: string;
}

export interface DeleteInspectionChecklistInput {
    checklistId: string;
}

export interface Inspection {
    id: string;
    vehicleId: string;
    branchId: string;
    inspectorId: string;
    checklist: InspectionChecklist;
    signature?: string;
    createdAt?: string;
    updatedAt?: string;
}