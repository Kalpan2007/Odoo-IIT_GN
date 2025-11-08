export declare const roleRequestSchemas: {
    RoleRequest: {
        type: string;
        properties: {
            id: {
                type: string;
                format: string;
            };
            user_id: {
                type: string;
                format: string;
            };
            current_user_role: {
                type: string;
                enum: string[];
            };
            requested_role: {
                type: string;
                enum: string[];
            };
            status: {
                type: string;
                enum: string[];
            };
            reason: {
                type: string;
                nullable: boolean;
            };
            created_at: {
                type: string;
                format: string;
            };
            updated_at: {
                type: string;
                format: string;
            };
        };
    };
    CreateRoleRequest: {
        type: string;
        required: string[];
        properties: {
            requested_role: {
                type: string;
                enum: string[];
            };
            reason: {
                type: string;
            };
        };
    };
    UpdateRoleRequest: {
        type: string;
        required: string[];
        properties: {
            status: {
                type: string;
                enum: string[];
            };
        };
    };
};
//# sourceMappingURL=roleRequest.schema.d.ts.map