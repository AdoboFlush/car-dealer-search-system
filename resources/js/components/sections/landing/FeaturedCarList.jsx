import React, { useEffect, useState, useCallback } from "react"
import { Search, ExternalLink, Loader } from "lucide-react"
import { startCase, toLower } from "lodash" // Import lodash functions

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination"
import { fetchGuestCars } from "@/API/Car"
import DialogViewCarDetails from "@/components/partials/dialogs/guest/DialogViewCarDetails"
import { Star } from "lucide-react"

export default function FeaturedCarListing() {
    const [isLoading, setIsLoading] = useState(false)
    const [currentPage, setCurrentPage] = useState(1)
    const [totalPages, setTotalPages] = useState(0)
    const [totalCars, setTotalCars] = useState(0)
    const [cars, setCars] = useState([])
    const [searchQuery, setSearchQuery] = useState("")
    const [isSearchActive, setIsSearchActive] = useState(false)
    const carsPerPage = 8

    const fetchData = (page, search) => {
        if (isSearchActive) return; // Disable fetching if search input is active
        setIsLoading(true)
        fetchGuestCars({ page: page, perPage: carsPerPage, search: search, isFeatured: 1 })
            .then((response) => {
                setCars(response.data.data)
                setTotalPages(response.data.meta.lastPage)
                setTotalCars(response.data.meta.total)
            })
            .catch((error) => {
                console.error("Error fetching data:", error)
            })
            .finally(() => {
                setIsLoading(false)
            })
    };

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber)
        fetchData(pageNumber, searchQuery);
        window.scrollTo(0, 0)
    };

    const debounce = (func, delay) => {
        let timer;
        return (...args) => {
            clearTimeout(timer);
            timer = setTimeout(() => func(...args), delay);
        };
    };

    const handleSearch = useCallback(
        debounce((value) => {
            setCurrentPage(1);
            fetchData(1, value);
        }, 3000),
        []
    );

    const handleSearchInputChange = (e) => {
        setSearchQuery(e.target.value);
        handleSearch(e.target.value);
    };

    const handleSearchInputKeyDown = (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            setCurrentPage(1);
            fetchData(1, searchQuery);
        }
    };

    const handleSearchInputFocus = () => {
        setIsSearchActive(true);
    };

    const handleSearchInputBlur = () => {
        setIsSearchActive(false);
    };

    useEffect(() => {
        fetchData(currentPage, searchQuery);
    }, []);

    return (
        <div className="container mx-auto px-4 py-8">

            <header className="mb-12 text-center">
                <h1 className="text-4xl font-bold mb-2">Featured Cars</h1>
            </header>

            {/* Loader */}
            {isLoading && (
                <div className="flex justify-center items-center py-12">
                    <Loader className="animate-spin h-8 w-8 text-primary" />
                </div>
            )}

            {/* Main content */}
            {!isLoading && (
                <>
                    {/* Car listings grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                        {cars.map((car) => (
                            <Card key={car.id} className="overflow-hidden flex flex-col h-full">
                                <img
                                    src={car.thumbnailLink || "/placeholder.svg"}
                                    alt={car.title}
                                    className="w-full h-48 object-cover"
                                    onError={(e) => {
                                        e.target.onerror = null // Prevent infinite loop    
                                        e.target.src = "/images/knuckles.jpg"
                                    }}
                                />
                                <CardHeader className="flex-grow">
                                    <CardTitle className="line-clamp-2">{car.title}</CardTitle>
                                    <p className="text-sm text-muted-foreground mt-2">
                                        <a href={car?.websiteUrl} target="_blank" className="flex items-center">
                                            {startCase(toLower(car?.websiteName))}
                                            <ExternalLink className="ml-2" size={16} />
                                        </a>
                                    </p>
                                </CardHeader>
                                <CardContent className="mt-auto">
                                    <p className="text-2xl font-bold">
                                        {parseFloat(car?.price || 0).toLocaleString("en-PH", {
                                            style: "currency",
                                            currency: car?.currency,
                                        }).replace("₱", "₱ ")}
                                    </p>
                                </CardContent>
                                <CardFooter>
                                    <DialogViewCarDetails data={car} trigger={(
                                        <Button className="w-full">
                                            View Details
                                        </Button>
                                    )} />
                                </CardFooter>
                            </Card>
                        ))}
                    </div>

                    {/* Show message if no cars match search */}
                    {cars.length === 0 && (
                        <div className="text-center py-12">
                            <h2 className="text-xl font-semibold">No cars found</h2>
                            <p className="text-muted-foreground mt-2">Try adjusting your search criteria</p>
                        </div>
                    )}

                    {/* Pagination */}
                    {cars.length > 0 && (
                        <Pagination>
                            <PaginationContent>
                                <PaginationItem>
                                    <PaginationPrevious
                                        onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)}
                                        className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                                    />
                                </PaginationItem>

                                {/* Render page numbers with ellipses */}
                                {Array.from({ length: totalPages }, (_, index) => index + 1)
                                    .filter((pageNumber) => {
                                        return (
                                            pageNumber === 1 ||
                                            pageNumber === totalPages ||
                                            (pageNumber >= currentPage - 2 && pageNumber <= currentPage + 2)
                                        );
                                    })
                                    .map((pageNumber, index, filteredPages) => (
                                        <React.Fragment key={pageNumber}>
                                            {index > 0 && pageNumber !== filteredPages[index - 1] + 1 && (
                                                <PaginationEllipsis />
                                            )}
                                            <PaginationItem>
                                                <PaginationLink
                                                    onClick={() => handlePageChange(pageNumber)}
                                                    className={currentPage === pageNumber ? "font-bold text-primary" : "cursor-pointer"}
                                                >
                                                    {pageNumber}
                                                </PaginationLink>
                                            </PaginationItem>
                                        </React.Fragment>
                                    ))}

                                <PaginationItem>
                                    <PaginationNext
                                        onClick={() => currentPage < totalPages && handlePageChange(currentPage + 1)}
                                        className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                                    />
                                </PaginationItem>
                            </PaginationContent>
                        </Pagination>
                    )}
                </>
            )}
        </div>
    )
}

