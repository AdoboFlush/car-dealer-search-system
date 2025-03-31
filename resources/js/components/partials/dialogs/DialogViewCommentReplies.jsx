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
import { CommentsTable } from "../tables/CommentsTable";

export function DialogViewCommentReplies({ data = {} }) {
    return (
        <Dialog>
            <DialogTrigger> 
                <Button
                    size="sm"
                    variant="outline"
                >
                <View />
                View Replies
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] md:max-w-[1000px] lg:max-w-[1000px]">
                <DialogHeader>
                    <DialogTitle>Replies</DialogTitle>
                    <DialogDescription></DialogDescription>
                </DialogHeader>

                <Table>
                    <TableBody>
                        <TableRow>
                            <TableCell>
                                Post Title
                            </TableCell>
                            <TableCell>
                                <div className="capitalize">{data?.post.title}</div>
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>
                                Parent Comment
                            </TableCell>
                            <TableCell>
                                <div className="capitalize">{data?.content}</div>
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
                
                <CommentsTable title="Replies" passedQueryParams={{commentId: data.id, postId: data?.post?.id}} disableActions={true} withCard={false} />

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
