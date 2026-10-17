import { Before, Given, Then, When } from '@cucumber/cucumber';
import expect from 'expect';
import request from 'supertest';
import app from '../../src/app';
import { resetDatabase } from '../../src/test-utils/reset-db';

let response: request.Response;
let idGuardado: number;
let idPedido: number;
let accessToken: string;

Before(async () => {
  await resetDatabase();
});

Given('que la base de datos está limpia', async () => {
  await resetDatabase();
});

Given('que la base de datos de productos está limpia', async () => {
  await resetDatabase();
});

Given('que existe un usuario registrado con email {string}', async (email: string) => {
  const res = await request(app).post('/api/auth/registro').send({
    nombre: email.split('@')[0],
    email,
    password: 'Password123!'
  });
  expect(res.status).toBe(201);
});

Given(
  'que existe un producto guardado con nombre {string} y precio {int}',
  async (nombre: string, precio: number) => {
    const res = await request(app).post('/api/v1/productos').send({ nombre, precio, stock: 10 });
    idGuardado = res.body.id;
  }
);

Given(
  'que existe un producto con nombre {string} precio {int} y stock {int}',
  async (nombre: string, precio: number, stock: number) => {
    const res = await request(app).post('/api/v1/productos').send({ nombre, precio, stock });
    idGuardado = res.body.id;
  }
);

Given('que existen los siguientes productos en la base de datos:', async (dataTable) => {
  const productos = dataTable.hashes() as Array<{ nombre: string; precio: string }>;
  for (const prod of productos) {
    await request(app)
      .post('/api/v1/productos')
      .send({ nombre: prod.nombre, precio: Number(prod.precio), stock: 10 });
  }
});

Given(
  'que inicié sesión con email {string} y contraseña {string}',
  async (email: string, password: string) => {
    const res = await request(app).post('/api/auth/login').send({ email, password });
    expect(res.status).toBe(200);
    accessToken = res.body.accessToken;
  }
);

Given(
  'que creé un pedido autenticado del producto guardado con cantidad {int}',
  async (cantidad: number) => {
    const res = await request(app)
      .post('/api/pedidos')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ productosComprados: [{ productoId: idGuardado, cantidad }] });
    expect(res.status).toBe(201);
    idPedido = res.body.id;
  }
);

When(
  'envío una solicitud POST a {string} con el cuerpo:',
  async (ruta: string, docString: string) => {
    const body = JSON.parse(docString);
    response = await request(app).post(ruta).send(body);
  }
);

When(
  'envío una solicitud autenticada POST a {string} con el cuerpo:',
  async (ruta: string, docString: string) => {
    const body = JSON.parse(docString);
    if (Array.isArray(body.productosComprados)) {
      body.productosComprados = body.productosComprados.map(
        (item: { productoId: number; cantidad: number }) => ({
          ...item,
          productoId: item.productoId === 0 ? idGuardado : item.productoId
        })
      );
    }
    response = await request(app)
      .post(ruta)
      .set('Authorization', `Bearer ${accessToken}`)
      .send(body);
  }
);

When('envío una solicitud GET a {string}', async (ruta: string) => {
  const rutaFinal = ruta.replace('{id_guardado}', String(idGuardado));
  response = await request(app).get(rutaFinal);
});

When('envío una solicitud autenticada GET a {string}', async (ruta: string) => {
  const rutaFinal = ruta.replace('{id_pedido}', String(idPedido));
  response = await request(app).get(rutaFinal).set('Authorization', `Bearer ${accessToken}`);
});

When(
  'envío una solicitud PUT a {string} con el cuerpo:',
  async (ruta: string, docString: string) => {
    const rutaFinal = ruta.replace('{id_guardado}', String(idGuardado));
    const body = JSON.parse(docString);
    response = await request(app).put(rutaFinal).send(body);
  }
);

When('envío una solicitud DELETE a {string}', async (ruta: string) => {
  const rutaFinal = ruta.replace('{id_guardado}', String(idGuardado));
  response = await request(app).delete(rutaFinal);
});

Then('el código de respuesta debe ser {int}', (statusCode: number) => {
  expect(response.status).toBe(statusCode);
});

Then('el cuerpo de la respuesta debe contener un campo {string}', (campo: string) => {
  expect(response.body).toHaveProperty(campo);
});

Then('el campo {string} debe ser {string}', (campo: string, valor: string) => {
  expect(response.body[campo]).toBe(valor);
});

Then('el campo {string} debe ser {int}', (campo: string, valor: number) => {
  expect(response.body[campo]).toBe(valor);
});

Then('la respuesta debe contener un mensaje de error', () => {
  expect(response.body).toHaveProperty('error');
});

Then('la lista devuelta debe contener solo {int} elementos', (cantidad: number) => {
  expect(Array.isArray(response.body)).toBe(true);
  expect(response.body.length).toBe(cantidad);
});
