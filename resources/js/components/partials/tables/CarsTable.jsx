import * as React from "react";
import { Button } from "@/components/ui/button";
import dayjs from "dayjs";

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import DataTable from "@/components/partials/DataTable";
import { compact, get, includes, isEmpty, startCase, toLower } from "lodash";
import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { DialogViewCarDetails } from "../dialogs/DialogViewCarDetails";
import axios from "axios";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ExternalLink } from "lucide-react";
import { fetchCars } from "@/API/Car";
import { Dealer } from "@/Utils/Constants/Scraper";
import { Permissions } from "@/Utils/Constants/RolesPermissions";
import { usePage } from "@inertiajs/react";

export function CarsTable({
    title = "Cars Management",
    passedQueryParams = {},
    disableCheckbox = false,
    disableActions = false,
    disableTabs = false,
    disableMultiActions = false,
    disableHeader = false,
    disableSelectedRowCaption = false
}) {

    const [selectedIds, setSelectedIds] = useState([]);
    const { toast } = useToast();

    const { auth } = usePage().props;
    const permissions = get(auth, "permissions", []);

    const columns = compact([
        !disableCheckbox && includes(permissions, Permissions.CarUpdate) && {
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
            accessorKey: "title",
            header: "Title",
            cell: ({ row }) => (
                <div>{row.original?.title}</div>
            ),
        },
        {
            accessorKey: "scraperProcess",
            header: "Website / Scraper Name",
            cell: ({ row }) => (
                <a href={row.original?.scraperProcess?.website} target="_blank" className="flex">
                    {row.original?.scraperProcess?.scraperName} <ExternalLink className="ml-2" size={16} />
                </a>
            ),
        },
        {
            accessorKey: "isFeatured",
            header: "Featured?",
            cell: ({ row }) => (
                <Badge variant={row.original?.isFeatured ? "secondary" : "destructive"}>
                    <span>{row.original?.isFeatured ? "YES" : "NO"}</span>
                </Badge>
            ),
        },
        {
            accessorKey: "scraperProcess.isPublished",
            header: "Published?",
            cell: ({ row }) => (
                <Badge variant={row.original?.scraperProcess?.isPublished ? "secondary" : "destructive"}>
                    <span>{row.original?.scraperProcess?.isPublished ? "YES" : "NO"}</span>
                </Badge>
            ),
        },
        {
            accessorKey: "price",
            header: "Price",
            cell: ({ row }) => {
                const price = parseFloat(row.original?.price || 0).toLocaleString("en-PH", {
                    style: "currency",
                    currency: row.original?.currency,
                }).replace("₱", "₱ ");
                return <div>{price}</div>;
            },
        },
        {
            accessorKey: "createdAt",
            header: "Created At",
            cell: ({ row }) => {
                const date = dayjs(row.getValue("createdAt"));
                return <div>{date.isValid() ? date.format('YYYY-MM-DD HH:mm:ss') : '-'}</div>;
            },
        },
        !disableActions && {
            id: "actions",
            header: "Actions",
            enableHiding: false,
            cell: ({ row }) => {
                const data = row.original
                return (
                    <DialogViewCarDetails data={data} />
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
        {
        
            name: "scraperName",
            type: "select",
            placeholder: "Search Scraper",
            options: Object.keys(Dealer).map((keyName, k) => {
                return {
                    value: Dealer[keyName],
                    label: startCase(toLower(keyName.replace(/([A-Z])/g, ' $1').trim()))
                };
            }),
        },
    ];

    const dataTableRef = React.useRef();

    const updateField = (field, value) => {
        axios.post(route("cars.update-multiple"), { ids: selectedIds, field: field, value: value }).then((response) => {
            if (response?.status === 200) {
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
    };

    const renderDataTable = (passedQueryParams) => {
        return (
            <DataTable
                apiDataSource={fetchCars}
                columns={columns}
                showColumnFilter={true}
                dataFilters={filters}
                dataFilterAppendClass="md:grid-cols-4"
                ref={dataTableRef}
                passedQueryParams={passedQueryParams}
                disableSelectedRowCaption={disableSelectedRowCaption}
            />
        );
    };

    return (
        <Card>

            {!disableHeader && (
                <CardHeader>
                    <CardTitle className="flex justify-between items-center">
                        {title}
                    </CardTitle>
                </CardHeader>
            )}
            <CardContent>

                {!disableTabs ? (
                    <Tabs defaultValue="all" className="w-full">
                        <TabsList>
                            <TabsTrigger value="all">All</TabsTrigger>
                            <TabsTrigger value="featured">Featured</TabsTrigger>
                            <TabsTrigger value="published">Published</TabsTrigger>
                        </TabsList>
                        <TabsContent value="all">
                            {renderDataTable({ ...passedQueryParams })}
                        </TabsContent>
                        <TabsContent value="featured">
                            {renderDataTable({ ...passedQueryParams, isFeatured: 1 })}
                        </TabsContent>
                        <TabsContent value="published">
                            {renderDataTable({ ...passedQueryParams, isPublished: 1 })}
                        </TabsContent>
                    </Tabs>
                ) : (
                    <>{renderDataTable({ ...passedQueryParams })}</>
                )}

            </CardContent>
            {!disableMultiActions && includes(permissions, Permissions.CarUpdate) && (
                <CardFooter>
                    <span className="mr-5">All selected items: </span>
                    <Button variant="secondary" className="mr-2" onClick={() => updateField("is_featured", 1)}>Update to Featured</Button>
                    <Button variant="destructive" className="mr-2" onClick={() => updateField("is_featured", 0)}>Update to NOT Featured</Button>
                </CardFooter>
            )}
        </Card>
    );
}
