import NotificationResponse from "./NotificationResponse";

export default interface NotificationResponseList {
  list: NotificationResponse[];
  currentPage: number;
  totalPages: number;
  totalElements: number;
}
