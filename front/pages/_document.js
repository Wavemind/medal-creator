/**
 * The external imports
 */
import { ColorModeScript } from '@chakra-ui/react'
import NextDocument, { Html, Head, Main, NextScript } from 'next/document'

/**
 * The internal imports
 */
import { colorModeConfig } from '/lib/utils/colorModeUtils'

export default class Document extends NextDocument {
  render() {
    return (
      <Html lang='en'>
        <Head />
        <body>
          <ColorModeScript
            initialColorMode={colorModeConfig.initialColorMode}
          />
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}
