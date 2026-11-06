// Genera las capturas de la documentación a partir de las páginas de guia_html/.
// Uso: npm run capturas
const { chromium, devices } = require('playwright')
const fs = require('node:fs')
const path = require('node:path')
const { pathToFileURL } = require('node:url')

const DESTINO = __dirname
const guia = nombre => pathToFileURL(path.join(__dirname, '..', 'guia_html', nombre)).href

const GUIA_01 = guia('01_introducción.html')
const GUIA_02 = guia('02_contenedores.html')
const GUIA_03 = guia('03_flexbox_utilidades.html')
const GUIA_04 = guia('04_rejilla.html')
const GUIA_05 = guia('05_tipografia_color.html')
const GUIA_06 = guia('06_tablas.html')
const GUIA_07 = guia('07_formularios.html')
const GUIA_08 = guia('08_componentes_contenido.html')
const GUIA_09 = guia('09_javascript.html')
const GUIA_10 = guia('10_componentes_interactivos.html')
const GUIA_11 = guia('11_modo_claro_oscuro.html')
const GUIA_12 = guia('12_personalizacion.html')

// Capturas de las demos: [fichero, selector de la demo, anchos de ventana]
// Si hay varios anchos, el fichero lleva el sufijo del breakpoint (04_responsive_xs.png...)
const ANCHOS = { xs: 400, sm: 600, md: 800, lg: 1000, xl: 1250 }
const CAPTURAS_02 = [
  ['02_indicador',  '#breakpoints .demo >> nth=0', ['xs', 'md', 'xl']],
  ['02_ejemplo_862', '#tipos .demo >> nth=0',      ['lg']],
]
const CAPTURAS_03 = [
  ['03_espaciado_escala',      '#escala .demo >> nth=0',      ['lg']],
  ['03_espaciado_lados',       '#lados .demo >> nth=0',       ['lg']],
  ['03_espaciado_margin',      '#margin .demo >> nth=0',      ['lg']],
  ['03_espaciado_margin_auto', '#margin-auto .demo >> nth=0', ['lg']],
  ['03_espaciado_start_end',   '#start-end .demo >> nth=0',   ['lg']],
  ['03_espaciado_responsive',  '#responsive .demo >> nth=0',  ['xs', 'md']],
  ['03_flex_contenedor',       '#flex .demo >> nth=0',        ['lg']],
  ['03_flex_column_span',      '#flex .demo >> nth=1',        ['lg']],
  ['03_flex_justify',          '#justify .demo >> nth=0',     ['lg']],
  ['03_flex_align',            '#align .demo >> nth=0',       ['lg']],
  ['03_flex_gap_wrap',         '#gap-wrap .demo >> nth=0',    ['lg']],
  ['03_flex_nowrap',           '#gap-wrap .demo >> nth=1',    ['lg']],
  ['03_flex_elementos',        '#elementos .demo >> nth=0',   ['lg']],
  ['03_flex_grow',             '#elementos .demo >> nth=1',   ['lg']],
  ['03_flex_responsive',       '#flex-responsive .demo >> nth=0', ['xs', 'md']],
  // '#tamanos .demo >> nth=2' (portada con min-vh-100) no se captura: mide toda la pantalla
  ['03_tamanos_w_h',           '#tamanos .demo >> nth=0',     ['lg']],
  ['03_tamanos_mw',            '#tamanos .demo >> nth=1',     ['lg']],
  ['03_bordes',                '#bordes .demo >> nth=0',      ['lg']],
  ['03_bordes_rounded',        '#bordes .demo >> nth=1',      ['lg']],
  ['03_sombras',               '#sombras .demo >> nth=0',     ['lg']],
  ['03_sombras_tarjeta',       '#sombras .demo >> nth=1',     ['lg']],
  ['03_visibilidad_indicador', '#visibilidad .demo >> nth=0', ['xs', 'md', 'xl']],
  ['03_visibilidad_combinaciones', '#visibilidad .demo >> nth=1', ['xs', 'md', 'lg']],
  ['03_visibilidad_menu',      '#visibilidad .demo >> nth=2', ['xs', 'md']],
  ['03_visibilidad_invisible', '#visibilidad .demo >> nth=3', ['lg']],
  ['03_visibilidad_visually_hidden', '#visibilidad .demo >> nth=4', ['lg']],
]
const CAPTURAS_04 = [
  ['04_filas',           '#filas .demo >> nth=0',       ['lg']],
  ['04_filas_12',        '#filas .demo >> nth=1',       ['lg']],
  ['04_filas_fondo',     '#filas .demo >> nth=2',       ['lg']],
  ['04_filas_margen_negativo', '#filas .demo >> nth=3', ['lg']],
  ['04_auto_iguales',    '#automaticas .demo >> nth=0', ['lg']],
  ['04_auto_col_auto',   '#automaticas .demo >> nth=1', ['lg']],
  ['04_fijas',           '#fijas .demo >> nth=0',       ['lg']],
  ['04_fijas_desborde',  '#fijas .demo >> nth=1',       ['lg']],
  ['04_responsive',      '#responsive .demo >> nth=0',  ['xs', 'md', 'xl']],
  ['04_responsive_col_md', '#responsive .demo >> nth=1', ['xs', 'md']],
  ['04_offset',          '#offset .demo >> nth=0',      ['lg']],
  ['04_offset_ms_auto',  '#offset .demo >> nth=1',      ['lg']],
  ['04_order',           '#order .demo >> nth=0',       ['xs', 'md']],
  ['04_order_real',      '#order .demo >> nth=1',       ['xs', 'md']],
  ['04_gutters_g0',      '#gutters .demo >> nth=0',     ['lg']],
  ['04_gutters_g5',      '#gutters .demo >> nth=1',     ['lg']],
  ['04_gutters_gx1_gy4', '#gutters .demo >> nth=2',     ['lg']],
  ['04_row_cols',        '#row-cols .demo >> nth=0',    ['xs', 'sm', 'lg']],
  ['04_anidado',         '#anidado .demo >> nth=0',     ['lg']],
  ['04_layout_blog',     '#practica .demo >> nth=0',    ['xs', 'lg']],
  ['04_layout_catalogo', '#practica .demo >> nth=1',    ['sm', 'xl']],
  ['04_layout_panel',    '#practica .demo >> nth=2',    ['xs', 'lg']],
]
const CAPTURAS_05 = [
  ['05_encabezados',   '#encabezados .demo >> nth=0', ['lg']],
  ['05_display',       '#display .demo >> nth=0',     ['lg']],
  ['05_lead',          '#texto .demo >> nth=0',       ['lg']],
  ['05_utilidades',    '#texto .demo >> nth=1',       ['lg']],
  ['05_listas',        '#listas .demo >> nth=0',      ['lg']],
  ['05_citas',         '#citas .demo >> nth=0',       ['lg']],
  ['05_colores',       '#colores .demo >> nth=0',     ['lg']],
  ['05_subtle',        '#subtle .demo >> nth=0',      ['lg']],
  ['05_text_bg',       '#text-bg .demo >> nth=0',     ['lg']],
  ['05_img_fluid',     '#imagenes .demo >> nth=0',    ['lg']],
  ['05_img_otras',     '#imagenes .demo >> nth=1',    ['lg']],
  ['05_iconos',        '#iconos .demo >> nth=0',      ['lg']],
]
const CAPTURAS_06 = [
  ['06_base',          '#base .row >> nth=0',         ['lg']],
  ['06_estructura',    '#estructura .demo >> nth=0',  ['lg']],
  ['06_striped_hover', '#striped .row >> nth=0',      ['lg']],
  ['06_bordes_sm',     '#bordes .demo >> nth=0',      ['lg']],
  ['06_colores',       '#colores .row >> nth=0',      ['lg']],
  ['06_divider',       '#divider .demo >> nth=0',     ['lg']],
  ['06_responsive',    '#responsive .row >> nth=0',   ['lg']],
  ['06_alineacion_horizontal', '#alineacion .row >> nth=0', ['lg']],
  ['06_alineacion_vertical',   '#alineacion .row >> nth=1', ['lg']],
  ['06_caption_top',   '#alineacion .demo >> nth=4',  ['lg']],
  ['06_practica',      '#practica .demo >> nth=0',    ['xs', 'lg']],
]
const CAPTURAS_07 = [
  // '#control .row' no: con g-4 su margen negativo recoge el párrafo de encima
  ['07_control_sin',        '#control .demo >> nth=0',     ['lg']],
  ['07_control_con',        '#control .demo >> nth=1',     ['lg']],
  ['07_control_ayuda',      '#control .demo >> nth=2',     ['lg']],
  ['07_tipos',              '#tipos .demo >> nth=0',       ['lg']],
  ['07_tamanos',            '#estados .demo >> nth=0',     ['lg']],
  ['07_estados',            '#estados .demo >> nth=1',     ['lg']],
  ['07_select',             '#select .demo >> nth=0',      ['lg']],
  ['07_checks',             '#checks .demo >> nth=0',      ['lg']],
  ['07_switch_btn_check',   '#switch .demo >> nth=0',      ['lg']],
  ['07_rango',              '#rango .demo >> nth=0',       ['lg']],
  ['07_input_group',        '#input-group .demo >> nth=0', ['lg']],
  ['07_floating',           '#floating .demo >> nth=0',    ['lg']],
  ['07_rejilla_columnas',   '#rejilla .demo >> nth=0',     ['xs', 'lg']],
  ['07_rejilla_horizontal', '#rejilla .demo >> nth=1',     ['xs', 'lg']],
  ['07_rejilla_en_linea',   '#rejilla .demo >> nth=2',     ['xs', 'lg']],
  ['07_validacion_inicial', '#validacion .demo >> nth=0',  ['lg']],
  ['07_validacion_manual',  '#validacion .demo >> nth=1',  ['lg']],
  ['07_practica',           '#practica .demo >> nth=0',    ['xs', 'lg']],
]

