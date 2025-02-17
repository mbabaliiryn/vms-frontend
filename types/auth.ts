import { Garage } from "./garage";

export enum Role {
  ADMIN = "ADMIN",
  MECHANIC = "MECHANIC",
  INSPECTOR = "INSPECTOR",
}

export interface RegisterInput {
  phoneNumber: string;
  garageId: string;
  password?: string;
  firstName: string;
  lastName: string;
  role: Role;
}

export interface RegisterAdminInput {
  phoneNumber: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface LoginInput {
  phoneNumber: string;
  password: string;
}

export interface AssignRoleInput {
  userId: string;
  role: Role;
}

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  isActivated: boolean;
  role: Role;
  garage: Garage;
}
