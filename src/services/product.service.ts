import { Product, IProduct } from '../models/product.model';

export class ProductService {
    static async createProduct(productData: Partial<IProduct>): Promise<IProduct> {
        const product = new Product(productData);
        return product.save();
    }

    static async getProducts(query: any = {}): Promise<IProduct[]> {
        return Product.find(query);
    }

    static async getProductById(id: string): Promise<IProduct | null> {
        return Product.findById(id);
    }

    static async updateProduct(id: string, updateData: Partial<IProduct>): Promise<IProduct | null> {
        return Product.findByIdAndUpdate(id, updateData, { new: true });
    }

    static async deleteProduct(id: string): Promise<IProduct | null> {
        return Product.findByIdAndDelete(id);
    }

    static async getProductsByCategory(category: string): Promise<IProduct[]> {
        return Product.find({ category: category });
    }
}