const CAPTURAS_08 = [
  // '#botones .row' no: con g-4 su margen negativo recoge el párrafo de encima
  ['08_botones',              '#botones .demo >> nth=0',       ['lg']],
  ['08_botones_d_grid',       '#botones .demo >> nth=1',       ['lg']],
  ['08_botones_d_grid_md',    '#botones .demo >> nth=2',       ['xs', 'lg']],
  ['08_grupos',               '#grupos .demo >> nth=0',        ['lg']],
  ['08_cards',                '#cards .demo >> nth=0',         ['lg']],
  ['08_cards_colores',        '#cards .demo >> nth=1',         ['lg']],
  ['08_rejilla_cards',        '#rejilla-cards .demo >> nth=0', ['sm', 'lg']],
  ['08_rejilla_cards_sin_h100', '#rejilla-cards .demo >> nth=1', ['lg']],
  ['08_card_group',           '#rejilla-cards .demo >> nth=2', ['lg']],
  ['08_alerts',               '#alerts .demo >> nth=0',        ['lg']],
  ['08_badges',               '#badges .demo >> nth=0',        ['lg']],
  ['08_list_group',           '#list-group .demo >> nth=0',    ['lg']],
  ['08_breadcrumb',           '#breadcrumb .demo >> nth=0',    ['lg']],
  ['08_paginacion',           '#paginacion .demo >> nth=0',    ['lg']],
  ['08_progress',             '#progress .demo >> nth=0',      ['lg']],
  ['08_spinners',             '#spinners .demo >> nth=0',      ['lg']],
  ['08_practica',             '#practica .demo >> nth=0',      ['xs', 'lg']],
]

