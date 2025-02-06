import { ImportResponse } from "@/core/articles/dto/ImportResponse";
import ApiServer from "@/core/system/service/ApiServer";
import StockResponseList from "../dto/StockResponseList";
import { CreateStockRequest } from "../dto/CreateStockRequest";
import { StockResponse } from "../dto/StockRequest";
import { UpdateStockRequest } from "../dto/UpdateStockRequest";


class StockService extends ApiServer {
  importStocksFromExcel = async (
    file: File,
    token: string
  ): Promise<ImportResponse | string> => {
    const formData = new FormData();
    formData.append("file", file);

    const response = await this.api<FormData, ImportResponse>(
      "/stock/importExcel",
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
        "An error occurred while importing stocks from Excel."
      );
    }
  };

  getAllStocks = async (): Promise<StockResponseList | string> => {
    const response = await this.api<null, StockResponseList>(
      `/stock/getAllStocks`,
      "GET",
      null
    );

    if (response.status === 200) {
      return await response.json();
    } else {
      return Promise.reject("An error occurred while fetching the stocks.");
    }
  };

  createStockTransaction = async (
    stock: CreateStockRequest,
    token: string
  ): Promise<StockResponse | string> => {
    const response = await this.api<CreateStockRequest, StockResponse>(
      `/stock/createStockTransaction`,
      "POST",
      stock,
      token
    );

    try {
      if (response.status === 201) {
        return await response.json();
      } else if (response.status === 400) {
        return "Invalid request. Please check the input data.";
      } else if (response.status === 403) {
        return "Access denied. Only admins can perform this action.";
      } else {
        return Promise.reject(
          "An error occurred while creating the stock transaction."
        );
      }
    } catch (error) {
      return Promise.reject("Failed to process response.");
    }
  };

  updateStockTransaction = async (
    stockId: number,
    stock: UpdateStockRequest,
    token: string
  ): Promise<StockResponse | string> => {
    const response = await this.api<UpdateStockRequest, StockResponse>(
      `/stock/updateStockTransaction/${stockId}`,
      "PUT",
      stock,
      token
    );

    if (response.status === 202) {
      return await response.json();
    } else if (response.status === 404) {
      return "Stock not found";
    } else if (response.status === 403) {
      return "Access denied. Only admins can perform this action.";
    } else {
      return Promise.reject(
        "An error occurred while updating the stock transaction."
      );
    }
  };

  deleteStockTransaction = async (
    stockId: number,
    token: string
  ): Promise<string> => {
    const response = await this.api<null, string>(
      `/stock/deleteStockTransaction/${stockId}`,
      "DELETE",
      null,
      token
    );

    try {
      if (response.status === 200) {
        return await response.text();
      } else if (response.status === 404) {
        return "Stock not found";
      } else if (response.status === 403) {
        return "Access denied. Only admins can perform this action.";
      } else {
        return Promise.reject(
          "An error occurred while deleting the stock transaction."
        );
      }
    } catch (error) {
      return Promise.reject("Failed to process response.");
    }
  };

  deleteAllStocks = async (token: string): Promise<string> => {
    const response = await this.api<null, string>(
      `/stock/deleteAllStocks`,
      "DELETE",
      null,
      token
    );

    if (response.status === 200) {
      return await response.text();
    } else if (response.status === 403) {
      return "Access denied. Only admins can perform this action.";
    } else {
      return Promise.reject("An error occurred while deleting all stocks.");
    }
  };
}

export default StockService;
