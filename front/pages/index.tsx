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
import type { GetServerSidePropsContext } from 'next'

/**
 * The internal imports
 */
import { Page, ErrorMessage } from '@/components'
import { OverflowMenuIcon } from '@/assets/icons'
import Layout from '@/lib/layouts/default'
import { wrapper } from '@/lib/store'
import {
  getProjects,
  useGetProjectsQuery,
  useUnsubscribeFromProjectMutation,
} from '@/lib/services/modules'
import { apiGraphql } from '@/lib/services/apiGraphql'
import projectPlaceholder from '@/public/project-placeholder.svg'
import { Link } from '@chakra-ui/next-js'

/**
 * Type definitions
 */
type HomeProps = {
  isAdmin: boolean
}

export default function Home({ isAdmin }: HomeProps) {
  const { t } = useTranslation(['home', 'common'])

  const { data: projects, isError, error } = useGetProjectsQuery()
  const [unsubscribeFromProject] = useUnsubscribeFromProjectMutation()

  /**
   * Suppress user access to a project
   * @param {integer} id
   */
  const leaveProject = (id: number) => unsubscribeFromProject(id)

  if (isError) {
    return <ErrorMessage error={error} />
  }

  return (
    <Page title={t('title')}>
      <Box mx={32}>
        <HStack justifyContent='space-between' mb={12}>
          <Heading variant='h1'>{t('title')}</Heading>
          {isAdmin && (
            <Link variant='outline' href='/projects/new' data-cy='new_project'>
              {t('new')}
            </Link>
          )}
        </HStack>
        <SimpleGrid minChildWidth={200} spacing={20}>
          {projects?.edges.map(project => (
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
                        <Link
                          href={`/projects/${project.node.id}/edit`}
                          data-cy='project_edit'
                        >
                          <MenuItem>{t('settings', { ns: 'common' })}</MenuItem>
                        </Link>
                      )}
                    </MenuList>
                  </Menu>
                </HStack>
                <Link href={`projects/${project.node.id}`}>
                  <Image
                    src={projectPlaceholder}
                    alt={project.node.name}
                    placeholder='blur'
                    blurDataURL='@/public/project-placeholder.svg'
                  />
                  <Text textAlign='center' noOfLines={1}>
                    {project.node.name}
                  </Text>
                </Link>
              </Flex>
            </GridItem>
          ))}
        </SimpleGrid>
      </Box>
    </Page>
  )
}

Home.getLayout = function getLayout(page: ReactElement) {
  return <Layout showSideBar={false}>{page}</Layout>
}

export const getServerSideProps = wrapper.getServerSideProps(
  store =>
    async ({ locale }: GetServerSidePropsContext) => {
      if (typeof locale === 'string') {
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
            ...translations,
          },
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
