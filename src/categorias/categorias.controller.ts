import { NextFunction, Request, Response } from 'express';
import { CategoriasService } from './categorias.service';

export class CategoriasController {
  constructor(private readonly service: CategoriasService) {}

  crear = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const categoria = await this.service.crear(req.body?.nombre);
      res.status(201).json(categoria);
    } catch (error) {
      next(error);
    }
  };

  obtenerTodas = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const categorias = await this.service.obtenerTodas();
      res.status(200).json(categorias);
    } catch (error) {
      next(error);
    }
  };

  obtenerPorId = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const categoria = await this.service.obtenerPorId(req.params.id);
      res.status(200).json(categoria);
    } catch (error) {
      next(error);
    }
  };
}
