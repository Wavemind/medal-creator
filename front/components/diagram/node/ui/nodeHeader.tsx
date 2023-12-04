/**
 * The external imports
 */
import { memo } from 'react'
import { Text, HStack, Icon, Tooltip } from '@chakra-ui/react'
import { useTranslation } from 'next-i18next'
import { Baby } from 'lucide-react'

/**
 * The internal imports
 */
import NodeHeaderMenu from '@/components/diagram/node/ui/nodeHeaderMenu'
import type { NodeHeaderComponent } from '@/types'

const NodeHeader: NodeHeaderComponent = ({
  backgroundColor,
  icon,
  category,
  color,
  isOpen,
  onOpen,
  onClose,
  isNeonat,
  fromAvailableNode,
}) => {
  const { t } = useTranslation('variables')

  return (
    <HStack
      bg={backgroundColor}
      borderColor={backgroundColor}
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
            <Icon as={Baby} color='white' />
            <Text fontSize='xs' fontWeight='bold' color='white'>
              {category}
            </Text>
          </HStack>
        </Tooltip>
      ) : (
        <HStack px={3} py={2}>
          {icon}
          <Text color={color} fontSize='xs' fontWeight='bold'>
            {category}
          </Text>
        </HStack>
      )}
      {!fromAvailableNode && (
        <NodeHeaderMenu
          color={color}
          isOpen={isOpen}
          onOpen={onOpen}
          onClose={onClose}
        />
      )}
    </HStack>
  )
}

export default memo(NodeHeader)
