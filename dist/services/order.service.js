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
exports.OrderService = void 0;
const order_model_1 = require("../models/order.model");
class OrderService {
    static createOrder(orderData) {
        return __awaiter(this, void 0, void 0, function* () {
            const order = new order_model_1.Order(orderData);
            return order.save();
        });
    }
    static getOrders(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return order_model_1.Order.find({ user: userId }).populate('items.product');
        });
    }
    static getOrderById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return order_model_1.Order.findById(id).populate('items.product');
        });
    }
    static updateOrderStatus(id, status) {
        return __awaiter(this, void 0, void 0, function* () {
            return order_model_1.Order.findByIdAndUpdate(id, { status }, { new: true });
        });
    }
}
exports.OrderService = OrderService;
