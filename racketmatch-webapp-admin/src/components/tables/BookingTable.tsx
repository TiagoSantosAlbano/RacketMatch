import { Booking } from '../../models/booking';
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';

interface BookingTableProps {
  data: Booking[];
}

export const BookingTable = ({ data }: BookingTableProps) => {
  const columns: ColumnDef<Booking>[] = [
    { accessorKey: 'court', header: 'Court' },
    { accessorKey: 'user', header: 'User' },
    { accessorKey: 'date', header: 'Date' },
    { accessorKey: 'time', header: 'Time' },
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