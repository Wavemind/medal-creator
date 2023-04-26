/**
 * The external imports
 */
import { useContext } from 'react'
import {
  Box,
  HStack,
  Icon,
  Tooltip,
  Text,
  useConst,
  VStack,
} from '@chakra-ui/react'
import { RxDragHandleDots2 } from 'react-icons/rx'
import { useTranslation } from 'next-i18next'
import isNumber from 'lodash/isNumber'

/**
 * The internal imports
 */
import { InformationIcon } from '@/assets/icons'
import { TreeOrderingService } from '@/lib/services'
import { ModalContext } from '@/lib/contexts'
import { VariableInstances } from '..'
import type { ItemComponent } from '@/types'

const Item: ItemComponent = ({ enableDnd, node, usedVariables }) => {
  const { ROW_HEIGHT_PX, CIRCLE_WIDTH_PX } = TreeOrderingService

  const { openModal } = useContext(ModalContext)

  const { t } = useTranslation('consultationOrder')

  const subtitle = useConst(TreeOrderingService.subtitle(node))
  const isUsed = useConst(
    TreeOrderingService.isVariableUsed(node, usedVariables)
  )

  const openInfo = () => {
    if (isNumber(node.id)) {
      openModal({
        content: <VariableInstances variableId={node.id} />,
        title: node.text,
        size: '5xl',
      })
    }
  }

  return (
    <HStack
      cursor={enableDnd && node.data?.isMoveable ? 'move' : 'cursor'}
      boxShadow='md'
      spacing={4}
      h={`${ROW_HEIGHT_PX}px`}
      w='full'
      _hover={{
        bg: enableDnd ? 'blackAlpha.50' : 'white',
      }}
      alignItems='center'
      justifyContent='space-between'
      pr={4}
    >
      <Box
        h='100%'
        w={`${CIRCLE_WIDTH_PX}px`}
        minW={`${CIRCLE_WIDTH_PX}px`}
        bg='primary'
      >
        {node.data?.isMoveable && (
          <Icon as={RxDragHandleDots2} color='white' h='full' w='full' />
        )}
      </Box>
      <Tooltip hasArrow label={node.text} aria-label={node.text}>
        <VStack alignItems='flex-start' flex={1} spacing={0}>
          <Text
            fontWeight={node.parent === 0 ? 'bold' : 'normal'}
            noOfLines={1}
          >
            {node.text}
          </Text>
          {subtitle && (
            <Text
              fontWeight='light'
              fontSize='xs'
              color='gray.400'
              noOfLines={1}
            >
              {t(`subtitles.${subtitle}`, { defaultValue: '' })}
            </Text>
          )}
          {isUsed && (
            <Text
              fontWeight='bold'
              color='secondary'
              fontSize='xs'
              noOfLines={1}
            >
              {t('usedVariables')}
            </Text>
          )}
        </VStack>
      </Tooltip>
      {TreeOrderingService.isInfoAvailable(node) && (
        <InformationIcon onClick={openInfo} cursor='pointer' />
      )}
    </HStack>
  )
}

export default Item
