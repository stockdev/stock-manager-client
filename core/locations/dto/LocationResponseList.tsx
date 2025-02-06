import LocationResponse from "./LocationResponse";

export default interface LocationResponseList {
    list : LocationResponse[];
    currentPage: number;
    totalPages: number;
    totalElements: number;
}