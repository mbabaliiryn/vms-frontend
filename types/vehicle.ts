export interface CreateVehicleInput {
  customerId: string;
  branchId: string;
  make: string;
  model: string;
  year: number;
  plateNumber: string;
  vin?: string;
}

export interface UpdateVehicleInput {
  vehicleId: string;
  make?: string;
  model?: string;
  year?: number;
  plateNumber?: string;
  vin?: string;
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
  branchId: string;
  make: string;
  model: string;
  year: number;
  plateNumber: string;
  vin?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
