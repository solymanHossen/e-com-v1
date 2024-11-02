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
exports.updateOrderStatus = exports.getOrder = exports.getOrders = exports.createOrder = void 0;
const order_service_1 = require("../services/order.service");
const createOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const orderData = Object.assign({ user: req.user._id }, req.body);
        const order = yield order_service_1.OrderService.createOrder(orderData);
        res.status(201).json(order);
    }
    catch (error) {
        res.status(500).json({ message: 'Error creating order', error });
    }
});
exports.createOrder = createOrder;
const getOrders = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const orders = yield order_service_1.OrderService.getOrders(req.user._id);
        res.json(orders);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching orders', error });
    }
});
exports.getOrders = getOrders;
const getOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const order = yield order_service_1.OrderService.getOrderById(req.params.id);
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }
        if (order.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to view this order' });
        }
        res.json(order);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching order', error });
    }
});
exports.getOrder = getOrder;
const updateOrderStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const updatedOrder = yield order_service_1.OrderService.updateOrderStatus(req.params.id, req.body.status);
        if (!updatedOrder) {
            return res.status(404).json({ message: 'Order not found' });
        }
        res.json(updatedOrder);
    }
    catch (error) {
        res.status(500).json({ message: 'Error updating order status', error });
    }
});
exports.updateOrderStatus = updateOrderStatus;
