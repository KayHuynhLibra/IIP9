const express = require('express');
const router = express.Router();
const budgetController = require('../controllers/budgets');
const authenticate = require('../middlewares/auth');

router.use(authenticate);

router.post('/', budgetController.createBudget);
router.get('/', budgetController.getBudgets);
router.put('/:id', budgetController.updateBudget);
router.delete('/:id', budgetController.deleteBudget);

module.exports = router;