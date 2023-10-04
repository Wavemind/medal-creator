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
          borderRadius: '50px',
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
          borderRadius: '50px',
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
          borderRadius: '50px',
        },
        inline: {
          bg: 'primary',
          color: 'white',
          borderRightRadius: 'md',
          borderLeftRadius: 'none',
          width: '100%',
          borderRadius: '50px',
          _hover: {
            bg: 'blue.700',
          },
        },
        delete: {
          bg: 'error',
          color: 'white',
          borderRadius: '50px',
          _hover: {
            bg: 'red.700',
          },
        },
        outline: {
          borderColor: 'primary',
          borderWidth: 2,
          fontWeight: 'semibold',
          borderRadius: '50px',
          _hover: {
            bg: 'primary',
            color: 'white',
          },
        },
        diagram: {
          h: '36px',
          w: '36px',
          minW: 'none',
          bg: '#fff',
          borderRadius: '50%',
          border: '1px solid',
          borderColor: 'primary',
          cursor: 'pointer',
          fontSize: '2xl',
          color: 'primary',
          p: 0,
          _hover: {
            bg: 'primary',
            color: 'white',
          },
        },
        subMenu: {
          w: 'full',
          borderRadius: 'md',
          fontSize: 'sm',
          fontWeight: 'semibold',
          px: 4,
          py: 2,
          justifyContent: 'flex-start',
          _hover: {
            bg: 'gray.100',
          },
        },
      },
      // default values for 'size', 'variant' and 'colorScheme'
      defaultProps: {},
    },
  },
}
