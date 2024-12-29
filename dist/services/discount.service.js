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
exports.DiscountService = void 0;
const discount_model_1 = require("../models/discount.model");
class DiscountService {
    static createDiscount(discountData) {
        return __awaiter(this, void 0, void 0, function* () {
            const discount = new discount_model_1.Discount(discountData);
            return discount.save();
        });
    }
    static getDiscounts() {
        return __awaiter(this, void 0, void 0, function* () {
            return discount_model_1.Discount.find({ isActive: true });
        });
    }
    static updateDiscount(id, updateData) {
        return __awaiter(this, void 0, void 0, function* () {
            return discount_model_1.Discount.findByIdAndUpdate(id, updateData, { new: true });
        });
    }
    static deleteDiscount(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return discount_model_1.Discount.findByIdAndDelete(id);
        });
    }
    static applyDiscount(discount, totalAmount) {
        return __awaiter(this, void 0, void 0, function* () {
            if (discount.type === 'percentage') {
                return totalAmount * (discount.value / 100);
            }
            else {
                return Math.min(discount.value, totalAmount);
            }
        });
    }
    static getApplicableDiscounts(products, categories, totalAmount) {
        return __awaiter(this, void 0, void 0, function* () {
            const currentDate = new Date();
            return discount_model_1.Discount.find({
                isActive: true,
                startDate: { $lte: currentDate },
                endDate: { $gte: currentDate },
                $or: [
                    { applicableProducts: { $in: products } },
                    { applicableCategories: { $in: categories } },
                    { $and: [{ applicableProducts: { $exists: false } }, { applicableCategories: { $exists: false } }] },
                ],
                minPurchaseAmount: { $lte: totalAmount },
            });
        });
    }
}
exports.DiscountService = DiscountService;
