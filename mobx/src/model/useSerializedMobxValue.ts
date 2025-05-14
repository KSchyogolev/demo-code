import {useState} from 'react';

import {serializeMobxValue} from '../lib';
import {useAutorunLayoutEffect} from './useAutorunLayoutEffect';

export const useSerializedMobxValue = <T>(value: T): T => {
  const [serializedValue, setSerializedValue] = useState(serializeMobxValue(value));

  useAutorunLayoutEffect(() => {
    setSerializedValue(serializeMobxValue(value));
  }, [value]);

  return serializedValue;
};
