/**
 * The external imports
 */
import { useEffect } from 'react'
import { Box, Flex, Text, HStack, VStack } from '@chakra-ui/react'
import { useTranslation } from 'next-i18next'
import Image from 'next/image'

/**
 * The internal imports
 */
import Page from '@/components/page'
import { validationTranslations } from '@/lib/utils/validationTranslations'
import logo from '@/public/logo.svg'
import { useAppRouter } from '@/lib/hooks/useAppRouter'
import type { AuthLayoutComponent } from '@/types'

const AuthLayout: AuthLayoutComponent = ({ children, namespace }) => {
  const { t, i18n } = useTranslation(namespace)
  const router = useAppRouter()

  validationTranslations(t)

  useEffect(() => {
    const { pathname, asPath, query } = router
    const language = localStorage.getItem('language')
    if (language && language !== i18n.language) {
      router.push({ pathname, query }, asPath, {
        locale: language,
      })
    }
  }, [])

  /**
   * Changes the selected language
   * @param {*} e event object
   */
  const handleLanguageSelect = (locale: string) => {
    const { pathname, asPath, query } = router
    localStorage.setItem('language', locale)
    router.push({ pathname, query }, asPath, {
      locale,
    })
  }

  return (
    <Box width='100%' height='92vh'>
      <Page title={t('title')}>
        <Flex
          h={{ sm: 'initial', md: '75vh', lg: '100vh' }}
          w='100%'
          maxW='1044px'
          mx='auto'
          pt={{ sm: 150, md: 0 }}
        >
          <VStack
            w={{ base: '100%', md: '50%', lg: '42%' }}
            justifyContent='center'
          >
            <Box w='100%'>
              <Flex
                direction='column'
                boxShadow='0px 0px 4px rgba(0, 0, 0, 0.25)'
                borderRadius='2xl'
                p={{ sm: 10 }}
                mx={{ sm: 15, md: 0 }}
                mb={4}
              >
                {children}
              </Flex>
              <HStack>
                <Text
                  fontSize='sm'
                  onClick={() => handleLanguageSelect('fr')}
                  cursor='pointer'
                >
                  Francais
                </Text>
                <Text
                  fontSize='sm'
                  onClick={() => handleLanguageSelect('en')}
                  cursor='pointer'
                >
                  English
                </Text>
              </HStack>
            </Box>
          </VStack>
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
