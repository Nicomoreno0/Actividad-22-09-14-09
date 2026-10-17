import { prisma } from '../config/prisma';

export class PedidosRepository {
  async crearConDetalles(data: {
    usuarioId: number;
    total: number;
    estado: string;
    detalles: Array<{ productoId: number; cantidad: number; precioUnitario: number }>;
  }) {
    return prisma.$transaction(async (tx) => {
      const pedido = await tx.pedido.create({
        data: {
          usuarioId: data.usuarioId,
          total: data.total,
          estado: data.estado,
          detalles: {
            create: data.detalles
          }
        },
        include: { detalles: true }
      });

      for (const detalle of data.detalles) {
        await tx.producto.update({
          where: { id: detalle.productoId },
          data: { stock: { decrement: detalle.cantidad } }
        });
      }

      return pedido;
    });
  }

  async obtenerPorId(id: number) {
    return prisma.pedido.findUnique({
      where: { id },
      include: { detalles: true }
    });
  }
}
