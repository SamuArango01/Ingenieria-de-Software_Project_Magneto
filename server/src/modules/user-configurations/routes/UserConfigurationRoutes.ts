import { Router } from 'express';
import { UserConfigurationController } from '@/modules/user-configurations/controllers/UserConfigurationController';

const router = Router();
const userConfigController = new UserConfigurationController();

// --- Rutas para la configuración del usuario autenticado ---

// Obtiene la configuración del usuario actual
router.get('/', (req, res) => userConfigController.getByUserId(req, res));

// Crea o actualiza la configuración del usuario actual
router.put('/', (req, res) => userConfigController.createOrUpdate(req, res));

export default router;
