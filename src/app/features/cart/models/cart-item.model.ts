export interface CartItemModel {
    id?: string,
    productId: number,
    title?: string,
    imgPath?: string,
    price: number,
    quantity: number,
    userID?: number
}