export const TableColumns = {
  diagnosis: [
    {
      accessorKey: "name",
      // Header can be a function returning HTML
      header: () => <span>Name</span>,
    },
    {
      accessorKey: "complaintCategory",
      // Header can be simple text
      header: "Complaint category",
    },
  ],
};
