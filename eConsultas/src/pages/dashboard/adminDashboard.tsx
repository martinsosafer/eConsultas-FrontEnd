"use client"

import * as React from "react"
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { ArrowUpDown, MoreHorizontal } from "lucide-react"
import  Button  from "@/components/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Medico, Paciente } from "@/api/models/models"

export const medicoColumns: ColumnDef<Medico>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
        className="text-primary-dark border-gray-400"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
        className="text-primary-dark border-gray-400"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "nombre",
    header: "Nombre",
  },
  {
    accessorKey: "especialidad",
    header: "Especialidad",
  },
  {
    accessorKey: "sueldo",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="text-primary-dark hover:bg-primary-light"
      >
        Sueldo
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const sueldo = parseFloat(row.getValue("sueldo"))
      return (
        <div className="text-right font-medium">
          {new Intl.NumberFormat("es-MX", {
            style: "currency",
            currency: "MXN",
          }).format(sueldo)}
        </div>
      )
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const medico = row.original

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Abrir menú</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-white border-primary-light">
            <DropdownMenuLabel className="text-primary-dark">Acciones</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(medico.id)}
              className="hover:bg-primary-light"
            >
              Copiar ID
            </DropdownMenuItem>
            <DropdownMenuItem className="hover:bg-primary-light">
              Ver detalles
            </DropdownMenuItem>
            <DropdownMenuItem className="hover:bg-primary-light">
              Editar
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]

export const pacienteColumns: ColumnDef<Paciente>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
        className="text-primary-dark border-gray-400"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
        className="text-primary-dark border-gray-400"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "nombre",
    header: "Nombre",
  },
  {
    accessorKey: "obraSocial",
    header: "Obra Social",
  },
  {
    accessorKey: "dni",
    header: "DNI",
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const paciente = row.original

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Abrir menú</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-white border-primary-light">
            <DropdownMenuLabel className="text-primary-dark">Acciones</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(paciente.id)}
              className="hover:bg-primary-light"
            >
              Copiar ID
            </DropdownMenuItem>
            <DropdownMenuItem className="hover:bg-primary-light">
              Ver historial
            </DropdownMenuItem>
            <DropdownMenuItem className="hover:bg-primary-light">
              Editar
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]

interface DataTableProps<TData> {
  columns: ColumnDef<TData>[]
  data: TData[]
}

export function DataTable<TData>({ columns, data }: DataTableProps<TData>) {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [rowSelection, setRowSelection] = React.useState({})

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      rowSelection,
    },
  })

  return (
    <div className="w-full">
      <div className="flex items-center py-4">
        <Input
          placeholder="Filtrar por nombre..."
          value={(table.getColumn("nombre")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("nombre")?.setFilterValue(event.target.value)
          }
          className="max-w-sm border-primary-light focus:ring-2 focus:ring-primary"
        />
      </div>
      <div className="rounded-md border border-primary-light">
        <Table>
          <TableHeader className="bg-primary-dark">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} className="text-white">
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className="hover:bg-primary-lightest"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No hay resultados.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-primary-dark">
          {table.getFilteredSelectedRowModel().rows.length} de{" "}
          {table.getFilteredRowModel().rows.length} filas seleccionadas
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="border-primary-dark text-primary-dark hover:bg-primary-light"
          >
            Anterior
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="border-primary-dark text-primary-dark hover:bg-primary-light"
          >
            Siguiente
          </Button>
        </div>
      </div>
    </div>
  )
}


export const DynamicDataTable = () => {
  const [selectedType, setSelectedType] = React.useState<"medico" | "paciente">("medico")
  
  const mockMedicos: Medico[] = [
    {
      id: "1",
      nombre: "Dr. Juan Pérez",
      especialidad: "Cardiología",
      sueldo: 50000,

    }
  ]

  const mockPacientes: Paciente[] = [
    {
      id: "1",
      nombre: "María García",
      obraSocial: "Seguro Popular",
      dni: "12345678"
    }
  ]

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg">
      <div className="mb-6">

        <div className="flex gap-4 mb-4">
          <Button
            variant={selectedType === "medico" ? "primary" : "secondary"}
            onClick={() => setSelectedType("medico")}
          >
            Médicos
          </Button>
          <Button
            variant={selectedType === "paciente" ? "primary" : "secondary"}
            onClick={() => setSelectedType("paciente")}
          >
            Pacientes
          </Button>
        </div>
      </div>

      {selectedType === "medico" ? (
        <DataTable
          columns={medicoColumns}
          data={mockMedicos}
        />
      ) : (
        <DataTable
          columns={pacienteColumns}
          data={mockPacientes}
        />
      )}
    </div>
  )
}