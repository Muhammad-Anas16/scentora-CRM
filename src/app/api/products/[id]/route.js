import { connectToDatabase } from "@/lib/mongodb";
import helperFunction from "@/lib/helperFunction";
import Product from "@/models/Product";
import { withRole } from "@/middleware/auth";

export async function GET(_req, { params }) {
  try {
    await connectToDatabase();
    const item = await Product.findById(params.id).lean();
    if (!item) return helperFunction(404, null, true, "Product not found");
    return helperFunction(200, { item }, false, "Product fetched");
  } catch (error) {
    console.error("Product GET by id error:", error);
    return helperFunction(500, null, true, "Internal server error");
  }
}

export const PUT = withRole(async (req, { params }) => {
  try {
    await connectToDatabase();
    const body = await req.json();
    const updated = await Product.findByIdAndUpdate(params.id, body, { new: true });
    if (!updated) return helperFunction(404, null, true, "Product not found");
    return helperFunction(200, { item: updated }, false, "Product updated");
  } catch (error) {
    console.error("Product PUT error:", error);
    return helperFunction(500, null, true, "Internal server error");
  }
}, ["Admin", "Manager"]);

export const DELETE = withRole(async (_req, { params }) => {
  try {
    await connectToDatabase();
    const deleted = await Product.findByIdAndDelete(params.id);
    if (!deleted) return helperFunction(404, null, true, "Product not found");
    return helperFunction(200, null, false, "Product deleted");
  } catch (error) {
    console.error("Product DELETE error:", error);
    return helperFunction(500, null, true, "Internal server error");
  }
}, ["Admin", "Manager"]);


