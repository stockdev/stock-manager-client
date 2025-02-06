import { UserRole } from "@/core/user/dto/UserRole";

export interface UpdateUserRequest {
  fullName: string;
  email: string;
  password: string;
  phone: string;
  userRole: UserRole;
}
