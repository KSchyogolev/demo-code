import {isFunction} from 'lodash-es';
import {action, makeAutoObservable} from 'mobx';

import {rehydrate} from '../../ssr';
import {overlayCloseManager} from './overlayCloseManager';

type State<Props> = {visible: boolean; props: Props};

export class OverlayStateWithPropsObservable<Props> {
  key: string;

  state: State<Props>;

  reset: () => void;

  constructor({key, initialState: clientInitialState}: {key: string; initialState: State<Props>}) {
    const initialState = rehydrate(key, clientInitialState);

    this.key = key;
    this.state = initialState;

    this.reset = action(() => {
      this.state = initialState;
    });

    makeAutoObservable(this, {}, {autoBind: true, name: key});
    overlayCloseManager.subscribe(this.close);
  }

  open(props?: Props | ((props: Props) => Props)) {
    if (props) this.setProps(props);

    this.state.visible = true;
  }

  setProps(props: Props | ((props: Props) => Props)) {
    this.state.props = isFunction(props) ? props(this.state.props) : props;
  }

  close() {
    this.state.visible = false;
  }

  get visible() {
    return this.state.visible;
  }

  get props() {
    return this.state.props;
  }
}
