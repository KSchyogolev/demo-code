type FormattedServerError = {
  error: {
    code: string;
    details?: Record<string, any>;
  };
  httpStatus: number;
};

export const getSubscriptionInitialState = <Data>() => ({
  loading: true,
  data: {} as Data,
  error: null,
});

export const SUBSCRIPTION_ARRAY_INITIAL_STATE = {
  loading: true,
  data: [],
  error: null,
};

export const SUBSCRIPTION_VALUE_INITIAL_STATE = {
  loading: true,
  data: null,
  error: null,
};

export const SUBSCRIPTION_BOOLEAN_INITIAL_STATE = {
  loading: true,
  data: false,
  error: null,
};

export type CreateSubscriptionState<Data = any> = {
  loading: boolean;
  data: Data;
  error: FormattedServerError | null;
};

export type CreateSubscriptionCallbacks<Data> = {
  onData: (value: Data) => void;
  onError: (payload: any) => void;
  onSubscribe?: (payload?: any) => void;
  onUnsubscribe: () => void;
  onDisconnect: () => void;
};

export type NormalizedEntity<T = Record<string, never>> = T & {
  uuid: string;
};

export type SubscribeObservableTarget = {
  unsubscribe: null | (() => void);
} & {[k in string]: any};
