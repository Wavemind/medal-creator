export const TableColumns = {
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
      colSpan: '2',
    },
  ],
}
