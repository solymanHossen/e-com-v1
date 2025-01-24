import { Product, IProduct } from '../models/product.model';

export class ProductService {
    static async createProduct(productData: Partial<IProduct>): Promise<IProduct> {
        const product = new Product(productData);
        return product.save();
    }

    static async getProducts(query: any = {}): Promise<{ products: IProduct[], pagination: any }> {
        const page = parseInt(query.page) || 1;
        const limit = parseInt(query.limit) || 10;
        const search = query.search || '';
        const category = query.category || '';
        const filterQuery = {
            ...(search && { name: { $regex: search, $options: 'i' } }),
            ...(category && { category }),
        };
        const skip = (page - 1) * limit;
        const [products, total] = await Promise.all([
            Product.find(filterQuery).skip(skip).limit(limit),
            Product.countDocuments(filterQuery)
        ]);
        const pagination = {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit)
        };

        return { products, pagination };
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