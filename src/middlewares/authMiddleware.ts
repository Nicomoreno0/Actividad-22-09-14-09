import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { prisma } from '../config/prisma';
import { AppError } from '../errors/app-error';

const JWT_SECRET = process.env.JWT_SECRET || 'secret';

export interface AuthRequest extends Request {
  usuario?: { id: number; rol: string };
}

export const requireAuth = (req: AuthRequest, _res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : undefined;

  if (!token) {
    next(new AppError('Acceso denegado. No se proporcionó un token.', 401));
    return;
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET) as { id: number; rol: string };
    req.usuario = payload;
    next();
  } catch {
    next(new AppError('Token inválido o expirado.', 403));
  }
};

export const requireRole = (rolesPermitidos: string[]) => {
  return (req: AuthRequest, _res: Response, next: NextFunction): void => {
    if (!req.usuario || !rolesPermitidos.includes(req.usuario.rol)) {
      next(new AppError('No tienes los permisos necesarios.', 403));
      return;
    }
    next();
  };
};

export const checkPedidoOwnership = async (
  req: AuthRequest,
  _res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const pedidoId = Number(req.params.id);
    if (Number.isNaN(pedidoId)) {
      next(new AppError('ID de pedido inválido', 400));
      return;
    }

    const pedido = await prisma.pedido.findUnique({ where: { id: pedidoId } });
    if (!pedido) {
      next(new AppError('Pedido no encontrado', 404));
      return;
    }

    if (req.usuario?.rol === 'ADMIN' || pedido.usuarioId === req.usuario?.id) {
      next();
      return;
    }

    next(new AppError('No tienes permisos sobre este recurso.', 403));
  } catch (error) {
    next(error);
  }
};
