import Konva from 'konva';
import { map } from 'ramda';
import * as T from '../../types';
import { defaults } from '../../utils';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Component = TypedComponent<any>;

export interface BaseComponentConfig<I> {
  x: number;
  y: number;
  id: string;
  defaultInput?: I;

  // relates props of the component's expected input to the controller
  // keys they're bound to
  inputMap: Record<keyof I, T.ControllerKey>;
}

export abstract class TypedComponent<I extends Record<string, T.RawInput>> {
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

  protected applyDefaultInput(input: I): I {
    return this.config.defaultInput
      ? defaults(this.config.defaultInput, input)
      : input;
  }

  getId(): string {
    return this.config.id;
  }

  getInputMap(): Record<keyof I, T.ControllerKey> {
    return this.config.inputMap;
  }

  abstract update(input: I, dt: number): void;
}
