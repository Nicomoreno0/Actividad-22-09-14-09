import { prisma } from '../config/prisma';

export class CategoriasRepository {
  async crear(nombre: string) {
    return prisma.categoria.create({ data: { nombre } });
  }

  async obtenerTodas() {
    return prisma.categoria.findMany({ orderBy: { id: 'asc' } });
  }

  async obtenerPorId(id: number) {
    return prisma.categoria.findUnique({ where: { id } });
  }

  async obtenerPorNombre(nombre: string) {
    return prisma.categoria.findUnique({ where: { nombre } });
  }
}
