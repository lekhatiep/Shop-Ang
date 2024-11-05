import { CategoryModel } from "./category.model";

export interface CategoryResponse {
    currentPage: number,
    error: any,
    hasNext: boolean,
    hasPrevious: boolean,
    message: string,
    pageNumber: number,
    pageSize: number,
    succeeded: boolean,
    totalPages: 0,
    totalRecord: 0,
    data: CategoryModel[] | null
}