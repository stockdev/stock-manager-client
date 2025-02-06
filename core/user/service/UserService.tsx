import ApiServer from "@/core/system/service/ApiServer";
import LoginRequest from "../dto/LoginRequest";
import LoginResponse from "../dto/LoginResponse";
import { CreateUserRequest } from "../dto/CreateUserRequest";
import { UserResponse } from "../dto/UserResponse";
import { UserResponseList } from "../dto/UserReponseList";
import { UpdateUserRequest } from "../dto/UpdateUserRequest";
class UserService extends ApiServer {
  login = async (user: LoginRequest): Promise<LoginResponse | string> => {
    const data = await this.api<LoginRequest, LoginResponse>(
      `/user/login`,
      "POST",
      user
    );

    if (data.status === 200) {
      return await data.json();
    } else {
      return await data.text();
    }
  };

  getAllUsers = async (token: string): Promise<UserResponseList> => {
    const response = await this.api<null, UserResponseList>(
      `/user/getAllUsers`,
      "GET",
      null,
      token
    );
    if (response.status === 200) {
      return await response.json();
    } else {
      throw new Error("Failed to fetch users.");
    }
  };

  register = async (
    user: CreateUserRequest,
    token: string
  ): Promise<UserResponse | string> => {
    const response = await this.api<CreateUserRequest, UserResponse>(
      `/user/register`,
      "POST",
      user,
      token
    );
    if (response.status === 201) {
      return await response.json();
    } else if (response.status === 403) {
      return await response.json();
    } else {
      return await response.text();
    }
  };

  deleteUser = async (email: string, token: string): Promise<string> => {
    const response = await this.api<null, string>(
      `/user/delete/${email}`,
      "DELETE",
      null,
      token
    );

    if (response.status === 200) {
      return await response.text();
    } else if (response.status === 403) {
      return await response.json();
    } else {
      return await response.text();
    }
  };

  updateUser = async (
    email: string,
    updateUserRequest: UpdateUserRequest,
    token: string
  ): Promise<UserResponse | string> => {
    const response = await this.api<UpdateUserRequest, UserResponse>(
      `/user/update/${email}`,
      "PUT",
      updateUserRequest,
      token
    );
    if (response.status === 200) {
      return await response.json();
    } else if (response.status === 403) {
      return await response.json();
    } else {
      return await response.text();
    }
  };
  


}

export default UserService;
