import {
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table"
import { ArrowUpDown, ChevronDown, MoreHorizontal } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import _ from "lodash"

import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import { Skeleton } from "../ui/skeleton"
import DataFilter from "./DataFilter"
import { Filter } from "lucide-react"
import { ChevronLeft } from "lucide-react"
import { ChevronRight } from "lucide-react"
import React, { forwardRef, useEffect, useImperativeHandle, useState } from "react"
import { RefreshCcw } from "lucide-react"
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination"
import { Loader } from "lucide-react"

const DataTable = forwardRef(({
    fixedData = [],
    columns,
    apiDataSource = null,
    filterContent = null,
    showColumnFilter = false,
    recordsPerPage = 10,
    passedQueryParams = {},
    pageSizeSelection = [10, 50, 100],
    dataFilters = [],
    dataFilterAppendClass = "",
    disableSelectedRowCaption = false,
}, ref
) => {

    const [data, setData] = useState(fixedData)
    const [sorting, setSorting] = useState([])
    const [columnFilters, setColumnFilters] = useState([])
    const [columnVisibility, setColumnVisibility] = useState({})
    const [rowSelection, setRowSelection] = useState({})
    const [page, setPage] = useState(1)
    const [pageSize, setPageSize] = useState(recordsPerPage)
    const [dataSourceDetails, setDataSourceDetails] = useState({})
    const [isProcessing, setIsProcessing] = useState(false)
    const [currentFilterParams, setCurrentFilterParams] = useState({})

    useEffect(() => {
        if (_.size(fixedData) <= 0 && _.isFunction(apiDataSource)) {
            setIsProcessing(true);
            apiDataSource({
                page: page,
                perPage: pageSize,
                ...passedQueryParams,
            }).then((res) => {
                if (res.status == 200) {
                    setData(res.data?.data ?? []);
                    setDataSourceDetails(res?.data);
                }
            }).finally(() => {
                setIsProcessing(false);
            });
        }
        table.setPageSize(pageSize);
    }, [page, pageSize])

    const handlePageChange = (newPage) => {
        setPage(newPage);
    }
    const handlePageSizeChange = (value) => {
        setPage(1); // reset to 1
        setPageSize(value);
    }

    const handleSearch = (params) => {
        if (_.size(fixedData) <= 0 && _.isFunction(apiDataSource)) {
            setPage(1);
            setCurrentFilterParams(params);
            setIsProcessing(true);
            apiDataSource({
                page: 1,
                perPage: pageSize,
                ...passedQueryParams,
                ...params,
            }).then((res) => {
                if (res.status == 200) {
                    setData(res.data?.data ?? []);
                    setDataSourceDetails(res?.data);
                }
            }).finally(() => {
                setIsProcessing(false);
            });
        }
        table.setPageSize(pageSize);
    };

    const refreshData = () => {
        table.resetRowSelection();
        if (_.isFunction(apiDataSource)) {
            setPage(1); //reset to 1
            setIsProcessing(true);
            apiDataSource({
                page: 1,
                perPage: pageSize,
                ...passedQueryParams,
                ...currentFilterParams,
            }).then((res) => {
                if (res.status == 200) {
                    setData(res.data?.data ?? []);
                    setDataSourceDetails(res?.data);
                }
            }).finally(() => {
                setIsProcessing(false);
            });
        }
    };

    useImperativeHandle(ref, () => ({
        refresh() {
            refreshData();
        },
    }));

    const table = useReactTable({
        data,
        columns,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        state: {
            sorting,
            columnFilters,
            columnVisibility,
            rowSelection,
        },
    })

    return (
        <div className="w-full">
            <div>
                <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="item-1">
                        <AccordionTrigger>Filter Results</AccordionTrigger>
                        <AccordionContent className="p-4">
                            <DataFilter filters={dataFilters} filterParamCb={(params) => handleSearch(params)} appendClass={dataFilterAppendClass} />
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
            </div>

            <div className="flex items-center py-4">
                {_.isFunction(filterContent) && filterContent(table)}

                <Select
                    onValueChange={(value) => handlePageSizeChange(value)}
                    defaultValue={pageSize}
                >
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select Page Size" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            {_.size(pageSizeSelection) && pageSizeSelection.map((pageSize, p) => (
                                <SelectItem value={pageSize} key={p}>{pageSize} records per page</SelectItem>
                            ))}
                        </SelectGroup>
                    </SelectContent>
                </Select>
                
                {showColumnFilter && (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" className="ml-auto">
                                Columns <ChevronDown />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            {table
                                .getAllColumns()
                                .filter((column) => column.getCanHide())
                                .map((column) => {
                                    return (
                                        <DropdownMenuCheckboxItem
                                            key={column.id}
                                            className="capitalize"
                                            checked={column.getIsVisible()}
                                            onCheckedChange={(value) =>
                                                column.toggleVisibility(!!value)
                                            }
                                        >
                                            {column.id}
                                        </DropdownMenuCheckboxItem>
                                    )
                                })}
                        </DropdownMenuContent>
                    </DropdownMenu>
                )}
                <Button variant="outline" className="ml-2" onClick={refreshData}>
                    <RefreshCcw />
                </Button>
            </div>
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead key={header.id}>
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext()
                                                )}
                                        </TableHead>
                                    )
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {isProcessing ? (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-24 text-center">
                                    <div className="flex justify-center items-center py-12">
                                        <Loader className="animate-spin h-8 w-8 text-primary" />
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : (
                            <>
                                {table.getRowModel().rows?.length ? (
                                    table.getRowModel().rows.map((row, index) => (
                                        <TableRow
                                            key={row.id}
                                            data-state={row.getIsSelected() && "selected"}
                                            className={`
                                                ${index % 2 === 0 ? "table-row-even" : "table-row-odd"}
                                                ${row.getIsSelected() ? "table-row-selected" : ""}
                                                ${row.getIsSelected() && "table-row-selected-hover"}
                                                table-row-hover`
                                            }
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
                                            No results.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </>
                        )}
                    </TableBody>
                </Table>
            </div>
            <div className="flex items-center justify-between space-x-2 py-4">
                {!disableSelectedRowCaption && (
                    <div className="flex-1 text-sm text-muted-foreground">
                        {table.getFilteredSelectedRowModel().rows.length} of{" "}
                        {table.getFilteredRowModel().rows.length} row(s) selected.
                    </div>
                )}
                {_.isFunction(apiDataSource) && (
                    <div className="text-sm text-muted-foreground">
                        Showing results {dataSourceDetails?.from}-{dataSourceDetails?.to} of {dataSourceDetails?.total}
                    </div>
                )}
                <div className="space-x-2">
                    <Pagination>
                        <PaginationContent>
                            <PaginationItem>
                                <PaginationPrevious
                                    onClick={() => page > 1 && handlePageChange(page - 1)}
                                    className={page === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                                />
                            </PaginationItem>

                            {/* Render page numbers with ellipses */}
                            {_.isFunction(apiDataSource) && (
                                Array.from({ length: dataSourceDetails?.lastPage || 0 }, (_, index) => index + 1)
                                    .filter((pageNumber) => {
                                        return (
                                            pageNumber === 1 ||
                                            pageNumber === dataSourceDetails?.lastPage ||
                                            (pageNumber >= page - 2 && pageNumber <= page + 2)
                                        );
                                    })
                                    .map((pageNumber, index, filteredPages) => (
                                        <React.Fragment key={pageNumber}>
                                            {index > 0 && pageNumber !== filteredPages[index - 1] + 1 && (
                                                <PaginationEllipsis />
                                            )}
                                            <PaginationItem>
                                                <PaginationLink
                                                    onClick={() => handlePageChange(pageNumber)}
                                                    className={page === pageNumber ? "font-bold text-primary" : "cursor-pointer"}
                                                >
                                                    {pageNumber}
                                                </PaginationLink>
                                            </PaginationItem>
                                        </React.Fragment>
                                    ))
                            )}

                            <PaginationItem>
                                <PaginationNext
                                    onClick={() => page < dataSourceDetails?.lastPage && handlePageChange(page + 1)}
                                    className={page === dataSourceDetails?.lastPage ? "pointer-events-none opacity-50" : "cursor-pointer"}
                                />
                            </PaginationItem>
                        </PaginationContent>
                    </Pagination>
                </div>
            </div>
        </div>
    )
});

export default DataTable;
