import { Router } from 'express';

import {
    createParent,
    getParents,
    getParentById,
    getParentByIdUser,
    updateParent,
    deleteParent
} from '../controllers/parents.controller.js';

import { verifyToken } from '../middleware/auth.middleware.js';

import { authorizeRoles } from '../middleware/role.middleware.js';

const router = Router();

router.get(
  '/',
  verifyToken,
  authorizeRoles('ADMIN', 'TEACHER'),
  getParents
);

router.get(
  '/:id',
  verifyToken,
  authorizeRoles('ADMIN', 'TEACHER'),
  getParentById
);

router.get(
  '/user/:id',
  getParentByIdUser
);

router.post(
  '/create',
  verifyToken,
  authorizeRoles('ADMIN'),
  createParent
);

router.put(
  '/:id',
  verifyToken,
  authorizeRoles('ADMIN'),
  updateParent
);

router.delete(
  '/:id',
  verifyToken,
  authorizeRoles('ADMIN'),
  deleteParent
);

export default router;

