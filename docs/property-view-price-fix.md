# Correccion de precios L/v2 y View de inmuebles

Fecha: 2026-11-10. Ajuste focalizado posterior a `inmodata-backend/docs/implementations/bank-analyst-workflow.md`.

## Causa reproducida

El backend ya utiliza `property_valuations.average_square_yard` para construir
`valuationHistory.valuePoints[].value` y calcular `valueChange` y
`valueChangePercent`. No hay division por miles ni cambio de magnitud.

Precio y riesgo se devuelven como `ValuationHistoryPoint`, con el mismo `id` de
valuacion y un campo `value` diferente. Apollo normalizaba ambos con la identidad
`ValuationHistoryPoint:<id>`. Al escribir riskPoints sobrescribia valuePoints.
La variacion absoluta, un escalar independiente, permanecia correcta.

La prueba reproduce exactamente este resultado con InMemoryCache por defecto:

| Serie | Respuesta original | Lectura desde cache defectuosa |
| --- | --- | --- |
| Precio | 500, 1250, 1500, 2069.5 | 1, 2, 2, 2 |
| Riesgo | 1, 2, 2, 2 | 1, 2, 2, 2 |
| Variacion absoluta | 1569.5 | 1569.5 |

Solucion: `ValuationHistoryPoint: { keyFields: false }`. Los puntos se conservan
embebidos en su serie, sin tratarlos como entidades independientes compartidas.
No se modifica la normalizacion de Property ni el aislamiento de cache por sesion.
Las fixtures anteriores omitian __typename y no detectaban la colision; ahora
usan typenames e IDs iguales a los del contrato real y la politica de produccion.

## Valores y presentacion

Cada punto conserva `average_square_yard` sin escalar. Se mantiene el formatter
existente: `toLocaleString('en-US', { minimumFractionDigits: 2,
maximumFractionDigits: 2 })`, prefijo `L ` y sufijo `/v2` (superindice en UI).
Se mantienen ticks dinamicos, tooltips, orden cronologico y sector.

Ejemplo verificado con fixtures: 2069.50 - 500.00 = 1569.50;
1569.50 / 500.00 * 100 = 313.9%. Las etiquetas son L 500.00/v2,
L 1,250.00/v2, L 1,500.00/v2 y L 2,069.50/v2, no valores de riesgo.
Los datos originales mantienen su precision; redondear etiquetas a dos decimales
puede producir diferencias de un centavo frente a restar valores ya redondeados.
No se alteran historicos para compensar ese redondeo.

No se modificaron SimpleCharts, ValuationHistoryDashboard, las formulas backend,
la grafica de riesgo ni el historial operativo en esta tarea.

## View y mapa

Orden: Referencia / Clave Catastral; Direccion al ancho; Latitud / Longitud;
Mapa de ubicacion. En movil se apilan los campos. Encabezado Informacion General
sin repetir la referencia. El valor privado nulo mantiene la convencion `-`.

Se reutiliza InmuebleMapPreview con `readOnly`. Conserva mapa hybrid, map ID,
marker9, altura, controles de exploracion y zoom de ubicacion existentes.
No registra onClick de seleccion ni onDragEnd, y draggable es false. No se pasan
callbacks de formulario. Se omiten consultas y advertencias de proximidad de
edicion. El modo editable conserva seleccion y arrastre, probados por separado.
Sin coordenadas validas se muestra Ubicacion no disponible y el boton de mapa
queda deshabilitado, evitando construir una URL con null o coordenadas invalidas.

PropertyMapLink contiene exactamente el estilo previo del boton Edit y se usa
tanto en Edit como en View. No cambia el destino ni los permisos.
No se cambia la configuracion del APIProvider ni se agregan credenciales.

## Archivos de esta correccion

- `src/lib/apolloCache.ts`: fabrica de cache y politica especifica de puntos.
- `src/contexts/SessionApolloProvider.tsx`: utiliza esa fabrica; ciclo de sesion intacto.
- `src/pages/Property/detail.tsx`: orden, encabezado, mapa readonly y boton compartido.
- `src/pages/Property/components/InmuebleMapPreview.tsx`: variante readonly, estado vacio y eventos tipados.
- `src/pages/Property/components/PropertyMapLink.tsx`: boton reutilizado y guardia de coordenadas invalidas.
- `src/pages/Property/edit.tsx`: consume el mismo boton, sin cambios de autorizacion.
- `tests/browser/valuation-cache.cjs`: reproduccion y regresion de colision.
- `tests/browser/bank-workflow-harness.tsx` y `bank-workflow.cjs`: cache real, typenames y casos monetarios.
- `tests/browser/property-view-harness.tsx`, `property-view.cjs`, `maps-sdk-stub.tsx`: pruebas de View/mapa.
- `tests/browser/README.md`: instrucciones de pruebas.
- Este documento.

Los demas cambios ya presentes en el workspace pertenecen a trabajos anteriores
o ediciones ajenas a esta correccion y se conservaron.

## Verificacion ejecutada

- `node tests/browser/valuation-cache.cjs`: aprobado; reproduce fallo sin politica y verifica precios/riesgos independientes con ella.
- `NODE_PATH=/tmp/inmodata-browser-tools/node_modules node tests/browser/bank-workflow.cjs`: aprobado; valores pequenos, >1000, >10000, decimales, variaciones positivas/negativas/cero, fecha repetida, un punto, labels, riesgo y responsive.
- `NODE_PATH=/tmp/inmodata-browser-tools/node_modules node tests/browser/property-view.cjs`: aprobado; orden/layout, privacidad, coordenadas, marker9 cargado, ausencia de handlers/mutations/proximidad, estado vacio, objeto no disponible, boton identico y regresion editable.
- `NODE_PATH=/tmp/inmodata-browser-tools/node_modules node tests/browser/session.cjs`: aprobado; aislamiento y limpieza de sesion, sin cambiar autenticacion.
- `NODE_PATH=/tmp/inmodata-browser-tools/node_modules node tests/browser/institutions.cjs`: aprobado; tabla/modal institucionales y navegacion existentes.
- Backend: `docker compose exec -e APP_CONFIG_CACHE=/tmp/inmodata-testing-config.php -e APP_ENV=testing -e DB_DATABASE=testing laravel.test php artisan test --filter=PropertyValuationHistoryTest`: 4 pruebas, 18 aserciones aprobadas. Son pruebas unitarias sin escrituras de base de datos.
- `npm run build`: TypeScript y Vite aprobados; advertencia existente de chunk >500 kB.
- ESLint sobre archivos TS/TSX de esta correccion: cero errores, una advertencia preexistente sobre lifecycle.current en SessionApolloProvider. No se cambia ese mecanismo de seguridad para silenciarla.
- No cambian queries ni esquema GraphQL; no se requiere regenerar tipos ni migraciones.

## Limites y uso

Las pruebas de mapa ejecutan el componente real pero simulan el SDK de Google y
Circle. Verifican props, eventos, coordenadas, carga del PNG y layout; no validan
tiles reales, disponibilidad de Google ni restricciones de su API key. Se conserva
el proveedor/configuracion que ya usa Edit. No se accedio a produccion ni se
modificaron registros, permisos o instituciones.

Esta correccion solo requiere publicar el build frontend. Recargar la aplicacion
inicializa la nueva politica de cache; la cache de este cliente no es persistente.
No ejecutar seeders ni migraciones por estos ajustes.
