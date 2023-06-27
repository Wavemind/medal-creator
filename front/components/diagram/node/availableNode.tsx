/**
 * The external imports
 */
import { Box, Text, Flex, useTheme, VStack } from '@chakra-ui/react'
import type { FC, DragEvent } from 'react'

/**
 * The internal imports
 */

const AvailableNode: FC<{
  id: string
  type: string
  title: string
  label: string
  answers: object[]
}> = ({ id, type, title, label, answers }) => {
  const { colors } = useTheme()

  const onDragStart = (event: DragEvent<HTMLDivElement>) => {
    event.dataTransfer.setData(
      'application/reactflow',
      JSON.stringify({ id, type, title, label, answers })
    )
    event.dataTransfer.effectAllowed = 'move'
  }

  return (
    <VStack
      borderRadius={10}
      bg={colors.ordering}
      pt={1}
      onDragStart={event => onDragStart(event)}
      draggable
      cursor='grab'
    >
      <Flex w='full' px={3} py={1}>
        <Text
          align='left'
          color={colors.primary}
          fontSize='xs'
          fontWeight='bold'
        >
          {title}
        </Text>
      </Flex>
      <Box
        px={12}
        py={4}
        justifyContent='center'
        bg='white'
        borderBottomLeftRadius={10}
        borderBottomRightRadius={10}
      >
        <Text fontSize='lg'>{label}</Text>
      </Box>
    </VStack>
  )
}

export default AvailableNode
