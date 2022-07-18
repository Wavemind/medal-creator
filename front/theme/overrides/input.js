export default {
  components: {
    Input: {
      // style object for base or default style
      baseStyle: {},
      // styles for different sizes ("sm", "md", "lg")
      sizes: {
        md: {
          field: {
            borderRadius: 15,
            boxShadow: '0px 0px 5px rgba(10, 33, 65, 0.25)',
          },
        },
      },
      // styles for different visual variants ("outline", "solid")
      variants: {
        outline: {
          field: {
            borderColor: 'transparent',
          }
        }
      },
      // default values for 'size', 'variant' and 'colorScheme'
      defaultProps: {
      },
    },
  }
}