const CAPTURAS_10 = [
  // Los carruseles no están en un .demo: se capturan por su id
  ['10_navbar',          '#navbar .demo >> nth=0',    ['xs', 'lg']],
  ['10_navbar_oscura',   '#navbar .demo >> nth=1',    ['lg']],
  ['10_tabs_estilos',    '#tabs .demo >> nth=0',      ['lg']],
  ['10_tabs',            '#tabs .demo >> nth=1',      ['lg']],
  ['10_accordion',       '#accordion .demo >> nth=0', ['lg']],
  ['10_carousel',        '#carrusel-demo',            ['lg']],
  ['10_carousel_fade',   '#carrusel-api',             ['lg']],
  ['10_practica',        '#practica .demo >> nth=0',  ['xs', 'lg']],
]

// Modo claro: el navegador de las capturas no tiene nada en localStorage ('tema-guia' vacío → auto)
// y Playwright emula prefers-color-scheme: light, así que el script del <head> de la guía pone light.
// La práctica (#landing) tiene su propio selector ('tema-landing'), también en auto → light.
const CAPTURAS_11 = [
  // '#zonas .row' no: con g-4 su margen negativo recoge el párrafo de encima
  ['11_zona_solo_atributo',  '#zonas .demo >> nth=0',        ['lg']],
  ['11_zona_bg_body',        '#zonas .demo >> nth=1',        ['lg']],
  ['11_componentes_oscuros', '#zonas .demo >> nth=2',        ['lg']],
  ['11_utilidades_claro',    '#utilidades .demo >> nth=0',   ['lg']],
  ['11_logos_claro',         '#imagenes .demo >> nth=0',     ['lg']],
  ['11_fichas_claro',        '#propias .demo >> nth=0',      ['lg']],
  ['11_tienda_claro',        '#sobrescribir .demo >> nth=0', ['lg']],
  ['11_primary_rgb',         '#sobrescribir .demo >> nth=1', ['lg']],
  ['11_componente_claro',    '#componente .demo >> nth=0',   ['lg']],
  ['11_sepia',               '#modo-propio .demo >> nth=0',  ['lg']],
  ['11_practica',            '#practica .demo >> nth=0',     ['xs', 'lg']],
]

