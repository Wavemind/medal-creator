export default {
  components: {
    Table: {
      // style object for base or default style
      baseStyle: {
        th: {
          textTransform: 'none',
          fontWeight: 'normal',
          fontSize: 14,
        },
        td: {
          fontSize: 16,
          _first: {
            fontWeight: '900',
          },
        },
      },
      // styles for different sizes ("sm", "md", "lg")
      sizes: {},
      // styles for different visual variants ("outline", "solid")
      variants: {},
      // default values for 'size', 'variant' and 'colorScheme'
      defaultProps: {},
    },
  },
}
