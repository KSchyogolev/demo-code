import {action, makeAutoObservable} from 'mobx';

import {rehydrate} from '../../ssr';
import {overlayCloseManager} from './overlayCloseManager';

export class OverlayStateObservable {
  key: string;

  state = {visible: false};

  reset: () => void;

  constructor({
    key,
    initialState: clientInitialState = {visible: false},
  }: {
    key: string;
    initialState?: {visible: boolean};
  }) {
    const initialState = rehydrate(key, clientInitialState);

    this.key = key;
    if (initialState) {
      this.state = initialState;
    }

    this.reset = action(() => {
      this.state = initialState;
    });

    makeAutoObservable(this, {}, {autoBind: true, name: key});
    overlayCloseManager.subscribe(this.close);
  }

  open() {
    this.state.visible = true;
  }

  close() {
    this.state.visible = false;
  }

  get visible() {
    return this.state.visible;
  }
}
