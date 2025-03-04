import { ImportResponse } from "@/core/articles/dto/ImportResponse";
import ApiServer from "@/core/system/service/ApiServer";
import CreateUtilajRequest from "../dto/CreateUtilajRequest";
import UtilajResponseDTO from "../dto/UtilajResponseDTO";
import UtilajeResponseList from "../dto/UtilajeResponseList";

class UtilajService extends ApiServer {
  importUtilajeFromExcel = async (
    file: File,
    token: string
  ): Promise<ImportResponse | string> => {
    const formData = new FormData();
    formData.append("file", file);

    const response = await this.api<FormData, ImportResponse>(
      "/utilaj/importExcel",
      "POST",
      formData,
      token
    );

    if (response.status === 200) {
      return (await response.json()) as ImportResponse;
    } else if (response.status === 400) {
      const errorMessage = await response.text();
      return errorMessage || "Invalid request or file format.";
    } else if (response.status === 403) {
      const errorData = await response.json();
      return (
        errorData.message ||
        "Access denied. Only admins can perform this action."
      );
    } else if (response.status === 401) {
      const errorData = await response.json();
      return errorData.message || "Unauthorized request. Please log in.";
    } else {
      return Promise.reject(
        "An error occurred while importing utilaje from Excel."
      );
    }
  };


  getAllUtilaje = async (
    page: number = 0,
    size: number = 50,
    searchTerm?: string
  ): Promise<UtilajeResponseList | string> => {
    const params = new URLSearchParams({
      page: page.toString(),
      size: size.toString(),
    });

    if (searchTerm && searchTerm.trim().length > 0) {
      params.append("searchTerm", searchTerm);
    }

    const endpoint = `/utilaj/getAllUtilaje?${params.toString()}`;
    const response = await this.api<null, UtilajeResponseList>(
      endpoint,
      "GET",
      null
    );

    if (response.status === 200) {
      return await response.json();
    } else {
      return Promise.reject("An error occurred while fetching the utilaje.");
    }
  };

  getUtilajByCode = async (
    code: string
  ): Promise<UtilajResponseDTO | string> => {
    const response = await this.api<null, UtilajResponseDTO>(
      `/stock-manager/api/utilaj/getUtilajByCode/${code}`,
      "GET",
      null
    );

    if (response.status === 200) {
      return await response.json();
    } else if (response.status === 404) {
      return "Utilaj not found";
    } else {
      return Promise.reject("An error occurred while fetching the utilaj.");
    }
  };

  createUtilaj = async (
    utilaj: CreateUtilajRequest,
    token: string
  ): Promise<UtilajResponseDTO | string> => {
    const response = await this.api<CreateUtilajRequest, UtilajResponseDTO>(
      `/utilaj/createUtilaj`,
      "POST",
      utilaj,
      token
    );

    if (response.status === 201) {
      return await response.json();
    } else if (response.status === 409) {
      return "A utilaj with this code already exists.";
    } else if (response.status === 400) {
      return "Invalid request. Please check the input data.";
    } else if (response.status === 403) {
      return "Access denied. Only admins can perform this action.";
    } else {
      return Promise.reject("An error occurred while creating the utilaj.");
    }
  };

  deleteUtilajByCode = async (
    utilajCode: string,
    token: string
  ): Promise<string> => {
    const response = await this.api<null, string>(
      `/utilaj/deleteUtilajByCode/${utilajCode}`,
      "DELETE",
      null,
      token
    );

    if (response.status === 200) {
      return await response.text();
    } else if (response.status === 404) {
      return "Utilaj not found";
    } else if (response.status === 403) {
      return "Access denied. Only admins can perform this action.";
    } else {
      return Promise.reject("An error occurred while deleting the utilaj.");
    }
  };

  deleteAllUtilaje= async (token: string): Promise<string> => {
    const response = await this.api<null, string>(
      `/utilaj/deleteAllUtilaje`,
      "DELETE",
      null,
      token
    );

    if (response.status === 200) {
      return await response.text();
    } else if (response.status === 403) {
      const errorData = await response.json();
      return (
        errorData.message ||
        "Access denied. Only admins can perform this action."
      );
    } else {
      return Promise.reject("An error occurred while deleting all utilaje.");
    }
  };

}

export default UtilajService;
