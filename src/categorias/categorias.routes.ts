import { Router } from 'express';
import { CategoriasController } from './categorias.controller';
import { CategoriasRepository } from './categorias.repository';
import { CategoriasService } from './categorias.service';

const repository = new CategoriasRepository();
const service = new CategoriasService(repository);
const controller = new CategoriasController(service);

const router = Router();
router.get('/', controller.obtenerTodas);
router.get('/:id', controller.obtenerPorId);
router.post('/', controller.crear);

export { router as categoriasRouter };
