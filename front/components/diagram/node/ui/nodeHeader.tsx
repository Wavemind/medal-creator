/**
 * The external imports
 */
import { memo } from 'react'
import { Text, HStack, Icon, Tooltip } from '@chakra-ui/react'
import { useTranslation } from 'next-i18next'
import { PiBabyBold } from 'react-icons/pi'

/**
 * The internal imports
 */
import NodeHeaderMenu from './nodeHeaderMenu'
import type { NodeHeaderComponent } from '@/types'

const NodeHeader: NodeHeaderComponent = ({
  mainColor,
  icon,
  category,
  textColor,
  isOpen,
  onOpen,
  onClose,
  isNeonat,
  fromAvailableNode,
}) => {
  const { t } = useTranslation('variables')

  return (
    <HStack
      bg={mainColor}
      borderColor={mainColor}
      borderTopWidth={1}
      borderRightWidth={1}
      borderLeftWidth={1}
      justifyContent='space-between'
      borderTopRightRadius={10}
      borderTopLeftRadius={10}
    >
      {isNeonat ? (
        <Tooltip label={t('isNeonat')} placement='top' hasArrow>
          <HStack bg='diagram.neonat' borderTopLeftRadius={10} px={3} py={2}>
            <Icon as={PiBabyBold} color='white' />
            <Text fontSize='xs' fontWeight='bold' color='white'>
              {category}
            </Text>
          </HStack>
        </Tooltip>
      ) : (
        <HStack px={3} py={2}>
          {icon}
          <Text color={textColor} fontSize='xs' fontWeight='bold'>
            {category}
          </Text>
        </HStack>
      )}
      {!fromAvailableNode && (
        <NodeHeaderMenu
          textColor={textColor}
          isOpen={isOpen}
          onOpen={onOpen}
          onClose={onClose}
        />
      )}
    </HStack>
  )
}

// TODO: Need attention, may cause problems with the memo
export default memo(NodeHeader)
