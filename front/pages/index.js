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
import Layout from '/lib/layouts/default'
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
      <Box mx={32}>
        <HStack justifyContent='space-between'>
          <Heading variant='h1' mb={10}>
            {t('title')}
          </Heading>
          <OptimizedLink variant='outline' href='/projects/new'>
            {t('new')}
          </OptimizedLink>
        </HStack>
        <SimpleGrid minChildWidth={200} spacing={20}>
          {projects.map(project => (
            <GridItem
              key={`project_${project.id}`}
              flexDirection='column'
              w={250}
              h={250}
            >
              <Box
                align='center'
                width='100%'
                height='100%'
                borderRadius='lg'
                boxShadow='lg'
                _hover={{
                  boxShadow: 'xl',
                  transitionDuration: '0.5s',
                  transitionTimingFunction: 'ease-in-out',
                }}
                border='1px'
                borderColor='sidebar'
              >
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
                <OptimizedLink href={`projects/${project.id}`}>
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
                </OptimizedLink>
              </Box>
            </GridItem>
          ))}
        </SimpleGrid>
      </Box>
    </Page>
  )
}

Home.getLayout = function getLayout(page) {
  return <Layout showSideBar={false}>{page}</Layout>
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
