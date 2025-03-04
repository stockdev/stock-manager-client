import UtilajResponseDTO from "./UtilajResponseDTO";

export default interface UtilajeResponseList {
    list : UtilajResponseDTO[];
    currentPage: number;
    totalPages: number;
    totalElements: number;
}