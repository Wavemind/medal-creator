export default {
  components: {
    Table: {
      // style object for base or default style
      baseStyle: {
        thead: {
          borderBottomWidth: 2,
        },
        th: {
          textTransform: 'none',
          fontWeight: '400',
        },
        td: {
          _first: {
            fontWeight: '900',
          },
        },
      },
      // styles for different sizes ("sm", "md", "lg")
      sizes: {},
      // styles for different visual variants ("outline", "solid")
      variants: {
        basic: {
          td: {
            _first: {
              fontWeight: '400',
            },
          },
        },
      },
      // default values for 'size', 'variant' and 'colorScheme'
      defaultProps: {},
    },
  },
}
