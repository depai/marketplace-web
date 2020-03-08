import {model, Document, PaginateModel, Schema} from 'mongoose';

export interface Product extends Document {
    name: string;
    // eslint-disable-next-line camelcase
    reference_id: string;
    EAN: string;
    SKU: string;
    image: string;
    brand:string;
    status: string;
    variants: string[];
    categories: string[];
    price: number;
    suggestedPurchasePrice: number;
    specialPrice: any;
    city: string;
    parentSKU: string;
    warehouses: any[];
    suppliers: any[];
    createdBy: any;
    updatedBy: any;
    createdAt: string;
    updatedAt: string;
}
export interface testProduct {
    _id?: string,
    name: string;
    // eslint-disable-next-line camelcase
    reference_id?: string;
    EAN?: string;
    city?: string;
    SKU: string;
    image?: string;
    brand?:string;
    id?: string;
    status?: string;
    variants?: string[];
    categories?: string[];
    price?: number;
    suggestedPurchasePrice?: number;
    specialPrice?: any;
    parentSKU?: string;
    warehouses?: any[];
    suppliers?: any[];
    createdBy?: any;
    updatedBy?: any;
    createdAt?: string;
    updatedAt?: string;
}
const productSchema = new Schema({

})
const ProductModel: PaginateModel<Product> = model<Product>(
    'products',
        productSchema
);

export default ProductModel;
