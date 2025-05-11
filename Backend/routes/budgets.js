import express from 'express';
import Budget from '../models/Budget.js';
import Transaction from '../models/Transaction.js';
import auth from '../middleware/auth.js';
import mongoose from 'mongoose';

const router = express.Router();

router.use(auth); // Đảm bảo mọi route đều xác thực

// Get all budgets
router.get('/', async (req, res) => {
  try {
    const budgets = await Budget.find({ userId: req.userId });
    
    // Calculate spent amount for each budget
    const budgetsWithSpent = await Promise.all(budgets.map(async (budget) => {
      const spent = await Transaction.aggregate([
        {
          $match: {
            user: new mongoose.Types.ObjectId(budget.userId),
            category: budget.category,
            type: 'expense'
          }
        },
        {
          $group: {
            _id: null,
            total: { $sum: '$amount' }
          }
        }
      ]);

      return {
        ...budget.toObject(),
        spent: spent[0]?.total || 0
      };
    }));

    res.json(budgetsWithSpent);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Add new budget
router.post('/', async (req, res) => {
  console.log('req.userId:', req.userId);
  const { category, amount, spent, startDate, endDate } = req.body;
  const budget = new Budget({
    userId: req.userId,
    category,
    amount,
    spent,
    startDate,
    endDate
  });

  try {
    const newBudget = await budget.save();
    res.status(201).json(newBudget);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update budget
router.put('/:id', async (req, res) => {
  try {
    const budget = await Budget.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      req.body,
      { new: true }
    );

    if (!budget) {
      return res.status(404).json({ message: 'Budget not found' });
    }

    res.json(budget);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete budget
router.delete('/:id', async (req, res) => {
  try {
    const budget = await Budget.findOneAndDelete({
      _id: req.params.id,
      userId: req.userId
    });

    if (!budget) {
      return res.status(404).json({ message: 'Budget not found' });
    }

    res.json({ message: 'Budget deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update spent for a budget
router.patch('/:id/spent', auth, async (req, res) => {
  try {
    const budget = await Budget.findOne({ _id: req.params.id, userId: req.user.id });
    if (!budget) return res.status(404).json({ message: 'Budget not found' });
    budget.spent += req.body.amount;
    await budget.save();
    res.json(budget);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;