import { Router } from 'express';
import { WorkFieldController } from '@/modules/work-fields/controllers/WorkFieldController';

const router = Router();
const workFieldController = new WorkFieldController();

// Definir las rutas para el módulo de campos de trabajo
router.get('/', (req, res) => workFieldController.listAll(req, res));
router.get('/:id', (req, res) => workFieldController.findById(req, res));
router.post('/', (req, res) => workFieldController.create(req, res));
router.put('/:id', (req, res) => workFieldController.update(req, res));

export default router;
