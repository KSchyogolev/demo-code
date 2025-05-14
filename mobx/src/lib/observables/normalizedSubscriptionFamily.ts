import {getFamilyKey, getStoreKey} from '../utils';
import {NormalizedSubscriptionObservable} from './normalizedSubscription';
import {CreateSubscriptionCallbacks, CreateSubscriptionState, NormalizedEntity} from './types';

type ObservableParams<
  SubscriptionParams extends Record<string, any>,
  PayloadData extends Record<string, any>[],
  MappedData,
> = {
  key: string;
  normalizeKey: keyof PayloadData[0];
  initialState?: CreateSubscriptionState<Record<string, NormalizedEntity<MappedData>>>;
  subscription: (params: SubscriptionParams) => (callbacks: CreateSubscriptionCallbacks<PayloadData>) => () => void;
  mapper: (value: NormalizedEntity<PayloadData[0]>) => MappedData;
  filter?: (value: MappedData) => boolean;
};

export class NormalizedSubscriptionFamilyObservable<
  SubscriptionParams extends Record<string, any>,
  PayloadData extends Record<string, any>[],
  MappedData,
> {
  key: string;

  private observables = new Map<string, NormalizedSubscriptionObservable<PayloadData, MappedData>>();

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
        new NormalizedSubscriptionObservable({
          ...this.observableParams,
          key: getStoreKey(this.key, params),
          shouldUnsubscribeOnUnobserve: true,
          subscription: this.observableParams.subscription(params),
          onUnsubscribe: () => this.observables.delete(familyKey),
        }),
      );
    }

    return this.observables.get(familyKey) as NormalizedSubscriptionObservable<PayloadData, MappedData>;
  }

  data = (params: SubscriptionParams) => this.getObservable(params).data;

  loading = (params: SubscriptionParams) => this.getObservable(params).loading;

  error = (params: SubscriptionParams) => this.getObservable(params).error;

  list = (params: SubscriptionParams) => this.getObservable(params).list;
}
