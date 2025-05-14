import {isObservable, observable, toJS} from 'mobx';

export const serializeMobxValue = <T>(value: T): T =>
  isObservable(value) ? toJS(value) : toJS(observable(value as any));
