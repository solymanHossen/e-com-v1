import { Request, Response } from "express";
import { ProductService } from "../services/product.service";
import logger from "../utils/logger";
import sendResponse from "../utils/response";

export const createProduct = async (req: Request, res: Response) => {
  try {
    const product = await ProductService.createProduct(req.body);
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ message: "Error creating product", error });
  }
};

export const getProducts = async (req: Request, res: Response) => {
  try {
    const products = await ProductService.getProducts(req.query);
    sendResponse(res, 200, true, "Products fetched successfully", products);
  } catch (error) {
    logger.error(error);
    res.status(500).json({ message: "Error fetching products", error });
  }
};

export const getProduct = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const product = await ProductService.getProductById(req.params.id);
    if (!product) {
      res.status(404).json({ message: "Product not found" });
      return;
    }
    res.json(product);
  } catch (error) {
    logger.error(error);
    res.status(500).json({ message: "Error fetching product", error });
  }
};

export const updateProduct = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const updatedProduct = await ProductService.updateProduct(
      req.params.id,
      req.body
    );
    if (!updatedProduct) {
      res.status(404).json({ message: "Product not found" });
      return;
    }
    res.json(updatedProduct);
  } catch (error) {
    logger.error(error);
    res.status(500).json({ message: "Error updating product", error });
  }
};

export const deleteProduct = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const deletedProduct = await ProductService.deleteProduct(req.params.id);
    if (!deletedProduct) {
      res.status(404).json({ message: "Product not found" });
      return;
    }
    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    logger.error(error);
    res.status(500).json({ message: "Error deleting product", error });
  }
};

export const getProductsByCategory = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const products = await ProductService.getProductsByCategory(
      req.params.category
    );
    res.json(products);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching products by category", error });
  }
};
