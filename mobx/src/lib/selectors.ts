import {IComputedValueOptions, computed} from 'mobx';

export const computedSelector = <T>(func: () => T, options?: IComputedValueOptions<T>) => {
  const selector = computed(func, options);

  return () => selector.get();
};
