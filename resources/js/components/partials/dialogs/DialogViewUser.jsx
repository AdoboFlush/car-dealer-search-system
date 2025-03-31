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

export function DialogViewUser({ data = {} }) {
    return (
        <Dialog>
            <DialogTrigger> 
                <Button
                    size="sm"
                    variant="outline"
                >
                <View />
                View
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] md:max-w-[700px] lg:max-w-[900px]">
                <DialogHeader>
                    <DialogTitle>User information</DialogTitle>
                    <DialogDescription></DialogDescription>
                </DialogHeader>
                <Table>
                    <TableBody>
                        <TableRow>
                            <TableCell>
                                User name
                            </TableCell>
                            <TableCell>
                                {data?.name}
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>
                                Email
                            </TableCell>
                            <TableCell>
                                {data?.email}
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>
                                Full Name
                            </TableCell>
                            <TableCell>
                                {data?.fullName ?? "-"}
                            </TableCell>
                        </TableRow>

                        <TableRow>
                            <TableCell>
                                Birth Date
                            </TableCell>
                            <TableCell>
                                {data?.birthDate ?? "-"}
                            </TableCell>
                        </TableRow>

                        <TableRow>
                            <TableCell>
                                User Type
                            </TableCell>
                            <TableCell>
                                {data?.type ?? "-"}
                            </TableCell>
                        </TableRow>

                        <TableRow>
                            <TableCell>
                                Roles
                            </TableCell>
                            <TableCell>
                                { join(data.roles.map((role) => role.name), ", ") }
                            </TableCell>
                        </TableRow>

                        <TableRow>
                            <TableCell>
                                Is Blacklisted
                            </TableCell>
                            <TableCell>
                                <Badge variant={data?.isBlacklisted == 1 ? "destructive" : "secondary"}>
                                    {data?.isBlacklisted == 1 ? "YES" : "NO"} 
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
                                Profile Image
                            </TableCell>
                            <TableCell>
                                <Avatar className="h-20 w-20 rounded-lg">
                                    <AvatarImage src={data?.profileImageLink} alt={data?.name} />
                                    <AvatarFallback className="rounded-lg">ADB</AvatarFallback>
                                </Avatar>
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
