import jestPuppeteerConfig from '../jest-puppeteer.config';

describe('Load', () => {
  beforeAll(async () => {
    await page.goto(`http://localhost:${jestPuppeteerConfig.server.port}/examples.html`);
  });

  it('should render demo page', async () => {
    await expect(page).toMatch('Simplebar demo page');
  });

  it('should render SimpleBar on data-simplebar elements', async () => {
    await expect(page).toMatchElement('[data-simplebar] .simplebar-content');
  });

  it('should not auto hide the scrollbar', async () => {
    const demo = await expect(page).toMatchElement('[data-simplebar-auto-hide="false"]');
    await expect(demo).toMatchElement('.simplebar-scrollbar.simplebar-visible');
  });

  it('should force scrollbar track to be visible but scrollbar to be hidden', async () => {
    const trackSelector = '[data-simplebar-force-visible] .simplebar-track.simplebar-vertical';

    await page.waitForSelector(trackSelector, { visible: true });
    await page.waitForSelector(`${trackSelector} .simplebar-scrollbar`, { hidden: true });
  });

  it('should display SimpleBar in "rtl" mode', async () => {
    const el = await expect(page).toMatchElement('.demo-rtl');
    const scrollbarEl = await expect(el).toMatchElement(".simplebar-track.simplebar-horizontal .simplebar-scrollbar");
    const isRtl = await page.$eval('.demo-rtl', el => el.SimpleBar.isRtl);
    const transformStyle = await page.evaluate(el => el.style.transform, scrollbarEl);
    const elBoundingBox = await el.boundingBox();
    const scrollbarElBoundingBox = await scrollbarEl.boundingBox();

    expect(isRtl).toBeTruthy();
    expect(transformStyle).toEqual(`translate3d(${ elBoundingBox.width - scrollbarElBoundingBox.width}px, 0px, 0px)`);
  });

  it('should add class "dragging" when dragging', async () => {
    const el = await expect(page).toMatchElement('#demo2');

    await page.click('#demo2 .simplebar-track.simplebar-vertical .simplebar-scrollbar');
    await page.mouse.down();

    const isDragging = await page.evaluate(el => el.classList.contains('simplebar-dragging'), el);

    expect(isDragging).toBeTruthy();
  }, 999999);

  it('should recalculate scrollbar size when content size changes', async () => {
    const el = await expect(page).toMatchElement('#demo2');
    const scrollbarEl = await expect(el).toMatchElement('.simplebar-track.simplebar-vertical .simplebar-scrollbar');
    const scrollbarHeight = await page.evaluate(el => parseInt(el.style.height), scrollbarEl);

    await page.hover('#demo2 p');

    const scrollbarHeightAfterHover = await page.evaluate(el => parseInt(el.style.height), scrollbarEl);

    expect(scrollbarHeightAfterHover).toBeLessThan(scrollbarHeight);
  });
});

// await jestPuppeteer.debug();
