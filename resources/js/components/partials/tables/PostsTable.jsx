"use client"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import dayjs from "dayjs"

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import DataTable from "@/components/partials/DataTable"
import { fetchPosts } from "@/API/Blog"
import { visit } from "@/Utils/Functions"
import { Badge } from "@/components/ui/badge"
import { View } from "lucide-react"
import { PenLineIcon } from "lucide-react"
import { PlusCircle } from "lucide-react"
import { ExternalLink } from "lucide-react"
import { useRef, useState } from "react"
import { useToast } from "@/hooks/use-toast"
import { isEmpty } from "lodash"

export function PostsTable() {

    const [selectedIds, setSelectedIds] = useState([]);
    const { toast } = useToast();

    const columns = [
        {
            id: "select",
            header: ({ table }) => (
                <Checkbox
                    checked={
                        table.getIsAllPageRowsSelected() ||
                        (table.getIsSomePageRowsSelected() && "indeterminate")
                    }
                    onCheckedChange={(value) => {
                        table.toggleAllPageRowsSelected(!!value)
                        if (!!value && !isEmpty(table.getFilteredRowModel().rows)) {
                            setSelectedIds(table.getFilteredRowModel().rows.map((row) => row.id));
                        } else {
                            setSelectedIds([]);
                        }
                    }}
                    aria-label="Select all"
                />
            ),
            cell: ({ row }) => (
                <Checkbox
                    checked={row.getIsSelected()}
                    onCheckedChange={(value) => {
                        setSelectedIds(value ? [...selectedIds, row.original.id] : selectedIds.filter((id) => id !== row.original.id))
                        row.toggleSelected(!!value)
                    }}
                    aria-label="Select row"
                />
            ),
            enableSorting: false,
            enableHiding: false,
        },
        {
            accessorKey: "title",
            header: "Title",
            cell: ({ row }) => (
                <div className="capitalize">{row.getValue("title")}</div>
            ),
        },
        {
            accessorKey: "user",
            header: "Author/User",
            cell: ({ row }) => (
                <div className="capitalize">{row.original?.user?.fullName}</div>
            ),
        },
        {
            accessorKey: "commentsCount",
            header: "Comments Count",
            cell: ({ row }) => (
                <div className="capitalize">{row.getValue("commentsCount")}</div>
            ),
        },
        {
            accessorKey: "isActive",
            header: "Is Active",
            cell: ({ row }) => (
                <Badge variant={row.getValue("isActive") == 1 ? "primary" : "destructive"}>
                    {row.getValue("isActive") == 1 ? "YES" : "NO"} 
                </Badge>
            ),
        },
        {
            accessorKey: "createdAt",
            header: "Created At",
            cell: ({ row }) => (
                <div>{dayjs(row.getValue("createdAt")).format('YYYY-MM-DD HH:mm:ss')}</div>
            ),
        },
        {
            accessorKey: "updatedAt",
            header: "Updated At",
            cell: ({ row }) => (
                <div>{dayjs(row.getValue("updatedAt")).format('YYYY-MM-DD HH:mm:ss')}</div>
            ),
        },
        {
            id: "actions",
            header: "Actions",
            enableHiding: false,
            cell: ({ row }) => {
                const data = row.original
                return (
                    <>
                        <Button
                            size="sm"
                            variant="outline" 
                            onClick={(e) => visit(e, 'blogs.posts.show', 'GET', {post: data.id})}
                        >
                            <ExternalLink />
                            Post Link
                        </Button>

                        <Button
                            size="sm"
                            style={{ marginLeft: "0.5rem" }}
                            variant="outline" 
                            onClick={(e) => visit(e, 'blogs.posts.edit', 'GET', {post: data.id})}
                        >
                            <PenLineIcon />
                            Edit
                        </Button>
                    </>
                )
            },
        },
    ];

    const filters = [
        {
            name: "title",
            type: "input",
            placeholder: "Search Title",
        },
    ];

    const dataTableRef = useRef();

    const updateField = (field, value) => {
        axios.post(route("blogs.update-multiple-posts"), { ids: selectedIds, field: field, value: value }).then((response) => {
            if(response?.status === 200) {
                dataTableRef?.current.refresh();
                toast({
                    variant: "success",
                    description: "Selected records has been updated.",
                });
                setSelectedIds([]);
            } else {
                toast({
                    variant: "destructive",
                    title: "Uh oh! Something went wrong.",
                    description: "There was a problem with your request.",
                });
            }
        });
    }

    return (
        <>
            <Card>
                <CardHeader>
                    <CardTitle className="flex justify-between items-center">
                        Post List
                        <Button variant='secondary' size='sm' onClick={(e) => visit(e, 'blogs.posts.create')}><PlusCircle /> Create</Button>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <DataTable
                        apiDataSource={fetchPosts}
                        columns={columns}
                        showColumnFilter={true}
                        dataFilters={filters}
                        dataFilterAppendClass="md:grid-cols-4"
                        ref={dataTableRef}
                    />
                </CardContent>
                <CardFooter>
                    <span className="mr-5">All selected items: </span>
                    <Button variant="secondary" className="mr-2" onClick={() => updateField("is_active", 1)}>Set to Active</Button>
                    <Button variant="destructive" className="mr-2" onClick={() => updateField("is_active", 0)}>Set to Inactive</Button>
                </CardFooter>
            </Card>
        </>
    );
};
