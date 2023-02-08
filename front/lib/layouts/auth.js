/**
 * The external imports
 */
import { Box, Flex } from '@chakra-ui/react'
import { useTranslation } from 'next-i18next'
import Image from 'next/image'

/**
 * The internal imports
 */
import { Page } from '/components'
import logo from '/public/logo.svg'

const AuthLayout = ({ children, namespace }) => {
  const { t } = useTranslation(namespace)

  return (
    <Box width='100%' height='92vh'>
      <Page title={t('title')}>
        <Flex
          h={{ sm: 'initial', md: '75vh', lg: '100vh' }}
          w='100%'
          maxW='1044px'
          mx='auto'
          justifyContent='space-between'
          pt={{ sm: 150, md: 0 }}
        >
          <Flex
            alignItems='center'
            justifyContent='start'
            w={{ base: '100%', md: '50%', lg: '42%' }}
          >
            <Flex
              direction='column'
              w='100%'
              boxShadow='0px 0px 4px rgba(0, 0, 0, 0.25)'
              borderRadius='2xl'
              background='transparent'
              p={{ sm: 10 }}
              mx={{ sm: 15, md: 0 }}
              mt={{ md: 150, lg: 20 }}
            >
              {children}
            </Flex>
          </Flex>
          <Box
            display={{ base: 'none', md: 'block' }}
            h='100vh'
            w='40vw'
            position='absolute'
            right={0}
          >
            <Flex
              bgGradient='linear(primary, blue.700)'
              w='100%'
              h='100%'
              justifyContent='center'
              alignItems='center'
              position='relative'
            >
              <Image
                src={logo}
                alt={t('medalCreator', { ns: 'common' })}
                fill
                priority
              />
            </Flex>
          </Box>
        </Flex>
      </Page>
    </Box>
  )
}

export default AuthLayout
