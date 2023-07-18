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
          borderRadius: '2xl',
          fontSize: 'md',
          fontWeight: 'semibold',
          _hover: {
            borderRadius: '2xl',
            bg: 'blue.700',
            _disabled: {
              bg: 'primary',
            },
          },
        },
        ghost: {
          borderRadius: '2xl',
          fontSize: 'md',
          fontWeight: 'semibold',
          _hover: {
            borderRadius: '2xl',
          },
        },
        card: {
          borderRadius: 'lg',
          boxShadow: 'sm',
          height: 'full',
          _hover: {
            borderRadius: 'lg',
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
          borderRadius: '2xl',
          bg: 'error',
          color: 'white',
          _hover: {
            bg: 'red.700',
          },
        },
        outline: {
          borderColor: 'primary',
          borderWidth: 2,
          borderRadius: '2xl',
          fontWeight: 'semibold',
          _hover: {
            borderRadius: '2xl',
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
