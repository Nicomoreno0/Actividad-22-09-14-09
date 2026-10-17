import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import path from 'path';
import * as swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import { AuthController } from './auth/auth.controller';
import { categoriasRouter } from './categorias/categorias.routes';
import { requireAuth } from './middlewares/authMiddleware';
import { errorHandler } from './middlewares/errorHandler';
import { corsOptions, loginLimiter } from './middlewares/hardening';
import { notFound } from './middlewares/not-found';
import { pedidosRouter } from './pedidos/pedidos.routes';
import { productosRouter } from './productos/productos.routes';

const app = express();

app.use(express.json());
app.use(corsOptions);

const swaggerPath = path.join(__dirname, '../swagger.yaml');
const swaggerDocument = YAML.load(swaggerPath);
const customCss = `
  .swagger-ui .topbar { display: none; }
  .swagger-ui .info { margin: 20px 0; }
  .swagger-ui .info .title { font-size: 32px; color: #2563eb; }
  .swagger-ui .info .description { color: #4b5563; }
  .swagger-ui .opblock { border-radius: 8px; margin-bottom: 10px; }
  .swagger-ui .opblock .opblock-summary { border-radius: 8px; }
  .swagger-ui .opblock.opblock-post { border-color: #10b981; }
  .swagger-ui .opblock.opblock-get { border-color: #3b82f6; }
  .swagger-ui .opblock.opblock-put { border-color: #f59e0b; }
  .swagger-ui .opblock.opblock-delete { border-color: #ef4444; }
  .swagger-ui .btn { border-radius: 6px; }
  body { background-color: #f8fafc; }
`;
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument, {
  customCss,
  customSiteTitle: 'API ShopFlow - Documentación'
}));

app.get('/health', (_req, res) => {
  res.status(200).json({ status: 'ok' });
});

app.post('/api/auth/registro', AuthController.register);
app.post('/api/auth/login', loginLimiter, AuthController.login);
app.post('/api/auth/refresh', AuthController.refresh);

app.use('/api/v1/productos', productosRouter);
app.use('/api/v1/categorias', categoriasRouter);
app.use('/api/pedidos', requireAuth, pedidosRouter);

app.use(notFound);
app.use(errorHandler);

export default app;
