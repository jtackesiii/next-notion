"use client"

import Link from "next/link";
import { Box, Stack, Input, InputGroup, Text, Button, ButtonGroup } from "@chakra-ui/react";
import { Select } from "chakra-react-select";
import { LuSearch } from "react-icons/lu";
import {
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getFacetedRowModel,
    getFacetedUniqueValues,
    getPaginationRowModel,
    useReactTable
    } from "@tanstack/react-table";
import { useState, useMemo, useCallback, Fragment } from "react";

const columns = [
    {
        accessorKey: 'title',
        header: 'Name',
        size: 300,
        cell: ({cell, row}) => <Link className="cell-link" href={row.original.url != null ? row.original.url : `/resources/${row.original.slug}`}>{cell.getValue()}</Link>
    },
    {
        accessorKey: 'resourceType',
        header: 'Resource Type',
        meta: {
            filterVariant: 'select',
          },
        size: 200,
        cell: (props) => <div className="cell flex italic">{props.getValue().map((resource) => <p className="resourceType" key={resource.id} data-color={resource.color}>{resource.name}</p>)}</div>,
    },
    {
        accessorKey: 'region',
        header: 'Region',
        meta: {
            filterVariant: 'select',
          },
        size: 100,
        cell: (props) => <p className="cell region">{props.getValue()}</p>,
    },
    {
        accessorKey: 'audience',
        header: 'Audience',
        meta: {
            filterVariant: 'select',
          },
        size: 100,
        cell: (props) => <div className="cell flex">{props.getValue().map((audience) => <p className="audience" key={audience.id} data-color={audience.color}>{audience.name}</p>)}</div>,
    },
    {
        accessorKey: 'discipline',
        size: 250,
        header: 'Discipline',
        meta: {
            filterVariant: 'select',
          },
        cell: (props) => <div className="cell flex">{props.getValue().map((discipline) => <p className="discipline" key={discipline.id} data-color={discipline.color}>{discipline.name}</p>)}</div>,
    },
    {
        accessorKey: 'project',
        header: 'Project',
        meta: {
            filterVariant: 'select',
          },
        size: 300,
        cell: (props) => <p className="cell project">{props.getValue()}</p>,
    },
    {
        accessorKey: 'slug',
        header: 'Slug',
        size: 100,
        cell: (props) => <p>{props.getValue()}</p>,
    },
    {
        accessorKey: 'url',
        header: 'URL',
        size: 100,
        cell: (props) => <p>{props.getValue()}</p>,
    },
    {
        accessorKey: 'description',
        header: 'Description',
        cell: (props) => <p>{props.getValue()}</p>,
    }

];

