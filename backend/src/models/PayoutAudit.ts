import mongoose, { Schema, Document } from 'mongoose';

export interface IPayoutAudit extends Document {
  payout_id: mongoose.Types.ObjectId;
  action: 'CREATED' | 'SUBMITTED' | 'APPROVED' | 'REJECTED';
  performed_by: mongoose.Types.ObjectId;
  performed_by_email: string;
  timestamp: Date;
}

const payoutAuditSchema = new Schema<IPayoutAudit>(
  {
    payout_id: {
      type: Schema.Types.ObjectId,
      ref: 'Payout',
      required: true,
    },
    action: {
      type: String,
      enum: ['CREATED', 'SUBMITTED', 'APPROVED', 'REJECTED'],
      required: true,
    },
    performed_by: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    performed_by_email: {
      type: String,
      required: true,
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: false }
);

const PayoutAudit = mongoose.model<IPayoutAudit>('PayoutAudit', payoutAuditSchema);
export default PayoutAudit;
