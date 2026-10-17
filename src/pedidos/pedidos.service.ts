import { prisma } from '../config/prisma';
import { AppError } from '../errors/app-error';
import { CrearPedidoDto } from './pedido.dto';
import { PedidosRepository } from './pedidos.repository';

export class PedidosService {
  constructor(private readonly repository: PedidosRepository) {}

  async checkout(usuarioAutenticadoId: number, payload: CrearPedidoDto) {
    if (payload.usuarioId !== undefined && payload.usuarioId !== usuarioAutenticadoId) {
      throw new AppError('No puedes crear un pedido para otro usuario', 403);
    }

    const items = payload.productosComprados;
    if (!Array.isArray(items) || items.length === 0) {
      throw new AppError('Debes indicar al menos un producto', 400);
    }

    const detalles: Array<{ productoId: number; cantidad: number; precioUnitario: number }> = [];
    let total = 0;

    for (const item of items) {
      const productoId = Number(item.productoId);
      const cantidad = Number(item.cantidad);
      if (!Number.isInteger(productoId) || productoId <= 0 || !Number.isInteger(cantidad) || cantidad <= 0) {
        throw new AppError('Datos de producto inválidos', 400);
      }

      const producto = await prisma.producto.findUnique({ where: { id: productoId } });
      if (!producto) {
        throw new AppError(`Producto ${productoId} no encontrado`, 404);
      }
      if (producto.stock < cantidad) {
        throw new AppError('No hay stock suficiente para completar el pedido.', 422);
      }

      detalles.push({
        productoId,
        cantidad,
        precioUnitario: producto.precio
      });
      total += producto.precio * cantidad;
    }

    return this.repository.crearConDetalles({
      usuarioId: usuarioAutenticadoId,
      total,
      estado: 'FINALIZADO',
      detalles
    });
  }

  async obtenerPorId(idParam: string) {
    const id = Number(idParam);
    if (!Number.isInteger(id) || id <= 0) {
      throw new AppError('ID de pedido inválido', 400);
    }
    const pedido = await this.repository.obtenerPorId(id);
    if (!pedido) {
      throw new AppError('Pedido no encontrado', 404);
    }
    return pedido;
  }
}
