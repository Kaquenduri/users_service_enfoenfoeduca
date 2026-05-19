import { Router } from 'express';

import {
  getStudents,
  createStudent,
  updateStudent,
  getStudentById,
  deleteStudent
} from '../controllers/students.controller.js';

import { verifyToken } from '../middleware/auth.middleware.js';

import { authorizeRoles } from '../middleware/role.middleware.js';

const router = Router();

router.get(
  '/',
  verifyToken,
  authorizeRoles('ADMIN', 'TEACHER'),
  getStudents
);

router.get(
  '/:id',
  verifyToken,
  authorizeRoles('ADMIN', 'TEACHER'),
  getStudentById
);

router.post(
  '/create',
  verifyToken,
  authorizeRoles('ADMIN'),
  createStudent
);

router.put(
  '/:id',
  verifyToken,
  authorizeRoles('ADMIN'),
  updateStudent
);

router.delete(
  '/:id',
  verifyToken,
  authorizeRoles('ADMIN'),
  deleteStudent
);

export default router;

