/**
 * The external imports
 */
import type { TFunction } from 'i18next'

export type Unpacked<T> = T extends (infer U)[] ? U : T

export type CustomPartial<
  InputPartial,
  Model extends keyof key
> = Partial<InputPartial> & Pick<key, Model>

export type CustomTFunction<N> = TFunction<N, undefined, N>
