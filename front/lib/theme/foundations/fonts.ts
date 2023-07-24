/**
 * The external imports
 */
import { IBM_Plex_Sans, IBM_Plex_Mono } from 'next/font/google'

const IBMPlexSans = IBM_Plex_Sans({
  weight: ['100', '200', '300', '400', '500', '600', '700'],
  style: ['normal'],
  subsets: ['latin'],
})

const IBMPlexMono = IBM_Plex_Mono({
  weight: ['400'],
  style: ['normal'],
  subsets: ['latin'],
})

export default {
  fonts: {
    heading: IBMPlexSans.style.fontFamily,
    body: IBMPlexSans.style.fontFamily,
    mono: IBMPlexMono.style.fontFamily,
  },
}
