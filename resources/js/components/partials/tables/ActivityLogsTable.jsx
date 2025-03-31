import * as React from "react"
import { Button } from "@/components/ui/button"
import dayjs from "dayjs"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import DataTable from "@/components/partials/DataTable"
import { visit } from "@/Utils/Functions"
import { View } from "lucide-react"
import { fetchActivityLogs } from "@/API/User"
import { compact } from "lodash"
import { DialogViewActivity } from "@/components/partials/dialogs/DialogViewActivity"

export function ActivityLogTable({title = "Activity Logs", passedQueryParams = {}, showCauser = true}) {

    const [selectedRowData, setSelectedRowData] = React.useState();
    const [viewState, setViewState] = React.useState(false);

    const columns = compact([
        {
            accessorKey: "description",
            header: "Description",
            cell: ({ row }) => (
                <div className="capitalize">{row.original?.description}</div>
            ),
        },
        showCauser && {
            accessorKey: "causerId",
            header: "Causer",
            cell: ({ row }) => (
                <>
                    <span className="capitalize">{row.original?.causer?.fullName} </span> ( {row.original?.causer?.name} )
                </>
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
            id: "actions",
            header: "Actions",
            enableHiding: false,
            cell: ({ row }) => {
                const data = row.original
                return (
                    <DialogViewActivity data={data} />
                )
            },
        },
    ]);

    const filters = [
        {
            name: "description",
            type: "input",
            placeholder: "Search Description",
        },
    ];

    const dataTableRef = React.useRef();

    return (
        <>
            <Card>
                <CardHeader>
                    <CardTitle className="flex justify-between items-center">
                        {title}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <DataTable
                        apiDataSource={fetchActivityLogs}
                        columns={columns}
                        showColumnFilter={true}
                        dataFilters={filters}
                        dataFilterAppendClass="md:grid-cols-4"
                        ref={dataTableRef}
                        passedQueryParams={passedQueryParams}
                    />
                </CardContent>
            </Card>
        </>
    );
};
