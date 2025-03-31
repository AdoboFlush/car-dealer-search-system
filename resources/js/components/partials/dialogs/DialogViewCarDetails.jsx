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

export function DialogViewCarDetails({ data = {} }) {
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
            <DialogContent className="sm:max-w-[425px] md:max-w-[700px] lg:max-w-[1200px] max-h-screen overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Car Information</DialogTitle>
                    <DialogDescription></DialogDescription>
                </DialogHeader>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                    {/* Left Section */}
                    <div className="lg:col-span-2">
                        <Table>
                            <TableBody>
                                <TableRow>
                                    <TableCell>Title</TableCell>
                                    <TableCell>{data?.title}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>Price</TableCell>
                                    <TableCell>
                                        {parseFloat(data?.price || 0).toLocaleString("en-PH", {
                                            style: "currency",
                                            currency: data?.currency,
                                        }).replace("₱", "₱ ")}
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>Website / Scraper Name</TableCell>
                                    <TableCell>{data?.scraperProcess.scraperName}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>Is Featured</TableCell>
                                    <TableCell>
                                        <Badge variant={data?.isFeatured ? "secondary" : "destructive"}>
                                            {data?.isFeatured ? "YES" : "NO"}
                                        </Badge>
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>Is Published</TableCell>
                                    <TableCell>
                                        <Badge variant={data?.scraperProcess.isPublished ? "secondary" : "destructive"}>
                                            {data?.scraperProcess.isPublished ? "YES" : "NO"}
                                        </Badge>
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>Details Link</TableCell>
                                    <TableCell>
                                        <a href={data.detailsLink} target="_blank" className="flex">
                                            <Link size={16} className="mr-2" />
                                            {data.detailsLink}
                                        </a>
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>Created At</TableCell>
                                    <TableCell>{dayjs(data?.createdAt).format("YYYY-MM-DD HH:mm:ss")}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>Updated At</TableCell>
                                    <TableCell>{dayjs(data?.updatedAt).format("YYYY-MM-DD HH:mm:ss")}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>Thumbnail</TableCell>
                                    <TableCell>
                                        <Avatar className="h-15 w-full rounded-lg">
                                            <AvatarImage src={data?.thumbnailLink} alt={data?.title} />
                                            <AvatarFallback className="rounded-lg">CAR</AvatarFallback>
                                        </Avatar>
                                    </TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </div>

                    {/* Right Section */}
                    <div className="lg:col-span-1 p-4 border rounded-lg" style={{ backgroundColor: "hsl(var(--muted))", color: "hsl(var(--muted-foreground))" }}>
                        <h3 className="text-md font-semibold mb-2">Description :</h3>
                        <div
                            dangerouslySetInnerHTML={{ __html: data?.description || "No description available." }}
                        />
                    </div>
                </div>

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
