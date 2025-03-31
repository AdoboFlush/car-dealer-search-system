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
import ReactJson from "react-json-view";
import { isObject } from "lodash";

export function DialogViewActivity({ data = {} }) {
    return (
        <Dialog>
            <DialogTrigger><Button size="sm" variant="secondary">View Details</Button></DialogTrigger>
            <DialogContent className="sm:max-w-[425px] md:max-w-[700px] lg:max-w-[900px]">
                <DialogHeader>
                    <DialogTitle>Activity Log Details</DialogTitle>
                    <DialogDescription></DialogDescription>
                </DialogHeader>
                <Table>
                    <TableBody>
                        <TableRow>
                            <TableCell>
                                Causer
                            </TableCell>
                            <TableCell>
                                <div className="capitalize">{data?.causer?.fullName} ( {data?.causer?.name} )</div>
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>
                                Description
                            </TableCell>
                            <TableCell>
                                <div className="capitalize">{data?.description}</div>
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
                                Properties
                            </TableCell>
                            <TableCell>
                                <div className="max-h-[30vw]">
                                    <ReactJson theme="monokai" src={isObject(data?.properties) ? data?.properties : JSON.parse(data?.properties)} />
                                </div>
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>

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
