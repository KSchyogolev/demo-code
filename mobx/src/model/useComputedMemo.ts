import {computed} from 'mobx';
import {DependencyList, useMemo} from 'react';

export const useComputedMemo = <T>(factory: () => T, deps: DependencyList): T =>
  useMemo(
    () => computed(factory),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    deps,
  ).get();
