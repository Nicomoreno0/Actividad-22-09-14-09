import { NextFunction, Response } from 'express';
import { AuthRequest } from '../middlewares/authMiddleware';
import { PedidosService } from './pedidos.service';

export class PedidosController {
  constructor(private readonly service: PedidosService) {}

  crear = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const usuarioId = req.usuario?.id;
      if (!usuarioId) {
        res.status(401).json({ error: 'Acceso denegado. No se proporcionó un token.' });
        return;
      }
      const pedido = await this.service.checkout(usuarioId, req.body ?? {});
      res.status(201).json(pedido);
    } catch (error) {
      next(error);
    }
  };

  obtenerPorId = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const pedido = await this.service.obtenerPorId(req.params.id);
      res.status(200).json(pedido);
    } catch (error) {
      next(error);
    }
  };
}
