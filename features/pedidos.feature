# language: es
Característica: Checkout de pedidos
  Como usuario autenticado
  Quiero comprar productos con stock
  Para confirmar un pedido y descontar inventario

  Escenario: Pedido exitoso con stock suficiente
    Dado que la base de datos está limpia
    Y que existe un usuario registrado con email "nicolas.moreno@empresa.com"
    Y que existe un producto con nombre "Auriculares Bluetooth" precio 800 y stock 15
    Y que inicié sesión con email "nicolas.moreno@empresa.com" y contraseña "NicoPass123!"
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
    Y que existe un usuario registrado con email "nicolas.moreno@empresa.com"
    Y que existe un producto con nombre "Mouse Inalámbrico" precio 450 y stock 3
    Y que inicié sesión con email "nicolas.moreno@empresa.com" y contraseña "NicoPass123!"
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
