# Curso de Bootstrap 5 (16 horas)

Este workspace contiene el material (ejemplos, ejercicios y prácticas) del curso de Bootstrap 5 que imparte Luis Ramón. El temario siguiente es la referencia para generar o revisar contenido: ajustarse a la versión, la sesión y el nivel del alumnado indicados.

## Organización del workspace

- El material se organiza **por puntos del temario, no por sesiones**: el ritmo lo marca el alumnado y un punto puede pasar de una sesión a otra.
- Se trabaja **punto a punto**. Cada vez que se aborde un punto nuevo del temario, crear su página de guía en [guia_html/](guia_html/) (p. ej. [guia_html/introduccion.html](guia_html/introduccion.html)).
- Las páginas de guía son material de referencia del instructor, **no se usan durante el curso**. Cada una es un HTML autocontenido con Bootstrap 5.3.8 por CDN, explicación del punto, ejemplos de código y una práctica al final, siguiendo el estilo de [guia_html/introduccion.html](guia_html/introduccion.html).
- El resto de la estructura de carpetas aún no está decidida; no reorganizar ficheros sin preguntar.

## Datos generales

Curso práctico de 16 horas, en 4 sesiones de 4 horas, sobre **Bootstrap 5.3** (rama 5.x vigente, con modos de color, variables CSS y sin jQuery): al acabar, el alumnado sabe maquetar interfaces responsive y personalizar el framework.

## Objetivos

- Maquetar interfaces responsive con el sistema de rejilla, flexbox y las utilidades de Bootstrap.
- Usar los componentes principales y su JavaScript sin jQuery.
- Personalizar el framework con variables CSS, Sass y modo claro/oscuro.
- Aplicar buenas prácticas de accesibilidad, rendimiento y despliegue.

## Perfil y requisitos previos

- Alumnado con nivel básico-medio de HTML5 y CSS3 (selectores, modelo de caja, media queries básicas).
- Nociones de JavaScript útiles pero no imprescindibles; Sass se introduce desde cero.
- Editor de código (VS Code), navegador actualizado y Node.js LTS instalado.

## Metodología

Cada sesión combina un 40 % de exposición con demostración en vivo y un 60 % de práctica guiada. Los ejercicios son incrementales y cada sesión termina con una práctica guiada.

## Distribución por sesiones

Cuatro sesiones de 4 horas, de lo estructural a lo avanzado, con una práctica guiada al final de cada una.

| Sesión | Tema | Horas | Resultado práctico |
|---|---|---|---|
| 1 | Fundamentos, rejilla y utilidades | 4 | Landing responsive con navbar y secciones en rejilla |
| 2 | Tipografía, color, formularios y componentes de contenido | 4 | Página de contacto y catálogo con cards, tablas y formularios validados |
| 3 | Componentes interactivos, JavaScript y personalización | 4 | Modales, carrusel y modo oscuro; tema propio con Sass |
| 4 | Buenas prácticas, accesibilidad y despliegue | 4 | Landing auditada con Lighthouse y publicada |

### Sesión 1: fundamentos, rejilla y utilidades (4 h)

La primera sesión deja el entorno listo y enseña a maquetar con la rejilla y las utilidades, que son la base de todo lo demás.

1. **Introducción y entorno (45 min).** Qué es Bootstrap y qué cambia respecto a la versión 4 (sin jQuery, utilidades ampliadas, RTL, modos de color). Instalación por CDN y con npm; estructura de una plantilla base, meta viewport y `data-bs-theme`.
2. **Contenedores y breakpoints (30 min).** `.container`, `.container-fluid` y `.container-{breakpoint}`; los seis breakpoints y el enfoque mobile-first.
3. **Sistema de rejilla (75 min).** Filas y columnas, columnas automáticas y de ancho fijo, clases responsive, offset, order, gutters (`g-*`, `gx-*`, `gy-*`), `row-cols-*` y anidado. Práctica: maquetar tres layouts distintos.
4. **Flexbox y utilidades de espaciado (45 min).** `d-flex`, `justify-content-*`, `align-items-*`, `gap`; márgenes y rellenos (`m-*`, `p-*`), tamaños, bordes, sombras y visibilidad responsive.
5. **Práctica guiada (45 min).** Landing responsive con navbar, cabecera destacada y secciones en rejilla (se adelanta el componente navbar).

