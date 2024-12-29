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
exports.PromotionService = void 0;
const promotion_model_1 = require("../models/promotion.model");
const order_model_1 = require("../models/order.model");
class PromotionService {
    static createPromotion(promotionData) {
        return __awaiter(this, void 0, void 0, function* () {
            const promotion = new promotion_model_1.Promotion(promotionData);
            return promotion.save();
        });
    }
    static getPromotions() {
        return __awaiter(this, void 0, void 0, function* () {
            return promotion_model_1.Promotion.find({ isActive: true });
        });
    }
    static getPromotionByCode(code) {
        return __awaiter(this, void 0, void 0, function* () {
            return promotion_model_1.Promotion.findOne({ code, isActive: true });
        });
    }
    static updatePromotion(id, updateData) {
        return __awaiter(this, void 0, void 0, function* () {
            return promotion_model_1.Promotion.findByIdAndUpdate(id, updateData, { new: true });
        });
    }
    static deletePromotion(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return promotion_model_1.Promotion.findByIdAndDelete(id);
        });
    }
    static applyPromotion(promotion, totalAmount) {
        return __awaiter(this, void 0, void 0, function* () {
            if (promotion.type === 'percentage') {
                return totalAmount * (promotion.value / 100);
            }
            else {
                return Math.min(promotion.value, totalAmount);
            }
        });
    }
    static incrementUsageCount(id) {
        return __awaiter(this, void 0, void 0, function* () {
            yield promotion_model_1.Promotion.findByIdAndUpdate(id, { $inc: { usageCount: 1 } });
        });
    }
    static getPromotionEffectiveness(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const promotion = yield promotion_model_1.Promotion.findById(id);
            if (!promotion) {
                throw new Error('Promotion not found');
            }
            const ordersWithPromotion = yield order_model_1.Order.find({ promotion: id });
            const totalRevenue = ordersWithPromotion.reduce((sum, order) => sum + order.finalAmount, 0);
            const totalDiscount = ordersWithPromotion.reduce((sum, order) => sum + order.discountAmount, 0);
            return {
                promotionName: promotion.name,
                usageCount: promotion.usageCount,
                totalRevenue,
                totalDiscount,
                averageOrderValue: totalRevenue / ordersWithPromotion.length,
            };
        });
    }
}
exports.PromotionService = PromotionService;
