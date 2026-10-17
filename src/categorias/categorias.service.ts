import { AppError } from '../errors/app-error';
import { CategoriasRepository } from './categorias.repository';

export class CategoriasService {
  constructor(private readonly repository: CategoriasRepository) {}

  async crear(nombre?: string) {
    if (!nombre || nombre.trim() === '') {
      throw new AppError('El nombre es obligatorio', 422);
    }

    const existe = await this.repository.obtenerPorNombre(nombre.trim());
    if (existe) {
      throw new AppError('La categoría ya existe', 409);
    }

    return this.repository.crear(nombre.trim());
  }

  async obtenerTodas() {
    return this.repository.obtenerTodas();
  }

  async obtenerPorId(idParam: string) {
    const id = Number(idParam);
    if (!Number.isInteger(id) || id <= 0) {
      throw new AppError('ID inválido', 400);
    }

    const categoria = await this.repository.obtenerPorId(id);
    if (!categoria) {
      throw new AppError('Categoría no encontrada', 404);
    }
    return categoria;
  }
}
