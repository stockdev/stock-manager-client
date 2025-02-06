import ApiServer from "@/core/system/service/ApiServer";
import NotificationResponseList from "../dto/NotificationResponseList";

class NotificationService extends ApiServer {
  getAllNotifications = async (
    page: number = 0,
    size: number = 50,
    searchTerm?: string,
    selectedType?: string
  ): Promise<NotificationResponseList | string> => {
    const params = new URLSearchParams({
      page: page.toString(),
      size: size.toString(),
    });

    if (searchTerm && searchTerm.trim().length > 0) {
      params.append("searchTerm", searchTerm);
    }

    if (selectedType && selectedType.trim().length > 0) {
      params.append("selectedType", selectedType);
    }

    const endpoint = `/notification/getAllNotifications?${params.toString()}`;
    const response = await this.api<null, NotificationResponseList>(
      endpoint,
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
