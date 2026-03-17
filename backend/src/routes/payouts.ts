import { Router, Request, Response } from 'express';
import { body, query, validationResult } from 'express-validator';
import Payout from '../models/Payout';
import PayoutAudit from '../models/PayoutAudit';
import Vendor from '../models/Vendor';
import { authMiddleware, requireRole } from '../middleware/auth';
import { asyncHandler } from '../middleware/errorHandler';

const router = Router();

// Apply auth middleware to all payout routes
router.use(authMiddleware);

// POST /api/payouts - Create payout (OPS only)
router.post(
  '/',
  requireRole('OPS'),
  [
    body('vendor_id').notEmpty().withMessage('Vendor ID is required'),
    body('amount')
      .isFloat({ min: 0.01 })
      .withMessage('Amount must be greater than 0'),
    body('mode')
      .isIn(['UPI', 'IMPS', 'NEFT'])
      .withMessage('Mode must be UPI, IMPS, or NEFT'),
    body('note').optional().trim(),
  ],
  asyncHandler(async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { vendor_id, amount, mode, note } = req.body;

    // Verify vendor exists and is active
    const vendor = await Vendor.findById(vendor_id);
    if (!vendor || !vendor.is_active) {
      return res.status(404).json({ error: 'Vendor not found or inactive' });
    }

    // Create payout
    const payout = new Payout({
      vendor_id,
      amount,
      mode,
      note,
      status: 'Draft',
      created_by: req.user!.userId,
    });

    await payout.save();

    // Create audit entry
    await PayoutAudit.create({
      payout_id: payout._id,
      action: 'CREATED',
      performed_by: req.user!.userId,
      performed_by_email: req.user!.email,
    });

    res.status(201).json(payout);
  })
);

// GET /api/payouts - List payouts with filters
router.get(
  '/',
  [
    query('status').optional().isIn(['Draft', 'Submitted', 'Approved', 'Rejected']),
    query('vendor_id').optional(),
  ],
  asyncHandler(async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { status, vendor_id } = req.query;

    const filter: any = {};
    if (status) filter.status = status;
    if (vendor_id) filter.vendor_id = vendor_id;

    const payouts = await Payout.find(filter)
      .populate('vendor_id', 'name upi_id bank_account ifsc')
      .populate('created_by', 'email role')
      .sort({ createdAt: -1 });

    res.json(payouts);
  })
);

// GET /api/payouts/:id - Get payout details with audit trail
router.get(
  '/:id',
  asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;

    const payout = await Payout.findById(id)
      .populate('vendor_id', 'name upi_id bank_account ifsc')
      .populate('created_by', 'email role');

    if (!payout) {
      return res.status(404).json({ error: 'Payout not found' });
    }

    const auditTrail = await PayoutAudit.find({ payout_id: id })
      .populate('performed_by', 'email')
      .sort({ timestamp: 1 });

    res.json({
      ...payout.toObject(),
      auditTrail,
    });
  })
);

export default router;