const CAPTURAS_12 = [
  // '#css-globales .row' no: con g-4 su margen negativo recoge el bloque de código de encima
  ['12_css_globales_sin',   '#css-globales .demo >> nth=0',   ['lg']],
  ['12_css_globales_con',   '#css-globales .demo >> nth=1',   ['lg']],
  ['12_css_componente',     '#css-componente .demo >> nth=0', ['lg']],
  ['12_clases_redefinidas', '#css-clases .demo >> nth=0',     ['lg']],
  ['12_clases_escapa',      '#css-clases .demo >> nth=1',     ['lg']],
  ['12_sass_resultado',     '#sass .demo >> nth=0',           ['lg']],
  ['12_variables_tema',     '#variables .demo >> nth=0',      ['lg']],
  ['12_enable',             '#enable .demo >> nth=0',         ['lg']],
  ['12_mapas',              '#mapas .demo >> nth=0',          ['lg']],
  ['12_practica',           '#practica .demo >> nth=0',       ['xs', 'lg']],
]

async function capturarElemento(page, selector, fichero) {
  await page.locator(selector).first().screenshot({ path: path.join(DESTINO, fichero) })
  console.log('✔', fichero)
}

// Captura la zona que ocupan varios elementos juntos (una demo y el menú o el globo que se sale de ella)
async function capturarZona(page, selectores, fichero, margen = 8) {
  const cajas = []
  for (const selector of selectores) {
    const caja = await page.locator(selector).first().boundingBox()
    if (caja) cajas.push(caja)
  }
  const x = Math.max(0, Math.min(...cajas.map(c => c.x)) - margen)
  const y = Math.max(0, Math.min(...cajas.map(c => c.y)) - margen)
  const derecha = Math.max(...cajas.map(c => c.x + c.width)) + margen
  const abajo = Math.max(...cajas.map(c => c.y + c.height)) + margen
  await page.screenshot({ path: path.join(DESTINO, fichero), clip: { x, y, width: derecha - x, height: abajo - y } })
  console.log('✔', fichero)
}

