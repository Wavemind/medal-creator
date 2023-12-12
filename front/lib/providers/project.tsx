/**
 * The external imports
 */
import { useSession } from 'next-auth/react'
import { skipToken } from '@reduxjs/toolkit/dist/query'
import type { FC, PropsWithChildren } from 'react'

/**
 * The internal imports
 */
import { useGetProjectQuery } from '@/lib/api/modules/enhanced/project.enhanced'
import { useAppRouter } from '@/lib//hooks/useAppRouter'
import { ProjectContext } from '@/lib/contexts'
import { RoleEnum } from '@/types'

const ProjectProvider: FC<PropsWithChildren> = ({ children }) => {
  const {
    query: { projectId },
  } = useAppRouter()
  const { data } = useSession()

  const { data: project } = useGetProjectQuery(
    projectId ? { id: projectId } : skipToken
  )

  return (
    <ProjectContext.Provider
      value={{
        name: project?.name || '',
        projectLanguage: project?.language.code || 'en',
        isCurrentUserAdmin: project?.isCurrentUserAdmin || false,
        isAdminOrClinician:
          project?.isCurrentUserAdmin ||
          data?.user.role === RoleEnum.Clinician ||
          false,
      }}
    >
      {children}
    </ProjectContext.Provider>
  )
}

export default ProjectProvider
