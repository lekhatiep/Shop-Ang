import { ProductImageModel } from "./product-image.model"

export interface ProductModel {
    id: number,
    imagePath: string | null,
    categoryID: string,
    code: string,
    title: string,
    description: string,
    price: number,
    quantity: number,
    viewCount: number,
    isFavorite: boolean,
    isFeatured: boolean,
    thumbnailImage: string | null,
    productCategory: any
    productImages : ProductImageModel[] | null
}