# Portfolio backend: oisandev
## Descripción

Portfolio Django + NextJS + PostgreSQL + MinIO.
Pensado para ser desplegado con Docker
Para mostrar como sería una aplicación web básica con
 - Varios servicios coordinados entre sí.
 - Despliegue fácil con Docker y docker-compose.
 - Entornos de desarrollo y producción separados
 - Backend y frontend desacoplados por API REST.
 - Endpoints backends hechos con Django Rest Framework.
 - Solo backend necesario para el frontend (BFF) para evitar endpoints backend redundantes.
 - Autenticación JWT con rest framework simplejwt
 - Almacenamiento de imágenes en MinIO (almacén de objetos S3 open-source)
 - Panel de gestión de contenido dinámico (categorías, páginas, etiquetas ... etc)
 - Gestión de comentarios. Posible eliminación de opiniones spam.
 - API correspondiente a la parte pública, solo accesible desde SSR para no ser llamada desde el cliente (evitar exposición de API de forma innecesaria)

## Objetivo
Hice este sitio web para poder tener mi propio mini CMS en el cual poder gestionar mis artículos y proyectos, y al mismo tiempo aprender nuevas cosas mientras lo hacía.

Extendí mi objetivo inicial para mostrar a la gente intusiasta de la programación como creo un sitio web dinámico con un framework backend (Django) y con el frontend en un SPA como React, asociandolos a través de API REST.

Publicando mi código creo que puedo aportar mi granito de arena para quienes esten aprendiendo Django, Docker u otras de las tecnologías empleadas.

## Despliegue
**Variables de entorno:**
Para que funcione adecuadamente el despliegue en producción es necesario tener en cuenta las siguientes variables de entorno en .env:

    API_URL=http://backend:8000
    POSTGRES_DB=NOMBRE_BBDD
    POSTGRES_USER=USUARIO_BBDD
    POSTGRES_PASSWORD=CONTRASEÑA_BBDD
    NEXT_PUBLIC_MINIO_URL_PRODUCTION=https://tudominio-para-minio.com


**Para desplegar en local** (para pruebas, tests y desarrollo)

    docker compose -f docker-compose.debug.yml build
    docker compose -f docker-compose.debug.yml up 

**Para desplegar en producción**.
Indicar esta orden docker-compose en el apartado de despliegue del proveedor utilizado.

    docker compose -f docker-compose.prod.yml build


## Endpoints de la API Backend
Se trata de una documentación hecha a partir de OpenAPI en formato yaml.
Pueden acceder [pinchando aquí](https://jade-kangaroo-ee90d1.netlify.app/
), y encontrarán algo similar a esto:
![ejemplo doc api](/doc/doc-api-1.png)


## Modelo de la BBDD
![Modelo de la BBDD](/doc/diagrama_tablas.png)


## Vistas del sitio web en funcionamiento
### La parte pública
**Página de inicio**
![Página de inicio](/doc/1.png)

**Categoría de proyectos**
![Categoría de proyectos](/doc/2.png)

**Categoría de Artículos**
![Categoría de Artículos](/doc/3.png)

**Contacto**
![Contacto](/doc/4.png)

**Publicación de ejemplo**
![Publicación de ejemplo](/doc/5.png)

**Inicio de sesión**
![Inicio de sesión](/doc/6.png)


### La parte privada
**Dasboard principal**
![Dasboard principal](/doc/7.png)

**Gestión de etiquetas**
![Gestión de etiquetas](/doc/8.png)

**Gestión de categorías**
![Gestión de categorías](/doc/9.png)

**Gestión de páginas**
![Gestión de páginas](/doc/10.png)

**Creación de página**
![Creación de página](/doc/11.png)


## Colaboración
Este proyecto no tiene como finalidad principal reclutar a amantes del desarrollo de software que busquen reputación y visibilidad, ni nada por el estilo.

Sin embargo no prohibo colaborar a todo aquel que quiera aportar sus ideas o decida aportar su código, pues es de bien nacido ser agradecido.

En este caso publicaría su aporte y le haría una mención en agradecimiento por su molestia, en cuento el tiempo me lo permitiera.

