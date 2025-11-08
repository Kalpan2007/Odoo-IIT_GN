"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const roleRequest_controller_1 = require("../controllers/roleRequest.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const rbac_middleware_1 = require("../middleware/rbac.middleware");
const router = express_1.default.Router();
router.post('/', auth_middleware_1.verifyToken, roleRequest_controller_1.createRoleRequest);
router.get('/', auth_middleware_1.verifyToken, rbac_middleware_1.isAdmin, roleRequest_controller_1.getRoleRequests);
router.get('/my', auth_middleware_1.verifyToken, roleRequest_controller_1.getMyRoleRequests);
router.put('/:id', auth_middleware_1.verifyToken, rbac_middleware_1.isAdmin, roleRequest_controller_1.updateRoleRequest);
exports.default = router;
//# sourceMappingURL=roleRequest.routes.js.map