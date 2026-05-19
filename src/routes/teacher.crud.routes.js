import { Router } from 'express';

import {
    createTeacher,
    getTeachers,
    getTeacherById,
    updateTeacher,
    deleteTeacher
} from '../controllers/teachers.controller.js';

import { verifyToken } from '../middleware/auth.middleware.js';

import { authorizeRoles } from '../middleware/role.middleware.js';

const router = Router();

router.get(
  '/',
  verifyToken,
  authorizeRoles('ADMIN', 'TEACHER'),
  getTeachers
);

router.get(
  '/:id',
  verifyToken,
  authorizeRoles('ADMIN', 'TEACHER'),
  getTeacherById
);

router.post(
  '/create',
  verifyToken,
  authorizeRoles('ADMIN'),
  createTeacher
);

router.put(
  '/:id',
  verifyToken,
  authorizeRoles('ADMIN'),
  updateTeacher
);

router.delete(
  '/:id',
  verifyToken,
  authorizeRoles('ADMIN'),
  deleteTeacher
);

export default router;

