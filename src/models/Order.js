import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    // FIXED: Changed from customerName to customer ObjectId
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      required: true,
      index: true
    },
    
    product: { type: String, required: true, trim: true },
    amount: { type: Number, required: true, min: 0 },
    status: {
      type: String,
      enum: ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"],
      default: "Pending",
      index: true
    },
    
    // Additional fields
    orderDate: { type: Date, default: Date.now },
    deliveryDate: Date,
    
    // Relationship to Opportunity (if created from deal)
    opportunity: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Opportunity"
    },
    
    // Created by user
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      index: true
    }
  },
  { timestamps: true }
);

// Indexes
orderSchema.index({ customer: 1 });
orderSchema.index({ status: 1 });
orderSchema.index({ createdAt: -1 });
orderSchema.index({ createdBy: 1 });

export default mongoose.models.Order || mongoose.model("Order", orderSchema);