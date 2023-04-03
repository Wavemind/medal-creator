/**
 * The external imports
 */
import type { FC, PropsWithChildren } from 'react'

/**
 * The internal imports
 */
import type { MenuOptions } from './common'

export type AuthLayoutComponent = FC<
  PropsWithChildren<{
    namespace: string
  }>
>

export type DefaultLayoutComponent = FC<
  PropsWithChildren<{
    menuType?: keyof MenuOptions
    showSideBar?: boolean
  }>
>
