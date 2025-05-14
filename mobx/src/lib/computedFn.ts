import {isUsingStaticRendering} from 'mobx-react-lite';
import {computedFn as baseComputedFn} from 'mobx-utils';

// hide mobx warning about running outside of context on server side, cuz it loosing does not provide any changes
export const computedFn = <Fn extends (...args: any[]) => any>(
  fn: Fn,
  options?: Parameters<typeof baseComputedFn>[1],
) => (isUsingStaticRendering() ? fn : baseComputedFn(fn, options)) as Fn;
