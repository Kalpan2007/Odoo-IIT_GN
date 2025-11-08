"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const sales_controller_1 = require("../controllers/sales.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const rbac_middleware_1 = require("../middleware/rbac.middleware");
const router = express_1.default.Router();
router.get('/', auth_middleware_1.verifyToken, rbac_middleware_1.isAdminOrPM, sales_controller_1.getSalesOrders);
router.get('/:id', auth_middleware_1.verifyToken, rbac_middleware_1.isAdminOrPM, sales_controller_1.getSalesOrderById);
router.post('/', auth_middleware_1.verifyToken, rbac_middleware_1.isAdminOrPM, sales_controller_1.createSalesOrder);
router.put('/:id', auth_middleware_1.verifyToken, rbac_middleware_1.isAdminOrPM, sales_controller_1.updateSalesOrder);
router.delete('/:id', auth_middleware_1.verifyToken, rbac_middleware_1.isAdminOrPM, sales_controller_1.deleteSalesOrder);
exports.default = router;
//# sourceMappingURL=sales.routes.js.map