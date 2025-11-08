"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const timesheet_controller_1 = require("../controllers/timesheet.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = express_1.default.Router();
router.get('/', auth_middleware_1.verifyToken, timesheet_controller_1.getTimesheets);
router.post('/', auth_middleware_1.verifyToken, timesheet_controller_1.createTimesheet);
router.put('/:id', auth_middleware_1.verifyToken, timesheet_controller_1.updateTimesheet);
router.delete('/:id', auth_middleware_1.verifyToken, timesheet_controller_1.deleteTimesheet);
exports.default = router;
//# sourceMappingURL=timesheet.routes.js.map