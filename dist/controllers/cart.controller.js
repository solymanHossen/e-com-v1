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
exports.clearCart = exports.updateCartItemQuantity = exports.removeFromCart = exports.addToCart = exports.getCart = void 0;
const cart_service_1 = require("../services/cart.service");
const logger_1 = __importDefault(require("../utils/logger"));
const getCart = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const cart = yield cart_service_1.CartService.getCart(req.user._id);
        res.json(cart);
    }
    catch (error) {
        logger_1.default.error('getCart', error);
        res.status(400).json({ error: 'Error fetching cart' });
    }
});
exports.getCart = getCart;
const addToCart = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { productId, quantity } = req.body;
        const cart = yield cart_service_1.CartService.addToCart(req.user._id, productId, quantity);
        res.json(cart);
    }
    catch (error) {
        logger_1.default.error(error);
        res.status(400).json({ error: error.message });
    }
});
exports.addToCart = addToCart;
const removeFromCart = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const cart = yield cart_service_1.CartService.removeFromCart(req.user._id, req.params.cartItemId);
        res.json(cart);
    }
    catch (error) {
        logger_1.default.error('removeFromCart', error);
        res.status(400).json({ error });
    }
});
exports.removeFromCart = removeFromCart;
const updateCartItemQuantity = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { quantity } = req.body;
        const cart = yield cart_service_1.CartService.updateCartItemQuantity(req.user._id, req.params.cartItemId, quantity);
        res.json(cart);
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
});
exports.updateCartItemQuantity = updateCartItemQuantity;
const clearCart = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield cart_service_1.CartService.clearCart(req.user._id);
        res.json({ message: 'Cart cleared successfully' });
    }
    catch (error) {
        logger_1.default.error(error);
        res.status(400).json(error);
    }
});
exports.clearCart = clearCart;
