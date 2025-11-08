"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.roleRequestSchemas = void 0;
exports.roleRequestSchemas = {
    RoleRequest: {
        type: 'object',
        properties: {
            id: {
                type: 'string',
                format: 'uuid'
            },
            user_id: {
                type: 'string',
                format: 'uuid'
            },
            current_user_role: {
                type: 'string',
                enum: ['admin', 'project_manager', 'team_member']
            },
            requested_role: {
                type: 'string',
                enum: ['admin', 'project_manager', 'team_member']
            },
            status: {
                type: 'string',
                enum: ['pending', 'approved', 'rejected']
            },
            reason: {
                type: 'string',
                nullable: true
            },
            created_at: {
                type: 'string',
                format: 'date-time'
            },
            updated_at: {
                type: 'string',
                format: 'date-time'
            }
        }
    },
    CreateRoleRequest: {
        type: 'object',
        required: ['requested_role'],
        properties: {
            requested_role: {
                type: 'string',
                enum: ['project_manager']
            },
            reason: {
                type: 'string'
            }
        }
    },
    UpdateRoleRequest: {
        type: 'object',
        required: ['status'],
        properties: {
            status: {
                type: 'string',
                enum: ['approved', 'rejected']
            }
        }
    }
};
//# sourceMappingURL=roleRequest.schema.js.map