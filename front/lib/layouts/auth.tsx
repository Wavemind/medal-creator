/**
 * The external imports
 */
import { Box, Flex, Center } from '@chakra-ui/react'
import { useTranslation } from 'next-i18next'
import Image from 'next/image'
import { useEffect } from 'react';

/**
 * The internal imports
 */
import { Page } from '@/components'
import logo from '@/public/logo.svg'
import validationTranslations from '@/lib/utils/validationTranslations';

/**
 * Types definition
 */
interface AuthLayoutProps {
  children: React.ReactNode
  namespace: string
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children, namespace }) => {
  const { t } = useTranslation(namespace)

  useEffect(() => {
    console.log('je rentre')
    validationTranslations(t)
  }, [t])

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
            <Box
              bgGradient='linear(primary, blue.700)'
              w='100%'
              h='100%'
              bgPosition='50%'
            >
              <Center h='50%'>
                <Image
                  src={logo}
                  alt={t('medalCreator', { ns: 'common' })}
                  width={400}
                  height={400}
                />
              </Center>
            </Box>
          </Box>
        </Flex>
      </Page>
    </Box>
  )
}

export default AuthLayout
