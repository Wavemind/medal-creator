export default {
  components: {
    Heading: {
      // style object for base or default style
      baseStyle: {},
      // styles for different sizes ("sm", "md", "lg")
      sizes: {},
      // styles for different visual variants ("outline", "solid")
      variants: {
        h1: {
          fontWeight: 'semibold',
          fontSize: '5xl',
        },
        h2: {
          fontWeight: 'semibold',
          fontSize: '2xl',
        },
        h3: {
          fontWeight: 'medium',
          fontSize: 'lg',
        },
        h4: {
          fontWeight: 'regular',
          fontSize: 'lg',
        },
        subTitle: {
          fontWeight: 'semibold',
          fontSize: 'lg',
        }
      },
      // default values for 'size', 'variant' and 'colorScheme'
      defaultProps: {},
    }
  }
}