import { Router } from 'express';

import {
    createDirector,
    getDirectors,
    getDirectorById,
    getParentByIdUser,
    updateDirector,
    deleteDirector
} from '../controllers/director.controller.js'; // Cambiado al controlador de directores

import { verifyToken } from '../middleware/auth.middleware.js';
import { authorizeRoles } from '../middleware/role.middleware.js';

const router = Router();

// Obtener todos los directores
router.get(
  '/',
  verifyToken,
  authorizeRoles('ADMIN', 'TEACHER','DIRECTOR'),
  getDirectors
);

// Obtener un director por su ID
router.get(
  '/:id',
  verifyToken,
  authorizeRoles('ADMIN', 'TEACHER','DIRECTOR'),
  getDirectorById
);

router.get(
  '/user/:id',
  getParentByIdUser
);

// Crear un nuevo director
router.post(
  '/create',
  verifyToken,
  authorizeRoles('ADMIN'),
  createDirector
);

// Actualizar un director por su ID
router.put(
  '/:id',
  verifyToken,
  authorizeRoles('ADMIN'),
  updateDirector
);

// Eliminar un director por su ID
router.delete(
  '/:id',
  verifyToken,
  authorizeRoles('ADMIN'),
  deleteDirector
);

export default router;