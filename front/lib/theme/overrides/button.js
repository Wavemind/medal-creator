export default {
  components: {
    Button: {
      // style object for base or default style
      baseStyle: {},
      // styles for different sizes ("sm", "md", "lg")
      sizes: {},
      // styles for different visual variants ("outline", "solid")
      variants: {
        solid: {
          bg: 'primary',
          color: 'white',
          borderRadius: 15,
          fontSize: 'md',
          fontWeight: 'semibold',
          _hover: {
            borderRadius: 15,
            bg: 'blue.700',
          },
        },
        ghost: {
          borderRadius: 15,
          fontSize: 'md',
          fontWeight: 'semibold',
          _hover: {
            borderRadius: 15,
          }
        }
      },
      // default values for 'size', 'variant' and 'colorScheme'
      defaultProps: {},
    },
  },
}
