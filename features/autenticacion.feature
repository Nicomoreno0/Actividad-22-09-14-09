# language: es
Característica: Autenticación JWT
  Como usuario registrado
  Quiero iniciar sesión
  Para obtener un token y acceder a mis pedidos

  Escenario: Login exitoso
    Dado que la base de datos está limpia
    Y que existe un usuario registrado con email "nicolas.moreno@empresa.com"
    Cuando envío una solicitud POST a "/api/auth/login" con el cuerpo:
      """
      {
        "email": "nicolas.moreno@empresa.com",
        "password": "NicoPass123!"
      }
      """
    Entonces el código de respuesta debe ser 200
    Y el cuerpo de la respuesta debe contener un campo "accessToken"

  Escenario: Login con contraseña incorrecta
    Dado que la base de datos está limpia
    Y que existe un usuario registrado con email "nicolas.moreno@empresa.com"
    Cuando envío una solicitud POST a "/api/auth/login" con el cuerpo:
      """
      {
        "email": "nicolas.moreno@empresa.com",
        "password": "clave-incorrecta"
      }
      """
    Entonces el código de respuesta debe ser 401
    Y la respuesta debe contener un mensaje de error
