/**
 * The external imports
 */
import { useEffect } from 'react'
import { Flex } from '@chakra-ui/react'
import { useTranslation } from 'next-i18next'

/**
 * The internal imports
 */
import { validationTranslations } from '@/lib/utils/validationTranslations'
import DrawerProvider from '@/lib/providers/drawer'
import ModalProvider from '@/lib/providers/modal'
import ProjectProvider from '@/lib/providers/project'
import DiagramSidebar from '@/components/sidebar/diagram'
import type { DiagramLayoutComponent } from '@/types'

const DiagramLayout: DiagramLayoutComponent = ({ children }) => {
  const { t } = useTranslation('validations')

  useEffect(() => {
    validationTranslations(t)
  }, [t])

  return (
    <ProjectProvider>
      <Flex justifyContent='flex-start'>
        <DiagramSidebar />
        <ModalProvider>
          <DrawerProvider>{children}</DrawerProvider>
        </ModalProvider>
      </Flex>
    </ProjectProvider>
  )
}

export default DiagramLayout
