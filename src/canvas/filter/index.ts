export type Filter<S> = (state: S) => (i: ImageData) => void;
