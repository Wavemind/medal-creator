/**
 * The external imports
 */
import { useMemo } from 'react'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import Image from 'next/image'
import { useTranslation } from 'next-i18next'
import {
  Box,
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

export default function Projects() {
  const { t } = useTranslation('account')

  // TODO Get these from the store or the DB
  const accountProjects = useMemo(
    () => [
      { title: 'Dynamic Tanzania', type: 'dynamic' },
      { title: 'Dynamic Tanzania', type: 'dynamic' },
      { title: 'Dynamic Tanzania', type: 'dynamic' },
      { title: 'Dynamic Tanzania', type: 'dynamic' },
      { title: 'Dynamic Tanzania', type: 'dynamic' },
      { title: 'TIMCI Tanzania', type: 'timci' },
      { title: 'TIMCI Tanzania', type: 'timci' },
    ],
    []
  )

  // TODO find out what options there are in the menu
  return (
    <Box>
      <Heading mb={10}>{t('projects.title')}</Heading>
      <SimpleGrid minChildWidth={200} spacing={20}>
        {accountProjects.map((project) => (
          <GridItem
            as='button'
            w={200}
            h={200}
            borderRadius='8px'
            boxShadow={'0px 4px 8px rgba(0, 0, 0, 0.15)'}
            display='flex'
            flexDirection='column'
            alignItems='center'
            justifyContent='space-between'
            px={5}
            pt={2}
            pb={5}
            onClick={() => console.log('project clicked')}
          >
            <HStack w='full' justifyContent='flex-end'>
              <Menu>
                <MenuButton as={IconButton} variant='ghost'>
                  <OverflowMenuIcon />
                </MenuButton>
                <MenuList>
                  <MenuItem>{t('details')}</MenuItem>
                  <MenuItem>{t('edit')}</MenuItem>
                  <MenuItem>{t('duplicate')}</MenuItem>
                  <MenuItem>{t('delete')}</MenuItem>
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
    </Box>
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
