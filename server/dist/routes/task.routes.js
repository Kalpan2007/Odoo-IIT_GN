"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const task_controller_1 = require("../controllers/task.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const rbac_middleware_1 = require("../middleware/rbac.middleware");
const router = express_1.default.Router();
router.get('/', auth_middleware_1.verifyToken, task_controller_1.getTasks);
router.get('/:id', auth_middleware_1.verifyToken, task_controller_1.getTaskById);
router.post('/', auth_middleware_1.verifyToken, task_controller_1.createTask);
router.put('/:id', auth_middleware_1.verifyToken, task_controller_1.updateTask);
router.delete('/:id', auth_middleware_1.verifyToken, rbac_middleware_1.isAdminOrPM, task_controller_1.deleteTask);
exports.default = router;
//# sourceMappingURL=task.routes.js.map