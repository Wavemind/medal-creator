/**
 * The external imports
 */
import { useContext, useCallback } from 'react'
import {
  Heading,
  Button,
  HStack,
  Box,
  Tr,
  Td,
  Icon,
  Tooltip,
} from '@chakra-ui/react'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useTranslation } from 'next-i18next'
import { AiOutlineLock } from 'react-icons/ai'
import { formatDate } from '/lib/utils/date'

/**
 * The internal imports
 */
import Layout from '/lib/layouts/default'
import { ModalContext, AlertDialogContext } from '/lib/contexts'
import { CreateUserForm, Page, DataTable, MenuCell } from '/components'
import { wrapper } from '/lib/store'
import { setSession } from '/lib/store/session'
import { getProjects } from '/lib/services/modules/project'
import { apiGraphql } from '/lib/services/apiGraphql'
import getUserBySession from '/lib/utils/getUserBySession'
import {
  useLazyGetUsersQuery,
  useLockUserMutation,
  useUnlockUserMutation,
} from '/lib/services/modules/user'

export default function Users() {
  const { t } = useTranslation('users')
  const { openModal } = useContext(ModalContext)
  const { openAlertDialog } = useContext(AlertDialogContext)

  const [lockUser] = useLockUserMutation()
  const [unlockUser] = useUnlockUserMutation()

  /**
   * Opens the new user form in a modal
   */
  const handleOpenModal = () => {
    openModal({
      title: t('create'),
      content: <CreateUserForm />,
      size: 'xl',
    })
  }

  /**
   * Callback to handle the unlock of a user
   */
  const onUnLock = useCallback(
    userId => {
      openAlertDialog(t('unlock'), t('areYouSure', { ns: 'common' }), () =>
        unlockUser(userId)
      )
    },
    [t]
  )

  /**
   * Callback to handle the lock of a user
   */
  const onLock = useCallback(
    userId => {
      openAlertDialog(t('lock'), t('areYouSure', { ns: 'common' }), () =>
        lockUser(userId)
      )
    },
    [t]
  )

  const userRow = useCallback(
    row => {
      return (
        <Tr data-cy='datatable_row'>
          <Td>
            {row.firstName} {row.lastName}
          </Td>
          <Td>{row.email}</Td>
          <Td>{t(`roles.${row.role}`)}</Td>
          <Td>
            {row.lockedAt && (
              <Tooltip
                hasArrow
                label={formatDate(new Date(row.lockedAt))}
                fontSize='md'
              >
                <span>
                  <Icon as={AiOutlineLock} h={6} w={6} />
                </span>
              </Tooltip>
            )}
          </Td>
          <Td>
            <MenuCell
              itemId={row.id}
              onEdit={() => console.log('Edit !')}
              onLock={!row.lockedAt ? () => onLock(row.id) : false}
              onUnlock={row.lockedAt ? () => onUnLock(row.id) : false}
            />
          </Td>
        </Tr>
      )
    },
    [t]
  )

  return (
    <Page title={t('title')}>
      <Box mx={32}>
        <HStack justifyContent='space-between' mb={12}>
          <Heading variant='h1'>{t('heading')}</Heading>
          <Button
            data-cy='new_user'
            onClick={handleOpenModal}
            variant='outline'
          >
            {t('create')}
          </Button>
        </HStack>

        <DataTable
          source='users'
          searchable
          apiQuery={useLazyGetUsersQuery}
          renderItem={userRow}
          perPage={10}
        />
      </Box>
    </Page>
  )
}

Users.getLayout = function getLayout(page) {
  return <Layout showSideBar={false}>{page}</Layout>
}

export const getServerSideProps = wrapper.getServerSideProps(
  store =>
    async ({ locale, req, res }) => {
      const currentUser = getUserBySession(req, res)

      // Only admin user can access to this page
      if (currentUser.role !== 'admin') {
        return {
          redirect: {
            destination: '/',
            permanent: false,
          },
        }
      }

      await store.dispatch(setSession(currentUser))
      // Need to get projects to be able to assign projects to a new user
      store.dispatch(getProjects.initiate())
      await Promise.all(
        store.dispatch(apiGraphql.util.getRunningQueriesThunk())
      )

      // Translations
      const translations = await serverSideTranslations(locale, [
        'common',
        'users',
        'validations',
        'datatable',
      ])

      return {
        props: {
          isAdmin: currentUser.role === 'admin',
          ...translations,
        },
      }
    }
)
