import mongoose, { Schema, Document } from 'mongoose';

export interface IPayout extends Document {
  vendor_id: mongoose.Types.ObjectId;
  amount: number;
  mode: 'UPI' | 'IMPS' | 'NEFT';
  note?: string;
  status: 'Draft' | 'Submitted' | 'Approved' | 'Rejected';
  decision_reason?: string;
  created_by: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const payoutSchema = new Schema<IPayout>(
  {
    vendor_id: {
      type: Schema.Types.ObjectId,
      ref: 'Vendor',
      required: true,
    },
    amount: {
      type: Number,
      required: true,
      validate: {
        validator: (v: number) => v > 0,
        message: 'Amount must be greater than 0',
      },
    },
    mode: {
      type: String,
      enum: ['UPI', 'IMPS', 'NEFT'],
      required: true,
    },
    note: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: ['Draft', 'Submitted', 'Approved', 'Rejected'],
      default: 'Draft',
    },
    decision_reason: {
      type: String,
      trim: true,
    },
    created_by: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
);

const Payout = mongoose.model<IPayout>('Payout', payoutSchema);
export default Payout;
