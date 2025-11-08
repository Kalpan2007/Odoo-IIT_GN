import express from 'express';
import { 
  createRoleRequest,
  getRoleRequests,
  getMyRoleRequests,
  updateRoleRequest
} from '../controllers/roleRequest.controller';
import { verifyToken } from '../middleware/auth.middleware';
import { isAdmin } from '../middleware/rbac.middleware';

const router = express.Router();

/**
 * @swagger
 * /api/role-requests:
 *   post:
 *     tags:
 *       - Role Requests
 *     summary: Create a new role change request
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - requested_role
 *             properties:
 *               requested_role:
 *                 type: string
 *                 enum: [project_manager]
 *               reason:
 *                 type: string
 *     responses:
 *       201:
 *         description: Role request created successfully
 *       400:
 *         description: Invalid input
 *       403:
 *         description: Insufficient permissions
 */
router.post('/', verifyToken, createRoleRequest);

/**
 * @swagger
 * /api/role-requests:
 *   get:
 *     tags:
 *       - Role Requests
 *     summary: Get all role requests (admin only)
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Role requests retrieved successfully
 *       403:
 *         description: Insufficient permissions
 */
router.get('/', verifyToken, isAdmin, getRoleRequests);

/**
 * @swagger
 * /api/role-requests/my:
 *   get:
 *     tags:
 *       - Role Requests
 *     summary: Get role requests for current user
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User role requests retrieved successfully
 *       401:
 *         description: Unauthorized
 */
router.get('/my', verifyToken, getMyRoleRequests);

/**
 * @swagger
 * /api/role-requests/{id}:
 *   put:
 *     tags:
 *       - Role Requests
 *     summary: Update role request status (admin only)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [approved, rejected]
 *     responses:
 *       200:
 *         description: Role request updated successfully
 *       400:
 *         description: Invalid input
 *       403:
 *         description: Insufficient permissions
 *       404:
 *         description: Role request not found
 */
router.put('/:id', verifyToken, isAdmin, updateRoleRequest);

export default router;