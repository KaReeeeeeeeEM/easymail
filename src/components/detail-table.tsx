import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";

export type DetailTableRow = {
  label: string;
  value: React.ReactNode;
};

export function DetailTable({ rows }: { rows: DetailTableRow[] }) {
  return (
    <div className="mt-4 overflow-hidden rounded-lg border">
      <Table>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.label}>
              <TableCell className="w-2/5 bg-muted/40 font-medium text-muted-foreground sm:w-1/3">
                {row.label}
              </TableCell>
              <TableCell className="break-words font-medium">
                {row.value}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
