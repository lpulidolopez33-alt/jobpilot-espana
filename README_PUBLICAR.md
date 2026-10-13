# JobPilot España — actualización de interfaz y sincronización

## Publicar esta versión
1. En GitHub abre `lpulidolopez33-alt/jobpilot-espana` > Code.
2. Usa Add file > Upload files y sube **el contenido de esta carpeta** a la raíz del repositorio (no el ZIP).
3. Confirma la sustitución de `index.html`, `sync.js`, `sw.js` y demás archivos y pulsa Commit changes.
4. En GitHub > Actions espera a que Pages termine. Abre https://lpulidolopez33-alt.github.io/jobpilot-espana/ y actualiza con Ctrl+F5.
5. En iPhone cierra la app instalada, abre el enlace en Safari y vuelve a abrirla; si aparece una versión antigua, elimina el acceso directo y vuelve a añadirlo.

## Lo que hace
- Diseño adaptado a escritorio y móvil.
- Formulario **Nueva candidatura** dentro de la sección Candidaturas.
- Tablero de seguimiento, filtros, enlaces a ofertas y copias de seguridad.
- Sincronización con `jobpilot_state` de Supabase y cuenta privada, con escucha Realtime y refresco periódico mientras la app está abierta.
- Intenta fusionar cambios en candidaturas distintas y **detiene la sincronización** ante cambios incompatibles sobre la misma candidatura.
- Búsquedas externas de empleo en España.

## Limitaciones importantes
- No incluye un agregador autónomo de ofertas ni un trabajo programado diario; las búsquedas externas consultan los portales al abrirse.
- Los navegadores no garantizan ejecución con la app cerrada. El servicio gratuito de Supabase tiene límites.
- El CV local no se sube. Guarda una copia JSON antes de probar con candidaturas reales.
- El esquema `jobpilot_state` debe existir y tener RLS por `user_id`, como se configuró previamente.
- Los cambios simultáneos al mismo registro requieren resolución manual.
- Para uso real, revisar los permisos RLS, la autenticación y la configuración de Realtime.

## Prueba de extremo a extremo
1. En Windows, exporta una copia de seguridad.
2. Crea una candidatura ficticia y pulsa Sincronizar ahora. Debe decir que se guardó en la nube.
3. En iPhone, inicia sesión con el mismo usuario y sincroniza. Debe aparecer la candidatura.
4. Cambia el estado en iPhone y sincroniza; comprueba en Windows tras volver a la pestaña.
5. Borra la candidatura ficticia y sincroniza desde ambos dispositivos.

## Privacidad
Nunca introduzcas una `service_role` ni una clave secreta en una web pública. La URL y la clave publishable pueden estar en el cliente, pero los datos solo quedan protegidos si RLS está correctamente configurado.
