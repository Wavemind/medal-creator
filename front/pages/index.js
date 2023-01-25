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
import Image from 'next/image'
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
  useUnsubscribeFromProjectMutation,
} from '/lib/services/modules/project'
import { apiGraphql } from '/lib/services/apiGraphql'
import getUserBySession from '/lib/utils/getUserBySession'

export default function Home({ isAdmin }) {
  const { t } = useTranslation(['home', 'common'])

  const { data: projects } = useGetProjectsQuery()
  const [unsubscribeFromProject] = useUnsubscribeFromProjectMutation()

  /**
   * Suppress user access to a project
   * @param {integer} id
   */
  const leaveProject = id => unsubscribeFromProject(id)

  return (
    <Page title={t('title')}>
      <Box mx={32}>
        <HStack justifyContent='space-between' mb={12}>
          <Heading variant='h1'>{t('title')}</Heading>
          {isAdmin && (
            <OptimizedLink
              variant='outline'
              href='/projects/new'
              data-cy='new_project'
            >
              {t('new')}
            </OptimizedLink>
          )}
        </HStack>
        <SimpleGrid minChildWidth={200} spacing={20}>
          {projects.map(project => (
            <GridItem
              key={`project_${project.id}`}
              data-cy='project_show'
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
                borderWidth={1}
                borderColor='sidebar'
                p={1}
              >
                <HStack w='full' justifyContent='flex-end'>
                  <Menu>
                    <MenuButton
                      as={IconButton}
                      variant='ghost'
                      data-cy='project_menu'
                    >
                      <OverflowMenuIcon />
                    </MenuButton>
                    <MenuList>
                      {!isAdmin && (
                        <MenuItem onClick={() => leaveProject(project.id)}>
                          {t('remove', { ns: 'common' })}
                        </MenuItem>
                      )}
                      {project.isCurrentUserAdmin && (
                        <OptimizedLink
                          href={`/projects/${project.id}/edit`}
                          data-cy='project_edit'
                        >
                          <MenuItem>{t('edit', { ns: 'common' })}</MenuItem>
                        </OptimizedLink>
                      )}
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
                  <Text noOfLines={1}>{project.name}</Text>
                </OptimizedLink>
              </Box>
            </GridItem>
          ))}
        </SimpleGrid>
      </Box>
    </Page>
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
        'home',
        'common',
      ])

      return {
        props: {
          isAdmin: currentUser.role === 'admin',
          ...translations,
        },
      }
    }
)

Home.getLayout = function getLayout(page) {
  return <Layout showSideBar={false}>{page}</Layout>
}
