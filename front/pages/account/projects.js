/**
 * The external imports
 */
import { useMemo } from 'react'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import Image from 'next/image'
import { useTranslation } from 'next-i18next'
import {
  Heading,
  Text,
  SimpleGrid,
  GridItem,
  Menu,
  MenuItem,
  MenuButton,
  MenuList,
  IconButton,
  HStack,
} from '@chakra-ui/react'

/**
 * The internal imports
 */
import Layout from '/lib/layouts/default'
import logoDynamic from '/public/logoDynamic.svg'
import logoTimci from '/public/logoTimci.svg'
import { OverflowMenuIcon } from '/assets/icons'
import { Page } from '/components'

export default function Projects() {
  const { t } = useTranslation('account')

  // TODO Get these from the store or the DB
  const accountProjects = useMemo(
    () => [
      { id: 1, title: 'Dynamic Tanzania', type: 'dynamic' },
      { id: 2, title: 'Dynamic Tanzania', type: 'dynamic' },
      { id: 3, title: 'Dynamic Tanzania', type: 'dynamic' },
      { id: 4, title: 'Dynamic Tanzania', type: 'dynamic' },
      { id: 5, title: 'Dynamic Tanzania', type: 'dynamic' },
      { id: 6, title: 'TIMCI Tanzania', type: 'timci' },
      { id: 7, title: 'TIMCI Tanzania', type: 'timci' },
    ],
    []
  )

  // TODO find out what options there are in the menu
  return (
    <Page title={t('projects.title')}>
      <Heading mb={10}>{t('projects.header')}</Heading>
      <SimpleGrid minChildWidth={200} spacing={20}>
        {accountProjects.map(project => (
          <GridItem
            as='div'
            key={`project_${project.id}`}
            w={200}
            h={200}
            borderRadius='lg'
            boxShadow={'0px 4px 8px rgba(0, 0, 0, 0.15)'}
            display='flex'
            flexDirection='column'
            alignItems='center'
            justifyContent='space-between'
            px={5}
            pt={2}
            pb={5}
          >
            <HStack w='full' justifyContent='flex-end'>
              <Menu>
                <MenuButton as={IconButton} variant='ghost'>
                  <OverflowMenuIcon />
                </MenuButton>
                <MenuList>
                  <MenuItem>{t('projects.remove')}</MenuItem>
                </MenuList>
              </Menu>
            </HStack>
            <Image
              src={project.type === 'dynamic' ? logoDynamic : logoTimci}
              width='100'
              height='100'
            />
            <Text>{project.title}</Text>
          </GridItem>
        ))}
      </SimpleGrid>
    </Page>
  )
}

Projects.getLayout = function getLayout(page) {
  return <Layout menuType='account'>{page}</Layout>
}

export const getServerSideProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale, ['common', 'account', 'submenu'])),
  },
})
