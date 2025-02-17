import { Customer } from "./customer";
import { Garage } from "./garage";
import { VehicleInspection } from "./inspection";

export interface CreateVehicleInput {
  customerId: string;
  garageId: string;
  make: string;
  model: string;
  year: number;
  plateNumber: string;
  vin?: string;
  fuel?: string;
  transmission?: string;
  bodyShape?: string;
  engine?: string;
  chassis?: string;
}

export interface UpdateVehicleInput {
  vehicleId: string;
  make?: string;
  model?: string;
  year?: number;
  plateNumber?: string;
  vin?: string;
  fuel?: string;
  transmission?: string;
  bodyShape?: string;
  engine?: string;
  chassis?: string;
  updatedAt?: string;
}

export interface GetVehicleByIdInput {
  vehicleId: string;
}

export interface DeleteVehicleInput {
  vehicleId: string;
}

export interface Vehicle {
  id: string;
  customerId: string;
  garageId: string;
  make: string;
  model: string;
  year: number;
  plateNumber: string;
  vin?: string;
  fuel?: string;
  transmission?: string;
  bodyShape?: string;
  engine?: string;
  chassis?: string;
  customer: Customer;
  garage: Garage;
  vehicleInspections: VehicleInspection[];
}

// Fuel types available for vehicles
export enum FuelType {
  Petrol = "Petrol",
  Diesel = "Diesel",
  HybridPetrol = "Hybrid(Petrol)",
  LPG = "LPG",
  Electric = "Electric",
  HybridDiesel = "Hybrid(Diesel)",
  CNG = "CNG",
  Other = "Other",
}

// Vehicle model types
export enum VehicleModel {
  SUV = "SUV",
  Truck = "Truck",
  Pickup = "Pick up",
  Van = "Van",
  Sedan = "Sedan",
  Bus = "Bus",
  MiniVan = "Mini Van",
  Hatchback = "Hatchback",
  Coupe = "Coupe",
  Convertible = "Convertible",
  Wagon = "Wagon",
  MiniBus = "Mini Bus",
  Machinery = "Machinery",
  Forklift = "Forklift",
  Tractor = "Tractor",
  TractorHead = "Tractor Head",
  Motorcycle = "Motorcycle",
}

// Vehicle manufacturer makes
export enum VehicleMake {
  TOYOTA = "TOYOTA",
  NISSAN = "NISSAN",
  HONDA = "HONDA",
  MAZDA = "MAZDA",
  MITSUBISHI = "MITSUBISHI",
  SUBARU = "SUBARU",
  SUZUKI = "SUZUKI",
  ISUZU = "ISUZU",
  DAIHATSU = "DAIHATSU",
  HINO = "HINO",
  LEXUS = "LEXUS",
  MERCEDES_BENZ = "MERCEDES-BENZ",
  BMW = "BMW",
  VOLKSWAGEN = "VOLKSWAGEN",
  AUDI = "AUDI",
  PEUGEOT = "PEUGEOT",
  FORD = "FORD",
  VOLVO = "VOLVO",
  LAND_ROVER = "LAND ROVER",
  JAGUAR = "JAGUAR",
  JEEP = "JEEP",
  CHEVROLET = "CHEVROLET",
  HYUNDAI = "HYUNDAI",
  KIA = "KIA",
  SSANGYONG = "SSANGYONG",
  RENAULT = "RENAULT",
}
