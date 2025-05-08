const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transactions');
const authenticate = require('../middlewares/auth');
const { checkBudget } = require('../middlewares/budgetCheck');

router.use(authenticate);

router.post('/', checkBudget, transactionController.createTransaction);
router.get('/', transactionController.getTransactions);
router.put('/:id', checkBudget, transactionController.updateTransaction);
router.delete('/:id', transactionController.deleteTransaction);

module.exports = router;