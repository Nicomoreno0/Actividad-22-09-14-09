import { AppError } from '../errors/app-error';
import { ActualizarProductoDto, CrearProductoDto } from './producto.dto';
import { ProductosRepository } from './productos.repository';

export class ProductosService {
  constructor(private readonly repository: ProductosRepository) {}

  async crear(payload: Partial<CrearProductoDto>) {
    if (!payload.nombre || String(payload.nombre).trim() === '') {
      throw new AppError('El nombre es obligatorio', 422);
    }
    if (payload.precio === undefined || Number.isNaN(Number(payload.precio))) {
      throw new AppError('El precio es obligatorio y debe ser numérico', 422);
    }

    return this.repository.crear({
      nombre: String(payload.nombre).trim(),
      precio: Number(payload.precio),
      stock: payload.stock !== undefined ? Number(payload.stock) : 0,
      categoriaId: payload.categoriaId
    });
  }

  async obtenerTodos(nombre?: string) {
    return this.repository.obtenerTodos(nombre);
  }

  async obtenerPorId(idParam: string) {
    const id = this.parseId(idParam);
    const producto = await this.repository.obtenerPorId(id);
    if (!producto) {
      throw new AppError('Producto no encontrado', 404);
    }
    return producto;
  }

  async actualizar(idParam: string, payload: ActualizarProductoDto) {
    const id = this.parseId(idParam);
    const producto = await this.repository.obtenerPorId(id);
    if (!producto) {
      throw new AppError('Producto no encontrado', 404);
    }
    return this.repository.actualizar(id, payload);
  }

  async eliminar(idParam: string) {
    const id = this.parseId(idParam);
    const producto = await this.repository.obtenerPorId(id);
    if (!producto) {
      throw new AppError('Producto no encontrado', 404);
    }
    await this.repository.eliminar(id);
  }

  private parseId(idParam: string): number {
    const id = Number(idParam);
    if (!Number.isInteger(id) || id <= 0) {
      throw new AppError('ID inválido', 400);
    }
    return id;
  }
}
