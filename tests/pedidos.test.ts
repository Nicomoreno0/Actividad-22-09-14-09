import request from 'supertest';
import app from '../src/app';
import { resetDatabase } from '../src/test-utils/reset-db';

describe('Gestión de órdenes de compra', () => {
  beforeEach(async () => {
    await resetDatabase();
  });

  it('debe bloquear la creación de orden sin autenticación', async () => {
    const res = await request(app)
      .post('/api/pedidos')
      .send({ productosComprados: [{ productoId: 5, cantidad: 2 }] });
    expect(res.status).toBe(401);
  });

  it('procesa una compra exitosa con múltiples productos', async () => {
    await request(app).post('/api/auth/registro').send({
      nombre: 'Carlos',
      email: 'nicolas.moreno@empresa.com',
      password: 'NicoPass123!'
    });
    const login = await request(app).post('/api/auth/login').send({
      email: 'nicolas.moreno@empresa.com',
      password: 'NicoPass123!'
    });
    const prod1 = await request(app).post('/api/v1/productos').send({
      nombre: 'Auriculares Bluetooth',
      precio: 800,
      stock: 15
    });
    const prod2 = await request(app).post('/api/v1/productos').send({
      nombre: 'Mouse Inalámbrico',
      precio: 450,
      stock: 20
    });

    const res = await request(app)
      .post('/api/pedidos')
      .set('Authorization', `Bearer ${login.body.accessToken}`)
      .send({
        productosComprados: [
          { productoId: prod1.body.id, cantidad: 2 },
          { productoId: prod2.body.id, cantidad: 1 }
        ]
      });

    expect(res.status).toBe(201);
    expect(res.body.total).toBe(2050);
    expect(res.body.estado).toBe('FINALIZADO');
  });
});
