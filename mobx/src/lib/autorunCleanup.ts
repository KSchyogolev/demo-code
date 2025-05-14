import {IAutorunOptions, IReactionDisposer, IReactionPublic, autorun} from 'mobx';

export type Cleanup = () => void;
export type Callback = (r: IReactionPublic) => Cleanup | void;

export const autorunCleanup = (callback: Callback, options?: IAutorunOptions): IReactionDisposer => {
  let cleanup: Cleanup | void;

  const stop = autorun(r => {
    cleanup?.();
    cleanup = callback(r);
  }, options);

  return Object.assign(() => {
    stop();
    cleanup?.();
  }, stop);
};
