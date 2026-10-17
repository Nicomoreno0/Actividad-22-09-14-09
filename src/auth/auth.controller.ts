import { NextFunction, Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { prisma } from '../config/prisma';
import { AppError } from '../errors/app-error';

const JWT_SECRET = process.env.JWT_SECRET || 'secret';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'refresh_secret';
const SALT_ROUNDS = 10;

export class AuthController {
  static async register(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { nombre, email, password, rol } = req.body ?? {};
      if (!nombre || !email || !password) {
        throw new AppError('Todos los campos son obligatorios', 400);
      }

      const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email));
      if (!emailValido) {
        throw new AppError('El email no es válido', 400);
      }

      const usuarioExiste = await prisma.usuario.findUnique({ where: { email } });
      if (usuarioExiste) {
        throw new AppError('El email ya está registrado', 400);
      }

      const hashedPassword = await bcrypt.hash(String(password), SALT_ROUNDS);
      const nuevoUsuario = await prisma.usuario.create({
        data: {
          nombre: String(nombre),
          email: String(email),
          password: hashedPassword,
          rol: rol === 'ADMIN' ? 'ADMIN' : 'USER'
        },
        select: { id: true, nombre: true, email: true, rol: true }
      });

      res.status(201).json({
        mensaje: 'Usuario registrado exitosamente',
        usuario: nuevoUsuario
      });
    } catch (error) {
      next(error);
    }
  }

  static async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email, password } = req.body ?? {};
      if (!email || !password) {
        throw new AppError('Email y contraseña son obligatorios', 400);
      }

      const usuario = await prisma.usuario.findUnique({ where: { email: String(email) } });
      if (!usuario) {
        throw new AppError('Credenciales inválidas', 401);
      }

      const passwordValida = await bcrypt.compare(String(password), usuario.password);
      if (!passwordValida) {
        throw new AppError('Credenciales inválidas', 401);
      }

      const payload = { id: usuario.id, rol: usuario.rol };
      const accessToken = jwt.sign(payload, JWT_SECRET, { expiresIn: '15m' });
      const refreshToken = jwt.sign(payload, JWT_REFRESH_SECRET, { expiresIn: '7d' });

      await prisma.refreshToken.create({
        data: { token: refreshToken, usuarioId: usuario.id }
      });

      res.status(200).json({
        mensaje: 'Inicio de sesión exitoso',
        accessToken,
        refreshToken
      });
    } catch (error) {
      next(error);
    }
  }

  static async refresh(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { refreshToken } = req.body ?? {};
      if (!refreshToken) {
        throw new AppError('Refresh Token requerido', 401);
      }

      const tokenGuardado = await prisma.refreshToken.findUnique({
        where: { token: String(refreshToken) }
      });
      if (!tokenGuardado) {
        throw new AppError('Refresh Token inválido o revocado', 403);
      }

      const payload = jwt.verify(String(refreshToken), JWT_REFRESH_SECRET) as {
        id: number;
        rol: string;
      };
      const accessToken = jwt.sign(
        { id: payload.id, rol: payload.rol },
        JWT_SECRET,
        { expiresIn: '15m' }
      );

      res.status(200).json({ accessToken });
    } catch (error) {
      if (error instanceof AppError) {
        next(error);
        return;
      }
      next(new AppError('Token de refresco no válido o expirado', 403));
    }
  }
}
