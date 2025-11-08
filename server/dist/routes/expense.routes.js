"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const expense_controller_1 = require("../controllers/expense.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = express_1.default.Router();
router.get('/', auth_middleware_1.verifyToken, expense_controller_1.getExpenses);
router.get('/:id', auth_middleware_1.verifyToken, expense_controller_1.getExpenseById);
router.post('/', auth_middleware_1.verifyToken, expense_controller_1.createExpense);
router.put('/:id', auth_middleware_1.verifyToken, expense_controller_1.updateExpense);
router.delete('/:id', auth_middleware_1.verifyToken, expense_controller_1.deleteExpense);
exports.default = router;
//# sourceMappingURL=expense.routes.js.map