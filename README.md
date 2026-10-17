# ShopFlow Core

Backend de e-commerce en TypeScript con prácticas de Extreme Programming (XP) y BDD con Cucumber. La API se prueba de forma interactiva con Swagger UI, igual que en la evidencia de request de la actividad.

## Levantar el entorno

```bash
npm install
npx prisma generate
npx prisma migrate deploy
npm run dev
```

- API: http://localhost:3000
- Swagger: http://localhost:3000/api-docs
- Health: http://localhost:3000/health

Variables de entorno: copiá `.env.example` a `.env`. Persistencia con **SQLite + Prisma** (`file:./dev.db`) para poder correr todo sin instalar PostgreSQL.

## Cómo probar los endpoints (Swagger)

1. Abrí http://localhost:3000/api-docs
2. `POST /api/auth/registro` y después `POST /api/auth/login`
3. Copiá el `accessToken`
4. Click en **Authorize** y pegá el token
5. `POST /api/v1/productos` y `POST /api/pedidos` con Try it out

Capturas de esa misma UI van en `Evidencias/` (login JWT, request de pedido con token, Swagger ejecutado).

## Suite BDD y unitaria

Los tests se escribieron **antes** de dar por cerrada cada historia (ciclo RED → GREEN → refactor):

```bash
npm test          # Jest (endpoints)
npm run test:bdd  # Cucumber / Gherkin
npm run test:e2e  # alias de Cucumber
npm run lint
npm run build     # tsc --noEmit (strict)
```

Features en `features/`. Step definitions en `features/step_definitions/`. Jest en `tests/`.

## Decisiones de diseño (XP)

- **BDD/TDD:** cada historia tiene escenarios Gherkin (camino feliz + error) y, en productos/pedidos, tests Jest equivalentes.
- **Diseño simple / YAGNI:** un monolito Express, Prisma/SQLite, sin colas ni microservicios.
- **Capas:** rutas → controller → service → repository. Auth en middlewares.
- **Refactor:** hashes bcrypt, JWT, chequeo IDOR en pedidos, rate limit en login.
- **CI:** `.github/workflows/ci.yml` corre lint, `tsc`, Jest y Cucumber en cada push.

## Módulos

| Módulo | Rutas |
|---|---|
| Auth | `/api/auth/registro`, `/api/auth/login`, `/api/auth/refresh` |
| Productos | `/api/v1/productos` |
| Categorías | `/api/v1/categorias` |
| Pedidos | `/api/pedidos` (JWT) |

Backlog: [BACKLOG.md](./BACKLOG.md).
