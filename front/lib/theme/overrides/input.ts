export default {
  components: {
    Input: {
      // style object for base or default style
      baseStyle: {},
      // styles for different sizes ("sm", "md", "lg")
      sizes: {
        md: {
          field: {
            borderRadius: '2xl',
            boxShadow: '0px 0px 5px rgba(10, 33, 65, 0.25)',
          },
        },
      },
      // styles for different visual variants ("outline", "solid")
      variants: {
        outline: {
          field: {
            borderColor: 'transparent',
          },
        },
        inline: {
          field: {
            borderLeftRadius: '2xl',
            borderRightRadius: 'none',
          },
        },
      },
      // default values for 'size', 'variant' and 'colorScheme'
      defaultProps: {},
    },
  },
}
