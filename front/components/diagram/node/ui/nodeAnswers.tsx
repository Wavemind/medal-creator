/**
 * The external imports
 */
import { memo } from 'react'
import { Text, HStack, Circle, useTheme } from '@chakra-ui/react'
import { Handle, Position } from 'reactflow'
import { useRouter } from 'next/router'
import type { FC } from 'react'

/**
 * The external imports
 */
import { useGetProjectQuery } from '@/lib/api/modules'

const NodeAnswers: FC<{
  bg: string
  answers: { id: string; label: string }[] | []
}> = ({ bg, answers }) => {
  const { colors } = useTheme()

  const {
    query: { projectId },
  } = useRouter()

  const {
    data: project,
    isSuccess: isProjectSuccess,
    isError,
    error,
    isLoading,
  } = useGetProjectQuery(projectId)

  return (
    <HStack spacing={0} justifyContent='space-evenly'>
      {answers.map((answer, index) => (
        <Handle
          type='source'
          id={answer.id}
          key={answer.id}
          position={Position.Bottom}
          isConnectable={true}
          style={{
            padding: '5px',
            flexGrow: 1,
            backgroundColor: bg,
            borderBottomLeftRadius: index === 0 ? '10px' : '0px',
            borderBottomRightRadius:
              index === answers.length - 1 ? '10px' : '0px',
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <Text color='white' fontSize='xs' pointerEvents='none'>
            {isProjectSuccess &&
              answer.labelTranslations[project.language.code]}
          </Text>
          <Circle
            position='absolute'
            bg={colors.handle}
            size={5}
            top={18}
            zIndex='-1'
            pointerEvents='none'
          />
        </Handle>
      ))}
    </HStack>
  )
}

// TODO: Need attention, may cause problems with the memo
export default memo(NodeAnswers)
