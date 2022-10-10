/**
 * The external imports
 */
import React, { useMemo } from 'react'
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
import Image from 'next/future/image'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'

/**
 * The internal imports
 */
import { Page } from '/components'
import logoDynamic from '/public/logoDynamic.svg'
import logoTimci from '/public/logoTimci.svg'
import { OverflowMenuIcon } from '/assets/icons'
import BareLayout from '/lib/layouts/bare'

export default function Home() {
  const { t } = useTranslation('home')

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

  return (
    <Page title={t('title')}>
      <Heading variant='h1' mb={10}>
        {t('title')}
      </Heading>
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

Home.getLayout = function getLayout(page) {
  return <BareLayout>{page}</BareLayout>
}

export const getServerSideProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale, ['home', 'common'])),
  },
})
