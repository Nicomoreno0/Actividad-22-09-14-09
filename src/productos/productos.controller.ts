import { NextFunction, Request, Response } from 'express';
import { ProductosService } from './productos.service';

export class ProductosController {
  constructor(private readonly service: ProductosService) {}

  crear = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const producto = await this.service.crear(req.body ?? {});
      res.status(201).json(producto);
    } catch (error) {
      next(error);
    }
  };

  obtenerTodos = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const nombre = typeof req.query.nombre === 'string' ? req.query.nombre : undefined;
      const productos = await this.service.obtenerTodos(nombre);
      res.status(200).json(productos);
    } catch (error) {
      next(error);
    }
  };

  obtenerPorId = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const producto = await this.service.obtenerPorId(req.params.id);
      res.status(200).json(producto);
    } catch (error) {
      next(error);
    }
  };

  actualizar = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const producto = await this.service.actualizar(req.params.id, req.body ?? {});
      res.status(200).json(producto);
    } catch (error) {
      next(error);
    }
  };

  eliminar = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      await this.service.eliminar(req.params.id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  };
}
