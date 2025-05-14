import {IObservableValue} from 'mobx';
import {mapObjIndexed, pipe} from 'ramda';

export const useObservableBox = <T>(observableBox: IObservableValue<T>): [T, (value: T) => void] => [
  observableBox.get(),
  value => observableBox.set(value),
];

export const getFamilyKey = (params: Record<string, any>) =>
  pipe(
    mapObjIndexed(value => (typeof value === 'string' ? value.toLowerCase() : value)),
    (lowerCasedParams: Record<string, any>) => JSON.stringify(lowerCasedParams, Object.keys(lowerCasedParams).sort()),
  )(params);

export const getStoreKey = (key: string, params?: Record<string, any>) =>
  [key, params && getFamilyKey(params)].filter(Boolean).join('/');
