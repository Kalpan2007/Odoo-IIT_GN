"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const project_controller_1 = require("../controllers/project.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const rbac_middleware_1 = require("../middleware/rbac.middleware");
const router = express_1.default.Router();
router.get('/', auth_middleware_1.verifyToken, project_controller_1.getProjects);
router.get('/:id', auth_middleware_1.verifyToken, project_controller_1.getProjectById);
router.post('/', auth_middleware_1.verifyToken, rbac_middleware_1.isAdminOrPM, project_controller_1.createProject);
router.put('/:id', auth_middleware_1.verifyToken, rbac_middleware_1.isAdminOrPM, project_controller_1.updateProject);
router.delete('/:id', auth_middleware_1.verifyToken, rbac_middleware_1.isAdminOrPM, project_controller_1.deleteProject);
exports.default = router;
//# sourceMappingURL=project.routes.js.map