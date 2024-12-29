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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOrderSummary = exports.confirmOrder = exports.createCheckoutSession = void 0;
const checkout_service_1 = require("../services/checkout.service");
const logger_1 = __importDefault(require("../utils/logger"));
const createCheckoutSession = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { shippingAddress, billingAddress, promotionCode } = req.body;
        const { sessionId, orderId } = yield checkout_service_1.CheckoutService.createCheckoutSession(req.user._id, shippingAddress, billingAddress, promotionCode);
        res.json({ sessionId, orderId });
    }
    catch (error) {
        logger_1.default.error('createCheckoutSession', error);
        res.status(400).json(error);
    }
});
exports.createCheckoutSession = createCheckoutSession;
const confirmOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { sessionId } = req.body;
        const order = yield checkout_service_1.CheckoutService.confirmOrder(sessionId);
        res.json(order);
    }
    catch (error) {
        logger_1.default.error('confirmOrder', error);
        res.status(400).json(error);
    }
});
exports.confirmOrder = confirmOrder;
const getOrderSummary = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { orderId } = req.params;
        const order = yield checkout_service_1.CheckoutService.getOrderSummary(orderId);
        res.json(order);
    }
    catch (error) {
        logger_1.default.error(error);
        res.status(400).json(error);
    }
});
exports.getOrderSummary = getOrderSummary;
