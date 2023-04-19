/**
 * The external imports
 */
import { ReactElement } from 'react'
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
import { getServerSession } from 'next-auth'
import { Link } from '@chakra-ui/next-js'
import type { GetServerSidePropsContext } from 'next'

/**
 * The internal imports
 */
import Layout from '@/lib/layouts/default'
import { OverflowMenuIcon } from '@/assets/icons'
import { Page } from '@/components'
import { wrapper } from '@/lib/store'
import {
  getProjects,
  useGetProjectsQuery,
  useUnsubscribeFromProjectMutation,
} from '@/lib/api/modules'
import { apiGraphql } from '@/lib/api/apiGraphql'
import { authOptions } from '@/pages/api/auth/[...nextauth]'
import projectPlaceholder from '@/public/project-placeholder.svg'
import type { Paginated, Project, IsAdmin } from '@/types'

export default function Projects({ isAdmin }: IsAdmin) {
  const { t } = useTranslation('account')

  const { data: projects = {} as Paginated<Project> } = useGetProjectsQuery()
  const [unsubscribeFromProject] = useUnsubscribeFromProjectMutation()

  /**
   * Suppress user access to a project
   * @param {integer} id
   */
  const leaveProject = (id: number) => unsubscribeFromProject(id)

  return (
    <Page title={t('projects.title')}>
      <Heading mb={10}>{t('projects.header')}</Heading>
      <SimpleGrid minChildWidth={200} spacing={20}>
        {projects.edges.map(project => (
          <GridItem
            key={`project_${project.node.id}`}
            flexDirection='column'
            w={250}
            h={250}
          >
            <Box
              width='100%'
              height='100%'
              borderRadius='lg'
              boxShadow='lg'
              _hover={{
                boxShadow: 'xl',
                transitionDuration: '0.5s',
                transitionTimingFunction: 'ease-in-out',
              }}
              border={1}
              borderColor='sidebar'
              p={1}
            >
              <HStack w='full' justifyContent='flex-end'>
                <Menu>
                  <MenuButton as={IconButton} variant='ghost'>
                    <OverflowMenuIcon />
                  </MenuButton>
                  <MenuList>
                    {!isAdmin && (
                      <MenuItem onClick={() => leaveProject(project.node.id)}>
                        {t('remove', { ns: 'common' })}
                      </MenuItem>
                    )}
                    {project.node.isCurrentUserAdmin && (
                      <Link href={`/projects/${project.node.id}/edit`}>
                        <MenuItem>{t('edit', { ns: 'common' })}</MenuItem>
                      </Link>
                    )}
                  </MenuList>
                </Menu>
              </HStack>
              <Link href={`/projects/${project.node.id}`}>
                <Image
                  src={projectPlaceholder}
                  alt={project.node.name}
                  priority
                />
                <Text textAlign='center' noOfLines={1}>
                  {project.node.name}
                </Text>
              </Link>
            </Box>
          </GridItem>
        ))}
      </SimpleGrid>
    </Page>
  )
}

Projects.getLayout = function getLayout(page: ReactElement) {
  return (
    <Layout menuType='account' showSideBar={false}>
      {page}
    </Layout>
  )
}

export const getServerSideProps = wrapper.getServerSideProps(
  store =>
    async ({ locale, req, res }: GetServerSidePropsContext) => {
      if (typeof locale === 'string') {
        const session = await getServerSession(req, res, authOptions)

        if (session) {
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
              isAdmin: session.user.role === 'admin',
              ...translations,
            },
          }
        }
      }

      return {
        redirect: {
          destination: '/500',
          permanent: false,
        },
      }
    }
)
