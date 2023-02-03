export default {
  components: {
    Divider: {
      // style object for base or default style
      baseStyle: {
        borderColor: 'gray.300',
      },
      // styles for different sizes ("sm", "md", "lg")
      sizes: {
        md: { borderWidth: 2 },
      },
      // styles for different visual variants ("outline", "solid")
      variants: {},
      // default values for 'size', 'variant' and 'colorScheme'
      defaultProps: {
        size: 'md',
      },
    },
  },
}
