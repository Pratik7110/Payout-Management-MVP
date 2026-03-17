import { Router, Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import Vendor from '../models/Vendor';
import { authMiddleware } from '../middleware/auth';
import { asyncHandler } from '../middleware/errorHandler';

const router = Router();

// Apply auth middleware to all vendor routes
router.use(authMiddleware);

// GET /api/vendors - List all vendors
router.get(
  '/',
  asyncHandler(async (req: Request, res: Response) => {
    const vendors = await Vendor.find({ is_active: true }).sort({ createdAt: -1 });
    res.json(vendors);
  })
);

// POST /api/vendors - Create vendor
router.post(
  '/',
  [
    body('name').trim().notEmpty().withMessage('Vendor name is required'),
    body('upi_id').optional().trim(),
    body('bank_account').optional().trim(),
    body('ifsc').optional().trim(),
  ],
  asyncHandler(async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, upi_id, bank_account, ifsc } = req.body;

    // Validate that at least one payment method is provided
    if (!upi_id && !bank_account) {
      return res.status(400).json({
        error: 'At least one payment method (UPI ID or Bank Account) is required',
      });
    }

    const vendor = new Vendor({
      name,
      upi_id,
      bank_account,
      ifsc,
      is_active: true,
    });

    await vendor.save();
    res.status(201).json(vendor);
  })
);

export default router;
