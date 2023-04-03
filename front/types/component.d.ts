/**
 * The external imports
 */
import type { FC, PropsWithChildren } from 'react'

export type PageComponent = FC<
  PropsWithChildren<{
    title: string
  }>
>
