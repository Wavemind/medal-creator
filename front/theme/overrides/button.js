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
          width: 'full',
          bg: 'primary',
          color: 'white',
          borderRadius: 15,
          fontSize: 'md',
          fontWeight: 'semibold',
          _hover: {
            bg: 'blue.700'
          }
        }
      },
      // default values for 'size', 'variant' and 'colorScheme'
      defaultProps: {},
    },
  }
}
