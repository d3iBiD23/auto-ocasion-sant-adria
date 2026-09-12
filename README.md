# Auto Ocasión Sant Adrià

Aplicación full-stack para catálogo y gestión de vehículos de ocasión.

## Arranque en un clic

Haz doble clic en `iniciar-web.bat`. Es la ruta rápida: usa Docker Compose para levantar MySQL y arranca API y frontend solo si no estaban ya activos. Después abre automáticamente `http://127.0.0.1:5173`.

Para detener la aplicación, haz doble clic en `apagar-web.bat`. Detiene web, API y MySQL, pero deja Docker Desktop abierto: así el siguiente inicio es mucho más rápido y se evita el problema de sockets que puede aparecer tras cierres abruptos.

`iniciar-web.ps1` queda como recuperación automática si Docker Desktop no está disponible; también se ejecuta sin administrador.

## Probar desde un móvil en la misma Wi-Fi

Con el ordenador encendido y la web iniciada, conecta el móvil a la misma red Wi-Fi y abre `http://192.168.1.38:5173`. La dirección puede cambiar si cambia la red; en Windows puedes verla con `ipconfig` (usa la IPv4 del adaptador Ethernet o Wi-Fi). Esta dirección es solo para pruebas dentro de tu red, no para publicar la web en Internet.

Las solicitudes enviadas desde móvil se guardan igual que en ordenador. Los botones abren WhatsApp con el teléfono y texto preparados. Las fotos se guardan en la solicitud para el administrador; en navegadores móviles compatibles y bajo HTTPS también se ofrece el selector nativo para compartir fotos y mensaje juntos. WhatsApp no permite que una página web adjunte archivos automáticamente a un chat ya seleccionado.

## Arranque manual

1. Arranca MySQL: `docker compose up -d`
2. Inicia el API: `cd backend && mvn spring-boot:run`
3. En otra terminal inicia la web: `cd frontend && npm install && npm run dev`
4. Abre `http://localhost:5173`.

La API queda en `http://localhost:8080/api`. El perfil inicial de administración es `admin@autoocasion.local` / `Admin123!SantAdria`. En producción define `ADMIN_EMAIL` y `ADMIN_PASSWORD` como variables de entorno. Las sesiones son aleatorias y caducan en 30 minutos.

## Producción

Configura `DB_URL`, `DB_USER`, `DB_PASSWORD` y `JWT_SECRET` para el backend. Define también `VITE_WHATSAPP_PHONE` para indicar el WhatsApp comercial (ahora usa temporalmente `34678773271`). Construye el frontend con `npm run build`; los ficheros resultantes quedan en `frontend/dist`.

Las fotografías subidas se redimensionan automáticamente a una versión web (máximo 1.600 px) y a una miniatura de 560 px; el catálogo usa las miniaturas y solo carga la imagen grande al abrir la ficha. Para el despliegue público, configura el servidor/CDN para convertir esas imágenes JPEG optimizadas a WebP o AVIF según admita el navegador, conservando JPEG como compatibilidad. Así no se añade procesamiento pesado en el móvil ni se rompen navegadores antiguos.

## Contacto de clientes

Cada ficha de vehículo incluye un formulario de interés para solicitar su compra. La sección pública **Vende tu coche** es independiente: recopila los datos, descripción y hasta diez fotos del coche que un particular quiere vender al concesionario. Ambas solicitudes se guardan y aparecen separadas en el panel de administración, desde donde se pueden revisar, marcar como atendidas y responder por teléfono o WhatsApp.

## Inventario inicial

Los vehículos de ejemplo se han transcrito de la información pública del concesionario en Coches.net y sirven como carga inicial editable. Las imágenes son ilustrativas (Unsplash), para evitar reutilizar fotografías de terceros. Revisa disponibilidad, precio y especificaciones antes de publicar.
