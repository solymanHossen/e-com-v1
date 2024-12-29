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
exports.deleteDiscount = exports.updateDiscount = exports.getDiscounts = exports.createDiscount = void 0;
const discount_service_1 = require("../services/discount.service");
const logger_1 = __importDefault(require("../utils/logger"));
const createDiscount = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const discount = yield discount_service_1.DiscountService.createDiscount(req.body);
        res.status(201).json(discount);
    }
    catch (error) {
        res.status(400).json({ error: 'Error creating discount' });
    }
});
exports.createDiscount = createDiscount;
const getDiscounts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const discounts = yield discount_service_1.DiscountService.getDiscounts();
        res.json(discounts);
    }
    catch (error) {
        logger_1.default.error(error);
        res.status(400).json({ error: 'Error fetching discounts' });
    }
});
exports.getDiscounts = getDiscounts;
const updateDiscount = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const discount = yield discount_service_1.DiscountService.updateDiscount(req.params.id, req.body);
        if (!discount) {
            res.status(404).json({ error: 'Discount not found' });
            return;
        }
        res.json(discount);
    }
    catch (error) {
        logger_1.default.error(error);
        res.status(400).json({ error: 'Error updating discount' });
    }
});
exports.updateDiscount = updateDiscount;
const deleteDiscount = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const discount = yield discount_service_1.DiscountService.deleteDiscount(req.params.id);
        if (!discount) {
            res.status(404).json({ error: 'Discount not found' });
            return;
        }
        res.json({ message: 'Discount deleted successfully' });
    }
    catch (error) {
        logger_1.default.error(error);
        res.status(400).json({ error: 'Error deleting discount' });
    }
});
exports.deleteDiscount = deleteDiscount;
