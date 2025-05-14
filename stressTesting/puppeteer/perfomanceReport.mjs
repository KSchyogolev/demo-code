import lighthouse, {generateReport} from 'lighthouse';
import chalk from 'chalk';
import {pageMetricsPrettify} from '../lib/pageMetricsPrettify.mjs';
import {Cluster} from 'puppeteer-cluster'
import {CONFIG, PAGE_PERFORMANCE_DOC} from '../lib/config.mjs';

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';

const PAGES = ['/', '/faq', '/futures', '/trading', '/earn', '/buy-crypto'];

// ATTENTION!!!
// Run tests ONLY in trusted resources, because --no-sandbox flag is not secure.
// https://github.com/puppeteer/puppeteer/blob/main/docs/troubleshooting.md#setting-up-chrome-linux-sandbox

(async () => {

  const cluster = await Cluster.launch({
    concurrency: Cluster.CONCURRENCY_CONTEXT,
    maxConcurrency: CONFIG.maxConcurrency,
    workerCreationDelay: CONFIG.workerCreationDelay,
    timeout: CONFIG.pageTimeout,
    puppeteerOptions: {
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    },
  });

  console.info(chalk.dim(PAGE_PERFORMANCE_DOC));

  await cluster.task(async ({ page, data: url, worker }) => {
    const {lhMetrics, pageMetrics} = await getPerformanceMetrics(page, url);
    console.info(`\n${url} \n`);
    console.info(pageMetrics);
    console.info(lhMetrics);
  });

  for (let i = 0; i < PAGES.length; i++) {
    await cluster.queue(BASE_URL + PAGES[i]);
  }

  await cluster.idle();
  await cluster.close();
})();


const getPerformanceMetrics = async (page, url) => {
  const {lhr} = await lighthouse(url,{
    disableDeviceEmulation: true,
    chromeFlags: ['--disable-mobile-emulation']
  }, {
    extends: 'lighthouse:default',
    settings: {
      onlyAudits: CONFIG.lighthouseMetrics,
      maxWaitForLoad: CONFIG.pageTimeout
    },
  }, page);

  const metrics = await page.metrics();
  const pageMetrics = pageMetricsPrettify(metrics);

  const json = generateReport(lhr, 'json');
  const audits = JSON.parse(json).audits;

  const lhMetrics = CONFIG.lighthouseMetrics.reduce((res, item) => {
    return res + `${item.replaceAll('-', ' ')}: ${chalk.cyan(audits?.[item]?.displayValue)}\n`;
  }, chalk.magenta('Lighthouse Metrics\n'));

  return {
    lhMetrics,
    pageMetrics
  }
}
