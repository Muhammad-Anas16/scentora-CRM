import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, index: true },
    description: { type: String, trim: true },
    category: { type: String, trim: true, index: true },
    price: { type: Number, required: true, min: 0 },
    stock: { type: Number, default: 0, min: 0 },
    thumbnail: { type: String, trim: true },
    images: [{ type: String }],
    sku: { type: String, trim: true, unique: true, sparse: true },
    isActive: { type: Boolean, default: true, index: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

productSchema.index({ createdAt: -1 });
productSchema.index({ title: "text", description: "text", category: "text" });

export default mongoose.models.Product || mongoose.model("Product", productSchema);


