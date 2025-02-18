import { User } from "./auth";
import { Garage } from "./garage";
import { Vehicle } from "./vehicle";

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

export interface GarageInspectionChecklist {
  statutoryRequirements: {
    certificateOfIncorporation: boolean;
    tinCertificate: boolean;
    tradingLicense: boolean;
    otherDocuments: string;
  };
  locationPremises: {
    signpost: boolean;
    clearAccessRoad: boolean;
    garageLayout: "Good" | "Bad";
  };
  garageFacilities: {
    office: boolean;
    workingShade: boolean;
    sparePartEquipmentStore: boolean;
    parkingArea: boolean;
    customerWaitingArea: boolean;
    otherFacilities: string;
  };
  safetyAndHealth: {
    internalTalkingSignages: boolean;
    assortedWasteBins: boolean;
    fireExtinguishers: boolean;
    emergencyExit: boolean;
    staffProtectiveGear: boolean;
    safetyBoots: boolean;
    cleanToilets: boolean;
    femaleStaffProvisions: boolean;
    otherSafetyMeasures: string;
  };
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
}

export interface CreateVehicleInspectionChecklistInput {
  vehicleId: string;
  garageId: string;
  inspectorId: string;
  checklist: InspectionChecklist;
  lastInspectionDate?: Date;
}

export interface CreateGarageInspectionChecklistInput {
  garageId: string;
  inspectorId: string;
  checklist: GarageInspectionChecklist;
  notes?: string;
  lastInspectionDate?: Date;
}

export interface UpdateVehicleInspectionChecklistInput {
  checklistId: string;
  checklist?: Partial<InspectionChecklist>;
  signature?: string;
  updatedAt?: string;
  lastInspectionDate?: string;
}

export interface UpdateGarageInspectionChecklistInput {
  checklistId: string;
  checklist?: Partial<GarageInspectionChecklist>;
  updatedAt?: string;
  notes?: string;
  lastInspectionDate?: string;
}

export interface GetVehicleInspectionChecklistByIdInput {
  checklistId: string;
}

export interface GetGarageInspectionChecklistByIdInput {
  checklistId: string;
}

export interface DeleteVehicleInspectionChecklistInput {
  checklistId: string;
}

export interface DeleteGarageInspectionChecklistInput {
  checklistId: string;
}

export interface VehicleInspection {
  id: string;
  vehicleId: string;
  garageId: string;
  inspectorId: string;
  checklist: InspectionChecklist;
  lastInspectionDate?: string;
  createdAt?: string;
  updatedAt?: string;

  vehicle: Vehicle;
  garage: Garage;
  inspector: User;
}

export interface GarageInspection {
  id: string;
  garageId: string;
  inspectorId: string;
  checklist: GarageInspectionChecklist;
  notes?: string;
  lastInspectionDate?: string;
  createdAt?: string;
  updatedAt?: string;

  garage: Garage;
  inspector: User;
}
