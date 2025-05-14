import {isObservable, makeAutoObservable, reaction} from 'mobx';

import {SubscriptionObservable} from './subscription';

export class DerivedObservable<T> {
  data: T;

  constructor(defaultValue: T) {
    this.data = defaultValue;
    makeAutoObservable(this, {subscribe: false});
  }

  subscribe(subscription: SubscriptionObservable<T | undefined, T>) {
    if (isObservable(subscription)) {
      reaction(
        () => subscription.data,
        () => {
          this.data = subscription.data;
        },
      );
    }
  }
}
