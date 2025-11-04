import mongoose from "mongoose";

const customerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, index: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    phone: { type: String, trim: true, index: true },
    company: { type: String, trim: true },
    jobTitle: { type: String, trim: true },
    
    // Address
    address: {
      street: { type: String },
      city: { type: String },
      state: { type: String },
      zipCode: { type: String },
      country: { type: String }
    },
    
    // CRM Fields
    lifecycleStage: {
      type: String,
      enum: ["Lead", "Customer", "VIP", "Churned"],
      default: "Lead",
      index: true
    },
    
    // Assignment
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      index: true
    },
    
    // Conversion Tracking
    convertedFromLead: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Lead"
    },
    
    // Organization
    tags: [{ type: String }],
    
    // Analytics
    totalOrderValue: { type: Number, default: 0 },
    orderCount: { type: Number, default: 0 },
    lastOrderDate: Date,
    
    // Notes (embedded)
    notes: [{
      content: { type: String, required: true },
      createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      createdAt: { type: Date, default: Date.now }
    }]
  },
  { timestamps: true }
);

// Indexes for performance
customerSchema.index({ email: 1 });
customerSchema.index({ lifecycleStage: 1 });
customerSchema.index({ assignedTo: 1 });
customerSchema.index({ createdAt: -1 });
customerSchema.index({ name: "text", email: "text", company: "text" }); // Text search

export default mongoose.models.Customer || mongoose.model("Customer", customerSchema);

