/**
 * The external imports
 */
import { Controller, useFormContext } from 'react-hook-form'
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

const Slider = ({ name, label, helperText = null, isDisabled = false }) => {
  const {
    control,
    formState: { errors },
  } = useFormContext()

  return (
    <FormControl isInvalid={errors[name]}>
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
              bgGradient='linear(to-r, green.300, yellow.300, orange.200, red.600)'
            >
              <SliderFilledTrack bg='transparent' />
            </SliderTrack>
            <SliderThumb boxSize={6} zIndex={100} _disabled={{ opacity: 1 }} />
          </ChakraSlider>
        )}
      />

      {helperText && <FormHelperText>{helperText}</FormHelperText>}
      <FormErrorMessage>
        {errors[name] && errors[name].message}
      </FormErrorMessage>
    </FormControl>
  )
}

export default Slider
