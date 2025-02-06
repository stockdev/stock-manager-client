import { ImportResponse } from "@/core/articles/dto/ImportResponse";
import ApiServer from "@/core/system/service/ApiServer";
import LocationResponse from "../dto/LocationResponse";
import LocationResponseList from "../dto/LocationResponseList";
import CreateLocationRequest from "../dto/CreateLocationRequest";
import UpdateLocationRequest from "../dto/UpdateLocationRequest";

class LocationService extends ApiServer {
  importLocationsFromExcel = async (
    file: File,
    token: string
  ): Promise<ImportResponse | string> => {
    const formData = new FormData();
    formData.append("file", file);

    const response = await this.api<FormData, ImportResponse>(
      "/location/importExcel",
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
        "An error occurred while importing locations from Excel."
      );
    }
  };

  getLocationByCode = async (
    code: string
  ): Promise<LocationResponse | string> => {
    const response = await this.api<null, LocationResponse>(
      `/stock-manager/api/location/getLocationByCode/${code}`,
      "GET",
      null
    );

    if (response.status === 200) {
      return await response.json();
    } else if (response.status === 404) {
      return "Location not found";
    } else {
      return Promise.reject("An error occurred while fetching the location.");
    }
  };

  getAllLocations = async (
    page: number = 0,
    size: number = 50,
    searchTerm?: string
  ): Promise<LocationResponseList | string> => {
    const params = new URLSearchParams({
      page: page.toString(),
      size: size.toString(),
    });
  
    if (searchTerm && searchTerm.trim().length > 0) {
      params.append("searchTerm", searchTerm);
    }
  
    const endpoint = `/location/getAllLocations?${params.toString()}`;
    const response = await this.api<null, LocationResponseList>(
      endpoint,
      "GET",
      null
    );
  
    if (response.status === 200) {
      return await response.json();
    } else {
      return Promise.reject("An error occurred while fetching the locations.");
    }
  };
  
  createLocation = async (
    location: CreateLocationRequest,
    token: string
  ): Promise<LocationResponse | string> => {
    const response = await this.api<CreateLocationRequest, LocationResponse>(
      `/location/createLocation`,
      "POST",
      location,
      token
    );

    try {
      if (response.status === 201) {
        return await response.json();
      } else if (response.status === 409) {
        return "A location with this code already exists.";
      } else if (response.status === 400) {
        return "Invalid request. Please check the input data.";
      } else if (response.status === 403) {
        return "Access denied. Only admins can perform this action.";
      } else {
        return Promise.reject("An error occurred while creating the location.");
      }
    } catch (error) {
      return Promise.reject("Failed to process response.");
    }
  };

  updateLocation = async (
    code: string,
    location: UpdateLocationRequest,
    token: string
  ): Promise<LocationResponse | string> => {
    const response = await this.api<UpdateLocationRequest, LocationResponse>(
      `/location/updateLocation/${code}`,
      "PUT",
      location,
      token
    );

    if (response.status === 200) {
      return await response.json();
    } else if (response.status === 404) {
      return "Location not found";
    } else if (response.status === 403) {
      return "Access denied. Only admins can perform this action.";
    } else if (response.status === 409) {
      return "A location with this code already exists.";
    } else {
      return Promise.reject("An error occurred while updating the location.");
    }
  };

  deleteLocationByCode = async (
    locationCode: string,
    token: string
  ): Promise<string> => {
    const response = await this.api<null, string>(
      `/location/deleteLocationByCode/${locationCode}`,
      "DELETE",
      null,
      token
    );

    try {
      if (response.status === 200) {
        return await response.text();
      } else if (response.status === 404) {
        return "Location not found";
      } else if (response.status === 403) {
        return "Access denied. Only admins can perform this action.";
      } else {
        return Promise.reject("An error occurred while deleting the location.");
      }
    } catch (error) {
      return Promise.reject("Failed to process response.");
    }
  };

  deleteAllLocations = async (token: string): Promise<string> => {
    const response = await this.api<null, string>(
      `/location/deleteAllLocations`,
      "DELETE",
      null,
      token
    );

    if (response.status === 200) {
      return await response.text();
    } else if (response.status === 403) {
      return "Access denied. Only admins can perform this action.";
    } else {
      return Promise.reject("An error occurred while deleting all locations.");
    }
  };
}

export default LocationService;
