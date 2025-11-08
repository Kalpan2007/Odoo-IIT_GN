"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dashboard_controller_1 = require("../controllers/dashboard.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const rbac_middleware_1 = require("../middleware/rbac.middleware");
const router = express_1.default.Router();
router.get('/overview', auth_middleware_1.verifyToken, rbac_middleware_1.isAdminOrPM, dashboard_controller_1.getOverview);
router.get('/financials', auth_middleware_1.verifyToken, rbac_middleware_1.isAdminOrPM, dashboard_controller_1.getFinancials);
router.get('/user-stats', auth_middleware_1.verifyToken, dashboard_controller_1.getUserStats);
exports.default = router;
//# sourceMappingURL=dashboard.routes.js.map