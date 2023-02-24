export default {
  components: {
    Link: {
      // style object for base or default style
      baseStyle: {},
      // styles for different sizes ("sm", "md", "lg")
      sizes: {},
      // styles for different visual variants ("outline", "solid")
      variants: {
        solid: {
          bg: 'primary',
          color: 'white',
          borderRadius: '2xl',
          fontSize: 'md',
          fontWeight: 'semibold',
          px: 4,
          py: 2,
          _hover: {
            borderRadius: '2xl',
            bg: 'blue.700',
          },
        },
        outline: {
          color: 'primary',
          borderColor: 'primary',
          borderWidth: 2,
          borderRadius: '2xl',
          fontSize: 'md',
          fontWeight: 'semibold',
          px: 4,
          py: 1,
          _hover: {
            textDecoration: 'none',
            borderRadius: '2xl',
            bg: 'primary',
            color: 'white',
          },
        },
        subMenu: {
          w: 'full',
          borderRadius: 'md',
          fontSize: 'md',
          fontWeight: 'semibold',
          px: 4,
          py: 2,
          _hover: {
            textDecoration: 'none',
            borderRadius: 'md',
            bg: 'gray.100',
          },
        },
        activeSubMenu: {
          w: 'full',
          borderRadius: 'md',
          fontSize: 'md',
          fontWeight: 'semibold',
          px: 4,
          py: 2,
          bg: 'secondary',
          color: 'white',
        },
      },
      // default values for 'size', 'variant' and 'colorScheme'
      defaultProps: {},
    },
  },
}
