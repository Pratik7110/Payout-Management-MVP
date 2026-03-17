import { Router, Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import Vendor from '../models/Vendor';
import { authMiddleware } from '../middleware/auth';
import { asyncHandler } from '../middleware/errorHandler';

const router = Router();

// Apply auth middleware to all vendor routes
router.use(authMiddleware);

/**
 * @route   GET /api/vendors
 * @desc    Get all active vendors
 * @access  Private
 * @security bearerAuth
 * @returns {array} Array of vendor objects
 */
router.get(
  '/',
  asyncHandler(async (req: Request, res: Response) => {
    const vendors = await Vendor.find({ is_active: true }).sort({ createdAt: -1 });
    res.json(vendors);
  })
);

/**
 * @route   POST /api/vendors
 * @desc    Create a new vendor
 * @access  Private
 * @security bearerAuth
 * @param   {string} name - Vendor name (required)
 * @param   {string} upi_id - UPI ID (optional)
 * @param   {string} bank_account - Bank account number (optional)
 * @param   {string} ifsc - IFSC code (optional)
 * @returns {object} Created vendor object
 */
router.post(
  '/',
  [
    body('name')
      .trim()
      .notEmpty()
      .withMessage('Vendor name is required')
      .isLength({ min: 2, max: 100 })
      .withMessage('Vendor name must be between 2 and 100 characters')
      .matches(/^[a-zA-Z0-9\s\-&.,()]+$/)
      .withMessage('Vendor name contains invalid characters'),
    body('upi_id')
      .optional()
      .trim()
      .if((value) => value && value.length > 0)
      .matches(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9]+$/)
      .withMessage('UPI ID must be in format: username@bank (e.g., vendor@upi)'),
    body('bank_account')
      .optional()
      .trim()
      .if((value) => value && value.length > 0)
      .matches(/^\d{10,18}$/)
      .withMessage('Bank account must be 10-18 digits'),
    body('ifsc')
      .optional()
      .trim()
      .if((value) => value && value.length > 0)
      .matches(/^[A-Z]{4}0[A-Z0-9]{6}$/)
      .withMessage('IFSC code must be 11 characters (e.g., HDFC0001234)'),
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
      upi_id: upi_id || undefined,
      bank_account: bank_account || undefined,
      ifsc: ifsc || undefined,
      is_active: true,
    });

    await vendor.save();
    res.status(201).json(vendor);
  })
);

export default router;
