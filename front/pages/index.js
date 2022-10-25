/**
 * The external imports
 */
import {
  Heading,
  Text,
  SimpleGrid,
  GridItem,
  Menu,
  MenuItem,
  MenuButton,
  MenuList,
  IconButton,
  HStack,
  Box,
} from '@chakra-ui/react'
import Image from 'next/future/image'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'

/**
 * The internal imports
 */
import { Page, OptimizedLink } from '/components'
import { OverflowMenuIcon } from '/assets/icons'
import BareLayout from '/lib/layouts/bare'
import { wrapper } from '/lib/store'
import { setSession } from '/lib/store/session'
import {
  getProjects,
  useGetProjectsQuery,
  getRunningOperationPromises,
} from '/lib/services/modules/project'
import getUserBySession from '/lib/utils/getUserBySession'

export default function Home() {
  const { t } = useTranslation(['home', 'common'])

  const { data: projects } = useGetProjectsQuery()

  return (
    <Page title={t('title')}>
      <Heading variant='h1' mb={10}>
        {t('title')}
      </Heading>
      <SimpleGrid minChildWidth={200} spacing={20}>
        {projects.map(project => (
          <OptimizedLink
            key={`project_${project.id}`}
            href={`projects/${project.id}`}
          >
            <GridItem
              as='div'
              w={250}
              h={250}
              borderRadius='lg'
              boxShadow='0px 4px 8px rgba(0, 0, 0, 0.15)'
              display='flex'
              flexDirection='column'
              alignItems='center'
              justifyContent='space-between'
              px={5}
              pt={2}
              pb={5}
            >
              <Box align='center'>
                <HStack w='full' justifyContent='flex-end'>
                  <Menu>
                    <MenuButton as={IconButton} variant='ghost'>
                      <OverflowMenuIcon />
                    </MenuButton>
                    <MenuList>
                      <MenuItem>{t('remove', { ns: 'common' })}</MenuItem>
                    </MenuList>
                  </Menu>
                </HStack>
                <Box mt={1} mb={2}>
                  <Image
                    src='https://via.placeholder.com/150.png'
                    width='150'
                    height='150'
                    alt={project.name}
                    priority
                  />
                </Box>
                <Text>{project.name}</Text>
              </Box>
            </GridItem>
          </OptimizedLink>
        ))}
      </SimpleGrid>
    </Page>
  )
}

Home.getLayout = function getLayout(page) {
  return <BareLayout>{page}</BareLayout>
}

export const getServerSideProps = wrapper.getServerSideProps(
  store =>
    async ({ locale, req, res }) => {
      const currentUser = getUserBySession(req, res)
      await store.dispatch(setSession(currentUser))
      store.dispatch(getProjects.initiate())
      await Promise.all(getRunningOperationPromises())

      // Translations
      const translations = await serverSideTranslations(locale, [
        'home',
        'common',
      ])

      return {
        props: {
          ...translations,
        },
      }
    }
)
