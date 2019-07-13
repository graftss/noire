import Konva from 'konva';
import { map } from 'ramda';
import * as T from '../../types';
import { clone } from '../../utils';
import { defaultInputByKind, rawifyInputMap } from '../../input/bindings';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Component = TypedComponent<any>;

export interface BaseComponentConfig<I> {
  x: number;
  y: number;
  id: string;
  defaultInput?: I;
  inputKinds: Record<keyof I, T.InputKind>;
  inputMap: Record<keyof I, T.ControllerKey>;
}

export abstract class TypedComponent<I extends Record<string, T.Input>> {
  protected config: BaseComponentConfig<I>;
  group: Konva.Group;

  constructor(config: BaseComponentConfig<I>) {
    const { x, y } = config;
    this.config = config;
    this.group = new Konva.Group({ x, y });
  }

  protected static generateConfig<I, C>(
    baseConfig: BaseComponentConfig<I>,
    defaultComponentConfig: Required<C>,
    defaultInput: I,
  ): BaseComponentConfig<I> & Required<C> {
    const result = {
      ...baseConfig,
      ...defaultComponentConfig,
      defaultInput,
      inputMap: {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ...map(() => undefined, defaultInput as any),
        ...baseConfig.inputMap,
      },
    };

    return result;
  }

  protected applyDefaultInput(input: Record<keyof I, Maybe<T.Input>>): I {
    const result = clone(input);
    const { defaultInput } = this.config;

    for (const key in input) {
      if (result[key] !== undefined) continue;
      if (defaultInput && defaultInput[key]) result[key] = defaultInput[key];
      result[key] = defaultInputByKind(this.config.inputKinds[key]);
    }

    return result;
  }

  protected computeRawInput(input: I): T.Raw<I> {
    return rawifyInputMap(this.applyDefaultInput(input));
  }

  getId(): string {
    return this.config.id;
  }

  getInputMap(): Record<keyof I, T.ControllerKey> {
    return this.config.inputMap;
  }

  setInputMap(inputMap: Record<keyof I, T.ControllerKey>): void {
    this.config.inputMap = inputMap;
  }

  abstract update(input: I, dt: number): void;
}
