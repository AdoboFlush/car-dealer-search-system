import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import dayjs from "dayjs"

import { UserTypes } from "@/Utils/Constants/User"
import { DialogCreateUser } from "@/components/partials/dialogs/DialogCreateUser"
import { DialogEditUser } from "@/components/partials/dialogs/DialogEditUser"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { fetchUsers } from "@/API/User"
import DataTable from "@/components/partials/DataTable"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DialogViewUser } from "@/components/partials/dialogs/DialogViewUser"
import { isEmpty, join } from "lodash"
import axios from "axios"
import { useRef, useState } from "react"
import { useToast } from "@/hooks/use-toast"
import { Badge } from "@/components/ui/badge"

export function UsersTable() {

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
                            setSelectedIds(table.getFilteredRowModel().rows.map((row) => row.original.id));
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
            accessorKey: "profileImageLink",
            header: "Profile Image",
            cell: ({ row }) => (
                <Avatar className="h-8 w-8 rounded-lg">
                    <AvatarImage src={row.getValue("profileImageLink")} alt={row.getValue("name")} />
                    <AvatarFallback className="rounded-lg">ADB</AvatarFallback>
                </Avatar>
            ),
        },
        {
            accessorKey: "name",
            header: "Username",
            cell: ({ row }) => (
                <div className="capitalize">{row.getValue("name")}</div>
            ),
        },
        {
            accessorKey: "email",
            header: "Email",
            cell: ({ row }) => <div className="lowercase">{row.getValue("email")}</div>,
        },
        {
            accessorKey: "fullName",
            header: "Full Name",
            cell: ({ row }) => (
                <div className="capitalize">{row.getValue("fullName")}</div>
            ),
        },
        {
            accessorKey: "birthDate",
            header: "Birth Date",
            cell: ({ row }) => (
                <div className="capitalize">{row.getValue("birthDate")}</div>
            ),
        },
        {
            accessorKey: "type",
            header: "User Type",
            cell: ({ row }) => (
                <div className="capitalize">{row.getValue("type")}</div>
            ),
        },
        {
            accessorKey: "roles",
            header: "Roles",
            cell: ({ row }) => (
                <div className="capitalize">{join(row.original.roles.map((role) => role.name), ", ")}</div>
            ),
        },
        {
            accessorKey: "isBlacklisted",
            header: "Is Blacklisted",
            cell: ({ row }) => (
                <Badge variant={row.getValue("isBlacklisted") == 1 ? "destructive" : "secondary"}>
                    {row.getValue("isBlacklisted") == 1 ? "YES" : "NO"} 
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
                    <div className="flex gap-2">
                        <DialogViewUser data={data} />
                        <DialogEditUser data={data} successCb={() => dataTableRef.current?.refresh()} appendClass="ml-5" />
                    </div>
                )
            },
        },
    ];

    const filters = [
        {
            name: "name",
            type: "input",
            placeholder: "Search Name",
        },
        {

            name: "email",
            type: "input",
            placeholder: "Search Email",
        },
        {

            name: "type",
            type: "select",
            placeholder: "Search User Type",
            options: Object.keys(UserTypes).map((keyName, k) => {
                return {
                    value: UserTypes[keyName],
                    label: keyName
                };
            }),
        },
        {

            name: "birthDate",
            type: "date",
            placeholder: "Search Birth date",
        },
    ];

    const dataTableRef = useRef();

    const updateField = (field, value) => {
        axios.post(route("users.update-multiple"), { ids: selectedIds, field: field, value: value }).then((response) => {
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
                        User List
                        <DialogCreateUser successCb={() => dataTableRef.current?.refresh()} />
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <DataTable
                        apiDataSource={fetchUsers}
                        columns={columns}
                        showColumnFilter={true}
                        dataFilters={filters}
                        dataFilterAppendClass="md:grid-cols-4"
                        ref={dataTableRef}
                    />
                </CardContent>
                <CardFooter>
                    <span className="mr-5">All selected items: </span>
                    <Button variant="secondary" className="mr-2" onClick={() => updateField("is_blacklisted", 0)}>Whitelist Users</Button>
                    <Button variant="destructive" className="mr-2" onClick={() => updateField("is_blacklisted", 1)}>Blacklist Users</Button>
                </CardFooter>
            </Card>
        </>
    );
};
