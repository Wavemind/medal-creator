/**
 * The external imports
 */
import React from 'react'
import {
  SimpleGrid,
  VStack,
  Button,
  Flex,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Spinner,
} from '@chakra-ui/react'
import { useTranslation } from 'next-i18next'

/**
 * The internal imports
 */
import RichText from '../inputs/richText'
import Input from '@/components/inputs/input'
import Checkbox from '../inputs/checkbox'
import Textarea from '../inputs/textarea'
import Select from '../inputs/select'
import FileUpload from '../inputs/fileUpload'
import AddUsersToProject from '../inputs/addUsersToProject'
import { useGetLanguagesQuery } from '@/lib/api/modules/enhanced/language.enhanced'
import type { ProjectFormComponent } from '@/types'

const ProjectForm: ProjectFormComponent = ({
  setAllowedUsers,
  allowedUsers,
}) => {
  const { t } = useTranslation('project')

  const { data: languages, isSuccess } = useGetLanguagesQuery()

  if (isSuccess) {
    return (
      <React.Fragment>
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
            <AddUsersToProject
              allowedUsers={allowedUsers}
              setAllowedUsers={setAllowedUsers}
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
                    label={t('form.studyDescriptionTranslations', {
                      ns: 'project',
                    })}
                    name={`studyDescriptionTranslations.${language.code}`}
                  />
                </TabPanel>
              ))}
            </TabPanels>
          </Tabs>
        </SimpleGrid>
        <Flex justifyContent='flex-end' mt={12}>
          <Button
            type='submit'
            data-cy='submit'
            position='fixed'
            bottom={10}
            zIndex={10}
          >
            {t('save', { ns: 'common' })}
          </Button>
        </Flex>
      </React.Fragment>
    )
  }

  return <Spinner size='xl' />
}

export default ProjectForm
