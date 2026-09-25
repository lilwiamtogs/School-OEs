import { chromium } from 'file:///C:/Users/willi/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs';
import { pathToFileURL } from 'node:url';
import path from 'node:path';

const projectDir = path.resolve('Computing', 'Midterm Exam');
const outputDir = path.resolve('.qa', 'screenshots');
const pages = ['index.html', 'about.html', 'articles.html', 'contact.html'];
const issues = [];

const browser = await chromium.launch({
    headless: true,
    executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe'
});

for (const viewport of [
    { name: 'desktop', width: 1440, height: 1000 },
    { name: 'mobile', width: 390, height: 844 }
]) {
    const context = await browser.newContext({ viewport });

    for (const file of pages) {
        const page = await context.newPage();
        const errors = [];
        page.on('console', message => {
            if (message.type() === 'error') errors.push(`console: ${message.text()}`);
        });
        page.on('pageerror', error => errors.push(`page: ${error.message}`));
        page.on('requestfailed', request => errors.push(`request: ${request.url()} (${request.failure()?.errorText})`));

        await page.goto(pathToFileURL(path.join(projectDir, file)).href, { waitUntil: 'load' });
        await page.waitForTimeout(350);

        if (file === 'index.html' || file === 'articles.html') {
            await page.screenshot({
                path: path.join(projectDir, 'screenshots', `${file.replace('.html', '')}-${viewport.name}.png`),
                fullPage: true
            });
        }

        if (viewport.name === 'mobile') {
            await page.locator('.nav-toggle').click();
            const expanded = await page.locator('.nav-toggle').getAttribute('aria-expanded');
            if (expanded !== 'true') issues.push(`${file} mobile navigation did not open`);
            await page.locator('.nav-toggle').click();
        }

        if (file === 'index.html') {
            const startingSource = await page.locator('.drink-src').getAttribute('src');
            await page.waitForTimeout(4100);
            const rotatedSource = await page.locator('.drink-src').getAttribute('src');
            if (startingSource === rotatedSource) issues.push(`${file} automatic drink rotation did not advance`);

            await page.locator('.carousel-next').click();
            await page.waitForTimeout(250);
            await page.locator('.carousel-toggle').click();
            const toggleText = (await page.locator('.carousel-toggle').textContent())?.trim();
            if (toggleText !== 'Play') issues.push(`${file} carousel pause control did not update`);
        }

        if (file === 'contact.html') {
            await page.locator('#name').fill('Site Tester');
            await page.locator('#email').fill('tester@example.com');
            await page.locator('#message').fill('Testing the demo form.');
            await page.locator('.contact-form button[type="submit"]').click();
            const status = (await page.locator('.form-status').textContent())?.trim();
            if (!status?.includes('no message was sent')) issues.push(`${file} demo form status did not appear`);
        }

        const metrics = await page.evaluate(() => ({
            viewportWidth: document.documentElement.clientWidth,
            scrollWidth: document.documentElement.scrollWidth,
            brokenImages: [...document.images].filter(image => !image.complete || image.naturalWidth === 0).map(image => image.getAttribute('src')),
            h1Count: document.querySelectorAll('h1').length,
            currentCount: document.querySelectorAll('[aria-current="page"]').length
        }));

        if (metrics.scrollWidth > metrics.viewportWidth + 1) {
            issues.push(`${file} ${viewport.name} has horizontal overflow (${metrics.scrollWidth}px > ${metrics.viewportWidth}px)`);
        }
        if (metrics.brokenImages.length) issues.push(`${file} ${viewport.name} broken images: ${metrics.brokenImages.join(', ')}`);
        if (metrics.h1Count !== 1) issues.push(`${file} ${viewport.name} has ${metrics.h1Count} h1 elements`);
        if (metrics.currentCount !== 1) issues.push(`${file} ${viewport.name} has ${metrics.currentCount} current nav links`);
        if (errors.length) issues.push(`${file} ${viewport.name}: ${errors.join(' | ')}`);

        await page.evaluate(() => window.scrollTo(0, 0));
        await page.screenshot({ path: path.join(outputDir, `${file.replace('.html', '')}-${viewport.name}.png`), fullPage: true });
        console.log(`${file} ${viewport.name}: ${metrics.scrollWidth}x${await page.evaluate(() => document.documentElement.scrollHeight)}`);
        await page.close();
    }

    await context.close();
}

await browser.close();

if (issues.length) {
    console.error('\nQA ISSUES');
    for (const issue of issues) console.error(`- ${issue}`);
    process.exitCode = 1;
} else {
    console.log('\nAll visual smoke tests passed.');
}
