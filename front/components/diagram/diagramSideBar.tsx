/**
 * The external imports
 */
import { Flex, Input, VStack, useTheme } from '@chakra-ui/react'
import type { FC } from 'react'

/**
 * The internal imports
 */
import { AvailableNode } from '@/components'

const DiagramSideBar: FC = () => {
  const { colors, dimensions } = useTheme()

  return (
    <Flex
      top={dimensions.headerHeight}
      bg={colors.subMenu}
      width={dimensions.subMenuWidth}
      position='fixed'
      height={`calc(100vh - ${dimensions.headerHeight})`}
      boxShadow='-4px 0px 8px rgba(45, 45, 45, 0.1)'
    >
      <VStack mt={4} spacing={4}>
        <Input placeholder='Basic usage' />
        <AvailableNode
          id={Math.random().toString(36)}
          type='variable'
          title='Category'
          label='Malaria'
          answers={[
            {
              id: Math.random().toString(36),
              label: 'Yes',
              value: '1',
            },
            {
              id: Math.random().toString(36),
              label: 'No',
              value: '2',
            },
          ]}
        />
      </VStack>
    </Flex>
  )
}

export default DiagramSideBar
