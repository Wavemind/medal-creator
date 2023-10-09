/**
 * The external imports
 */
import type { FC, PropsWithChildren } from 'react'

/**
 * The internal imports
 */
import { ProjectContext } from '@/lib/contexts'
import { useGetProjectQuery } from '@/lib/api/modules/enhanced/project.enhanced'
import { skipToken } from '@reduxjs/toolkit/dist/query'
import { useAppRouter } from '@/lib//hooks'

const ProjectProvider: FC<PropsWithChildren> = ({ children }) => {
  const {
    query: { projectId },
  } = useAppRouter()

  const { data: project } = useGetProjectQuery(
    projectId ? { id: projectId } : skipToken
  )

  return (
    <ProjectContext.Provider
      value={{
        projectLanguage: project?.language.code || 'en',
        isAdminOrClinicien: project?.isCurrentUserAdmin || false,
      }}
    >
      {children}
    </ProjectContext.Provider>
  )
}

export default ProjectProvider
