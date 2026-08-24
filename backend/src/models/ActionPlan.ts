import mongoose, { Schema, Document } from 'mongoose';

export interface IPlanItem {
  _id?: mongoose.Types.ObjectId;
  title: string;
  description: string;
  type: 'opportunity' | 'skill' | 'project' | 'networking' | 'general';
  reasoning: string;
  isCompleted: boolean;
  referenceId?: mongoose.Types.ObjectId; // e.g., Opportunity ID
}

export interface IActionPlan extends Document {
  userId: mongoose.Types.ObjectId;
  careerGoal: string;
  skillGaps: string[];
  items: IPlanItem[];
  validUntil: Date;
  createdAt: Date;
  updatedAt: Date;
}

const PlanItemSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  type: { type: String, enum: ['opportunity', 'skill', 'project', 'networking', 'general'], required: true },
  reasoning: { type: String, required: true },
  isCompleted: { type: Boolean, default: false },
  referenceId: { type: Schema.Types.ObjectId }, // Flexible ref
});

const ActionPlanSchema: Schema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    careerGoal: { type: String, required: true },
    skillGaps: [{ type: String }],
    items: [PlanItemSchema],
    validUntil: { type: Date, required: true }, // e.g., end of the month/week
  },
  { timestamps: true }
);

export const ActionPlan = mongoose.model<IActionPlan>('ActionPlan', ActionPlanSchema);
