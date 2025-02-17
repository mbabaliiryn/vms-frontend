import { Garage } from "./garage";
import { Vehicle } from "./vehicle";

export enum CustomerStatus {
  INDIVIDUAL = "INDIVIDUAL",
  COMPANY = "COMPANY",
}

export interface CreateCustomerInput {
  name: string;
  contact: string;
  address: string;
  customerType: CustomerStatus;
  garageId: string;
}

export interface UpdateCustomerInput {
  customerId: string;
  name?: string;
  customerType?: CustomerStatus;
  contact?: string;
  address?: string;
  updatedAt?: string;
}

export interface GetCustomerByIdInput {
  customerId: string;
}

export interface DeleteCustomerInput {
  customerId: string;
}

export interface Customer {
  id: string;
  name: string;
  customerType: CustomerStatus;
  contact: string;
  address: string;
  garageId: string;
  createdAt: Date;
  updatedAt: Date;
  garage: Garage;
  vehicles: Vehicle[];
}
