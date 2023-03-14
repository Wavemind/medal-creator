/**
 * The external imports
 */
import { FC } from 'react'
import { Controller, useFormContext, FieldValues } from 'react-hook-form'
import {
  FormLabel,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  Slider as ChakraSlider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  SliderMark,
  Text,
} from '@chakra-ui/react'
import { ErrorMessage } from '@hookform/error-message'

/**
 * The internal imports
 */
import { LEVEL_OF_URGENCY_GRADIENT } from '@/lib/config/constants'

/**
 * Type definitions
 */
type SliderProps = {
  name: string
  label: string
  helperText?: string
  isDisabled?: boolean
}

const Slider: FC<SliderProps> = ({
  name,
  label,
  helperText = null,
  isDisabled = false,
}) => {
  const {
    control,
    formState: { errors },
  } = useFormContext<FieldValues>()

  return (
    <FormControl isInvalid={!!errors[name]}>
      <FormLabel htmlFor={name}>{label}</FormLabel>
      <Controller
        control={control}
        name={name}
        render={({ field: { onChange, value } }) => (
          <ChakraSlider
            data-cy='slider'
            min={1}
            max={10}
            step={1}
            isDisabled={isDisabled}
            _disabled={{
              opacity: 1,
            }}
            onChange={onChange}
            value={value}
          >
            {Array.from({ length: 10 }, (_, i) => i + 1).map(item => (
              <SliderMark
                key={item}
                data-cy={`slider_mark_${item}`}
                value={item}
                mt={4}
                zIndex={12}
                fontSize='sm'
                _before={{
                  content: '""',
                  position: 'absolute',
                  top: -6,
                  left: 0,
                  borderWidth: 1,
                  height: 4,
                  borderColor: 'gray.800',
                }}
              >
                <Text ml={-0.5}>{item}</Text>
              </SliderMark>
            ))}

            <SliderTrack
              h={3}
              bgGradient={`linear(to-r, ${LEVEL_OF_URGENCY_GRADIENT.join(', ')})`}
            >
              <SliderFilledTrack bg='transparent' />
            </SliderTrack>
            <SliderThumb boxSize={6} zIndex={100} _disabled={{ opacity: 1 }} />
          </ChakraSlider>
        )}
      />

      {helperText && <FormHelperText>{helperText}</FormHelperText>}
      <ErrorMessage as={<FormErrorMessage />} name={name} />
    </FormControl>
  )
}

export default Slider
