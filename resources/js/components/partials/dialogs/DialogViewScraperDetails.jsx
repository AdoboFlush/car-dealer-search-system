import { DialogContainer } from "@/components/partials/DialogContainer";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table"
import dayjs from "dayjs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { View } from "lucide-react";
import { join } from "lodash";
import { Badge } from "@/components/ui/badge";
import { Link } from "lucide-react";
import { ScraperStatus, ScraperStatusColor } from "@/Utils/Constants/Scraper";
import { CarsTable } from "../tables/CarsTable";
import { Progress } from "@/components/ui/progress";
import { ExternalLink } from "lucide-react";

export function DialogViewScraperDetails({ data = {} }) {
    return (
        <Dialog>
            <DialogTrigger> 
                <Button
                    size="sm"
                    variant="outline"
                >
                <View />
                View Details
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] md:max-w-[700px] lg:max-w-[1200px] max-h-screen overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Scraper information</DialogTitle>
                    <DialogDescription></DialogDescription>
                </DialogHeader>

                <Table>
                    <TableBody>
                        <TableRow>
                            <TableCell>
                                Scraper Name
                            </TableCell>
                            <TableCell>
                                <a href={data?.website} target="_blank" className="flex">
                                    {data?.scraperName} <ExternalLink className="ml-2" size={16} />
                                </a>
                            </TableCell>
                        </TableRow>

                        <TableRow>
                            <TableCell>
                                Status
                            </TableCell>
                            <TableCell>
                                <Badge variant={ScraperStatusColor[data?.status]}>
                                    <span className="capitalize">{data?.status}</span>
                                </Badge>
                            </TableCell>
                        </TableRow>

                        <TableRow>
                            <TableCell>
                                Is Published
                            </TableCell>
                            <TableCell>
                                <Badge variant={data?.isPublished ? "secondary" : "destructive"}>
                                    {data?.isPublished ? "YES" : "NO"} 
                                </Badge>
                            </TableCell>
                        </TableRow>

                        <TableRow>
                            <TableCell>
                                Created At
                            </TableCell>
                            <TableCell>
                                {dayjs(data?.createdAt).format("YYYY-MM-DD HH:mm:ss")}
                            </TableCell>
                        </TableRow>

                        <TableRow>
                            <TableCell>
                                Updated At
                            </TableCell>
                            <TableCell>
                                {dayjs(data?.updatedAt).format("YYYY-MM-DD HH:mm:ss")}
                            </TableCell>
                        </TableRow>

                        <TableRow>
                            <TableCell>
                                Progress
                            </TableCell>
                            <TableCell className="flex items-center">
                               <Progress value={ parseInt(data?.currentRecordsScraped) / parseInt(data?.totalRecords) * 100 } className="w-[60%] mr-5" /> { data?.currentRecordsScraped} / {data?.totalRecords} ({parseInt(data?.currentRecordsScraped) / parseInt(data?.totalRecords) * 100}) %
                            </TableCell>
                        </TableRow>

                        <TableRow>
                            <TableCell>
                                Last Error Message
                            </TableCell>
                            <TableCell>
                                {data?.lastErrorMessage}
                            </TableCell>
                        </TableRow>

                    </TableBody>
                </Table>

                <CarsTable 
                    passedQueryParams={{scraperProcessId : data.id}}
                    disableCheckbox={true}
                    disableActions={true}
                    disableTabs={true}
                    disableMultiActions={true}
                    disableHeader={true}
                    disableSelectedRowCaption={true}
                />

                <DialogFooter className="flex item-center justify-between">
                    <DialogClose asChild>
                        <Button type="button" variant="secondary">
                            Close
                        </Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
