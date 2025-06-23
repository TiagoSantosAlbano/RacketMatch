
import { Payment } from '../../models/payment';
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';

interface PaymentTableProps {
  data: Payment[];
}

export const PaymentTable = ({ data }: PaymentTableProps) => {
  const columns: ColumnDef<Payment>[] = [
    { accessorKey: 'user.username', header: 'User' },
    { accessorKey: 'court.name', header: 'Court' },
    { accessorKey: 'matchPartner.username', header: 'Partner' },
    { accessorKey: 'totalPrice', header: 'Total (€)' },
    { accessorKey: 'commission', header: 'Commission (€)' },
    { accessorKey: 'clubRevenue', header: 'Club Revenue (€)' },
    { accessorKey: 'day', header: 'Day' },
    { accessorKey: 'hour', header: 'Hour' },
    { accessorKey: 'approvedBy.name', header: 'Approved By' },
  ];

  const table = useReactTable({ data, columns, getCoreRowModel: getCoreRowModel() });

  return (
    <div className="rounded border p-4">
      <table className="w-full">
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id} className="border-b">
              {headerGroup.headers.map((header) => (
                <th key={header.id} className="p-2 text-left">
                  {flexRender(header.column.columnDef.header, header.getContext())}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id} className="border-b">
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id} className="p-2">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
