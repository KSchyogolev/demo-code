import {isFunction} from 'lodash-es';
import {action, makeAutoObservable, onBecomeObserved, onBecomeUnobserved, runInAction} from 'mobx';

import {computedFn} from '../computedFn';
import {clientRehydration, rehydrate} from '../ssr';
import {CreateSubscriptionCallbacks, CreateSubscriptionState, getSubscriptionInitialState} from './types';

export class SubscriptionObservable<PayloadData, MappedData> {
  key: string;

  private state: CreateSubscriptionState<MappedData>;

  constructor({
    key,
    shouldUnsubscribeOnUnobserve = false,
    initialState: clientInitialState = getSubscriptionInitialState(),
    subscription,
    mapper,
    onUnsubscribe,
  }: {
    key: string;
    shouldUnsubscribeOnUnobserve?: boolean;
    initialState?: CreateSubscriptionState<MappedData>;
    subscription: (callbacks: CreateSubscriptionCallbacks<PayloadData>) => () => void;
    mapper: (value: PayloadData, state: MappedData) => MappedData;
    onUnsubscribe?: () => void;
  }) {
    let unsubscribe = () => {};
    let subscribed = false;

    const reset = action(() => {
      this.state = clientInitialState;
    });
    const initialState = rehydrate(key, clientInitialState);

    const subscribe = () => {
      unsubscribe = subscription({
        onData: data => {
          runInAction(() => {
            this.state = {
              loading: false,
              data: mapper(data, this.state.data),
              error: null,
            };
          });
        },
        onError: error => {
          runInAction(() => {
            this.state = {
              loading: false,
              data: clientInitialState.data,
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

  item = computedFn(
    (id: keyof MappedData) => this.state.data[id] ?? ({} as MappedData[keyof MappedData]), //
    {name: 'ignore__subscription_item'},
  );

  set = (
    state:
      | CreateSubscriptionState<MappedData>
      | ((state: CreateSubscriptionState<MappedData>) => CreateSubscriptionState<MappedData>),
  ) => {
    if (isFunction(state)) {
      this.state = (state as (state: CreateSubscriptionState<MappedData>) => CreateSubscriptionState<MappedData>)(
        this.state,
      );

      return;
    }

    this.state = state;
  };
}
