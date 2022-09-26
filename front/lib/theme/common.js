/**
 * The external imports
 */
import { mode } from '@chakra-ui/theme-tools'

export default {
  styles: {
    global: props => ({
      body: {
        fontFamily: 'IBM Plex Sans',
        bg: mode('white', 'gray.800')(props),
      },
    }),
  },
}
