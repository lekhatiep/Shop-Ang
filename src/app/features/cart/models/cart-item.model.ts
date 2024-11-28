export interface CartItemModel {
    id?: string,
    productId: number,
    title?: string,
    imgPath?: string,
    price: number,
    quantity: number,
    userID?: number
}

export interface CartItemInPageModel {
    id?: string,
    title?: string,
    imgPath?: string,
    total: number,
    productId: number,
    price: number,
    discount: number,
    quantity: number,
    active: boolean,
    isChecked: boolean,
    isOrder: boolean
}