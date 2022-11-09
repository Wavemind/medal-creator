/**
 * The external imports
 */
import { useState, useCallback, useEffect } from 'react'
import {
  Heading,
  SimpleGrid,
  VStack,
  Button,
  Text,
  Input as ChakraInput,
  Checkbox as ChakraCheckbox,
  FormControl,
  FormLabel,
  Alert,
  AlertIcon,
  Flex,
  Box,
  IconButton,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
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
import {
  Page,
  RichText,
  Input,
  Checkbox,
  Textarea,
  Select,
  FileUpload,
} from '/components'
import Layout from '/lib/layouts/default'
import { wrapper } from '/lib/store'
import { setSession } from '/lib/store/session'
import {
  getLanguages,
  useGetLanguagesQuery,
} from '/lib/services/modules/language'
import { apiGraphql } from '/lib/services/apiGraphql'
import { getUsers, useGetUsersQuery } from '/lib/services/modules/user'
import { useCreateProjectMutation } from '/lib/services/modules/project'
import getUserBySession from '/lib/utils/getUserBySession'
import { useToast } from '/lib/hooks'
import { useRouter } from 'next/router'

export default function NewProject({ hashStoreLanguage }) {
  const { t } = useTranslation(['project', 'common', 'validations'])
  const router = useRouter()
  const { newToast } = useToast()
  const [usersFind, setUsersFind] = useState([])
  const [allowedUsers, setAllowedUsers] = useState([])

  const { data: languages } = useGetLanguagesQuery()
  const { data: users } = useGetUsersQuery()
  const [createProject, createProjectValues] = useCreateProjectMutation()

  console.log(
    createProjectValues?.error
      ? createProjectValues.error.message.split(':')[0]
      : ''
  )

  /**
   * Setup form configuration
   */
  const methods = useForm({
    resolver: yupResolver(
      yup.object({
        name: yup.string().required(t('required', { ns: 'validations' })),
        // languageId: yup.string().required(t('required', { ns: 'validations' })),
      })
    ),
    reValidateMode: 'onSubmit',
    defaultValues: {
      name: '',
      description: '',
      consentManagement: false,
      trackReferral: false,
      villages: null,
      languageId: '',
      emergencyContentTranslations: hashStoreLanguage,
    },
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

  /**
   * Send values to data
   * @param {object} data,
   */
  const submitForm = data => {
    const cleanedAllowedUsers = allowedUsers.map(user => ({
      userId: user.id,
      isAdmin: user.isAdmin,
    }))
    createProject({ ...data, userProjectsAttributes: cleanedAllowedUsers })
  }

  useEffect(() => {
    if (createProjectValues.isSuccess) {
      newToast({
        message: t('notifications.createSuccess', { ns: 'common' }),
        status: 'success',
      })
      router.push(`/projects/${createProjectValues.data.id}`)
    }
  }, [createProjectValues.isSuccess])

  /**
   * Add user to allowedUser array
   * @param {object} user
   */
  const addUser = user => {
    setUsersFind([])
    setAllowedUsers(prev => [...prev, { ...user, isAdmin: false }])
  }

  /**
   * Remove user to allowedUser array
   * @param {object} user
   */
  const removeUser = user => {
    const newAllowedUsers = filter(allowedUsers, function (u) {
      return u.id !== user.id
    })
    setAllowedUsers(newAllowedUsers)
  }

  /**
   * Toggle admin status
   * @param {userIndex} index
   */
  const toggleAdminUser = index => {
    const tmpAllowedUsers = allowedUsers
    tmpAllowedUsers[index].isAdmin = !tmpAllowedUsers[index].isAdmin
    setAllowedUsers(tmpAllowedUsers)
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
      <Box mt={6} textAlign='center'>
        {createProjectValues.isError && (
          <Text fontSize='m' color='red'>
            {typeof createProjectValues.error.message === 'string'
              ? createProjectValues.error.message.split(':')[0]
              : createProjectValues.error.data.errors.join()}
          </Text>
        )}
      </Box>
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(submitForm)}>
          <SimpleGrid columns={2} spacing={12}>
            <VStack align='left' spacing={6}>
              <Input label={t('form.name')} name='name' isRequired />
              <SimpleGrid columns={2}>
                <Checkbox
                  label={t('form.consentManagement')}
                  name='consentManagement'
                />
                <Checkbox
                  label={t('form.trackReferral')}
                  name='trackReferral'
                />
              </SimpleGrid>
              <Textarea label={t('form.description')} name='description' />
              <FileUpload
                label={t('form.villages')}
                name='villages'
                acceptedFileTypes='application/JSON'
                hint={t('form.hintVillages')}
              />
              <Select
                label={t('form.languageId')}
                name='languageId'
                options={languages}
                valueOption='id'
                labelOption='name'
              />

              <SimpleGrid columns={1} spacing={10}>
                <Tabs>
                  <TabList>
                    {languages.map(language => (
                      <Tab key={language.code}>{language.name}</Tab>
                    ))}
                  </TabList>
                  <TabPanels>
                    {languages.map(language => (
                      <TabPanel key={language.code}>
                        <RichText
                          label={t('form.emergencyContentTranslations')}
                          name={`emergencyContentTranslations.${language.code}`}
                        />
                      </TabPanel>
                    ))}
                  </TabPanels>
                </Tabs>
              </SimpleGrid>
            </VStack>
            <VStack align='left' spacing={6}>
              <FormControl>
                <FormLabel htmlFor='users'>{t('form.searchUser')}</FormLabel>
                <ChakraInput
                  name='users'
                  placeholder='John doe | john.doe@email.com'
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

              <Text fontWeight='semibold'>{t('form.allowedUser')}</Text>
              {allowedUsers.length > 0 ? (
                <SimpleGrid columns={2} spacing={2}>
                  {allowedUsers.map((user, index) => (
                    <Box
                      borderRadius='lg'
                      boxShadow='sm'
                      height='full'
                      border='1px'
                      borderColor='sidebar'
                      display='flex'
                      flexDirection='columns'
                      p={15}
                      key={user.id}
                    >
                      <VStack alignItems='flex-start' w='full'>
                        <Text fontSize='lg'>
                          {user.firstName} {user.lastName}
                        </Text>
                        <Text>{user.email}</Text>
                        <ChakraCheckbox
                          size='sm'
                          value={user.isAdmin}
                          onChange={() => toggleAdminUser(index)}
                        >
                          {t('form.administrator')}
                        </ChakraCheckbox>
                      </VStack>
                      <IconButton
                        variant='delete'
                        fontSize={12}
                        size='xs'
                        onClick={() => removeUser(user)}
                        icon={<CloseIcon />}
                      />
                    </Box>
                  ))}
                </SimpleGrid>
              ) : (
                <Alert status='info'>
                  <AlertIcon />
                  {t('form.nobody')}
                </Alert>
              )}
            </VStack>
          </SimpleGrid>
          <Flex justifyContent='flex-end' mt={12}>
            <Button
              type='submit'
              sx={{
                position: 'fixed',
                bottom: 10,
              }}
            >
              {t('save', { ns: 'common' })}
            </Button>
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
      const languageResponse = await store.dispatch(getLanguages.initiate())
      store.dispatch(getUsers.initiate())
      await Promise.all(
        store.dispatch(apiGraphql.util.getRunningQueriesThunk())
      )

      const hashStoreLanguage = {}
      languageResponse.data.forEach(element => {
        hashStoreLanguage[element.code] = ''
      })

      // Translations
      const translations = await serverSideTranslations(locale, [
        'project',
        'common',
        'validations',
      ])

      return {
        props: {
          hashStoreLanguage,
          ...translations,
        },
      }
    }
)

NewProject.getLayout = function getLayout(page) {
  return <Layout showSideBar={false}>{page}</Layout>
}
