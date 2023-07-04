export default {
  components: {
    Button: {
      // style object for base or default style
      baseStyle: {
        borderRadius: '50px',
      },
      // styles for different sizes ("sm", "md", "lg")
      sizes: {},
      // styles for different visual variants ("outline", "solid")
      variants: {
        solid: {
          bg: 'primary',
          color: 'white',

          fontSize: 'md',
          fontWeight: 'semibold',
          _hover: {
            bg: 'blue.700',
            _disabled: {
              bg: 'primary',
            },
          },
        },
        ghost: {
          fontSize: 'md',
          fontWeight: 'semibold',
        },
        card: {
          boxShadow: 'sm',
          height: 'full',
          _hover: {
            boxShadow: 'md',
          },
          fontWeight: 'normal',
          border: '1px',
          borderColor: 'sidebar',
          display: 'flex',
          flexDirection: 'columns',
          p: 15,
        },
        inline: {
          bg: 'primary',
          color: 'white',
          borderRightRadius: 'md',
          borderLeftRadius: 'none',
          width: '100%',
          _hover: {
            bg: 'blue.700',
          },
        },
        delete: {
          bg: 'error',
          color: 'white',
          _hover: {
            bg: 'red.700',
          },
        },
        outline: {
          borderColor: 'primary',
          borderWidth: 2,
          fontWeight: 'semibold',
          _hover: {
            bg: 'primary',
            color: 'white',
          },
        },
      },
      // default values for 'size', 'variant' and 'colorScheme'
      defaultProps: {},
    },
  },
}
