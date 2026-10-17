# language: es
Característica: Seguridad de pedidos
  Como auditor de seguridad
  Quiero que los pedidos exijan JWT y pertenezcan al dueño
  Para evitar accesos no autorizados

  Escenario: Checkout sin token
    Dado que la base de datos está limpia
    Cuando envío una solicitud POST a "/api/pedidos" con el cuerpo:
      """
      {
        "productosComprados": [
          { "productoId": 1, "cantidad": 1 }
        ]
      }
      """
    Entonces el código de respuesta debe ser 401
    Y la respuesta debe contener un mensaje de error

  Escenario: Un usuario no puede ver el pedido de otro
    Dado que la base de datos está limpia
    Y que existe un usuario registrado con email "dueno@ejemplo.com"
    Y que existe un usuario registrado con email "otro@ejemplo.com"
    Y que existe un producto con nombre "Cámara Web" precio 12000 y stock 5
    Y que inicié sesión con email "dueno@ejemplo.com" y contraseña "Password123!"
    Y que creé un pedido autenticado del producto guardado con cantidad 1
    Y que inicié sesión con email "otro@ejemplo.com" y contraseña "Password123!"
    Cuando envío una solicitud autenticada GET a "/api/pedidos/{id_pedido}"
    Entonces el código de respuesta debe ser 403
    Y la respuesta debe contener un mensaje de error
