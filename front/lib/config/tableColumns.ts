/**
 * Type definitions
 */
export interface Column {
  accessorKey: string
  colSpan?: number
}

interface ITableColumns {
  [key: string]: Column[]
}

export const TableColumns: ITableColumns = {
  lastActivities: [
    {
      accessorKey: 'name',
    },
    {
      accessorKey: 'algorithm',
    },
    {
      accessorKey: 'complaintCategory',
    },
    {
      accessorKey: 'updatedAt',
    },
  ],
  algorithms: [
    {
      accessorKey: 'name',
    },
    {
      accessorKey: 'mode',
    },
    {
      accessorKey: 'status',
    },
    {
      accessorKey: 'updatedAt',
      colSpan: 3,
    },
  ],
  decisionTrees: [
    {
      accessorKey: 'name',
    },
    {
      accessorKey: 'complaintCategory',
      colSpan: 2,
    },
  ],
  users: [
    {
      accessorKey: 'name',
    },
    {
      accessorKey: 'email',
    },
    {
      accessorKey: 'role',
    },
    {
      accessorKey: 'access',
      colSpan: 2,
    },
  ],
}
