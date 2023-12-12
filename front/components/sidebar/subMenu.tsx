/**
 * The external imports
 */
import React from 'react'
import {
  VStack,
  useTheme,
  Flex,
  Heading,
  Divider,
  Button,
  Tooltip,
} from '@chakra-ui/react'
import { useTranslation } from 'next-i18next'
import { Link } from '@chakra-ui/next-js'
import { skipToken } from '@reduxjs/toolkit/dist/query'

/**
 * The internal imports
 */
import { useGetAlgorithmQuery } from '@/lib/api/modules/enhanced/algorithm.enhanced'
import { MENU_OPTIONS, SubMenuRole } from '@/lib/config/constants'
import AlgorithmStatus from '@/components/algorithmStatus'
import AlgorithmForm from '@/components/forms/algorithm'
import { useAppRouter } from '@/lib/hooks/useAppRouter'
import { useModal } from '@/lib/hooks/useModal'
import { useProject } from '@/lib/hooks/useProject'
import { AlgorithmStatusEnum, type SubMenuComponent } from '@/types'

const SubMenu: SubMenuComponent = ({ menuType }) => {
  const { t } = useTranslation('submenu')
  const { colors, dimensions } = useTheme()
  const { open: openModal } = useModal()
  const { isAdminOrClinician, isCurrentUserAdmin } = useProject()
  const {
    asPath,
    query: { projectId, algorithmId },
  } = useAppRouter()

  const { data: algorithm } = useGetAlgorithmQuery(
    algorithmId ? { id: algorithmId } : skipToken
  )

  const editAlgorithm = (): void => {
    openModal({
      title: t('edit', { ns: 'algorithms' }),
      content: <AlgorithmForm algorithmId={algorithmId} />,
    })
  }

  const hasAccess = (role: SubMenuRole): boolean => {
    switch (role) {
      case SubMenuRole.IsAdmin:
        return isCurrentUserAdmin
      case SubMenuRole.IsAdminOrClinician:
        return isAdminOrClinician
      case SubMenuRole.Open:
        return true
      default:
        return false
    }
  }

  return (
    <Flex
      left={menuType === 'account' ? 0 : dimensions.sidebarWidth}
      top={dimensions.headerHeight}
      bg={colors.subMenu}
      width={dimensions.subMenuWidth}
      position='fixed'
      height={`calc(100vh - ${dimensions.headerHeight})`}
      boxShadow='-4px 0px 8px rgba(45, 45, 45, 0.1)'
    >
      <VStack
        spacing={12}
        alignItems='flex-start'
        paddingBottom={20}
        paddingTop={10}
        paddingLeft={4}
        paddingRight={4}
        overflowY='visible'
        overflowX='hidden'
        w='full'
      >
        {algorithmId && algorithm && (
          <React.Fragment>
            <VStack justifyContent='center' w='full' spacing={4}>
              <AlgorithmStatus status={algorithm.status} />
              <Heading variant='h3' fontWeight='bold'>
                {algorithm.name}
              </Heading>
              <Heading variant='h4'>
                {t(`enum.mode.${algorithm.mode}`, {
                  ns: 'algorithms',
                  defaultValue: '',
                })}
              </Heading>
            </VStack>
            <Divider w='90%' alignSelf='center' />
          </React.Fragment>
        )}
        {MENU_OPTIONS[menuType]
          .filter(link => hasAccess(link.access))
          .map(link => (
            <Link
              key={link.key}
              fontSize='sm'
              href={link.path({ projectId, algorithmId })}
              data-testid={`subMenu-${link.key}`}
              variant={
                asPath === link.path({ projectId, algorithmId })
                  ? 'activeSubMenu'
                  : 'subMenu'
              }
              {...link.linkOptions}
            >
              {t(link.label, { defaultValue: '' })}
            </Link>
          ))}
        {algorithmId && algorithm && isAdminOrClinician && (
          <Tooltip
            label={t('tooltip.inProduction', { ns: 'common' })}
            hasArrow
            isDisabled={algorithm.status === AlgorithmStatusEnum.Draft}
          >
            <Button
              variant='subMenu'
              onClick={editAlgorithm}
              isDisabled={[
                AlgorithmStatusEnum.Prod,
                AlgorithmStatusEnum.Archived,
              ].includes(algorithm.status)}
            >
              {t('algorithmSettings')}
            </Button>
          </Tooltip>
        )}
      </VStack>
    </Flex>
  )
}

export default SubMenu
