import {getFamilyKey} from '../utils';
import {StateObservable} from './state';

type ObservableParams<State> = {
  key: string;
  initialState: State;
};

type BaseParameter = string | number;

export class StateFamilyObservable<State, Parameter extends BaseParameter | Record<string, any> = BaseParameter> {
  initialState: State;

  key: string;

  private observables = new Map<BaseParameter, StateObservable<State>>();

  constructor(observableParams: ObservableParams<State>) {
    this.key = observableParams.key;
    this.initialState = observableParams.initialState;
  }

  private getObservable(parameter: Parameter) {
    const preparedParameter =
      typeof parameter === 'string' || typeof parameter === 'number' ? parameter : getFamilyKey(parameter);

    if (!this.observables.has(preparedParameter)) {
      this.observables.set(
        preparedParameter,
        new StateObservable<State>({
          key: `${this.key}/${preparedParameter}`,
          initialState: this.initialState,
        }),
      );
    }

    return this.observables.get(preparedParameter) as StateObservable<State>;
  }

  state = (parameter: Parameter) => this.getObservable(parameter).state;

  set = (parameter: Parameter) => this.getObservable(parameter).set;
}
