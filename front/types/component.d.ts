/**
 * The external imports
 */
import type { FC, ReactNode } from 'react'

export type PageComponent = FC<{
  children: ReactNode
  title: string
}>
