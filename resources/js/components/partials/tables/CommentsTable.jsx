"use client"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import dayjs from "dayjs"

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import DataTable from "@/components/partials/DataTable"
import { fetchComments, fetchPosts } from "@/API/Blog"
import { visit } from "@/Utils/Functions"
import { Badge } from "@/components/ui/badge"
import { View } from "lucide-react"
import { DialogViewCommentReplies } from "../dialogs/DialogViewCommentReplies"
import { compact, isEmpty } from "lodash"
import { useRef, useState } from "react"
import { useToast } from "@/hooks/use-toast"

export function CommentsTable({
    title = "Comments List",
    passedQueryParams = {},
    disableActions = false,
    withCard = true,
}) {

    const [selectedIds, setSelectedIds] = useState([]);
    const { toast } = useToast();

    const columns = compact([
        !disableActions && {
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
            accessorKey: "content",
            header: "Comment",
            cell: ({ row }) => (
                <div className="capitalize">{row.getValue("content")}</div>
            ),
        },
        !disableActions && {
            accessorKey: "post",
            header: "Post Title",
            cell: ({ row }) => (
                <div className="capitalize">{row.original?.post?.title}</div>
            ),
        },
        {
            accessorKey: "user",
            header: "Commenter/User",
            cell: ({ row }) => (
                <div className="capitalize">{row.original?.user?.fullName}</div>
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
        !disableActions && {
            id: "actions",
            header: "Actions",
            enableHiding: false,
            cell: ({ row }) => {
                const data = row.original
                return (
                    <DialogViewCommentReplies data={data} />
                )
            },
        },
    ]);

    const filters = [
        {
            name: "title",
            type: "input",
            placeholder: "Search Title",
        },
    ];

    const dataTableRef = useRef();

    const updateField = (field, value) => {
        axios.post(route("blogs.update-multiple-comments"), { ids: selectedIds, field: field, value: value }).then((response) => {
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
            {withCard ? (
                <Card>
                    <CardHeader>
                        <CardTitle className="flex justify-between items-center">
                            {title}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <DataTable
                            apiDataSource={fetchComments}
                            columns={columns}
                            showColumnFilter={true}
                            dataFilters={filters}
                            dataFilterAppendClass="md:grid-cols-4"
                            ref={dataTableRef}
                            passedQueryParams={passedQueryParams}
                            disableSelectedRowCaption={disableActions}
                        />
                    </CardContent>
                    <CardFooter>
                        <span className="mr-5">All selected items: </span>
                        <Button variant="secondary" className="mr-2" onClick={() => updateField("is_active", 1)}>Set to Active</Button>
                        <Button variant="destructive" className="mr-2" onClick={() => updateField("is_active", 0)}>Set to Inactive</Button>
                    </CardFooter>
                </Card>
            ) : (
                <DataTable
                    apiDataSource={fetchComments}
                    columns={columns}
                    showColumnFilter={true}
                    dataFilters={filters}
                    dataFilterAppendClass="md:grid-cols-4"
                    ref={dataTableRef}
                    passedQueryParams={passedQueryParams}
                    disableSelectedRowCaption={disableActions}
                />
            )}

        </>
    );
};
