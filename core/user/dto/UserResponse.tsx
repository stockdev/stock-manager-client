import { UserRole } from "./UserRole";

export interface UserResponse {
    id: number;
    email: string;
    password: string;
    fullName: string;
    phone: string;
    userRole: UserRole;
}