import {getFamilyKey, getStoreKey} from '../utils';
import {SubscriptionObservable} from './subscription';
import {CreateSubscriptionCallbacks, CreateSubscriptionState} from './types';

type ObservableParams<SubscriptionParams extends Record<string, any>, PayloadData, MappedData> = {
  key: string;
  shouldUnsubscribeOnUnobserve?: boolean;
  initialState?: CreateSubscriptionState<MappedData>;
  subscription: (params: SubscriptionParams) => (callbacks: CreateSubscriptionCallbacks<PayloadData>) => () => void;
  mapper: (value: PayloadData, state: MappedData) => MappedData;
};

export class SubscriptionFamilyObservable<SubscriptionParams extends Record<string, any>, PayloadData, MappedData> {
  key: string;

  private observables = new Map<string, SubscriptionObservable<PayloadData, MappedData>>();

  private readonly observableParams: ObservableParams<SubscriptionParams, PayloadData, MappedData>;

  constructor(observableParams: ObservableParams<SubscriptionParams, PayloadData, MappedData>) {
    this.key = observableParams.key;
    this.observableParams = observableParams;
  }

  private getObservable(params: SubscriptionParams) {
    const familyKey = getFamilyKey(params);

    if (!this.observables.has(familyKey)) {
      this.observables.set(
        familyKey,
        new SubscriptionObservable({
          ...this.observableParams,
          key: getStoreKey(this.key, params),
          shouldUnsubscribeOnUnobserve: this.observableParams.shouldUnsubscribeOnUnobserve ?? true,
          subscription: this.observableParams.subscription(params),
          onUnsubscribe: () => this.observables.delete(familyKey),
        }),
      );
    }

    return this.observables.get(familyKey) as SubscriptionObservable<PayloadData, MappedData>;
  }

  data = (params: SubscriptionParams) => this.getObservable(params).data;

  loading = (params: SubscriptionParams) => this.getObservable(params).loading;

  error = (params: SubscriptionParams) => this.getObservable(params).error;

  set = (params: SubscriptionParams) => this.getObservable(params).set;
}
