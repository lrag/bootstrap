// Genera las capturas de la documentación a partir de las páginas de guia_html/.
// Uso: npm run capturas
const { chromium, devices } = require('playwright');
const fs = require('node:fs');
const path = require('node:path');
const { pathToFileURL } = require('node:url');

const DESTINO = __dirname;
const guia = nombre => pathToFileURL(path.join(__dirname, '..', 'guia_html', nombre)).href;

const GUIA_01 = guia('01_introducción.html');
const GUIA_02 = guia('02_contenedores.html');

async function capturarElemento(page, selector, fichero) {
  await page.locator(selector).first().screenshot({ path: path.join(DESTINO, fichero) });
  console.log('✔', fichero);
}

(async () => {
  const browser = await chromium.launch();

  // 01 · Modo claro y oscuro de la sección data-bs-theme
  {
    const page = await browser.newPage({ viewport: { width: 1200, height: 900 } });
    await page.goto(GUIA_01, { waitUntil: 'networkidle' });
    await capturarElemento(page, '#tema', '01_tema_claro.png');
    await page.click('[data-tema="dark"]');
    await capturarElemento(page, '#tema', '01_tema_oscuro.png');
    await page.close();
  }

  // 01 · Móvil con y sin meta viewport (iPhone emulado)
  for (const conMeta of [true, false]) {
    const context = await browser.newContext({ ...devices['iPhone 13'], deviceScaleFactor: 1 });
    const page = await context.newPage();
    if (!conMeta) {
      // Servimos la página quitando la meta viewport
      await page.route('**/02_contenedores.html', route => {
        const html = fs.readFileSync(path.join(__dirname, '..', 'guia_html', '02_contenedores.html'), 'utf8')
          .replace(/<meta name="viewport"[^>]*>/, '');
        route.fulfill({ contentType: 'text/html; charset=utf-8', body: html });
      });
    }
    await page.goto(GUIA_02, { waitUntil: 'networkidle' });
    await page.screenshot({ path: path.join(DESTINO, `01_viewport_${conMeta ? 'con' : 'sin'}_meta.png`) });
    console.log('✔', `01_viewport_${conMeta ? 'con' : 'sin'}_meta.png`);
    await context.close();
  }

  // 02 · Bandas de contenedores en cada breakpoint
  for (const [bp, ancho] of [['xs', 400], ['sm', 600], ['md', 800], ['lg', 1000], ['xl', 1250], ['xxl', 1450]]) {
    const page = await browser.newPage({ viewport: { width: ancho, height: 900 } });
    await page.goto(GUIA_02, { waitUntil: 'networkidle' });
    await capturarElemento(page, 'div.mb-5:has(.banda)', `02_contenedores_${bp}.png`);
    await page.close();
  }

  // 02 · Ejemplo mobile-first de alineación en tres anchos
  for (const [bp, ancho] of [['xs', 400], ['md', 800], ['xl', 1250]]) {
    const page = await browser.newPage({ viewport: { width: ancho, height: 900 } });
    await page.goto(GUIA_02, { waitUntil: 'networkidle' });
    await capturarElemento(page, 'p.text-center.text-md-start.text-xl-end', `02_mobile_first_${bp}.png`);
    await page.close();
  }

  await browser.close();
})();
