/**
 * The external imports
 */
import { useContext, useCallback, ReactElement } from 'react'
import {
  Heading,
  Button,
  HStack,
  Box,
  Tr,
  Td,
  Icon,
  Tooltip,
  Highlight,
} from '@chakra-ui/react'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useTranslation } from 'next-i18next'
import { AiOutlineLock } from 'react-icons/ai'
import {
  GetServerSidePropsContext,
  NextApiRequest,
  NextApiResponse,
} from 'next'

/**
 * The internal imports
 */
import Layout from '@/lib/layouts/default'
import { ModalContext, AlertDialogContext } from '@/lib/contexts'
import { UserForm, Page, DataTable, MenuCell } from '@/components'
import { wrapper } from '@/lib/store'
import { setSession } from '@/lib/store/session'
import { apiGraphql } from '@/lib/services/apiGraphql'
import getUserBySession from '@/lib/utils/getUserBySession'
import { formatDate } from '@/lib/utils/date'
import {
  useLazyGetUsersQuery,
  useLockUserMutation,
  useUnlockUserMutation,
} from '@/lib/services/modules/user'
import type { RenderItemFn } from '@/types/datatable'
import { User } from '@/types/user'

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
      content: <UserForm />,
      size: 'xl',
    })
  }

  /**
   * Callback to handle the unlock of a user
   */
  const onUnLock = useCallback(
    (userId: number) => {
      openAlertDialog({
        title: t('unlock'),
        content: t('areYouSure', { ns: 'common' }),
        action: () => unlockUser(userId),
      })
    },
    [t]
  )

  /**
   * Callback to handle the lock of a user
   */
  const onLock = useCallback(
    (userId: number) => {
      openAlertDialog({
        title: t('lock'),
        content: t('areYouSure', { ns: 'common' }),
        action: () => lockUser(userId),
      })
    },
    [t]
  )

  /**
   * Callback to open the modal to edit the user
   */
  const onEdit = useCallback((userId: number) => {
    openModal({
      title: t('update'),
      content: <UserForm id={userId} />,
      size: 'xl',
    })
  }, [])

  const userRow = useCallback<RenderItemFn<User>>(
    (row, searchTerm) => (
      <Tr data-cy='datatable_row'>
        <Td>
          <Highlight query={searchTerm} styles={{ bg: 'red.100' }}>
            {`${row.firstName} ${row.lastName}`}
          </Highlight>
        </Td>
        <Td>
          <Highlight query={searchTerm} styles={{ bg: 'red.100' }}>
            {row.email}
          </Highlight>
        </Td>
        <Td>{t(`roles.${row.role}`)}</Td>
        <Td>
          {row.lockedAt && (
            <Tooltip
              hasArrow
              label={formatDate(new Date(row.lockedAt))}
              fontSize='md'
            >
              <span>
                <Icon
                  data-cy='datatable_row_lock'
                  as={AiOutlineLock}
                  h={6}
                  w={6}
                />
              </span>
            </Tooltip>
          )}
        </Td>
        <Td>
          <MenuCell
            itemId={row.id}
            onEdit={() => onEdit(row.id)}
            onLock={!row.lockedAt ? () => onLock(row.id) : undefined}
            onUnlock={row.lockedAt ? () => onUnLock(row.id) : undefined}
          />
        </Td>
      </Tr>
    ),
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

Users.getLayout = function getLayout(page: ReactElement) {
  return <Layout showSideBar={false}>{page}</Layout>
}

export const getServerSideProps = wrapper.getServerSideProps(
  store =>
    async ({ locale, req, res }: GetServerSidePropsContext) => {
      const currentUser = getUserBySession(
        req as NextApiRequest,
        res as NextApiResponse
      )

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
      await Promise.all(
        store.dispatch(apiGraphql.util.getRunningQueriesThunk())
      )

      // Translations
      const translations = await serverSideTranslations(locale as string, [
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
