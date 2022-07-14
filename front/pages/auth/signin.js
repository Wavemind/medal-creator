/**
 * The external imports
 */
import React from 'react';
import { useForm } from 'react-hook-form';
import { Heading, Link, Flex, Box, Center, Text, VStack, Button, FormControl, FormLabel, Input } from '@chakra-ui/react'
import Image from 'next/image';

import logo from '../../public/logo.svg'

export default function SignIn() {
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm()

  return (
    <Flex>
      <Flex
        h={{ sm: "initial", lg: "100vh" }}
        w="100%"
        maxW="1044px"
        mx="auto"
      >
        <Flex
          alignItems="center"
          w={{ base: "100%", md: "50%", lg: "42%" }}
        >
          <Flex
            direction="column"
            w="100%"
            p={{ sm: 10 }}
            boxShadow="0px 0px 4px rgba(0, 0, 0, 0.25)"
            borderRadius={15}
          >
            <Heading variant="h2" mb={14} textAlign="center">
              Login
            </Heading>
            <form onSubmit={handleSubmit(handleSubmit)}>
              <FormControl>
                <VStack align="left" spacing={6}>
                  <Box>
                    <FormLabel>
                      Email
                    </FormLabel>
                    <Input
                      id="email"
                      name="email"
                      type="text"
                      autoFocus={true}
                      {...register('email', {
                        required: 'This is required',
                        minLength: { value: 4, message: 'Minimum length should be 4' },
                      })}
                    />
                  </Box>
                  <Box>
                    <FormLabel>
                      Password
                    </FormLabel>
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      {...register('password', {
                        required: 'This is required',
                        minLength: { value: 4, message: 'Minimum length should be 4' },
                      })}
                    />
                  </Box>
                </VStack>
                <Box mt={6} textAlign="center">
                  <Text fontSize="m" color="red">
                  </Text>
                </Box>
                <Button
                  type="submit"
                  mt={6}
                  isLoading={isSubmitting}
                >
                  Sign in
                </Button>
              </FormControl>
            </form>
            <Box mt={8}>
              <Link as="span" fontSize="sm">
                Forgot your password ?
              </Link>
            </Box>
          </Flex>
        </Flex>
        <Box
          display={{ base: "none", md: "block" }}
          h="100%"
          w="40vw"
          position="absolute"
          pt={4}
          pb={4}
          right={0}
        >
          <Box
            bg="primary"
            w="100%"
            h="100%"
            bgPosition="50%"
            borderBottomLeftRadius="20px"
            borderTopLeftRadius="20px"
          >
            <Center h="50%">
              <VStack>
                <Image src={logo} width="400" height="400" />
              </VStack>
            </Center>
          </Box>
        </Box>
      </Flex>
    </Flex>
  )
}
