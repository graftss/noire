export interface EditorFieldData {
  string: { type: string; props: undefined };
  boolean: { type: boolean; props: undefined };
  number: { type: number; props: { precision: number } };
  Vec2: { type: Vec2; props: { precision: number } };
}

export type EditorFieldKind = keyof EditorFieldData;

export type EditorFieldType<
  K extends EditorFieldKind
> = EditorFieldData[K]['type'];

export type EditorFieldProps<
  K extends EditorFieldKind
> = EditorFieldData[K]['props'];

export interface EditorField<K extends EditorFieldKind = EditorFieldKind> {
  label: string;
  key: string;
  kind: K;
  defaultValue: EditorFieldType<K>;
  props: EditorFieldProps<K>;
}
