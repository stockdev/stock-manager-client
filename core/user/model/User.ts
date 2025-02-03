import { UserRole } from "../dto/UserRole";

export interface User {
    id: number;
    email: string;
    password: string;
    fullName: string;
    phone: string;
    userRole: UserRole;
}