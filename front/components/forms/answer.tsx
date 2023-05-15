/**
 * The external imports
 */
import {
  Button,
  Input,
  FormControl,
  FormLabel,
  HStack,
  IconButton,
  VStack,
  Select as ChakraSelect,
} from '@chakra-ui/react'

/**
 * The internal imports
 */
import { DeleteIcon } from '@/assets/icons'
import { AnswerComponent, AnswerTemplate } from '@/types'
import { ANSWER_TEMPLATE } from '@/lib/config/constants'

const Answer: AnswerComponent = ({ answers, setAnswers }) => {

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
    setAnswers(prev => [...prev, ANSWER_TEMPLATE])
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
          <HStack key={`answer_${index}`} alignItems='flex-end'>
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
            <FormControl isRequired={true}>
              <FormLabel>Operator</FormLabel>
              <ChakraSelect
                id={`answer_operator_${index}`}
                value={answer.operator}
                onChange={e =>
                  handleAnswerChange('operator', index, e.target.value)
                }
              >
                <option key={null} value=''></option>
                {options.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </ChakraSelect>
            </FormControl>
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
