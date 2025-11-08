"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const invoice_controller_1 = require("../controllers/invoice.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const rbac_middleware_1 = require("../middleware/rbac.middleware");
const router = express_1.default.Router();
router.get('/', auth_middleware_1.verifyToken, rbac_middleware_1.isAdminOrPM, invoice_controller_1.getInvoices);
router.get('/:id', auth_middleware_1.verifyToken, rbac_middleware_1.isAdminOrPM, invoice_controller_1.getInvoiceById);
router.post('/', auth_middleware_1.verifyToken, rbac_middleware_1.isAdminOrPM, invoice_controller_1.createInvoice);
router.put('/:id', auth_middleware_1.verifyToken, rbac_middleware_1.isAdminOrPM, invoice_controller_1.updateInvoice);
router.delete('/:id', auth_middleware_1.verifyToken, rbac_middleware_1.isAdminOrPM, invoice_controller_1.deleteInvoice);
exports.default = router;
//# sourceMappingURL=invoice.routes.js.map