export default function DataTable({data}){
    const [columnFilters, setColumnFilters] = useState({})
    const [searchQuery, setSearchQuery] = useState("")

    const uniqueValues = useMemo(() => {
        const values = {
            resourceType: new Set(),
            audience: new Set(),
            discipline: new Set(),
            region: new Set(),
            project: new Set()
        };

        data.forEach(row => {
            // Handle arrays (resourceType, audience, discipline)
            ['resourceType', 'audience', 'discipline'].forEach(key => {
                if (Array.isArray(row[key])) {
                    row[key].forEach(item => {
                        if (item.name) {
                            values[key].add(item.name);
                        }
                    });
                }
            });
            // Handle simple string values (region, project)
            ['region', 'project'].forEach(key => {
                if (row[key]) {
                   values[key].add(row[key]);
                }
            });
        });

        return Object.fromEntries(
            Object.entries(values).map(([key, set]) => [key, Array.from(set)])
        );
    }, [data]);

    const groupedOptions = useMemo(() => {
        return Object.entries(uniqueValues).map(([group, values]) => ({
            label: group.charAt(0).toUpperCase() + group.slice(1),
            options: values.map(value => ({
                label: value,
                value: value,
                group: group
            }))
        }));
    }, [uniqueValues]);

    const filteredData = useMemo(() => {
        return data.filter(row => {
            // First check search box
            if (searchQuery) {
                const title = row.title?.toLowerCase() || "";
                const description = row.description?.toLowerCase() || "";
                if (!title.includes(searchQuery.toLowerCase()) && !description.includes(searchQuery.toLowerCase())) {
                    return false;
                }
            }

            // Then check column filters
            return Object.entries(columnFilters).every(([column, filterValue]) => {
                if (!filterValue || filterValue.length === 0) return true;
                const cellValue = row[column];

                // Handle array values (resourceType, audience, discipline)
                if (Array.isArray(cellValue)) {
                    return cellValue.some(item => filterValue.includes(item.name));
                }

                // Handle string values (region, project)
                return filterValue.includes(cellValue);
            });
        });
    }, [data, columnFilters, searchQuery]);

    const handleFilterChange = useCallback((selected) => {
        const groupedFilters = selected.reduce((acc, option) => {
            if (!acc[option.group]) {
                acc[option.group] = [];
            }
            acc[option.group].push(option.value);
            return acc;
        }, {});
        setColumnFilters(groupedFilters);
    }, []);

    const table = useReactTable({
        data: filteredData,
        columns,
        state: {
            columnFilters,
            columnVisibility: {
                slug: false,
                url: false,
                discipline: false,
                region: false,
                audience: false,
                description: false
            }
        },
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getFacetedRowModel: getFacetedRowModel(),
        getFacetedUniqueValues: getFacetedUniqueValues(),
        getPaginationRowModel: getPaginationRowModel(),
        columnResizeMode: "onChange",
        debugTable: true,
        debugHeaders: true,
        debugColumns: false,
    });

    return (
    <Box className="data-table">
        <Stack direction={{ base: "column", md: "row" }} mb={4} className="filter-bar">
            <InputGroup w="auto" startElement={<LuSearch />}>
                <Input
                    placeholder="Search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    variant="outline"
                />
            </InputGroup>
            <Box maxW="100%" flexGrow={1}>
                <Select
                    instanceId="grouped-select"
                    placeholder="Keywords"
                    isClearable
                    isMulti
                    options={groupedOptions}
                    value={Object.entries(columnFilters).flatMap(([group, values]) =>
                        values.map(value => ({
                            label: value,
                            value: value,
                            group: group
                        }))
                    )}
                    onChange={handleFilterChange}
                />
            </Box>
        </Stack>
        <Box className="table" w={table.getTotalSize()}>
            {table.getHeaderGroups().map(headerGroup => <Box className="tr" key={headerGroup.id}>
                {headerGroup.headers.map((header) =>
                    <Box className="th" w={header.getSize()} key={header.id}>
                       {header.column.columnDef.header}
                        <Box
                            onMouseDown={
                                header.getResizeHandler()
                            }
                            onTouchStart={
                                header.getResizeHandler()
                            }
                            className={
                                `resizer ${
                                    header.column.getIsResizing() ? "isResizing" : ""
                                }`
                            }
                        />
                    </Box>
                )}
            </Box>)}
            {
                table.getRowModel().rows.map(row =>
                    <Fragment key={row.id}>
                        <Box className="tr hover-parent">
                            {row.getVisibleCells().map(cell => <Box className="td" w={cell.column.getSize()} key={cell.id}>
                                {
                                    flexRender(
                                        cell.column.columnDef.cell,
                                        cell.getContext(),
                                    )
                                }
                            </Box>)}
                        </Box>
                        <Box className="tr hover-child" key={row.id + "-sub"}>
                            <Box className="td" w="100%">
                                {row.original.description}
                            </Box>
                        </Box>
                    </Fragment>)
            }
        </Box>
        <br />
        <Text mb={2}>
           Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
        </Text>
        <ButtonGroup size="sm" attached variant="outline">
            <Button
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
            >{"<"}</Button>
            <Button
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
            >{">"}</Button>
        </ButtonGroup>
    </Box>);
}
