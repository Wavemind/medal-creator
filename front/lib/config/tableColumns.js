export const TableColumns = {
  lastActivity: [
    { accessorKey: 'name', type: 'string' },
    {
      accessorKey: 'algorithm',
      type: 'string',
    },
    {
      accessorKey: 'complaintCategory',
      type: 'string',
    },
    {
      accessorKey: 'lastOpened',
      type: 'date',
    },
  ],
  algorithms: [
    {
      accessorKey: 'name',
      sortable: false,
      type: 'string',
    },
    {
      accessorKey: 'mode',
      sortable: false,
      type: 'enum',
    },
    {
      accessorKey: 'status',
      sortable: false,
      type: 'enum',
    },
    {
      accessorKey: 'updatedAt',
      sortable: false,
      type: 'date',
    },
  ],
  diagnosis: [
    {
      accessorKey: 'name',
      // Header can be a function returning HTML or simple text
      header: 'Name',
    },
    {
      accessorKey: 'complaintCategory',
      header: 'Complaint category',
    },
  ],
}
