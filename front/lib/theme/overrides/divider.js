export default {
  components: {
    Divider: {
      // style object for base or default style
      baseStyle: {
        borderColor: 'gray.300',
      },
      // styles for different sizes ("sm", "md", "lg")
      sizes: {
        lg: { borderWidth: '4px' },
        md: { borderWidth: '2px' },
        sm: { borderWidth: '1px' },
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
