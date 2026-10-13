# JobPilot España · v5 visual y exportación Excel

## Mejoras
- Interfaz oscura azul marino, acciones naranja y columnas por estado con colores diferenciados.
- Ajustes responsive para móvil, tableta y escritorio, botones y campos adaptativos.
- Botones Exportar Excel en Candidaturas y Mi perfil y datos.
- Excel con hojas Candidaturas y Resumen; exporta únicamente los registros almacenados en este dispositivo.
- El generador Excel usa la biblioteca SheetJS desde CDN: requiere conexión a Internet al exportar. Si falla, exporta CSV.
- Se mantienen los archivos originales de sincronización y la estructura de datos.

## Publicación
1. Exporta copia JSON antes de actualizar.
2. Descomprime y sube los archivos de esta carpeta a la raíz del repositorio GitHub Pages.
3. Espera al despliegue y fuerza recarga Ctrl+F5. En iPhone, cierra y reabre la app instalada; si sigue la versión anterior, borra los datos en caché con cuidado de conservar copia de seguridad.
4. Prueba una candidatura ficticia, exporta Excel y comprueba sincronización en ambos dispositivos.

## Límites
- No se ha probado en tu cuenta Supabase ni en dispositivos físicos.
- Las ofertas de buscadores externos no son un agregador automático completo.
- La exportación contiene el estado actual de las candidaturas, no un historial de cambios no registrado.
