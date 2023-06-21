/**
 * The external imports
 */
import { useRef, useState, useLayoutEffect } from 'react'
import { Box, Text, HStack, Flex, useTheme, VStack } from '@chakra-ui/react'
import { Handle, Position } from 'reactflow'
import type { FC } from 'react'

/**
 * The internal imports
 */
import { SettingsIcon } from '@/assets/icons'

const VariableNode: FC = ({ data, isConnectable }) => {
  const nodeRef = useRef()
  const { colors } = useTheme()
  const [dimensions, setDimensions] = useState({})
  console.log(isConnectable)
  useLayoutEffect(() => {
    if (nodeRef.current) {
      setDimensions({
        width: nodeRef.current.offsetWidth,
        height: nodeRef.current.offsetHeight,
      })
    }
  }, [])

  const positionHandle = index => {
    return (dimensions.width * index) / (data.answers.length + 1)
  }

  return (
    <Box borderRadius={10} boxShadow='lg' bg='white' ref={nodeRef}>
      <Handle
        type='target'
        position={Position.Top}
        isConnectable={isConnectable}
        style={{
          height: '20px',
          width: '20px',
          zIndex: '-1',
          top: '-10px',
          backgroundColor: colors.ordering,
        }}
      />
      <HStack
        bg={colors.sidebar}
        px={3}
        py={2}
        justifyContent='space-between'
        borderTopLeftRadius={10}
        borderTopRightRadius={10}
      >
        <Text color='primary' fontSize='xs' fontWeight='bold'>
          {data.type}
        </Text>
        <SettingsIcon />
      </HStack>
      <Flex px={12} py={4} justifyContent='center'>
        <Text>{data.label}</Text>
      </Flex>
      <HStack spacing={0} justifyContent='space-evenly'>
        {/* TODO FIX text */}
        {data.answers.map((answer, index) => (
          <Handle
            type='source'
            position={Position.Bottom}
            id={answer.id}
            isConnectable={isConnectable}
            style={{
              padding: '10px',
              flexGrow: 1,
            }}
          >
            <Text color='white' align='center' fontSize='xs'>
              {answer.label}
            </Text>
          </Handle>
        ))}
      </HStack>
    </Box>
  )
}

export default VariableNode
