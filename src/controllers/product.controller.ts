import { Request, Response } from "express";
import { ProductService } from "../services/product.service";
import logger from "../utils/logger";
import sendResponse from "../utils/response";

export const createProduct = async (req: Request, res: Response) => {
  try {
    const product = await ProductService.createProduct(req.body);
    sendResponse(res,201, true, "Product created successfully", product);
  } catch (error) {
    sendResponse(res , 500, false, "Error creating product", error);
  }
};

export const getProducts = async (req: Request, res: Response) => {
  try {
    const products = await ProductService.getProducts(req.query);
    sendResponse(res, 200, true, "Products fetched successfully", products);
  } catch (error) {
    logger.error(error);
    sendResponse(res, 500, false, "Error fetching products", error);
  }
};

export const getProduct = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const product = await ProductService.getProductById(req.params.id);
    if (!product) {
      sendResponse(res, 404, false, "Product not found");
      return;
    }
    sendResponse(res, 200, true, "Products fetched successfully", product);
  } catch (error) {
    logger.error(error);
    sendResponse(res, 500, false, "Error fetching product", error);
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
      sendResponse(res, 404, false, "Product not found");
      return;
    }
    sendResponse(res, 200, true, "Product updated successfully", updatedProduct);
  } catch (error) {
    logger.error(error);
    sendResponse(res, 500, false, "Error updating product", error);
  }
};

export const deleteProduct = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const deletedProduct = await ProductService.deleteProduct(req.params.id);
    if (!deletedProduct) {
      sendResponse(res, 404, false, "Product not found");
      return;
    }
    sendResponse(res, 200, true, "Product deleted successfully", deletedProduct);
  } catch (error) {
    logger.error(error);
    sendResponse(res, 500, false, "Error deleting product", error);
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
    sendResponse(res, 200, true, "Products fetched successfully", products);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching products by category", error });
    sendResponse(res, 500, false, "Error deleting product", error);
  }
};
