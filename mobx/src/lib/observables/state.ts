import {isFunction} from 'lodash-es';
import {
  action,
  autorun,
  makeAutoObservable,
  onBecomeUnobserved as mobxOnBecomeUnobserved,
  runInAction,
  toJS,
} from 'mobx';

import {clientRehydration, rehydrate} from '../ssr';

export class StateObservable<State> {
  state: State;

  key: string;

  reset: () => void;

  constructor({
    key,
    initialState: clientInitialState,
    onStateChange,
    onBecomeUnobserved,
  }: {
    key: string;
    initialState: State;
    onStateChange?: (value: State) => void;
    onBecomeUnobserved?: ({reset}: {reset: () => void}) => void;
  }) {
    const initialState = rehydrate(key, clientInitialState);

    this.key = key;
    this.state = initialState;
    this.reset = action(() => {
      this.state = initialState;
    });

    makeAutoObservable(this, {set: action}, {name: key});
    clientRehydration(this);

    if (onStateChange) {
      let firstRun = true;
      autorun(() => {
        const state = this.state;
        if (!firstRun) {
          onStateChange(toJS(state));
        }
        firstRun = false;
      });
    }

    if (onBecomeUnobserved) {
      mobxOnBecomeUnobserved(this, 'state', () => {
        runInAction(() => {
          onBecomeUnobserved({reset: this.reset});
        });
      });
    }
  }

  set = (state: State | ((state: State) => State)) => {
    if (isFunction(state)) {
      this.state = (state as (state: State) => State)(this.state);

      return;
    }

    this.state = state;
  };
}
