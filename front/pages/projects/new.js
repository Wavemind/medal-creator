/**
 * The external imports
 */
import { useState, useCallback } from 'react'
import {
  Heading,
  SimpleGrid,
  VStack,
  Button,
  Text,
  Input as ChakraInput,
  FormControl,
  FormLabel,
  Alert,
  AlertIcon,
  Flex,
} from '@chakra-ui/react'
import { AddIcon, CloseIcon } from '@chakra-ui/icons'
import { useTranslation } from 'next-i18next'
import { useForm, FormProvider } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import filter from 'lodash/filter'
import debounce from 'lodash/debounce'
import find from 'lodash/find'

/**
 * The internal imports
 */
import { Page, RichText, Input, Checkbox, Textarea, Select } from '/components'
import Layout from '/lib/layouts/default'
import { wrapper } from '/lib/store'
import { setSession } from '/lib/store/session'
import {
  getLanguages,
  useGetLanguagesQuery,
  getRunningOperationPromises,
} from '/lib/services/modules/language'
import { getUsers, useGetUsersQuery } from '/lib/services/modules/user'
import getUserBySession from '/lib/utils/getUserBySession'

export default function NewProject() {
  const { t } = useTranslation(['project', 'common'])
  const [usersFind, setUsersFind] = useState([])
  const [allowedUsers, setAllowedUsers] = useState([])

  const { data: languages } = useGetLanguagesQuery()
  const { data: users } = useGetUsersQuery()

  /**
   * Setup form configuration
   */
  const methods = useForm({
    resolver: yupResolver(
      yup.object({
        password: yup.string().required(t('required', { ns: 'validations' })),
        passwordConfirmation: yup
          .string()
          .required(t('required', { ns: 'validations' })),
      })
    ),
    reValidateMode: 'onSubmit',
    defaultValues: {},
  })

  /**
   * Search user by first name. last name or email
   * @param {object} e
   */
  const searchUser = e => {
    const term = e.target.value

    if (term === '') {
      setUsersFind([])
    } else {
      const result = filter(users, function (user) {
        return (
          (user.firstName.toLowerCase().indexOf(term) > -1 ||
            user.lastName.toLowerCase().indexOf(term) > -1 ||
            user.email.toLowerCase().indexOf(term) > -1) &&
          !find(allowedUsers, ['id', user.id])
        )
      })

      setUsersFind(result)
    }
  }

  const addUser = user => {
    setUsersFind([])
    setAllowedUsers(prev => [...prev, user])
  }

  const removeUser = user => {
    const newAllowedUsers = filter(allowedUsers, function (u) {
      return u.id !== user.id
    })
    setAllowedUsers(newAllowedUsers)
  }

  /**
   * Debounces the search update by 0.3 seconds
   */
  const debouncedSearchUser = useCallback(debounce(searchUser, 300), [
    allowedUsers,
  ])

  return (
    <Page title={t('title')}>
      <Heading variant='h1' mb={10}>
        {t('title')}
      </Heading>
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit('TODO')}>
          <SimpleGrid columns={2} spacing={12}>
            <VStack align='left' spacing={6}>
              <Input label={t('form.name')} name='name' required />
              <SimpleGrid columns={2}>
                <Checkbox
                  label={t('form.consentManagement')}
                  name='consentManagement'
                />
                <Checkbox
                  label={t('form.displayReferral')}
                  name='displayReferral'
                />
              </SimpleGrid>
              <Textarea label={t('form.description')} name='description' />
              <Select
                label={t('form.defaultLanguage')}
                name='defaultLanguage'
                options={languages}
                valueOption='id'
                labelOption='name'
                required
              />

              <SimpleGrid columns={2} spacing={10}>
                <RichText
                  label={t('form.emergencyContent')}
                  name='emergencyContent'
                  required
                />
                <RichText
                  label={t('form.studyDescription')}
                  name='studyDescription'
                  required
                />
              </SimpleGrid>
            </VStack>
            <VStack align='left' spacing={6}>
              <FormControl>
                <FormLabel htmlFor='users'>Add user to this project</FormLabel>
                <ChakraInput
                  name='users'
                  placeholder='Search an user'
                  onChange={debouncedSearchUser}
                />
              </FormControl>
              <SimpleGrid columns={2} spacing={2}>
                {usersFind.map(user => (
                  <Button
                    variant='dragAndDrop'
                    key={user.id}
                    onClick={() => addUser(user)}
                    rightIcon={
                      <AddIcon
                        bg='green.400'
                        borderRadius='md'
                        fontSize={18}
                        p={1}
                        color='white'
                      />
                    }
                  >
                    <VStack alignItems='flex-start' w='full'>
                      <Text fontSize='lg'>
                        {user.firstName} {user.lastName}
                      </Text>
                      <Text>{user.email}</Text>
                    </VStack>
                  </Button>
                ))}
              </SimpleGrid>

              <Text fontWeight='semibold'>Allowed users</Text>
              {allowedUsers.length > 0 ? (
                <SimpleGrid columns={2} spacing={2}>
                  {allowedUsers.map(user => (
                    <Button
                      variant='dragAndDrop'
                      key={user.id}
                      onClick={() => removeUser(user)}
                      rightIcon={
                        <CloseIcon
                          bg='red.400'
                          borderRadius='md'
                          fontSize={18}
                          p={1}
                          color='white'
                        />
                      }
                    >
                      <VStack alignItems='flex-start' w='full'>
                        <Text fontSize='lg'>
                          {user.firstName} {user.lastName}
                        </Text>
                        <Text>{user.email}</Text>
                      </VStack>
                    </Button>
                  ))}
                </SimpleGrid>
              ) : (
                <Alert status='info'>
                  <AlertIcon />
                  Nobody have access to this project
                </Alert>
              )}
            </VStack>
          </SimpleGrid>
          <Flex justifyContent='flex-end' mt={12}>
            <Button type='submit'>{t('save', { ns: 'common' })}</Button>
          </Flex>
        </form>
      </FormProvider>
    </Page>
  )
}

export const getServerSideProps = wrapper.getServerSideProps(
  store =>
    async ({ locale, req, res }) => {
      const currentUser = getUserBySession(req, res)
      await store.dispatch(setSession(currentUser))
      store.dispatch(getLanguages.initiate())
      store.dispatch(getUsers.initiate())
      await Promise.all(getRunningOperationPromises())

      // Translations
      const translations = await serverSideTranslations(locale, [
        'project',
        'common',
      ])

      return {
        props: {
          ...translations,
        },
      }
    }
)

NewProject.getLayout = function getLayout(page) {
  return <Layout showSideBar={false}>{page}</Layout>
}
