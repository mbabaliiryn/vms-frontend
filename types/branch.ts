import { User } from "./auth";
import { Customer } from "./customer";
import { Vehicle } from "./vehicle";

export interface CreateBranchInput {
  name: string;
  location: string;
  contactNumber: string;
  servicesOffered: string[];
  branchEmail?: string;
  isActive?: boolean;
  openingHours?: OpeningHours;
  managerId?: string;
}

export interface UpdateBranchInput {
  branchId: string;
  name?: string;
  location?: string;
  servicesOffered?: string[];
  contactNumber?: string;
  branchEmail?: string;
  isActive?: boolean;
  openingHours?: OpeningHours;
  managerId?: string;
}

export interface GetBranchByIdInput {
  branchId: string;
}

export interface DeleteBranchInput {
  branchId: string;
}

interface OpeningHours {
  [day: string]: {
    open: string;
    close: string;
  };
}

export interface Branch {
  id: string;
  name: string;
  location: string;
  contactNumber: string;
  servicesOffered: string[];
  branchEmail?: string;
  isActive: boolean;
  openingHours: OpeningHours;
  managerId: string;
  createdAt?: Date;
  updatedAt?: Date;

  manager?: User;
  users?: User[];
  customers?: Customer[];
  vehicles?: Vehicle[];
}
