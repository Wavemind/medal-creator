/**
 * The external imports
 */
import { useState } from 'react'
import {
  Button,
  Input,
  FormControl,
  FormLabel,
  HStack,
  IconButton,
  VStack,
} from '@chakra-ui/react'
import type { FC } from 'react'

/**
 * The internal imports
 */
import { Select } from '@/components'
import { DeleteIcon } from '@/assets/icons'

type AnswerTemplate = { label: string; operator: string; value: string }

const Answer: FC = () => {
  const [answers, setAnswers] = useState<AnswerTemplate[]>([])

  const answerTemplate: AnswerTemplate = { label: '', operator: '', value: '' }

  const options = [
    { label: '<', value: '<' },
    { label: '>', value: '>' },
    { label: '<=', value: '<=' },
    { label: '>=', value: '>=' },
    { label: '=', value: '=' },
  ]

  /**
   * Removes the answer at the given index
   * @param index number
   */
  const handleRemove = (index: number) => {
    const newAnswers = [...answers]
    newAnswers.splice(index, 1)
    setAnswers(newAnswers)
  }

  const addAnswer = () => {
    setAnswers(prev => [...prev, answerTemplate])
  }

  const handleAnswerChange = (
    key: keyof AnswerTemplate,
    index: number,
    value: string
  ) => {
    setAnswers(prev => {
      const newAnswers = [...prev]
      newAnswers[index][key] = value
      return newAnswers
    })
  }

  return (
    <VStack spacing={8}>
      <VStack spacing={6}>
        {answers.map((answer, index) => (
          <HStack alignItems='flex-end'>
            <FormControl isRequired={true}>
              <FormLabel>Label</FormLabel>
              <Input
                id={`answer_label_${index}`}
                type='text'
                autoComplete='off'
                value={answer.label}
                onChange={e =>
                  handleAnswerChange('label', index, e.target.value)
                }
              />
            </FormControl>
            <Select
              name={`answer_operator_${index}`}
              label='Operator'
              options={options}
            />
            <FormControl isRequired={true}>
              <FormLabel>Value</FormLabel>
              <Input
                id={`answer_value_${index}`}
                type='text'
                autoComplete='off'
                value={answer.value}
                onChange={e =>
                  handleAnswerChange('value', index, e.target.value)
                }
              />
            </FormControl>
            <IconButton
              aria-label='delete'
              icon={<DeleteIcon />}
              variant='ghost'
              onClick={() => handleRemove(index)}
            />
          </HStack>
        ))}
      </VStack>
      <Button onClick={addAnswer} w='full'>
        Add
      </Button>
    </VStack>
  )
}

export default Answer
