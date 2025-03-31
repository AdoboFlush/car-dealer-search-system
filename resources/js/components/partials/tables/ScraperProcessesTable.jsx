import * as React from "react";
import { Button } from "@/components/ui/button";
import dayjs from "dayjs";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import DataTable from "@/components/partials/DataTable";
import { fetchScraperProcesses } from "@/API/Scraper";
import { compact, get, includes } from "lodash";
import { DialogCreateScraperInstance } from "../dialogs/DialogCreateScraperInstance";
import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { ScraperStatus, ScraperStatusColor } from "@/Utils/Constants/Scraper";
import { CreativeCommons } from "lucide-react";
import { Globe } from "lucide-react";
import { RefreshCcw } from "lucide-react";
import { DialogViewScraperDetails } from "../dialogs/DialogViewScraperDetails";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ExternalLink } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { X } from "lucide-react";
import { Permissions } from "@/Utils/Constants/RolesPermissions";
import { usePage } from "@inertiajs/react";

export function ScraperProcessesTable({ title = "Scraper Monitoring", passedQueryParams = {} }) {

    const [selectedIds, setSelectedIds] = useState([]);
    const { toast } = useToast();

    const { auth } = usePage().props;
    const permissions = get(auth, "permissions", []);

    const retryProcess = (data) => {
        axios.put(route("scraper-processes.retry", { scraper_process: data.id }), {}).then((response) => {
            if (response?.status === 200) {
                dataTableRef?.current.refresh();
                toast({
                    variant: "success",
                    description: `Retry process on scraper id ${data.id} is successful.`,
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
    };

    const updatePublishProcess = (data, toPublish = true) => {
        axios.put(route("scraper-processes.publish", { scraper_process: data.id }), { toPublish: toPublish }).then((response) => {
            if (response?.status === 200) {
                dataTableRef?.current.refresh();
                toast({
                    variant: "success",
                    description: `Scraper id ${data.id} has successfully ${toPublish ? "published" : "unpublished"}.`,
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
    };

    const columns = compact([
        {
            accessorKey: "id",
            header: "ID",
            cell: ({ row }) => (
                <div>{row.original?.id}</div>
            ),
        },
        {
            accessorKey: "scraperName",
            header: "Scraper Name",
            cell: ({ row }) => (
                <a href={row.original?.website} target="_blank" className="flex">
                    {row.original?.scraperName} <ExternalLink className="ml-2" size={16} />
                </a>
            ),
        },
        {
            accessorKey: "totalRecords",
            header: "Total Records",
            cell: ({ row }) => (
                <div>{row.original?.totalRecords}</div>
            ),
        },
        {
            accessorKey: "currentRecordsScraped",
            header: "Records Scraped",
            cell: ({ row }) => (
                <div>{row.original?.currentRecordsScraped}</div>
            ),
        },
        {
            accessorKey: "progress",
            header: "Progress",
            cell: ({ row }) => (
                <Progress value={parseInt(row.original?.currentRecordsScraped) / parseInt(row.original?.totalRecords) * 100} />
            ),
        },
        {
            accessorKey: "retryCount",
            header: "Retry Count",
            cell: ({ row }) => (
                <div>{row.original?.retryCount}</div>
            ),
        },
        {
            accessorKey: "status",
            header: "Status",
            cell: ({ row }) => (
                <Badge variant={ScraperStatusColor[row.original?.status]}>
                    <span className="capitalize">{row.original?.status}</span>
                </Badge>
            ),
        },
        {
            accessorKey: "isPublished",
            header: "Published?",
            cell: ({ row }) => (
                <Badge variant={row.original?.isPublished ? "secondary" : "destructive"}>
                    <span>{row.original?.isPublished ? "YES" : "NO"}</span>
                </Badge>
            ),
        },
        {
            accessorKey: "startsAt",
            header: "Starts At",
            cell: ({ row }) => {
                const date = dayjs(row.getValue("startsAt"));
                return <div>{date.isValid() ? date.format('YYYY-MM-DD HH:mm:ss') : '-'}</div>;
            },
        },
        {
            accessorKey: "endsAt",
            header: "Ends At",
            cell: ({ row }) => {
                const date = dayjs(row.getValue("endsAt"));
                return <div>{date.isValid() ? date.format('YYYY-MM-DD HH:mm:ss') : '-'}</div>;
            },
        },
        {
            id: "actions",
            header: "Actions",
            enableHiding: false,
            cell: ({ row }) => {
                const data = row.original
                return (
                    <div className="flex gap-2">
                        <DialogViewScraperDetails data={data} />
                        {includes(permissions, Permissions.ScraperProcessUpdate) && (
                            <>
                                {data?.status === ScraperStatus.Completed && (
                                    <>
                                        {data?.isPublished ? (
                                            <Button size="sm" variant="destructive" onClick={() => updatePublishProcess(data, false)}>
                                                <X />
                                                Unpublish
                                            </Button>
                                        ) : (
                                            <Button size="sm" variant="secondary" onClick={() => updatePublishProcess(data)}>
                                                <Globe />
                                                Publish
                                            </Button>
                                        )}
                                    </>
                                )}

                                {[ScraperStatus.Failed, ScraperStatus.Canceled].includes(data?.status) && (
                                    <Button size="sm" variant="secondary" onClick={() => retryProcess(data)}>
                                        <RefreshCcw />
                                        Retry
                                    </Button>
                                )}
                            </>
                        )}
                    </div>
                )
            },
        },
    ]);

    const filters = [
        {
            name: "scraperName",
            type: "input",
            placeholder: "Search Scraper Name",
        },
    ];

    const dataTableRef = React.useRef();

    const renderDataTable = (passedQueryParams) => {
        return (
            <DataTable
                apiDataSource={fetchScraperProcesses}
                columns={columns}
                showColumnFilter={true}
                dataFilters={filters}
                dataFilterAppendClass="md:grid-cols-4"
                ref={dataTableRef}
                passedQueryParams={passedQueryParams}
            />
        );
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex justify-between items-center">
                    {title}
                    {includes(permissions, Permissions.ScraperProcessCreate) && (
                        <DialogCreateScraperInstance successCb={() => dataTableRef.current?.refresh()} />
                    )}
                </CardTitle>
            </CardHeader>
            <CardContent>
                <Tabs defaultValue="all" className="w-full">
                    <TabsList>
                        <TabsTrigger value="all">All</TabsTrigger>
                        <TabsTrigger value="published">Published</TabsTrigger>
                        <TabsTrigger value="completed">Completed</TabsTrigger>
                        <TabsTrigger value="pending">Pending</TabsTrigger>
                        <TabsTrigger value="processing">Processing</TabsTrigger>
                        <TabsTrigger value="failed">Failed</TabsTrigger>
                        <TabsTrigger value="canceled">Canceled</TabsTrigger>
                    </TabsList>
                    <TabsContent value="all">
                        {renderDataTable({ ...passedQueryParams })}
                    </TabsContent>
                    <TabsContent value="published">
                        {renderDataTable({ ...passedQueryParams, isPublished: 1 })}
                    </TabsContent>
                    <TabsContent value="completed">
                        {renderDataTable({ ...passedQueryParams, status: ScraperStatus.Completed })}
                    </TabsContent>
                    <TabsContent value="pending">
                        {renderDataTable({ ...passedQueryParams, status: ScraperStatus.Pending })}
                    </TabsContent>
                    <TabsContent value="processing">
                        {renderDataTable({ ...passedQueryParams, status: ScraperStatus.Processing })}
                    </TabsContent>
                    <TabsContent value="failed">
                        {renderDataTable({ ...passedQueryParams, status: ScraperStatus.Failed })}
                    </TabsContent>
                    <TabsContent value="canceled">
                        {renderDataTable({ ...passedQueryParams, status: ScraperStatus.Canceled })}
                    </TabsContent>
                </Tabs>
            </CardContent>
        </Card>
    );
}
