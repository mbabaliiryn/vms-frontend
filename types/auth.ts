export interface RegisterInput {
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

enum Role {
  ADMIN = "ADMIN",
  MANAGER = "MANAGER",
  MECHANIC = "MECHANIC",
}

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  role: Role;
}
