import { UserRole } from "./UserRole";

export interface CreateUserRequest {
  fullName: string;
  email: string;
  password: string;
  phone: string;
  userRole: UserRole;
}
