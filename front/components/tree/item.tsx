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

/**
 * The internal imports
 */
import { InformationIcon } from '@/assets/icons'
import { TreeOrderingService } from '@/lib/services'
import { ModalContext } from '@/lib/contexts'
import type { ItemComponent } from '@/types'
import { InfoModalContent } from '..'

const Item: ItemComponent = ({ enableDnd, node, hasChild, usedVariables }) => {
  const { ROW_HEIGHT_PX, CIRCLE_WIDTH_PX } = TreeOrderingService

  const { openModal } = useContext(ModalContext)

  const { t } = useTranslation('consultationOrder')

  const subtitle = useConst(TreeOrderingService.subtitle(node, hasChild))
  const isUsed = useConst(
    TreeOrderingService.isVariableUsed(node, usedVariables)
  )

  // TODO : Open the modal and display info
  const openInfo = () => {
    openModal({
      title: node.text,
      content: <InfoModalContent />,
    })
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
              {t(`subtitles.${subtitle}`)}
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
      {!hasChild && <InformationIcon onClick={openInfo} cursor='pointer' />}
    </HStack>
  )
}

export default Item
