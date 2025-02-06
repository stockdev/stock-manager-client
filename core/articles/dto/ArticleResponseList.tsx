import { ArticleResponse } from "./ArticleResponse";

export interface ArticleResponseList {
    list: ArticleResponse[];
    currentPage: number;
    totalPages: number;
    totalElements: number;
}
