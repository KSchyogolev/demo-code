import {autorun, spy} from 'mobx';

// eslint-disable-next-line no-underscore-dangle
export const reduxDevtoolsExtension = typeof window !== 'undefined' && (window as any).__REDUX_DEVTOOLS_EXTENSION__;

export const injectDevTools = async (isProductionBuild: boolean) => {
  if (!reduxDevtoolsExtension || isProductionBuild) {
    return;
  }

  const {createStore} = await import('redux');

  const store = createStore<any, any, any, any>(
    (state = {}, {payload} = {}) => {
      if (payload?.node?.key) {
        return {...state, [payload.node.key]: payload.loadable};
      }

      return state;
    },
    reduxDevtoolsExtension({
      name: 'Mobx state observer',
      maxAge: 100,
    }),
  );

  spy(event => {
    if (
      (event.type === 'update' || event.type === 'create' || event.type === 'add') &&
      typeof event.newValue !== 'function' &&
      event.debugObjectName.split('.')[0] === event.debugObjectName
    ) {
      const key = event.debugObjectName.replace(/computedFn\((.+)#\d+\)/, '$1');
      if (key.startsWith('ignore')) return;

      autorun(() => {
        const action = {
          type: `[${event.observableKind}] ${key}`,
          payload: {node: {key}, loadable: JSON.parse(JSON.stringify(event.newValue || ''))},
        };

        store.dispatch(action);
      });
    }
  });
};
