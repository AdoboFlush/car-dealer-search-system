import { ExternalLink } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { startCase, toLower } from "lodash"

const DialogViewCarDetails = ({ data, trigger }) => {
    const { thumbnailLink, title, price, websiteUrl, websiteName, updatedAt, description, detailsLink, currency } = data

    const formattedDate = new Date(updatedAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
    })

    return (
        <Dialog>
            <DialogTrigger asChild>{trigger}</DialogTrigger>
            <DialogContent className="sm:max-w-[1000px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold">{title}</DialogTitle>
                </DialogHeader>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-4">
                    {/* Left Section */}
                    <div className="sm:col-span-2 space-y-4">
                        <div className="rounded-md overflow-hidden">
                            <img
                                src={thumbnailLink || "/images/knuckles.jpg"}
                                alt={title}
                                className="w-full h-[600px] object-cover"
                                onError={(e) => {
                                    e.target.onerror = null   
                                    e.target.src = "/images/knuckles.jpg"
                                }}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-sm text-muted-foreground">Price</p>
                                <p className="text-lg font-semibold">{parseFloat(price || 0).toLocaleString("en-PH", {
                                    style: "currency",
                                    currency: currency,
                                }).replace("₱", "₱ ")}</p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Website</p>
                                <p className="text-lg">
                                    <a href={websiteUrl} target="_blank" className="flex items-center">
                                        {startCase(toLower(websiteName))}
                                        <ExternalLink className="ml-2" size={16} />
                                    </a>
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Last Updated</p>
                                <p>{formattedDate}</p>
                            </div>
                            <div>
                                <Button className="w-full" onClick={() => window.open(detailsLink, "_blank")}>
                                    Go to Product Details Page <ExternalLink className="ml-2" />
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* Right Section */}
                    <div className="space-y-4 overflow-y-auto max-h-[700px]">
                        <p className="text-sm text-muted-foreground mb-1">Description</p>
                        <div className="prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: description }} />
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default DialogViewCarDetails