### Sesión 2: contenido, formularios y componentes básicos (4 h)

La segunda sesión cubre todo lo que se ve en pantalla sin necesidad de JavaScript.

1. **Tipografía y color (45 min).** Reboot, encabezados, `display-*`, `lead`, listas y citas; colores de tema, `text-*`, `bg-*`, `*-subtle` y `*-emphasis`; imágenes responsive e iconos con Bootstrap Icons.
2. **Tablas (30 min).** Variantes, `table-striped`, `table-hover`, `table-responsive` y alineación.
3. **Formularios (75 min).** `form-control`, `form-select`, checks, switches, rangos, `input-group`, `form-floating`, rejilla en formularios y validación nativa con `.was-validated` e `is-invalid`.
4. **Componentes de contenido (60 min).** Botones y grupos de botones, cards (incluido `card-group` y rejilla de cards), alerts, badges, list groups, breadcrumbs, paginación, progress y spinners.
5. **Práctica guiada (30 min).** Página de contacto con formulario validado y catálogo de productos con cards.

### Sesión 3: componentes interactivos y personalización (4 h)

La tercera sesión añade comportamiento con el JavaScript de Bootstrap y enseña a adaptar el framework a una marca propia.

1. **JavaScript de Bootstrap (30 min).** Bundle con Popper, atributos `data-bs-*` frente a la API programática, eventos y métodos de las instancias.
2. **Componentes interactivos (90 min).** Navbar responsive con collapse, dropdowns, modales, offcanvas, tabs y pills, accordion, carousel, tooltips, popovers, toasts y scrollspy.
3. **Modo claro y oscuro (30 min).** `data-bs-theme`, variables CSS `--bs-*` y un selector de tema con JavaScript.
4. **Personalización con CSS y Sass (60 min).** Sobrescribir variables CSS; compilar Bootstrap desde Sass con npm; variables `$primary`, `$theme-colors` y `$enable-*`; mapas de Sass; importación selectiva de módulos para reducir peso.
5. **Práctica guiada (30 min).** Tema propio con paleta y tipografías de marca, más modal, carrusel y modo oscuro sobre la landing.

### Sesión 4: buenas prácticas, accesibilidad y despliegue (4 h)

La última sesión consolida lo aprendido y cierra con calidad y publicación.

1. **Buenas prácticas (50 min).** Organización del proyecto con npm y Sass, cuándo usar utilidades frente a CSS propio, evitar `!important` y errores habituales.
2. **Extender Bootstrap (40 min).** API de utilidades para crear clases propias, helpers (`ratio`, `stretched-link`, `visually-hidden`) y estructura de mixins y funciones de Sass.
3. **Accesibilidad (50 min).** HTML semántico, roles y atributos ARIA en componentes, contraste de color, navegación por teclado y comprobación con Lighthouse.
4. **Taller de refuerzo (60 min).** Práctica libre guiada: cada persona retoma los ejercicios de las sesiones anteriores, los mejora y resuelve dudas con el instructor.
5. **Rendimiento y despliegue (30 min).** Carga por CDN frente a compilación propia, minimizado, importación selectiva de Sass y publicación en GitHub Pages o Netlify.
6. **Cierre (10 min).** Repaso, dudas y siguientes pasos (Bootstrap con React o Vue, frameworks alternativos).

## Recursos recomendados

- Documentación oficial de Bootstrap como referencia principal durante todo el curso.
- Bootstrap Icons para la iconografía.
- Las herramientas de desarrollo del navegador y Lighthouse para depurar y auditar.
