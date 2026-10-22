import { readData } from "../utils/jsonStore.js";

export async function getProducts(req, res, next) {
  try {
    const products = await readData("products");
    const limit = Number(req.query.limit) || products.length;
    res.json(products.slice(0, limit));
  } catch (err) {
    next(err);
  }
}
