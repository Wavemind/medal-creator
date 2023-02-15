/**
 * The external imports
 */
import { ReactElement } from 'react'
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
  Flex,
} from '@chakra-ui/react'
import Image from 'next/image'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import {
  GetServerSidePropsContext,
  NextApiRequest,
  NextApiResponse,
} from 'next'

/**
 * The internal imports
 */
import { Page, OptimizedLink } from '@/components'
import { OverflowMenuIcon } from '@/assets/icons'
import Layout from '@/lib/layouts/default'
import { wrapper } from '@/lib/store'
import { setSession } from '@/lib/store/session'
import {
  getProjects,
  useGetProjectsQuery,
  useUnsubscribeFromProjectMutation,
} from '@/lib/services/modules/project'
import { apiGraphql } from '@/lib/services/apiGraphql'
import getUserBySession from '@/lib/utils/getUserBySession'
import { Project } from '@/types/project'
import { Paginated } from '@/types/common'
import projectPlaceholder from '/public/project-placeholder.svg'

/**
 * Type definitions
 */
type HomeProps = {
  isAdmin: boolean
}

export default function Home({ isAdmin }: HomeProps) {
  const { t } = useTranslation(['home', 'common'])

  const { data: projects = {} as Paginated<Project> } = useGetProjectsQuery({})
  const [unsubscribeFromProject] = useUnsubscribeFromProjectMutation()

  /**
   * Suppress user access to a project
   * @param {integer} id
   */
  const leaveProject = (id: number) => unsubscribeFromProject(id)

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
          {projects.edges.map(project => (
            <GridItem
              key={`project_${project.node.id}`}
              data-cy='project_show'
              flexDirection='column'
              w={250}
              h={250}
            >
              <Flex
                direction='column'
                alignItems='center'
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
                        <MenuItem onClick={() => leaveProject(project.node.id)}>
                          {t('remove', { ns: 'common' })}
                        </MenuItem>
                      )}
                      {project.node.isCurrentUserAdmin && (
                        <OptimizedLink
                          href={`/projects/${project.node.id}/edit`}
                          data-cy='project_edit'
                        >
                          <MenuItem>{t('edit', { ns: 'common' })}</MenuItem>
                        </OptimizedLink>
                      )}
                    </MenuList>
                  </Menu>
                </HStack>
                <OptimizedLink href={`projects/${project.node.id}`}>
                  <Image
                    src={projectPlaceholder}
                    alt={project.node.name}
                    priority
                  />
                  <Text textAlign='center' noOfLines={1}>
                    {project.node.name}
                  </Text>
                </OptimizedLink>
              </Flex>
            </GridItem>
          ))}
        </SimpleGrid>
      </Box>
    </Page>
  )
}

export const getServerSideProps = wrapper.getServerSideProps(
  store =>
    async ({ locale, req, res }: GetServerSidePropsContext) => {
      const currentUser = getUserBySession(
        req as NextApiRequest,
        res as NextApiResponse
      )
      await store.dispatch(setSession(currentUser))
      store.dispatch(getProjects.initiate({}))
      await Promise.all(
        store.dispatch(apiGraphql.util.getRunningQueriesThunk())
      )

      // Translations
      const translations = await serverSideTranslations(locale as string, [
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

Home.getLayout = function getLayout(page: ReactElement) {
  return <Layout showSideBar={false}>{page}</Layout>
}
