import {DependencyList, EffectCallback, useEffect} from 'react';

import {autorunCleanup} from '../lib';

export const useAutorunEffect = (effect: EffectCallback, deps: DependencyList) => {
  useEffect(
    () => autorunCleanup(effect),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    deps,
  );
};
