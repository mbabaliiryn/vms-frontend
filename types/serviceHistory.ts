export interface CreateServiceHistoryInput {
    vehicleId: string;
    mechanicId: string;
    serviceDate: Date;
    description: string;
    cost?: number;
    branchId: string;
}

export interface UpdateServiceHistoryInput {
    serviceHistoryId: string;
    serviceDate?: Date;
    description?: string;
    cost?: number;
    updatedAt?: string;
    mechanicId: string;
}

export interface GetServiceHistoryByIdInput {
    serviceHistoryId: string;
}

export interface DeleteServiceHistoryInput {
    serviceHistoryId: string;
}

export interface ServiceHistory {
    id: string;
    vehicleId: string;
    mechanicId: string;
    serviceDate: Date;
    description: string;
    cost?: number;
    branchId: string;
    createdAt?: Date;
    updatedAt?: Date;
}
