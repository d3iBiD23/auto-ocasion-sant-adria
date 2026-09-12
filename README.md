# Auto Ocasión Sant Adrià

Plataforma integral para un concesionario de vehículos de ocasión: catálogo público, captación de coches y panel de gestión de inventario y solicitudes.

## Funcionalidades

- Catálogo responsive con filtros por marca, combustible y precio.
- Fichas de vehículo con galería, formulario de interés y contacto por WhatsApp.
- Sección **Vende tu coche** para recibir tasaciones con información y fotografías.
- Panel privado para crear, editar, duplicar, reservar, publicar o retirar vehículos.
- Gestión de solicitudes por estado, seguimientos y papelera recuperable.
- Carga optimizada de imágenes: versión web y miniaturas automáticas.
- API REST con Spring Boot, persistencia MySQL y control de acceso administrativo.

## Arquitectura

| Capa | Tecnología |
| --- | --- |
| Interfaz | React + Vite |
| API | Spring Boot + Java 17 |
| Persistencia | MySQL + JPA/Hibernate |
| Entorno local | Docker Compose |

```text
AutoOcasionSantAdria/
├── backend/                 # API, seguridad, datos y procesamiento de imágenes
├── frontend/                # Aplicación React
├── docker-compose.yml       # Servicio MySQL local
├── iniciar-web.bat          # Inicio rápido en Windows
├── apagar-web.bat           # Detención segura del entorno local
└── README.md
```

## Inicio rápido en Windows

1. Abre Docker Desktop y espera a que indique que está listo.
2. Haz doble clic en `iniciar-web.bat`.
3. Abre [http://127.0.0.1:5173](http://127.0.0.1:5173).

El script inicia MySQL con Docker Compose y levanta API y frontend solo si no estaban activos. Para apagar el entorno, ejecuta `apagar-web.bat`; Docker Desktop permanece abierto para que el siguiente inicio sea más rápido.

## Acceso desde móvil durante las pruebas

Con el ordenador y el móvil en la misma Wi-Fi, abre en el teléfono:

```text
http://IP-LOCAL-DEL-ORDENADOR:5173
```

La IP se consulta con `ipconfig` en Windows. Esta dirección sirve únicamente dentro de la red local; para la publicación se utilizará el dominio y el alojamiento definitivos.

## Inicio manual

```powershell
# 1. Base de datos
docker compose up -d

# 2. API (otra terminal)
cd backend
mvn spring-boot:run

# 3. Aplicación web (otra terminal)
cd frontend
npm install
npm run dev
```

La interfaz queda disponible en `http://localhost:5173` y la API en `http://localhost:8080/api`.

## Calidad

Antes de publicar cambios, ejecuta:

```powershell
cd backend
mvn test

cd ../frontend
npm run build
```

Las pruebas cubren los flujos principales de autenticación, solicitudes, duplicados, imágenes y estados del inventario.

## Variables para producción

No subas credenciales al repositorio. Define las siguientes variables en el proveedor de alojamiento:

```text
DB_URL
DB_USER
DB_PASSWORD
ADMIN_EMAIL
ADMIN_PASSWORD
UPLOAD_DIR
VITE_WHATSAPP_PHONE
```

Las imágenes se redimensionan al subirlas a una versión de catálogo (máximo 1.600 px) y una miniatura (560 px). En producción se recomienda servirlas desde un almacenamiento/CDN con WebP o AVIF, manteniendo JPEG como compatibilidad.

## Despliegue

GitHub será la fuente de código y control de versiones. El despliegue público se conectará posteriormente a un proveedor con soporte para:

- Frontend estático para la carpeta `frontend/dist`.
- Servicio Java para el backend.
- MySQL administrado y almacenamiento persistente de fotografías.
- Variables de entorno y dominio personalizado con HTTPS.

## Datos de demostración

El inventario inicial contiene vehículos de muestra editables. Antes de la publicación final se deben revisar disponibilidad, precios, fichas, textos legales, datos del responsable y teléfono comercial.
