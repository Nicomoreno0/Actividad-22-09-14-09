# language: es
Característica: Registro de usuarios
  Como visitante
  Quiero registrarme con nombre, email y contraseña
  Para poder realizar pedidos en la tienda

  Escenario: Registro exitoso con datos válidos
    Dado que la base de datos está limpia
    Cuando envío una solicitud POST a "/api/auth/registro" con el cuerpo:
      """
      {
        "nombre": "Faabri",
        "email": "faabri@ejemplo.com",
        "password": "Password123!"
      }
      """
    Entonces el código de respuesta debe ser 201
    Y el cuerpo de la respuesta debe contener un campo "usuario"

  Escenario: Registro con email duplicado
    Dado que la base de datos está limpia
    Y que existe un usuario registrado con email "faabri@ejemplo.com"
    Cuando envío una solicitud POST a "/api/auth/registro" con el cuerpo:
      """
      {
        "nombre": "Otro",
        "email": "faabri@ejemplo.com",
        "password": "Password123!"
      }
      """
    Entonces el código de respuesta debe ser 400
    Y la respuesta debe contener un mensaje de error
