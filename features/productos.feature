# language: es
Característica: Pruebas de Endpoints de la API de Productos
  Como usuario de la API
  Quiero gestionar la entidad Productos
  Para verificar que los códigos de respuesta HTTP y la lógica de negocio sean correctos

  Escenario: Crear con datos válidos
    Dado que la base de datos de productos está limpia
    Cuando envío una solicitud POST a "/api/v1/productos" con el cuerpo:
      """
      {
        "nombre": "Monitor Gamer 27\"",
        "precio": 150000
      }
      """
    Entonces el código de respuesta debe ser 201
    Y el cuerpo de la respuesta debe contener un campo "id"
    Y el campo "nombre" debe ser "Monitor Gamer 27\""

  Escenario: Crear sin título o nombre
    Cuando envío una solicitud POST a "/api/v1/productos" con el cuerpo:
      """
      {
        "precio": 1500
      }
      """
    Entonces el código de respuesta debe ser 422
    Y la respuesta debe contener un mensaje de error

  Escenario: Consultar ID existente
    Dado que existe un producto guardado con nombre "Auriculares Bluetooth" y precio 800
    Cuando envío una solicitud GET a "/api/v1/productos/{id_guardado}"
    Entonces el código de respuesta debe ser 200
    Y el campo "nombre" debe ser "Auriculares Bluetooth"

  Escenario: Consultar ID inexistente
    Cuando envío una solicitud GET a "/api/v1/productos/999999"
    Entonces el código de respuesta debe ser 404

  Escenario: Consultar ID inválido
    Cuando envío una solicitud GET a "/api/v1/productos/abc-invalido"
    Entonces el código de respuesta debe ser 400

  Escenario: Modificar un campo válido
    Dado que existe un producto guardado con nombre "Mouse Inalámbrico" y precio 450
    Cuando envío una solicitud PUT a "/api/v1/productos/{id_guardado}" con el cuerpo:
      """
      {
        "precio": 25000
      }
      """
    Entonces el código de respuesta debe ser 200
    Y el campo "precio" debe ser 25000

  Escenario: Eliminar recurso existente
    Dado que existe un producto guardado con nombre "Webcam HD" y precio 12000
    Cuando envío una solicitud DELETE a "/api/v1/productos/{id_guardado}"
    Entonces el código de respuesta debe ser 204

  Escenario: Aplicar filtro
    Dado que existen los siguientes productos en la base de datos:
      | nombre           | precio |
      | Monitor Gamer    | 150000 |
      | Teclado Bluetooth | 35000 |
    Cuando envío una solicitud GET a "/api/v1/productos?nombre=Monitor"
    Entonces el código de respuesta debe ser 200
    Y la lista devuelta debe contener solo 1 elementos

  Escenario: Invocar ruta desconocida
    Cuando envío una solicitud GET a "/api/v1/ruta-desconocida-xyz"
    Entonces el código de respuesta debe ser 404
