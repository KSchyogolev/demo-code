import {autorun, makeAutoObservable} from 'mobx';

import {getStoreKey} from './utils';

const MOBX_STORE_KEY = 'initialMobxStore';

type Params = Record<string, any>;
export function dehydrate(
  ...data: [
    store: {key: string; set: ((value: any) => void) | ((params: Params) => (values: any) => void)},
    data: {params?: Params; value: any},
    setServerValue?: boolean,
  ][]
) {
  const initialState: Record<string, any> = {};
  data.forEach(([store, {params, value}, setServerValue = true]) => {
    initialState[getStoreKey(store.key, params)] = value;

    if (!setServerValue) return;

    if (params) {
      store.set(params)?.(value);
    } else {
      store.set(value);
    }
  });

  return {[MOBX_STORE_KEY]: initialState};
}

function rehydrate<T>(key: string, initialState: T): T;
function rehydrate<T>(key: string, initialState: T, forceServerState: true): T | undefined;

function rehydrate<T>(key: string, initialState: T, forceServerState?: boolean) {
  const serverInitialState =
    typeof window === 'undefined'
      ? undefined
      : // eslint-disable-next-line no-underscore-dangle
        ((window as any).__NEXT_DATA__?.props?.pageProps?.[MOBX_STORE_KEY]?.[key] as T | undefined);

  if (forceServerState) return serverInitialState;

  return serverInitialState ?? initialState;
}

export {rehydrate};

export const clientHydration = new (class {
  hydrationId: string = '__SERVER_HYDRATION_ID';

  constructor() {
    makeAutoObservable(this, {}, {autoBind: true});

    this.nextHydrationId();
  }

  rehydrate() {
    this.nextHydrationId();
  }

  nextHydrationId() {
    this.hydrationId = Math.random().toString(32).slice(2);
  }
})();

export const clientRehydration = <T>(props: {key: string; set: (state: T) => void}) =>
  autorun(() => {
    const {key, set} = props;

    if (!clientHydration.hydrationId || typeof window === 'undefined') return;

    const serverState = rehydrate(key, {} as T, true);

    if (serverState) set(serverState);
  });
