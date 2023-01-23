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
    },
    {
      accessorKey: 'mode',
      sortable: false,
    },
    {
      accessorKey: 'status',
      sortable: false,
    },
    {
      accessorKey: 'updatedAt',
      sortable: false,
      colSpan: 3,
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
