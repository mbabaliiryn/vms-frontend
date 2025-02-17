import { User } from "./auth";
import { Customer } from "./customer";
import { Vehicle } from "./vehicle";

export interface CreateGarageInput {
  name: string;
  adminId: string;
  location: string;
  contactNumber: string;
  servicesOffered: string[];
  garageEmail?: string;
  isActive?: boolean;
  openingHours?: OpeningHours;
}

export interface UpdateGarageInput {
  garageId: string;
  name?: string;
  location?: string;
  servicesOffered?: string[];
  contactNumber?: string;
  garageEmail?: string;
  isActive?: boolean;
  openingHours?: OpeningHours;
}

export interface GetGarageByIdInput {
  garageId: string;
}

export interface DeleteGarageInput {
  garageId: string;
}

interface OpeningHours {
  [day: string]: {
    open: string;
    close: string;
  };
}

export interface Garage {
  id: string;
  name: string;
  location: string;
  adminId: string;
  contactNumber: string;
  servicesOffered: string[];
  garageEmail?: string;
  isActive: boolean;
  openingHours: OpeningHours;
  createdAt?: Date;
  updatedAt?: Date;

  admin: User;
  users?: User[];
  customers?: Customer[];
  vehicles?: Vehicle[];
}
