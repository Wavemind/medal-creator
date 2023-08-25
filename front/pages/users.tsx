/**
 * The external imports
 */
import { useCallback, ReactElement } from 'react'
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
import UserForm from '@/components/forms/user'
import Page from '@/components/page'
import DataTable from '@/components/table/datatable'
import MenuCell from '@/components/table/menuCell'
import { wrapper } from '@/lib/store'
import { formatDate } from '@/lib/utils/date'
import {
  useLazyGetUsersQuery,
  useUnlockUserMutation,
  useLockUserMutation,
} from '@/lib/api/modules/enhanced/user.enhanced'
import { authOptions } from '@/pages/api/auth/[...nextauth]'
import { useAlertDialog, useModal } from '@/lib/hooks'
import { RenderItemFn, RoleEnum, Scalars, User } from '@/types'

export default function Users() {
  const { t } = useTranslation('users')
  const { open: openModal } = useModal()
  const { open: openAlertDialog } = useAlertDialog()

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
    (id: Scalars['ID']) => {
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
    (id: Scalars['ID']) => {
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
  const onEdit = useCallback((id: Scalars['ID']) => {
    openModal({
      title: t('edit'),
      content: <UserForm id={id} />,
      size: 'xl',
    })
  }, [])

  const userRow = useCallback<RenderItemFn<User>>(
    (row, searchTerm) => (
      <Tr data-testid={`datatable-row-${row.id}`}>
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
        <Td>{t(`roles.${row.role}`, { defaultValue: '' })}</Td>
        <Td>
          {row.lockedAt && (
            <Tooltip
              hasArrow
              label={formatDate(new Date(row.lockedAt))}
              fontSize='md'
            >
              <span>
                <Icon
                  data-testid={`datatable-row-lock-${row.id}`}
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
            data-testid='new-user'
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
          if (session.user.role !== RoleEnum.Admin) {
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
