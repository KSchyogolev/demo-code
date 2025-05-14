import {useIsomorphicLayoutEffect} from '@tools/react';
import {DependencyList, EffectCallback} from 'react';

import {autorunCleanup} from '../lib';

export const useAutorunLayoutEffect = (effect: EffectCallback, deps: DependencyList) => {
  useIsomorphicLayoutEffect(
    () => autorunCleanup(effect),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    deps,
  );
};
