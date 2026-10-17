# language: es
Característica: Gestión de categorías
  Como administrador del catálogo
  Quiero crear categorías
  Para organizar los productos de la tienda

  Escenario: Crear categoría con nombre válido
    Dado que la base de datos está limpia
    Cuando envío una solicitud POST a "/api/v1/categorias" con el cuerpo:
      """
      {
        "nombre": "Hardware"
      }
      """
    Entonces el código de respuesta debe ser 201
    Y el campo "nombre" debe ser "Hardware"

  Escenario: Crear categoría duplicada
    Dado que la base de datos está limpia
    Cuando envío una solicitud POST a "/api/v1/categorias" con el cuerpo:
      """
      {
        "nombre": "Hardware"
      }
      """
    Y envío una solicitud POST a "/api/v1/categorias" con el cuerpo:
      """
      {
        "nombre": "Hardware"
      }
      """
    Entonces el código de respuesta debe ser 409
    Y la respuesta debe contener un mensaje de error
