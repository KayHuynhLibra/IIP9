import Budget from '../models/Budget.js';

const checkBudget = async (req, res, next) => {
  const { category, amount } = req.body;
  try {
    const budget = await Budget.findOne({ userId: req.userId, category });
    if (budget && amount > budget.amount) {
      return res.status(400).json({
        warning: `This expense exceeds your ${category} budget!`,
      });
    }
    next();
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export default checkBudget; 