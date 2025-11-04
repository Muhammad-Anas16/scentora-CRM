import mongoose from "mongoose";

const opportunitySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: String,
    
    // Relationship
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      required: true,
      index: true
    },
    
    // Pipeline Stage
    stage: {
      type: String,
      enum: ["Lead", "Qualification", "Proposal", "Negotiation", "Closed Won", "Closed Lost"],
      default: "Lead",
      index: true
    },
    
    // Value & Probability
    value: { type: Number, required: true, min: 0 },
    probability: { type: Number, min: 0, max: 100, default: 0 },
    expectedValue: { type: Number }, // Calculated: value * (probability / 100)
    
    // Dates
    expectedCloseDate: { type: Date, index: true },
    actualCloseDate: Date,
    
    // Assignment
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },
    
    // Products
    products: [{
      name: String,
      quantity: Number,
      unitPrice: Number,
      totalPrice: Number
    }],
    
    // Competition
    competitors: [String],
    lossReason: String,
    
    // Activities
    activities: [{
      type: { type: String, enum: ["Call", "Email", "Meeting", "Note"] },
      description: String,
      date: { type: Date, default: Date.now },
      createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
    }],
    
    notes: [{
      content: String,
      createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      createdAt: { type: Date, default: Date.now }
    }]
  },
  { timestamps: true }
);

// Pre-save hook to calculate expected value
opportunitySchema.pre("save", function(next) {
  this.expectedValue = this.value * (this.probability / 100);
  next();
});

// Indexes
opportunitySchema.index({ stage: 1 });
opportunitySchema.index({ owner: 1 });
opportunitySchema.index({ customer: 1 });
opportunitySchema.index({ expectedCloseDate: 1 });
opportunitySchema.index({ createdAt: -1 });

export default mongoose.models.Opportunity || mongoose.model("Opportunity", opportunitySchema);


