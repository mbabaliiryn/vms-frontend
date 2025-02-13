export interface CreateCustomerInput {
  name: string;
  contact: string;
  address: string;
  branchId: string;
}

export interface UpdateCustomerInput {
  customerId: string;
  name?: string;
  contact?: string;
  address?: string;
  updatedAt?: string;
}

export interface Customer {
  id: string;
  name: string;
  contact: string;
  address: string;
  branchId: string;
  createdAt: Date;
  updatedAt: Date;
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
  contact: string;
  address: string;
  branchId: string;
  createdAt: Date;
  updatedAt: Date;
}
