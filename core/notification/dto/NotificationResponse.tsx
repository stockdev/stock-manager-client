import { NotificationType } from "./NotificationType";
import { UserResponse } from "@/core/user/dto/UserResponse";

export default interface NotificationResponse{
    notificationType: NotificationType;
    message: string;
    user : UserResponse;
    // stock : Stock;
}