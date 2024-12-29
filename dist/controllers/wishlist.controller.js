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
exports.checkForDiscounts = exports.getSharedWishlist = exports.generateShareableLink = exports.clearWishlist = exports.removeFromWishlist = exports.addToWishlist = exports.getWishlist = void 0;
const wishlist_service_1 = require("../services/wishlist.service");
const logger_1 = __importDefault(require("../utils/logger"));
const getWishlist = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const wishlist = yield wishlist_service_1.WishlistService.getWishlist(req.user._id);
        res.json(wishlist);
    }
    catch (error) {
        logger_1.default.error(error);
        res.status(400).json({ error: 'Error fetching wishlist' });
    }
});
exports.getWishlist = getWishlist;
const addToWishlist = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { productId } = req.body;
        const wishlist = yield wishlist_service_1.WishlistService.addToWishlist(req.user._id, productId);
        res.json(wishlist);
    }
    catch (error) {
        logger_1.default.error(error);
        res.status(400).json(error);
    }
});
exports.addToWishlist = addToWishlist;
const removeFromWishlist = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { productId } = req.params;
        const wishlist = yield wishlist_service_1.WishlistService.removeFromWishlist(req.user._id, productId);
        res.json(wishlist);
    }
    catch (error) {
        logger_1.default.error(error);
        res.status(400).json(error);
    }
});
exports.removeFromWishlist = removeFromWishlist;
const clearWishlist = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield wishlist_service_1.WishlistService.clearWishlist(req.user._id);
        res.json({ message: 'Wishlist cleared successfully' });
    }
    catch (error) {
        logger_1.default.error(error);
        res.status(400).json(error);
    }
});
exports.clearWishlist = clearWishlist;
const generateShareableLink = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const shareableLink = yield wishlist_service_1.WishlistService.generateShareableLink(req.user._id);
        res.json({ shareableLink });
    }
    catch (error) {
        logger_1.default.error(error);
        res.status(400).json(error);
    }
});
exports.generateShareableLink = generateShareableLink;
const getSharedWishlist = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { shareableLink } = req.params;
        const wishlist = yield wishlist_service_1.WishlistService.getWishlistByShareableLink(shareableLink);
        if (!wishlist) {
            res.status(404).json({ error: 'Shared wishlist not found' });
            return;
        }
        res.json(wishlist);
    }
    catch (error) {
        logger_1.default.error(error);
        res.status(400).json({ error: 'Error fetching shared wishlist' });
    }
});
exports.getSharedWishlist = getSharedWishlist;
const checkForDiscounts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const discountedItems = yield wishlist_service_1.WishlistService.checkForDiscounts(req.user._id);
        res.json(discountedItems);
    }
    catch (error) {
        logger_1.default.error(error);
        res.status(400).json(error);
    }
});
exports.checkForDiscounts = checkForDiscounts;
