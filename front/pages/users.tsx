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
import { getServerSession } from 'next-auth'
import type { GetServerSidePropsContext } from 'next'

/**
 * The internal imports
 */
import Layout from '@/lib/layouts/default'
import { ModalContext, AlertDialogContext } from '@/lib/contexts'
import { UserForm, Page, DataTable, MenuCell } from '@/components'
import { wrapper } from '@/lib/store'
import { formatDate } from '@/lib/utils'
import {
  useLazyGetUsersQuery,
  useLockUserMutation,
  useUnlockUserMutation,
} from '@/lib/api/modules'
import { authOptions } from './api/auth/[...nextauth]'
import { Role } from '@/lib/config/constants'
import type { RenderItemFn } from '@/types'
import type { User } from '@/types/graphql'

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
      title: t('new'),
      content: <UserForm />,
    })
  }

  /**
   * Callback to handle the unlock of a user
   */
  const onUnLock = useCallback(
    (id: string) => {
      openAlertDialog({
        title: t('unlock'),
        content: t('areYouSure', { ns: 'common' }),
        action: () => unlockUser({ id }),
      })
    },
    [t]
  )

  /**
   * Callback to handle the lock of a user
   */
  const onLock = useCallback(
    (id: string) => {
      openAlertDialog({
        title: t('lock'),
        content: t('areYouSure', { ns: 'common' }),
        action: () => lockUser({ id }),
      })
    },
    [t]
  )

  /**
   * Callback to open the modal to edit the user
   */
  const onEdit = useCallback((id: string) => {
    openModal({
      title: t('edit'),
      content: <UserForm id={Number(id)} />,
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
            {row.email || ''}
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
            itemId={Number(row.id)}
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
            {t('new')}
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
  () =>
    async ({ locale, req, res }: GetServerSidePropsContext) => {
      if (typeof locale === 'string') {
        const session = await getServerSession(req, res, authOptions)

        if (session) {
          // Only admin user can access to this page
          if (session.user.role !== Role.admin) {
            return {
              redirect: {
                destination: '/',
                permanent: false,
              },
            }
          }

          // Translations
          const translations = await serverSideTranslations(locale, [
            'common',
            'users',
            'validations',
            'datatable',
          ])

          return {
            props: {
              ...translations,
            },
          }
        }
      }
      return {
        redirect: {
          destination: '/500',
          permanent: false,
        },
      }
    }
)
