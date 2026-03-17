import { Router, Request, Response } from 'express';
import User from '../models/User';
import Vendor from '../models/Vendor';

const router = Router();

/**
 * @swagger
 * /api/seed:
 *   post:
 *     summary: Seed database with initial data
 *     tags: [Seed]
 *     responses:
 *       200:
 *         description: Database seeded successfully
 */
router.post('/', async (req: Request, res: Response) => {
  try {
    // Check if users already exist
    const existingUsers = await User.countDocuments();
    if (existingUsers > 0) {
      return res.status(400).json({
        error: 'Database already seeded. Users exist.',
        message: 'To re-seed, manually clear the database first.',
      });
    }

    // Create users
    await User.create([
      {
        email: 'ops@demo.com',
        password: 'ops123',
        role: 'OPS',
      },
      {
        email: 'finance@demo.com',
        password: 'fin123',
        role: 'FINANCE',
      },
    ]);

    // Create sample vendors
    await Vendor.create([
      {
        name: 'Acme Corporation',
        upi_id: 'acme@upi',
        bank_account: '1234567890',
        ifsc: 'HDFC0001234',
        is_active: true,
      },
      {
        name: 'Tech Solutions Ltd',
        upi_id: 'techsol@upi',
        bank_account: '0987654321',
        ifsc: 'ICIC0005678',
        is_active: true,
      },
      {
        name: 'Global Services Inc',
        upi_id: 'global@upi',
        bank_account: '5555666677',
        ifsc: 'AXIS0009999',
        is_active: true,
      },
    ]);

    res.json({
      success: true,
      message: 'Database seeded successfully!',
      data: {
        users: 2,
        vendors: 3,
        credentials: {
          ops: 'ops@demo.com / ops123',
          finance: 'finance@demo.com / fin123',
        },
      },
    });
  } catch (error) {
    console.error('Seed error:', error);
    res.status(500).json({
      error: 'Failed to seed database',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

export default router;
