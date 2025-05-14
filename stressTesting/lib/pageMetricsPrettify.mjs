import chalk from "chalk";

const MEMORY_METRICS = ['JSHeapUsedSize', 'JSHeapTotalSize'];
const TIME_METRICS = ['RecalcStyleDuration', 'ScriptDuration', 'TaskDuration'];

const VALUABLE_METRICS = [...MEMORY_METRICS, ...TIME_METRICS];

const getPrettyValue = (metric, value) => {
  let val = '';

  if (MEMORY_METRICS.includes(metric)) {
    val = `${(value / Math.pow(1000, 2)).toFixed(2)} MB`
  } else {
    val = `${value.toFixed(2)} s`
  }

  return chalk.cyan(val)
}

export const pageMetricsPrettify = pageMetrics => VALUABLE_METRICS.reduce((res, key) => {
  return res + `${key}: ${getPrettyValue(key, pageMetrics[key])}\n`
}, chalk.magenta('Page Metrics \n'))
