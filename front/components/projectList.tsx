/**
 * The external imports
 */
import {
  Text,
  SimpleGrid,
  Menu,
  MenuItem,
  MenuButton,
  MenuList,
  IconButton,
  HStack,
  Flex,
  Spinner,
} from '@chakra-ui/react'
import Image from 'next/image'
import { useTranslation } from 'next-i18next'
import { Link } from '@chakra-ui/next-js'
import type { FC } from 'react'

/**
 * The internal imports
 */
import ErrorMessage from '@/components/errorMessage'
import OverflowMenuIcon from '@/assets/icons/OverflowMenu'
import {
  useGetProjectsQuery,
  useUnsubscribeFromProjectMutation,
} from '@/lib/api/modules/enhanced/project.enhanced'
import projectPlaceholder from '@/public/project-placeholder.svg'
import type { IsAdmin, Scalars } from '@/types'

const ProjectList: FC<IsAdmin> = ({ isAdmin }) => {
  const { t } = useTranslation('home')

  const {
    data: projects,
    isError: isGetProjectError,
    error: projectError,
    isSuccess,
    isLoading,
  } = useGetProjectsQuery()

  const [
    unsubscribeFromProject,
    {
      isError: isUnsubscribreFromProjectError,
      error: unsubscribreFromProjectError,
    },
  ] = useUnsubscribeFromProjectMutation()

  /**
   * Suppress user access to a project
   * @param {integer} id
   */
  const leaveProject = (id: Scalars['ID']) => unsubscribeFromProject({ id })

  if (isGetProjectError || isUnsubscribreFromProjectError) {
    return (
      <ErrorMessage
        error={{ ...projectError, ...unsubscribreFromProjectError }}
      />
    )
  }

  if (isLoading) {
    return <Spinner size='xl' />
  }

  if (isSuccess) {
    return (
      <SimpleGrid columns={{ md: 2, lg: 3, '2xl': 5 }}>
        {projects.edges.map(project => (
          <Flex
            key={`project_${project.node.id}`}
            data-cy={`project-show-${project.node.id}`}
            direction='column'
            w={250}
            h={250}
            alignItems='center'
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
                  data-cy={`project-menu-${project.node.id}`}
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
                      data-cy={`project-menu-edit-${project.node.id}`}
                    >
                      <MenuItem>{t('settings', { ns: 'common' })}</MenuItem>
                    </Link>
                  )}
                </MenuList>
              </Menu>
            </HStack>
            <Link href={`/projects/${project.node.id}`}>
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
        ))}
      </SimpleGrid>
    )
  }

  return null
}

export default ProjectList
