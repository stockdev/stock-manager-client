import { User } from "../../user/model/User";
import { NotificationType } from "../dto/NotificationType";

export interface Notification {
    id: number;
    notificationType: NotificationType;
    message: string;
    user: User | null;
}