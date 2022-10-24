export const TableColumns = {
  lastActivity: [
    { accessorKey: 'name', enableColumnFilter: 'false', type: 'string' },
    {
      accessorKey: 'algorithm',
      enableColumnFilter: 'false',
      type: 'string',
    },
    {
      accessorKey: 'complaintCategory',
      enableColumnFilter: 'false',
      type: 'string',
    },
    {
      accessorKey: 'lastOpened',
      enableColumnFilter: 'false',
      type: 'date',
    },
  ],
  diagnosis: [
    {
      accessorKey: 'name',
      // Header can be a function returning HTML or simple text
      header: 'Name',
      enableColumnFilter: false,
    },
    {
      accessorKey: 'complaintCategory',
      header: 'Complaint category',
    },
  ],
}