(async () => {
  const browser = await chromium.launch()

  // 01 · La unidad rem (con la base de 16 px y de 24 px), Reboot y modos de color con data-bs-theme
  {
    const page = await browser.newPage({ viewport: { width: 1200, height: 900 } })
    await page.goto(GUIA_01, { waitUntil: 'networkidle' })
    await capturarElemento(page, '#rem .demo >> nth=0', '01_rem_base16.png')
    await capturarElemento(page, '#rem .demo >> nth=1', '01_rem_em.png')
    await capturarElemento(page, '#rem .demo >> nth=2', '01_rem_bootstrap.png')
    await page.click('[data-base="24"]')
    await capturarElemento(page, '#rem .demo >> nth=0', '01_rem_base24.png')
    await page.click('[data-base="16"]')
    await capturarElemento(page, '#reboot .demo >> nth=0', '01_reboot.png')
    await capturarElemento(page, '#reboot .demo >> nth=1', '01_reboot_box_sizing.png')
    await capturarElemento(page, '#tema .demo >> nth=0', '01_tema_modo.png')
    await capturarElemento(page, '#tema .row >> nth=0', '01_tema_claro.png')
    await page.click('[data-tema="dark"]')
    await capturarElemento(page, '#tema .row >> nth=0', '01_tema_oscuro.png')
    await page.close()
  }

  // 01 · Móvil con y sin meta viewport (iPhone emulado)
  for (const conMeta of [true, false]) {
    const context = await browser.newContext({ ...devices['iPhone 13'], deviceScaleFactor: 1 })
    const page = await context.newPage()
    if (!conMeta) {
      // Servimos la página quitando la meta viewport
      await page.route('**/02_contenedores.html', route => {
        const html = fs.readFileSync(path.join(__dirname, '..', 'guia_html', '02_contenedores.html'), 'utf8')
          .replace(/<meta name="viewport"[^>]*>/, '')
        route.fulfill({ contentType: 'text/html; charset=utf-8', body: html })
      })
    }
    await page.goto(GUIA_02, { waitUntil: 'networkidle' })
    await page.screenshot({ path: path.join(DESTINO, `01_viewport_${conMeta ? 'con' : 'sin'}_meta.png`) })
    console.log('✔', `01_viewport_${conMeta ? 'con' : 'sin'}_meta.png`)
    await context.close()
  }

  // 02 · Bandas de contenedores en cada breakpoint
  for (const [bp, ancho] of [['xs', 400], ['sm', 600], ['md', 800], ['lg', 1000], ['xl', 1250], ['xxl', 1450]]) {
    const page = await browser.newPage({ viewport: { width: ancho, height: 900 } })
    await page.goto(GUIA_02, { waitUntil: 'networkidle' })
    await capturarElemento(page, 'div.mb-5:has(.banda)', `02_contenedores_${bp}.png`)
    await page.close()
  }

  // 02 · Ejemplo mobile-first de alineación en tres anchos
  for (const [bp, ancho] of [['xs', 400], ['md', 800], ['xl', 1250]]) {
    const page = await browser.newPage({ viewport: { width: ancho, height: 900 } })
    await page.goto(GUIA_02, { waitUntil: 'networkidle' })
    await capturarElemento(page, 'p.text-center.text-md-start.text-xl-end', `02_mobile_first_${bp}.png`)
    await page.close()
  }

  // 02 a 12 · Demos de las guías (la 09 no: todas sus capturas necesitan un estado, van en su bloque), una página por ancho de ventana
  for (const [url, capturas] of [[GUIA_02, CAPTURAS_02], [GUIA_03, CAPTURAS_03], [GUIA_04, CAPTURAS_04], [GUIA_05, CAPTURAS_05], [GUIA_06, CAPTURAS_06], [GUIA_07, CAPTURAS_07], [GUIA_08, CAPTURAS_08], [GUIA_10, CAPTURAS_10], [GUIA_11, CAPTURAS_11], [GUIA_12, CAPTURAS_12]]) {
    for (const [bp, ancho] of Object.entries(ANCHOS)) {
      const pendientes = capturas.filter(([, , bps]) => bps.includes(bp))
      if (!pendientes.length) continue
      const page = await browser.newPage({ viewport: { width: ancho, height: 900 } })
      await page.goto(url, { waitUntil: 'networkidle' })
      // El indicador fijo de breakpoint taparía parte de las demos
      await page.addStyleTag({ content: '.indicador { display: none !important; }' })
      // spinner-grow se anima desde invisible (scale(0)): lo dejamos quieto como en la mitad de la animación, cuando se ve entero
      await page.addStyleTag({ content: '.spinner-grow { animation: none !important; opacity: 1 !important; transform: none !important; }' })
      for (const [nombre, selector, bps] of pendientes) {
        const fichero = bps.length > 1 ? `${nombre}_${bp}.png` : `${nombre}.png`
        await capturarElemento(page, selector, fichero)
      }
      await page.close()
    }
  }

  // 03 · d-print-*: la misma demo en pantalla y como se imprime
  {
    const page = await browser.newPage({ viewport: { width: 1000, height: 900 } })
    await page.goto(GUIA_03, { waitUntil: 'networkidle' })
    await page.addStyleTag({ content: '.indicador { display: none !important; }' })
    await capturarElemento(page, '#visibilidad .demo >> nth=5', '03_visibilidad_print_pantalla.png')
    await page.emulateMedia({ media: 'print' })
    await capturarElemento(page, '#visibilidad .demo >> nth=5', '03_visibilidad_print_impresion.png')
    await page.close()
  }

  // 06 · Las tablas de rayas y hover en modo oscuro
  {
    const page = await browser.newPage({ viewport: { width: 1000, height: 900 } })
    await page.goto(GUIA_06, { waitUntil: 'networkidle' })
    await page.evaluate(() => document.documentElement.setAttribute('data-bs-theme', 'dark'))
    await capturarElemento(page, '#striped .row >> nth=0', '06_modo_oscuro.png')
    await page.close()
  }

  // 07 · Validación: el formulario tras enviarlo con errores y con todo correcto, y los mensajes en globo
  {
    const page = await browser.newPage({ viewport: { width: 1000, height: 900 } })
    await page.goto(GUIA_07, { waitUntil: 'networkidle' })
    const alta = page.locator('#validacion form >> nth=0')
    await page.fill('#v-nombre', 'Luis')
    await page.fill('#v-email', 'luis.ejemplo.com')
    await page.fill('#v-usuario', 'luis_r')
    await page.fill('#v-cp', '2800')
    await alta.locator('button[type=submit]').click()
    await page.evaluate(() => document.activeElement.blur())
    await capturarElemento(page, '#validacion .demo >> nth=0', '07_validacion_enviado.png')
    await page.fill('#v-email', 'luis@ejemplo.com')
    await page.selectOption('#v-provincia', 'Madrid')
    await page.fill('#v-cp', '28001')
    await page.check('#v-condiciones')
    await alta.locator('button[type=submit]').click()
    await page.evaluate(() => document.activeElement.blur())
    await capturarElemento(page, '#validacion .demo >> nth=0', '07_validacion_correcto.png')
    await page.fill('#tt-ciudad', 'Madrid')
    await page.locator('#validacion form >> nth=1').locator('button[type=submit]').click()
    await page.evaluate(() => document.activeElement.blur())
    await capturarElemento(page, '#validacion .demo >> nth=2', '07_validacion_tooltip.png')
    await page.close()
  }

  // 09 · JavaScript: collapse abierto con data-bs-*, dropdown con offset, API, tooltip, eventos y práctica
  {
    const page = await browser.newPage({ viewport: { width: 1000, height: 900 } })
    await page.goto(GUIA_09, { waitUntil: 'networkidle' })
    // La animación de collapse dura .35s y la de fade .15s: esperamos a que terminen antes de capturar,
    // con el ratón fuera para que el botón pulsado no salga con el color de hover
    const esperar = async () => {
      await page.mouse.move(0, 0)
      await page.waitForTimeout(600)
    }
    await page.click('[data-bs-target="#detalles"]')
    await esperar()
    await capturarElemento(page, '#data-bs .demo >> nth=0', '09_data_bs_collapse.png')
    // El menú es absoluto y se saldría de la demo: le damos altura para que entre en la captura
    await page.addStyleTag({ content: '#opciones .demo { min-height: 10rem; }' })
    await page.click('[data-bs-offset="0,20"]')
    await esperar()
    await capturarElemento(page, '#opciones .demo >> nth=0', '09_dropdown_offset.png')
    await page.keyboard.press('Escape')
    await page.click('#api-show')
    await esperar()
    await capturarElemento(page, '#api .demo >> nth=0', '09_api_show.png')
    await page.hover('#tooltips [data-bs-placement="right"]')
    await page.waitForSelector('.tooltip.show')
    await page.waitForTimeout(600)
    await capturarElemento(page, '#tooltips .demo >> nth=0', '09_tooltip.png')
    const abrirCerrar = '[data-bs-target="#bloque-eventos"]'
    await page.click(abrirCerrar)
    await esperar()
    await page.click(abrirCerrar)
    await esperar()
    await page.check('#bloquear')
    await page.click(abrirCerrar)
    await esperar()
    await page.evaluate(() => document.activeElement.blur())
    await capturarElemento(page, '#eventos .demo >> nth=0', '09_eventos.png')
    await page.click('#faq-abrir')
    await esperar()
    await page.evaluate(() => document.activeElement.blur())
    await capturarElemento(page, '#practica .demo >> nth=0', '09_practica.png')
    await page.close()
  }

  // 10 · Navbar en el móvil con el menú abierto
  {
    const page = await browser.newPage({ viewport: { width: 400, height: 900 } })
    await page.goto(GUIA_10, { waitUntil: 'networkidle' })
    await page.click('#navbar .navbar-toggler')
    await page.waitForTimeout(400)
    await page.evaluate(() => document.activeElement.blur())
    await capturarElemento(page, '#navbar .demo >> nth=0', '10_navbar_abierta_xs.png')
    await page.close()
  }

  // 10 · Dropdown abierto, tooltip con popover y scrollspy a media sección
  // reducedMotion: sin scroll suave (Reboot), Popper calcularía la posición a mitad del desplazamiento y daría la vuelta a los menús
  {
    const page = await browser.newPage({ viewport: { width: 1000, height: 900 }, reducedMotion: 'reduce' })
    await page.goto(GUIA_10, { waitUntil: 'networkidle' })

    await page.locator('#dropdowns .demo').evaluate(el => el.scrollIntoView({ block: 'center' }))
    await page.click('#dropdowns .dropdown >> nth=0 >> button')
    await page.waitForTimeout(400)
    await capturarZona(page, ['#dropdowns .demo', '#dropdowns .dropdown-menu.show'], '10_dropdown_abierto.png')
    await page.keyboard.press('Escape')

    await page.locator('#tooltips .demo').evaluate(el => el.scrollIntoView({ block: 'center' }))
    await page.click('#tooltips [data-bs-toggle="popover"] >> nth=0')
    await page.hover('#tooltips [data-bs-title="Arriba"]')
    await page.waitForTimeout(400)
    await capturarZona(page, ['#tooltips .demo', '.popover', '.tooltip'], '10_tooltips_popovers.png')

    await page.locator('#spy-contenido').evaluate(el => {
      const seccion = document.getElementById('spy-envios')
      el.scrollTop += seccion.getBoundingClientRect().top - el.getBoundingClientRect().top - 16
    })
    await page.waitForTimeout(400)
    await capturarElemento(page, '#scrollspy .demo >> nth=0', '10_scrollspy.png')
    await page.close()
  }

  // 10 · Modales y offcanvas abiertos (la ventana entera, con el fondo oscurecido)
  for (const [boton, fichero] of [['#modal-vaciar', '10_modal.png'], ['#modal-largo', '10_modal_scroll.png'], ['#oc-carrito', '10_offcanvas.png']]) {
    const page = await browser.newPage({ viewport: { width: 1000, height: 600 } })
    await page.goto(GUIA_10, { waitUntil: 'networkidle' })
    await page.click(`[data-bs-target="${boton}"]`)
    await page.waitForTimeout(400)
    await page.screenshot({ path: path.join(DESTINO, fichero) })
    console.log('✔', fichero)
    await page.close()
  }

  // 10 · Los tres toasts de la demo, apilados abajo a la derecha (la ventana entera: el toast-container es transparente)
  {
    const page = await browser.newPage({ viewport: { width: 1000, height: 600 } })
    await page.goto(GUIA_10, { waitUntil: 'networkidle' })
    await page.click('[data-toast="toast-carrito"]')
    await page.click('[data-toast="toast-ok"]')
    await page.click('[data-toast="toast-error"]')
    await page.waitForTimeout(400)
    await page.screenshot({ path: path.join(DESTINO, '10_toasts.png') })
    console.log('✔', '10_toasts.png')
    await page.close()
  }

  // 11 · Modo claro y oscuro: las demos en oscuro, el selector de tema abierto y la práctica en oscuro
  {
    const page = await browser.newPage({ viewport: { width: 1000, height: 900 } })
    await page.goto(GUIA_11, { waitUntil: 'networkidle' })
    // El selector de la cabecera, en claro, con el menú abierto (Automático marcado)
    await page.click('header [data-bs-toggle="dropdown"]')
    await page.locator('header .dropdown-menu').waitFor({ state: 'visible' })
    await capturarElemento(page, 'header', '11_selector_menu.png')
    await page.keyboard.press('Escape')
    // La guía entera en oscuro, como al elegir Oscuro en su selector (sin guardarlo en localStorage)
    await page.evaluate(() => document.documentElement.setAttribute('data-bs-theme', 'dark'))
    await capturarElemento(page, '#utilidades .demo >> nth=0',   '11_utilidades_oscuro.png')
    await capturarElemento(page, '#imagenes .demo >> nth=0',     '11_logos_oscuro.png')
    await capturarElemento(page, '#propias .demo >> nth=0',      '11_fichas_oscuro.png')
    await capturarElemento(page, '#sobrescribir .demo >> nth=0', '11_tienda_oscuro.png')
    await capturarElemento(page, '#componente .demo >> nth=0',   '11_componente_oscuro.png')
    // La landing de la práctica tiene su propio data-bs-theme: se lo cambiamos a ella
    await page.evaluate(() => document.getElementById('landing').setAttribute('data-bs-theme', 'dark'))
    await capturarElemento(page, '#practica .demo >> nth=0',     '11_practica_oscuro.png')
    await page.close()
  }

  await browser.close()
})()
