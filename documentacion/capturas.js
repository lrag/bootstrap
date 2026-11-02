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

// Capturas de las demos: [fichero, selector de la demo, anchos de ventana]
// Si hay varios anchos, el fichero lleva el sufijo del breakpoint (04_responsive_xs.png...)
const ANCHOS = { xs: 400, sm: 600, md: 800, lg: 1000, xl: 1250 }
const CAPTURAS_03 = [
  ['03_espaciado_escala',      '#escala .demo >> nth=0',      ['lg']],
  ['03_espaciado_lados',       '#lados .demo >> nth=0',       ['lg']],
  ['03_espaciado_margin',      '#margin .demo >> nth=0',      ['lg']],
  ['03_espaciado_margin_auto', '#margin-auto .demo >> nth=0', ['lg']],
  ['03_espaciado_start_end',   '#start-end .demo >> nth=0',   ['lg']],
  ['03_espaciado_responsive',  '#responsive .demo >> nth=0',  ['xs', 'md']],
  ['03_flex_contenedor',       '#flex .demo >> nth=0',        ['lg']],
  ['03_flex_justify',          '#justify .demo >> nth=0',     ['lg']],
  ['03_flex_align',            '#align .demo >> nth=0',       ['lg']],
  ['03_flex_gap_wrap',         '#gap-wrap .demo >> nth=0',    ['lg']],
  ['03_flex_elementos',        '#elementos .demo >> nth=0',   ['lg']],
  ['03_flex_responsive',       '#flex-responsive .demo >> nth=0', ['xs', 'md']],
]
const CAPTURAS_04 = [
  ['04_filas',           '#filas .demo >> nth=0',       ['lg']],
  ['04_auto_iguales',    '#automaticas .demo >> nth=0', ['lg']],
  ['04_auto_col_auto',   '#automaticas .demo >> nth=1', ['lg']],
  ['04_fijas',           '#fijas .demo >> nth=0',       ['lg']],
  ['04_fijas_desborde',  '#fijas .demo >> nth=1',       ['lg']],
  ['04_responsive',      '#responsive .demo >> nth=0',  ['xs', 'md', 'xl']],
  ['04_responsive_col_md', '#responsive .demo >> nth=1', ['xs', 'md']],
  ['04_offset',          '#offset .demo >> nth=0',      ['lg']],
  ['04_offset_ms_auto',  '#offset .demo >> nth=1',      ['lg']],
  ['04_order',           '#order .demo >> nth=0',       ['xs', 'md']],
  ['04_gutters_g0',      '#gutters .demo >> nth=0',     ['lg']],
  ['04_gutters_g5',      '#gutters .demo >> nth=1',     ['lg']],
  ['04_gutters_gx1_gy4', '#gutters .demo >> nth=2',     ['lg']],
  ['04_row_cols',        '#row-cols .demo >> nth=0',    ['xs', 'sm', 'lg']],
  ['04_anidado',         '#anidado .demo >> nth=0',     ['lg']],
  ['04_layout_blog',     '#practica .demo >> nth=0',    ['xs', 'lg']],
  ['04_layout_catalogo', '#practica .demo >> nth=1',    ['sm', 'xl']],
  ['04_layout_panel',    '#practica .demo >> nth=2',    ['xs', 'lg']],
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

  // 03 y 04 · Demos del espaciado y de la rejilla, una página por ancho de ventana
  for (const [url, capturas] of [[GUIA_03, CAPTURAS_03], [GUIA_04, CAPTURAS_04]]) {
    for (const [bp, ancho] of Object.entries(ANCHOS)) {
      const pendientes = capturas.filter(([, , bps]) => bps.includes(bp))
      if (!pendientes.length) continue
      const page = await browser.newPage({ viewport: { width: ancho, height: 900 } })
      await page.goto(url, { waitUntil: 'networkidle' })
      // El indicador fijo de breakpoint taparía parte de las demos
      await page.addStyleTag({ content: '.indicador { display: none !important; }' })
      for (const [nombre, selector, bps] of pendientes) {
        const fichero = bps.length > 1 ? `${nombre}_${bp}.png` : `${nombre}.png`
        await capturarElemento(page, selector, fichero)
      }
      await page.close()
    }
  }

  await browser.close()
})()
