export const PAGE_PERFORMANCE_DOC =
  '\n' +
  'JSHeapUsedSize : Used JavaScript heap size.\n' +
  'JSHeapTotalSize : Total JavaScript heap size.\n' +
  'RecalcStyleDuration : Combined duration of all page style recalculations.\n' +
  'ScriptDuration : Combined duration of JavaScript execution.\n' +
  'TaskDuration : Combined duration of all tasks performed by the browser.\n\n' +
  'first-contentful-paint: When the browser renders the first DOM element on your page.\n' +
  'total-blocking-time: The amount of time during which Long Tasks (all tasks longer than 50ms) block the main thread and affect the usability of a page.\n' +
  'interactive: Measures a page\'s load responsiveness and helps identify situations where a page looks interactive but actually isn\'t.\n';

export const CONFIG = {
  maxConcurrency: 1,
  workerCreationDelay: 100,
  pageTimeout: 300_000,
  lighthouseMetrics: ['first-contentful-paint', 'total-blocking-time', 'interactive']
}
