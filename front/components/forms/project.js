/**
 * The external imports
 */
import React, { useCallback } from 'react'
import {
  SimpleGrid,
  VStack,
  Button,
  Text,
  Flex,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
} from '@chakra-ui/react'
import { useTranslation } from 'next-i18next'
import { FormProvider } from 'react-hook-form'

/**
 * The internal imports
 */
import {
  RichText,
  Input,
  Checkbox,
  Textarea,
  Select,
  FileUpload,
  MultiSelectWithAdmin,
} from '/components'
import { useGetLanguagesQuery } from '/lib/services/modules/language'
import { useGetUsersQuery } from '/lib/services/modules/user'

const ProjectForm = ({ methods, submit, setAllowedUsers, allowedUsers }) => {
  const { t } = useTranslation(['project', 'common', 'validations'])

  const { data: languages } = useGetLanguagesQuery()
  const { data: users } = useGetUsersQuery()

  /**
   * Search criteria to use for project search
   */
  const userSearchCriteria = useCallback(
    (element, term) =>
      element.firstName.toLowerCase().indexOf(term) > -1 ||
      element.lastName.toLowerCase().indexOf(term) > -1 ||
      element.email.toLowerCase().indexOf(term) > -1
  )

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(submit)}>
        <SimpleGrid columns={2} spacing={12}>
          <VStack align='left' spacing={6}>
            <Input label={t('form.name')} name='name' />
            <SimpleGrid columns={2}>
              <Checkbox
                label={t('form.consentManagement')}
                name='consentManagement'
              />
              <Checkbox label={t('form.trackReferral')} name='trackReferral' />
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
              isRequired
            />
          </VStack>
          <VStack align='left' spacing={6}>
            <MultiSelectWithAdmin
              type='users'
              elements={users}
              selectedElements={allowedUsers}
              setSelectedElements={setAllowedUsers}
              inputLabel={t('form.searchUser')}
              inputPlaceholder='John doe | john.doe@email.com'
              selectedText={t('form.allowedUser')}
              cardContent={element => (
                <React.Fragment>
                  <Text fontSize='lg'>
                    {element.firstName} {element.lastName}
                  </Text>
                  <Text>{element.email}</Text>
                </React.Fragment>
              )}
              noneSelectedText={t('form.nobody')}
              searchCriteria={userSearchCriteria}
            />
          </VStack>
        </SimpleGrid>
        <SimpleGrid columns={2} spacing={10} mt={8}>
          <Tabs>
            <TabList>
              {languages.map(language => (
                <Tab key={`emergency-content-title-${language.code}`}>
                  {language.name}
                </Tab>
              ))}
            </TabList>
            <TabPanels>
              {languages.map(language => (
                <TabPanel key={`emergency-content-content-${language.code}`}>
                  <RichText
                    label={t('form.emergencyContentTranslations')}
                    name={`emergencyContentTranslations.${language.code}`}
                  />
                </TabPanel>
              ))}
            </TabPanels>
          </Tabs>
          <Tabs>
            <TabList>
              {languages.map(language => (
                <Tab key={`study-description-title-${language.code}`}>
                  {language.name}
                </Tab>
              ))}
            </TabList>
            <TabPanels>
              {languages.map(language => (
                <TabPanel key={`study-description-content-${language.code}`}>
                  <RichText
                    label={t('form.studyDescriptionTranslations')}
                    name={`studyDescriptionTranslations.${language.code}`}
                  />
                </TabPanel>
              ))}
            </TabPanels>
          </Tabs>
        </SimpleGrid>
        <Flex justifyContent='flex-end' mt={12}>
          <Button type='submit' data-cy='submit' position='fixed' bottom={10}>
            {t('save', { ns: 'common' })}
          </Button>
        </Flex>
      </form>
    </FormProvider>
  )
}

export default ProjectForm
