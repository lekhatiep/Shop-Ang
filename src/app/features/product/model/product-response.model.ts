import { ProductImageModel } from "./product-image.model";
import { ProductModel } from "./product.model";

export interface ProductResponseModel {
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
    data:  ProductModel[] | null,
}