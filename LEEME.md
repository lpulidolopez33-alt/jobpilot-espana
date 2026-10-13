# JobPilot España — PWA gratuita para iPhone y Windows

## Instalación
1. Publica la carpeta en un alojamiento HTTPS gratuito (por ejemplo GitHub Pages). **No basta abrir index.html como archivo local**: la instalación PWA y el service worker requieren HTTPS o localhost.
2. Windows: abre la URL en Edge > menú `...` > Aplicaciones > Instalar este sitio como aplicación. También puedes crear acceso directo en el escritorio.
3. iPhone: abre la URL en Safari > Compartir > Añadir a pantalla de inicio > Añadir.

## Sincronización gratuita entre dispositivos
1. Crea un proyecto gratuito en Supabase (sujeto a límites y condiciones vigentes).
2. Abre SQL Editor y ejecuta `supabase.sql` para crear la tabla y las políticas de acceso.
3. En ambos dispositivos abre la misma URL HTTPS de JobPilot. En la sección Sincronización, pega la URL del proyecto y la clave **pública** anon/publishable (nunca service_role).
4. Crea cuenta, confirma correo si se solicita e inicia sesión en ambos equipos. Pulsa **Sincronizar ahora**.
5. **Importante**: en la primera sincronización, si hay datos diferentes, la app no mezcla ni sobrescribe automáticamente. Exporta copias JSON antes de decidir cómo migrar. Los cambios se sincronizan al pulsar el botón o al volver a enfocar la app después de la primera sincronización. No es sincronización instantánea en segundo plano.

## Ofertas actualizadas
La búsqueda externa consulta portales en el momento de abrirlos. La búsqueda integrada Adzuna requiere credenciales del proveedor y puede fallar por CORS. **No hay actualización diaria desatendida de ofertas integrada en esta versión**: eso requiere un proceso servidor programado y una fuente/API permitida, con sus límites y condiciones. No se garantiza cobertura de todos los portales.

## Coste
Código y PWA gratis. GitHub Pages y Supabase pueden utilizarse en planes gratuitos sujetos a límites y políticas. Publicar una PWA no requiere cuenta de desarrollador Apple. No se garantiza que cualquier proveedor mantenga su plan gratuito indefinidamente.

## Seguridad y privacidad
La clave pública no es secreta; las políticas RLS del SQL restringen los datos a cada usuario. No compartas contraseña ni claves privadas. Los datos locales no están cifrados; evita dispositivos compartidos. Exporta copias de seguridad regularmente. La librería Supabase se carga desde CDN y necesita conexión para sincronizar.
