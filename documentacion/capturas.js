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
const GUIA_03 = guia('03_rejilla.html')
const ESPACIADO = pathToFileURL(path.join(__dirname, '..', '06_Espaciado.html')).href

// Capturas del espaciado: [fichero, índice del h2 de la sección, anchos de ventana]
// Se captura la franja entre el h2 de la sección y el siguiente (o el final del contenedor)
const CAPTURAS_04 = [
  ['04_espaciado_escala',     0, ['lg']],
  ['04_espaciado_lados',      1, ['lg']],
  ['04_espaciado_margin',     2, ['lg']],
  ['04_espaciado_margin_auto', 3, ['lg']],
  ['04_espaciado_start_end',  4, ['lg']],
  ['04_espaciado_responsive', 5, ['xs', 'md']],
]

// Capturas de la rejilla: [fichero, selector de la demo, anchos de ventana]
// Si hay varios anchos, el fichero lleva el sufijo del breakpoint (03_responsive_xs.png...)
const ANCHOS = { xs: 400, sm: 600, md: 800, lg: 1000, xl: 1250 }
const CAPTURAS_03 = [
  ['03_filas',           '#filas .demo >> nth=0',       ['lg']],
  ['03_auto_iguales',    '#automaticas .demo >> nth=0', ['lg']],
  ['03_auto_col_auto',   '#automaticas .demo >> nth=1', ['lg']],
  ['03_fijas',           '#fijas .demo >> nth=0',       ['lg']],
  ['03_fijas_desborde',  '#fijas .demo >> nth=1',       ['lg']],
  ['03_responsive',      '#responsive .demo >> nth=0',  ['xs', 'md', 'xl']],
  ['03_responsive_col_md', '#responsive .demo >> nth=1', ['xs', 'md']],
  ['03_offset',          '#offset .demo >> nth=0',      ['lg']],
  ['03_offset_ms_auto',  '#offset .demo >> nth=1',      ['lg']],
  ['03_order',           '#order .demo >> nth=0',       ['xs', 'md']],
  ['03_gutters_g0',      '#gutters .demo >> nth=0',     ['lg']],
  ['03_gutters_g5',      '#gutters .demo >> nth=1',     ['lg']],
  ['03_gutters_gx1_gy4', '#gutters .demo >> nth=2',     ['lg']],
  ['03_row_cols',        '#row-cols .demo >> nth=0',    ['xs', 'sm', 'lg']],
  ['03_anidado',         '#anidado .demo >> nth=0',     ['lg']],
  ['03_layout_blog',     '#practica .demo >> nth=0',    ['xs', 'lg']],
  ['03_layout_catalogo', '#practica .demo >> nth=1',    ['sm', 'xl']],
  ['03_layout_panel',    '#practica .demo >> nth=2',    ['xs', 'lg']],
]

async function capturarElemento(page, selector, fichero) {
  await page.locator(selector).first().screenshot({ path: path.join(DESTINO, fichero) })
  console.log('✔', fichero)
}

(async () => {
  const browser = await chromium.launch()

  // 01 · Modo claro y oscuro de la sección data-bs-theme
  {
    const page = await browser.newPage({ viewport: { width: 1200, height: 900 } })
    await page.goto(GUIA_01, { waitUntil: 'networkidle' })
    await capturarElemento(page, '#tema', '01_tema_claro.png')
    await page.click('[data-tema="dark"]')
    await capturarElemento(page, '#tema', '01_tema_oscuro.png')
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

  // 03 · Demos de la rejilla, una página por ancho de ventana
  for (const [bp, ancho] of Object.entries(ANCHOS)) {
    const pendientes = CAPTURAS_03.filter(([, , bps]) => bps.includes(bp))
    if (!pendientes.length) continue
    const page = await browser.newPage({ viewport: { width: ancho, height: 900 } })
    await page.goto(GUIA_03, { waitUntil: 'networkidle' })
    // El indicador fijo de breakpoint taparía parte de las demos
    await page.addStyleTag({ content: '.indicador { display: none !important; }' })
    for (const [nombre, selector, bps] of pendientes) {
      const fichero = bps.length > 1 ? `${nombre}_${bp}.png` : `${nombre}.png`
      await capturarElemento(page, selector, fichero)
    }
    await page.close()
  }

  // 04 · Secciones de la página de espaciado, una página por ancho de ventana
  for (const [bp, ancho] of Object.entries(ANCHOS)) {
    const pendientes = CAPTURAS_04.filter(([, , bps]) => bps.includes(bp))
    if (!pendientes.length) continue
    const page = await browser.newPage({ viewport: { width: ancho, height: 900 } })
    await page.goto(ESPACIADO, { waitUntil: 'networkidle' })
    for (const [nombre, indice, bps] of pendientes) {
      const clip = await page.evaluate(i => {
        const titulos = [...document.querySelectorAll('h2')]
        const contenedor = document.querySelector('.container').getBoundingClientRect()
        const arriba = titulos[i].getBoundingClientRect().top + scrollY
        const abajo = i + 1 < titulos.length
          ? titulos[i + 1].getBoundingClientRect().top + scrollY - 24
          : contenedor.bottom + scrollY
        return { x: contenedor.left, y: arriba - 8, width: contenedor.width, height: abajo - arriba + 8 }
      }, indice)
      const fichero = bps.length > 1 ? `${nombre}_${bp}.png` : `${nombre}.png`
      await page.screenshot({ path: path.join(DESTINO, fichero), clip, fullPage: true })
      console.log('✔', fichero)
    }
    await page.close()
  }

  await browser.close()
})()
