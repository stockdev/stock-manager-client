import ApiServer from "@/core/system/service/ApiServer";
import { ArticleResponse } from "../dto/ArticleResponse";
import { ArticleResponseList } from "../dto/ArticleResponseList";
import { CreateArticleRequest } from "../dto/CreateArticleRequest";
import { UpdateArticleRequest } from "../dto/UpdateArticleRequest";
import { ImportResponse } from "../dto/ImportResponse";

class ArticleService extends ApiServer {

  importArticlesFromExcel = async (
    file: File,
    token: string
  ): Promise<ImportResponse | string> => {
    const formData = new FormData();
    formData.append("file", file);

    const response = await this.api<FormData, ImportResponse>(
      "/article/importExcel",
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
        "An error occurred while importing articles from Excel."
      );
    }
  };

  getArticleById = async (
    articleId: number
  ): Promise<ArticleResponse | string> => {
    const response = await this.api<null, ArticleResponse>(
      `/article/getArticleById/${articleId}`,
      "GET",
      null
    );

    if (response.status === 200) {
      return await response.json();
    } else if (response.status === 404) {
      return "Article not found";
    } else {
      return Promise.reject("An error occurred while fetching the article.");
    }
  };

  getArticleByCode = async (
    code: string
  ): Promise<ArticleResponse | string> => {
    const response = await this.api<null, ArticleResponse>(
      `/article/getArticleByCode/${code}`,
      "GET",
      null
    );

    if (response.status === 200) {
      return await response.json();
    } else if (response.status === 404) {
      return "Article not found";
    } else {
      return Promise.reject("An error occurred while fetching the article.");
    }
  };

  getAllArticles = async (): Promise<ArticleResponseList | string> => {
    const response = await this.api<null, ArticleResponseList>(
      `/article/getAllArticles`,
      "GET",
      null
    );

    if (response.status === 200) {
      return await response.json();
    } else {
      return Promise.reject("An error occurred while fetching the articles.");
    }
  };

  createArticle = async (
    article: CreateArticleRequest,
    token: string
  ): Promise<ArticleResponse | string> => {
    const response = await this.api<CreateArticleRequest, ArticleResponse>(
      `/article/createArticle`,
      "POST",
      article,
      token
    );

    try {
      if (response.status === 201) {
        return await response.json();
      } else if (response.status === 409) {
        const errorMessage = await response.text();
        return errorMessage || "An article with this code already exists.";
      } else if (response.status === 400) {
        const errorMessage = await response.text();
        return errorMessage || "Invalid request. Please check the input data.";
      } else if (response.status === 403) {
        const errorData = await response.json();
        return (
          errorData.message ||
          "Access denied. Only admins can perform this action."
        );
      } else {
        return Promise.reject("An error occurred while creating the article.");
      }
    } catch (error) {
      return Promise.reject("Failed to process response.");
    }
  };

  updateArticle = async (
    articleId: number,
    article: UpdateArticleRequest,
    token: string
  ): Promise<ArticleResponse | string> => {
    const response = await this.api<UpdateArticleRequest, ArticleResponse>(
      `/article/updateArticle/${articleId}`,
      "PUT",
      article,
      token
    );

    if (response.status === 200) {
      return await response.json();
    } else if (response.status === 404) {
      const errorData = await response.text();
      return errorData || "Article not found";
    } else if (response.status === 403) {
      const errorData = await response.json();
      return (
        errorData.message ||
        "Access denied. Only admins can perform this action."
      );
    } else if (response.status === 409) {
      const errorData = await response.text();
      return errorData || "An article with this code already exists.";
    } else {
      return Promise.reject("An error occurred while updating the article.");
    }
  };

  deleteArticleByCode = async (
    articleCode: string,
    token: string
  ): Promise<string> => {
    const response = await this.api<null, string>(
      `/article/deleteArticleByCode/${articleCode}`,
      "DELETE",
      null,
      token
    );

    try {
      if (response.status === 200) {
        return await response.text();
      } else if (response.status === 404) {
        const errorData = await response.text();
        return errorData || "Article not found";
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
        return Promise.reject("An error occurred while deleting the article.");
      }
    } catch (error) {
      return Promise.reject("Failed to process response.");
    }
  };

  deleteAllArticles = async (token: string): Promise<string> => {
    const response = await this.api<null, string>(
      `/article/deleteAllArticles`,
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
      return Promise.reject("An error occurred while deleting all articles.");
    }
  };
}

export default ArticleService;
