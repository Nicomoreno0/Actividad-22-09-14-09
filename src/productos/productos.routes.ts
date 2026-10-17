import { Router } from 'express';
import { ProductosController } from './productos.controller';
import { ProductosRepository } from './productos.repository';
import { ProductosService } from './productos.service';

const repository = new ProductosRepository();
const service = new ProductosService(repository);
const controller = new ProductosController(service);

const router = Router();
router.get('/', controller.obtenerTodos);
router.get('/:id', controller.obtenerPorId);
router.post('/', controller.crear);
router.put('/:id', controller.actualizar);
router.delete('/:id', controller.eliminar);

export { router as productosRouter };
