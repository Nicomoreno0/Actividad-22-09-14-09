# Backlog del producto — ShopFlow Core

Historias de usuario del núcleo e-commerce, con criterios de aceptación (Definition of Done).

## Historias funcionales

### US-01 Registro de usuario
**Como** visitante, **quiero** registrarme con nombre, email y contraseña **para** poder comprar.

Criterios de aceptación:
1. Con datos válidos, `POST /api/auth/registro` responde `201` y devuelve `usuario` sin contraseña.
2. Si el email ya existe, responde `400` con `{ error }`.
3. Si falta un campo, responde `400`.

### US-02 Login JWT
**Como** usuario registrado, **quiero** iniciar sesión **para** obtener un access token.

Criterios de aceptación:
1. Credenciales correctas → `200` con `accessToken` y `refreshToken`.
2. Contraseña o email incorrectos → `401` con mensaje genérico.
3. Las contraseñas se comparan con bcrypt, nunca en texto plano.

### US-03 Gestión de productos
**Como** operador del catálogo, **quiero** crear, consultar, actualizar y eliminar productos **para** mantener el inventario.

Criterios de aceptación:
1. `POST /api/v1/productos` con nombre y precio → `201` e `id`.
2. Sin nombre → `422`. ID inexistente → `404`. ID no numérico → `400`.
3. `DELETE` de un producto existente → `204`.

### US-04 Filtro de productos
**Como** comprador, **quiero** filtrar productos por nombre **para** encontrar un artículo rápido.

Criterios de aceptación:
1. `GET /api/v1/productos?nombre=Teclado` responde `200` con un array.
2. Solo se incluyen coincidencias del filtro.
3. Sin filtro se listan todos.

### US-05 Categorías
**Como** administrador, **quiero** crear categorías **para** organizar el catálogo.

Criterios de aceptación:
1. `POST /api/v1/categorias` con nombre válido → `201`.
2. Nombre duplicado → `409`.
3. Nombre vacío → `422`.

### US-06 Checkout de pedidos
**Como** usuario autenticado, **quiero** comprar productos con stock **para** confirmar un pedido.

Criterios de aceptación:
1. Con JWT y stock suficiente → `201`, estado `FINALIZADO` y total calculado.
2. Stock insuficiente → `422`.
3. Sin token → `401`. Un usuario no dueño no ve el pedido (`403`).

## Historias técnicas (NFR)

### NFR-01 Hashing de contraseñas
**Como** auditor de seguridad, **quiero** que las contraseñas se guarden con bcrypt y salt **para** proteger los datos si hay una brecha.

Criterios:
1. En base de datos nunca se persiste `password` en claro.
2. Hash bcrypt con cost ≥ 10.
3. Login usa `bcrypt.compare`.

### NFR-02 JWT y latencia de lectura
**Como** administrador del sistema, **quiero** endpoints protegidos con Bearer y lecturas rápidas **para** una experiencia fluida y segura.

Criterios:
1. Pedidos requieren `Authorization: Bearer`.
2. Access token JWT con expiración corta (15 min) y refresh token persistido.
3. `GET /health` y listados locales responden en menos de 200 ms en entorno de desarrollo.
