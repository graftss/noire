// TODO: fill this in

export interface KeyboardSourceRef {
  kind: 'keyboard';
}

export interface KeyboardSource {
  kind: 'keyboard';
  ref: KeyboardSourceRef;
  keyboard: object;
}
