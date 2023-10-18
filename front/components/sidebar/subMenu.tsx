/**
 * The external imports
 */
import React, { useEffect } from 'react'
import {
  VStack,
  useTheme,
  Flex,
  Heading,
  Divider,
  Button,
} from '@chakra-ui/react'
import { useTranslation } from 'next-i18next'
import { Link } from '@chakra-ui/next-js'
import { skipToken } from '@reduxjs/toolkit/dist/query'

/**
 * The internal imports
 */
import AlgorithmForm from '@/components/forms/algorithm'
import { MENU_OPTIONS } from '@/lib/config/constants'
import {
  useGetAlgorithmQuery,
  useLazyExportDataQuery,
} from '@/lib/api/modules/enhanced/algorithm.enhanced'
import { useAppDispatch, useAppRouter, useModal } from '@/lib/hooks'
import { downloadFile } from '@/lib/utils/media'
import { apiGraphql } from '@/lib/api/apiGraphql'
import type { SubMenuComponent } from '@/types'

const SubMenu: SubMenuComponent = ({ menuType }) => {
  const { t } = useTranslation('submenu')
  const { colors, dimensions } = useTheme()
  const { open: openModal } = useModal()
  const router = useAppRouter()
  const dispatch = useAppDispatch()

  const { projectId, algorithmId } = router.query

  const { data: algorithm } = useGetAlgorithmQuery(
    algorithmId ? { id: algorithmId } : skipToken
  )

  const [exportData, { data, isSuccess: isExportSuccess }] =
    useLazyExportDataQuery()

  const editAlgorithm = (): void => {
    openModal({
      title: t('edit', { ns: 'algorithms' }),
      content: (
        <AlgorithmForm projectId={projectId} algorithmId={algorithmId} />
      ),
    })
  }

  useEffect(() => {
    if (isExportSuccess) {
      handleDownloadFile()
    }
  }, [isExportSuccess])

  const handleDownloadFile = async () => {
    if (data && data.url) {
      await downloadFile(data.url)
      await dispatch(apiGraphql.util.invalidateTags(['ExportData']))
    }
  }

  const handleVariableExport = () =>
    exportData({
      id: algorithmId,
      exportType: 'variables',
    })

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
        {MENU_OPTIONS[menuType].map(link => (
          <Link
            key={link.key}
            fontSize='sm'
            href={link.path({ projectId, algorithmId })}
            data-testid={`subMenu-${link.key}`}
            variant={
              router.asPath === link.path({ projectId, algorithmId })
                ? 'activeSubMenu'
                : 'subMenu'
            }
          >
            {t(link.label, { defaultValue: '' })}
          </Link>
        ))}
        {algorithmId && algorithm && (
          <>
            <Button variant='subMenu' onClick={handleVariableExport}>
              {t('downloadVariables')}
            </Button>
            <Button variant='subMenu' onClick={editAlgorithm}>
              {t('algorithmSettings')}
            </Button>
          </>
        )}
      </VStack>
    </Flex>
  )
}

export default SubMenu
