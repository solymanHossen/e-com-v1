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
exports.getPromotionEffectiveness = exports.deletePromotion = exports.updatePromotion = exports.getPromotions = exports.createPromotion = void 0;
const promotion_service_1 = require("../services/promotion.service");
const logger_1 = __importDefault(require("../utils/logger"));
const createPromotion = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const promotion = yield promotion_service_1.PromotionService.createPromotion(req.body);
        res.status(201).json(promotion);
    }
    catch (error) {
        logger_1.default.error('Error creating promotion:', error);
        res.status(400).json({ error: 'Error creating promotion' });
    }
});
exports.createPromotion = createPromotion;
const getPromotions = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const promotions = yield promotion_service_1.PromotionService.getPromotions();
        res.json(promotions);
    }
    catch (error) {
        res.status(400).json({ error: 'Error fetching promotions' });
    }
});
exports.getPromotions = getPromotions;
const updatePromotion = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const promotion = yield promotion_service_1.PromotionService.updatePromotion(req.params.id, req.body);
        if (!promotion) {
            res.status(404).json({ error: 'Promotion not found' });
            return;
        }
        res.json(promotion);
    }
    catch (error) {
        logger_1.default.error('Error fetching update promotion', error);
        res.status(400).json({ error: 'Error updating promotion' });
    }
});
exports.updatePromotion = updatePromotion;
const deletePromotion = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const promotion = yield promotion_service_1.PromotionService.deletePromotion(req.params.id);
        if (!promotion) {
            res.status(404).json({ error: 'Promotion not found' });
            return;
        }
        res.json({ message: 'Promotion deleted successfully' });
    }
    catch (error) {
        logger_1.default.error("Error deleting promotion page", error);
        res.status(400).json({ error: 'Error deleting promotion' });
    }
});
exports.deletePromotion = deletePromotion;
const getPromotionEffectiveness = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const effectiveness = yield promotion_service_1.PromotionService.getPromotionEffectiveness(req.params.id);
        res.json(effectiveness);
    }
    catch (error) {
        logger_1.default.error("Error for promotion effectiveness", error);
        res.status(400).json({ error: 'Error fetching promotion effectiveness' });
    }
});
exports.getPromotionEffectiveness = getPromotionEffectiveness;
