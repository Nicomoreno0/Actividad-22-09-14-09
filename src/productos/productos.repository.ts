import { prisma } from '../config/prisma';
import { ActualizarProductoDto, CrearProductoDto } from './producto.dto';

export class ProductosRepository {
  async crear(data: CrearProductoDto) {
    return prisma.producto.create({
      data: {
        nombre: data.nombre,
        precio: data.precio,
        stock: data.stock ?? 0,
        categoriaId: data.categoriaId
      }
    });
  }

  async obtenerTodos(nombre?: string) {
    return prisma.producto.findMany({
      where: nombre ? { nombre: { contains: nombre } } : undefined,
      orderBy: { id: 'asc' }
    });
  }

  async obtenerPorId(id: number) {
    return prisma.producto.findUnique({ where: { id } });
  }

  async actualizar(id: number, data: ActualizarProductoDto) {
    return prisma.producto.update({ where: { id }, data });
  }

  async eliminar(id: number) {
    await prisma.producto.delete({ where: { id } });
  }
}
