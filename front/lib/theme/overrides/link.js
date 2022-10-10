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
          py: 1,
          _hover: {
            borderRadius: '2xl',
            bg: 'blue.700',
          },
        },
      },
      // default values for 'size', 'variant' and 'colorScheme'
      defaultProps: {},
    },
  },
}
