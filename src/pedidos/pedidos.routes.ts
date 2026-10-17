import { Router } from 'express';
import { checkPedidoOwnership } from '../middlewares/authMiddleware';
import { PedidosController } from './pedidos.controller';
import { PedidosRepository } from './pedidos.repository';
import { PedidosService } from './pedidos.service';

const repository = new PedidosRepository();
const service = new PedidosService(repository);
const controller = new PedidosController(service);

const router = Router();
router.post('/', controller.crear);
router.get('/:id', checkPedidoOwnership, controller.obtenerPorId);

export { router as pedidosRouter };
