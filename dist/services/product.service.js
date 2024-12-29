"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductService = void 0;
const product_model_1 = require("../models/product.model");
class ProductService {
    static createProduct(productData) {
        return __awaiter(this, void 0, void 0, function* () {
            const product = new product_model_1.Product(productData);
            return product.save();
        });
    }
    static getProducts() {
        return __awaiter(this, arguments, void 0, function* (query = {}) {
            const page = parseInt(query.page) || 1;
            const limit = parseInt(query.limit) || 10;
            const search = query.search || '';
            const filterQuery = search ? { name: { $regex: search, $options: 'i' } } : {};
            const skip = (page - 1) * limit;
            const [products, total] = yield Promise.all([
                product_model_1.Product.find(filterQuery).skip(skip).limit(limit),
                product_model_1.Product.countDocuments(filterQuery)
            ]);
            const pagination = {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit)
            };
            return { products, pagination };
        });
    }
    static getProductById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return product_model_1.Product.findById(id);
        });
    }
    static updateProduct(id, updateData) {
        return __awaiter(this, void 0, void 0, function* () {
            return product_model_1.Product.findByIdAndUpdate(id, updateData, { new: true });
        });
    }
    static deleteProduct(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return product_model_1.Product.findByIdAndDelete(id);
        });
    }
    static getProductsByCategory(category) {
        return __awaiter(this, void 0, void 0, function* () {
            return product_model_1.Product.find({ category: category });
        });
    }
}
exports.ProductService = ProductService;
