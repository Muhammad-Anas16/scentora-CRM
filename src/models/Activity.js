import mongoose from "mongoose";

const activitySchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["Call", "Email", "Meeting", "Note", "Task"],
      required: true,
      index: true
    },
    subject: { type: String, required: true },
    description: String,
    
    // Related Entity (polymorphic)
    relatedTo: {
      entityType: {
        type: String,
        enum: ["Customer", "Lead", "Opportunity", "Order"],
        required: true
      },
      entityId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        refPath: "relatedTo.entityType"
      }
    },
    
    // Assignment
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      index: true
    },
    
    // Scheduling
    dueDate: { type: Date, index: true },
    completed: { type: Boolean, default: false },
    completedAt: Date,
    
    // Metadata
    duration: Number, // in minutes (for calls/meetings)
    outcome: String, // e.g., "Positive", "Neutral", "Negative"
    
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    }
  },
  { timestamps: true }
);

// Indexes
activitySchema.index({ "relatedTo.entityType": 1, "relatedTo.entityId": 1 });
activitySchema.index({ assignedTo: 1 });
activitySchema.index({ dueDate: 1 });
activitySchema.index({ completed: 1 });
activitySchema.index({ createdAt: -1 });

export default mongoose.models.Activity || mongoose.model("Activity", activitySchema);

