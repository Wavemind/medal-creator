/**
 * The external imports
 */
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import Image from 'next/image'
import { useTranslation } from 'next-i18next'
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

/**
 * The internal imports
 */
import Layout from '/lib/layouts/default'
import { OverflowMenuIcon } from '/assets/icons'
import { Page, OptimizedLink } from '/components'
import { wrapper } from '/lib/store'
import { setSession } from '/lib/store/session'
import { getProjects, useGetProjectsQuery } from '/lib/services/modules/project'
import { apiGraphql } from '/lib/services/apiGraphql'
import getUserBySession from '/lib/utils/getUserBySession'

export default function Projects() {
  const { t } = useTranslation('account')

  const { data: projects } = useGetProjectsQuery()

  return (
    <Page title={t('projects.title')}>
      <Heading mb={10}>{t('projects.header')}</Heading>
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
                    {project.isCurrentUserAdmin && (
                      <OptimizedLink href={`/projects/${project.id}/edit`}>
                        <MenuItem>{t('edit', { ns: 'common' })}</MenuItem>
                      </OptimizedLink>
                    )}
                  </MenuList>
                </Menu>
              </HStack>
              <OptimizedLink href={`/projects/${project.id}`}>
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
    </Page>
  )
}

Projects.getLayout = function getLayout(page) {
  return (
    <Layout menuType='account' showSideBar={false}>
      {page}
    </Layout>
  )
}

export const getServerSideProps = wrapper.getServerSideProps(
  store =>
    async ({ locale, req, res }) => {
      const currentUser = getUserBySession(req, res)
      await store.dispatch(setSession(currentUser))
      store.dispatch(getProjects.initiate())
      await Promise.all(
        store.dispatch(apiGraphql.util.getRunningQueriesThunk())
      )

      // Translations
      const translations = await serverSideTranslations(locale, [
        'common',
        'account',
        'submenu',
      ])

      return {
        props: {
          ...translations,
        },
      }
    }
)
