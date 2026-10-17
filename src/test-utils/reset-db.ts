import { prisma } from '../config/prisma';

export async function resetDatabase(): Promise<void> {
  await prisma.detallePedido.deleteMany();
  await prisma.pedido.deleteMany();
  await prisma.refreshToken.deleteMany();
  await prisma.producto.deleteMany();
  await prisma.categoria.deleteMany();
  await prisma.usuario.deleteMany();
}
