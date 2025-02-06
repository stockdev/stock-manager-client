import ApiServer from "@/core/system/service/ApiServer";
import NotificationResponseList from "../dto/NotificationResponseList";

class NotificationService extends ApiServer {

  getAllNotifications = async (): Promise<NotificationResponseList | string> => {
    const response = await this.api<null, NotificationResponseList>(
      "/notification/getAllNotifications",
      "GET",
      null
    );

    if (response.status === 200) {
      return await response.json();
    } else {
      return Promise.reject("A apărut o eroare la preluarea notificărilor.");
    }
  };

  
  deleteAllNotifications = async (token: string): Promise<string> => {
    const response = await this.api<null, string>(
      "/notification/deleteAllNotifications",
      "DELETE",
      null,
      token
    );

    if (response.status === 200) {
      return await response.text();
    } else if (response.status === 403) {
      return "Acces interzis. Doar administratorii pot efectua această acțiune.";
    } else {
      return Promise.reject("A apărut o eroare la ștergerea notificărilor.");
    }
  };
}

export default NotificationService;
