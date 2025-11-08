"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const dotenv_1 = __importDefault(require("dotenv"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const swagger_1 = require("./docs/swagger");
const errorHandler_1 = require("./utils/errorHandler");
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const project_routes_1 = __importDefault(require("./routes/project.routes"));
const task_routes_1 = __importDefault(require("./routes/task.routes"));
const timesheet_routes_1 = __importDefault(require("./routes/timesheet.routes"));
const sales_routes_1 = __importDefault(require("./routes/sales.routes"));
const purchase_routes_1 = __importDefault(require("./routes/purchase.routes"));
const expense_routes_1 = __importDefault(require("./routes/expense.routes"));
const invoice_routes_1 = __importDefault(require("./routes/invoice.routes"));
const dashboard_routes_1 = __importDefault(require("./routes/dashboard.routes"));
const roleRequest_routes_1 = __importDefault(require("./routes/roleRequest.routes"));
dotenv_1.default.config();
if (!process.env.JWT_SECRET) {
    console.error('ERROR: JWT_SECRET is not configured in .env file');
    process.exit(1);
}
if (!process.env.SUPABASE_URL || !process.env.SUPABASE_ANON_KEY || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    console.error('ERROR: Supabase environment variables are not configured in .env file');
    process.exit(1);
}
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true
}));
const limiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: 'Too many requests from this IP, please try again later.'
});
app.use('/api/', limiter);
app.use(express_1.default.json({ limit: '10mb' }));
app.use(express_1.default.urlencoded({ extended: true }));
app.use('/api/docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swagger_1.swaggerSpec));
app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'OK',
        message: 'OneFlow API Server is running',
        timestamp: new Date().toISOString(),
        version: '1.0.0'
    });
});
app.use('/api/auth', auth_routes_1.default);
app.use('/api/projects', project_routes_1.default);
app.use('/api/tasks', task_routes_1.default);
app.use('/api/timesheets', timesheet_routes_1.default);
app.use('/api/sales', sales_routes_1.default);
app.use('/api/purchases', purchase_routes_1.default);
app.use('/api/expenses', expense_routes_1.default);
app.use('/api/invoices', invoice_routes_1.default);
app.use('/api/dashboard', dashboard_routes_1.default);
app.use('/api/role-requests', roleRequest_routes_1.default);
app.use('*', (req, res) => {
    res.status(404).json({
        success: false,
        message: 'API endpoint not found',
        path: req.originalUrl
    });
});
app.use(errorHandler_1.errorHandler);
app.listen(PORT, () => {
    console.log(`🚀 OneFlow API Server running on port ${PORT}`);
    console.log(`📚 API Documentation available at http://localhost:${PORT}/api/docs`);
    console.log(`🏥 Health check available at http://localhost:${PORT}/health`);
});
exports.default = app;
//# sourceMappingURL=server.js.map