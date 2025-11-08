"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_controller_1 = require("../controllers/auth.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const rbac_middleware_1 = require("../middleware/rbac.middleware");
const router = express_1.default.Router();
router.post('/signup', auth_controller_1.signup);
router.post('/login', auth_controller_1.login);
router.post('/logout', auth_controller_1.logout);
router.get('/me', auth_middleware_1.verifyToken, auth_controller_1.getMe);
router.get('/users', auth_middleware_1.verifyToken, rbac_middleware_1.isAdmin, auth_controller_1.getUsers);
router.put('/users/:id/role', auth_middleware_1.verifyToken, rbac_middleware_1.isAdmin, auth_controller_1.updateUserRole);
exports.default = router;
//# sourceMappingURL=auth.routes.js.map