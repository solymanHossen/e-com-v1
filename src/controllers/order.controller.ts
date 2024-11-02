import { Response } from 'express';
import { OrderService } from '../services/order.service';
import { AuthRequest } from '../middleware/auth.middleware';

export const createOrder = async (req: AuthRequest, res: Response) => {
    try {
        const orderData = {
            user: req.user!._id,
            ...req.body
        };
        const order = await OrderService.createOrder(orderData);
        res.status(201).json(order);
    } catch (error) {
        res.status(500).json({ message: 'Error creating order', error });
    }
};

export const getOrders = async (req: AuthRequest, res: Response) => {
    try {
        const orders = await OrderService.getOrders(req.user!._id);
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching orders', error });
    }
};

export const getOrder = async (req: AuthRequest, res: Response) => {
    try {
        const order = await OrderService.getOrderById(req.params.id);
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }
        if (order.user.toString() !== req.user!._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to view this order' });
        }
        res.json(order);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching order', error });
    }
};

export const updateOrderStatus = async (req: AuthRequest, res: Response) => {
    try {
        const updatedOrder = await OrderService.updateOrderStatus(req.params.id, req.body.status);
        if (!updatedOrder) {
            return res.status(404).json({ message: 'Order not found' });
        }
        res.json(updatedOrder);
    } catch (error) {
        res.status(500).json({ message: 'Error updating order status', error });
    }
};