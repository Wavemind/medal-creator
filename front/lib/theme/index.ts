/**
 * The external imports
 */
import { extendTheme } from '@chakra-ui/react'

/**
 * The internal imports
 */
import common from './common'
import fonts from './foundations/fonts'
import colors from './foundations/colors'
import config from './foundations/config'
import dimensions from './foundations/dimensions'
import heading from './overrides/heading'
import formLabel from './overrides/formLabel'
import input from './overrides/input'
import numberInput from './overrides/numberInput'
import button from './overrides/button'
import link from './overrides/link'
import divider from './overrides/divider'
import select from './overrides/select'
import textarea from './overrides/textarea'
import table from './overrides/table'
import slider from './overrides/slider'
import drawer from './overrides/drawer'

export default extendTheme(
  config,
  colors,
  fonts,
  common,
  heading,
  formLabel,
  input,
  numberInput,
  button,
  link,
  divider,
  select,
  textarea,
  table,
  slider,
  drawer,
  dimensions
)

export type CustomTheme = typeof extendTheme
