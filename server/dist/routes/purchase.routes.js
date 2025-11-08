"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const purchase_controller_1 = require("../controllers/purchase.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const rbac_middleware_1 = require("../middleware/rbac.middleware");
const router = express_1.default.Router();
router.get('/', auth_middleware_1.verifyToken, rbac_middleware_1.isAdminOrPM, purchase_controller_1.getPurchases);
router.get('/:id', auth_middleware_1.verifyToken, rbac_middleware_1.isAdminOrPM, purchase_controller_1.getPurchaseById);
router.post('/', auth_middleware_1.verifyToken, rbac_middleware_1.isAdminOrPM, purchase_controller_1.createPurchase);
router.put('/:id', auth_middleware_1.verifyToken, rbac_middleware_1.isAdminOrPM, purchase_controller_1.updatePurchase);
router.delete('/:id', auth_middleware_1.verifyToken, rbac_middleware_1.isAdminOrPM, purchase_controller_1.deletePurchase);
exports.default = router;
//# sourceMappingURL=purchase.routes.js.map