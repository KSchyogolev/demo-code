import {isFunction} from 'lodash-es';
import {action, makeAutoObservable, onBecomeObserved, onBecomeUnobserved, runInAction} from 'mobx';
import {filter, reduce, values} from 'ramda';

import {computedFn} from '../computedFn';
import {clientRehydration} from '../ssr';
import {
  CreateSubscriptionCallbacks,
  CreateSubscriptionState,
  NormalizedEntity,
  getSubscriptionInitialState,
} from './types';

type State<T> = CreateSubscriptionState<Record<string, NormalizedEntity<T>>>;

export class NormalizedSubscriptionObservable<PayloadData extends Record<string, any>[], MappedData> {
  key: string;

  private state: State<MappedData>;

  constructor({
    key,
    shouldUnsubscribeOnUnobserve = false,
    normalizeKey,
    resetOldData,
    initialState = getSubscriptionInitialState(),
    subscription,
    mapper,
    filter: filterItem = () => true,
    onUnsubscribe,
  }: {
    key: string;
    shouldUnsubscribeOnUnobserve?: boolean;
    normalizeKey: keyof PayloadData[0];
    resetOldData?: boolean;
    initialState?: State<MappedData>;
    subscription: (callbacks: CreateSubscriptionCallbacks<PayloadData>) => () => void;
    mapper: (value: NormalizedEntity<PayloadData[0]>) => MappedData;
    filter?: (value: MappedData) => boolean;
    onUnsubscribe?: () => void;
  }) {
    let unsubscribe = () => {};
    let subscribed = false;

    const reset = action(() => {
      this.state = initialState;
    });

    const subscribe = () => {
      unsubscribe = subscription({
        onData: data => {
          runInAction(() => {
            const normalizedData = reduce<PayloadData[0], Record<string, NormalizedEntity<MappedData>>>(
              (acc, val) => ({
                ...acc,
                [val[normalizeKey]]: mapper({
                  ...val,
                  uuid: val[normalizeKey],
                }),
              }),
              resetOldData ? {} : this.state.data,
              data,
            );

            this.state = {
              loading: false,
              data: filter(filterItem)(normalizedData),
              error: null,
            };
          });
        },
        onError: error => {
          runInAction(() => {
            this.state = {
              loading: false,
              data: initialState.data,
              error,
            };
          });
        },
        onSubscribe: () => {
          runInAction(() => {
            this.state = {
              loading: true,
              data: initialState.data,
              error: null,
            };
          });
        },
        onUnsubscribe: () => {
          reset();
          onUnsubscribe?.();
        },
        onDisconnect: () => {
          reset();
        },
      });
    };

    this.key = key;
    this.state = initialState;
    makeAutoObservable(this, {set: action}, {name: key});
    clientRehydration(this);

    onBecomeObserved(this, 'state', () => {
      if (!subscribed) {
        subscribe();
        subscribed = true;
      }
    });
    onBecomeUnobserved(this, 'state', () => {
      if (shouldUnsubscribeOnUnobserve) {
        unsubscribe();
        subscribed = false;
      }
    });
  }

  get data() {
    return this.state.data;
  }

  get loading() {
    return this.state.loading;
  }

  get error() {
    return this.state.error;
  }

  get list() {
    return values(this.state.data);
  }

  set = (state: State<MappedData> | ((state: State<MappedData>) => State<MappedData>)) => {
    if (isFunction(state)) {
      this.state = (state as (state: State<MappedData>) => State<MappedData>)(this.state);

      return;
    }

    this.state = state;
  };

  item = computedFn(
    (id: keyof Record<string, NormalizedEntity<MappedData>>) => this.state.data[id] ?? {}, //
    {name: 'ignore__normalized-subscription_item'},
  );
}
