/**
 * The external imports
 */
import { mode, StyleFunctionProps } from '@chakra-ui/theme-tools'

export default {
  styles: {
    global: (props: StyleFunctionProps) => ({
      body: {
        fontFamily: 'IBM Plex Sans',
        bg: mode('white', 'gray.800')(props),
      },
    }),
  },
}
