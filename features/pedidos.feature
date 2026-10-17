# language: es
Característica: Checkout de pedidos
  Como usuario autenticado
  Quiero comprar productos con stock
  Para confirmar un pedido y descontar inventario

  Escenario: Pedido exitoso con stock suficiente
    Dado que la base de datos está limpia
    Y que existe un usuario registrado con email "faabri@ejemplo.com"
    Y que existe un producto con nombre "Teclado Mecánico" precio 45000 y stock 5
    Y que inicié sesión con email "faabri@ejemplo.com" y contraseña "Password123!"
    Cuando envío una solicitud autenticada POST a "/api/pedidos" con el cuerpo:
      """
      {
        "productosComprados": [
          { "productoId": 0, "cantidad": 2 }
        ]
      }
      """
    Entonces el código de respuesta debe ser 201
    Y el cuerpo de la respuesta debe contener un campo "total"
    Y el campo "estado" debe ser "FINALIZADO"

  Escenario: Pedido rechazado por stock insuficiente
    Dado que la base de datos está limpia
    Y que existe un usuario registrado con email "faabri@ejemplo.com"
    Y que existe un producto con nombre "Monitor 4K" precio 120000 y stock 1
    Y que inicié sesión con email "faabri@ejemplo.com" y contraseña "Password123!"
    Cuando envío una solicitud autenticada POST a "/api/pedidos" con el cuerpo:
      """
      {
        "productosComprados": [
          { "productoId": 0, "cantidad": 4 }
        ]
      }
      """
    Entonces el código de respuesta debe ser 422
    Y la respuesta debe contener un mensaje de error
