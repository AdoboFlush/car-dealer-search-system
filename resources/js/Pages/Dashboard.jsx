import AuthenticatedLayout from "@/components/layouts/AuthenticatedLayout"
import React, { useEffect, useState } from 'react';
import axios from 'axios';

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { CarsOverviewPerMonth } from "@/components/partials/charts/CarsOverviewPerMonth";
import { CarsOverviewByScraper } from "@/components/partials/charts/CarsOverviewByScraper";
import { Car } from "lucide-react";
import { Globe } from "lucide-react";
import { Select, SelectTrigger, SelectContent, SelectItem } from "@/components/ui/select"; // Adjusted import for SelectContent and SelectTrigger

import {
    Alert,
    AlertDescription,
    AlertTitle,
} from "@/components/ui/alert"
import { Info } from "lucide-react";

function StatisticCard({ title, value, icon }) {
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{title}</CardTitle>
                {icon}
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{value}</div>
            </CardContent>
        </Card>
    );
}

export default function Index() {
    const breadcrumbItems = [
        {
            title: "Dashboard",
            href: "#",
            current: true,
        },
    ];

    const [stats, setStats] = useState({
        totalCars: 0,
        totalCarsPublished: 0,
        totalScraperInstances: 0,
        featuredCars: 0,
    });

    const [year, setYear] = useState(new Date().getFullYear());

    useEffect(() => {
        axios.get(route("dashboard.get", { year: year }))
            .then(response => {
                setStats(response?.data?.data);
            })
            .catch(error => {
                console.error('Error fetching dashboard stats:', error);
            });
    }, [year]);

    const years = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i); // Generate last 5 years

    const statistics = [
        {
            title: "Total Cars Published",
            value: stats.totalCarsPublished,
            icon: (
                <Car />
            ),
        },
        {
            title: "Total Featured Cars",
            value: stats.featuredCars,
            icon: (
                <Car />
            ),
        },
        {
            title: "Total Cars",
            value: stats.totalCars,
            icon: (
                <Car />
            ),
        },
        {
            title: "Total Scraper Instances",
            value: stats.totalScraperInstances,
            icon: (
                <Globe />
            ),
        },
    ];

    return (
        <AuthenticatedLayout breadcrumbItems={breadcrumbItems}>
            <Alert className="mb-4">
                <AlertDescription className="flex items-center justify-between space-x-2">
                    <span className="flex items-center space-x-1">
                        <Info className="mr-2" />
                        <span>Showing the overview data for the year {year}.</span>
                    </span>
                    <div className="flex items-center justify-end space-x-2">
                        <label htmlFor="year-select" className="text-sm font-medium">Select Year:</label>
                        <Select id="year-select" value={year} onValueChange={(value) => setYear(value)}>
                            <SelectTrigger className="w-40"> {/* Set a fixed width */}
                                <button className="text-sm font-medium">{year}</button>
                            </SelectTrigger>
                            <SelectContent>
                                {years.map((yr) => (
                                    <SelectItem key={yr} value={yr}>
                                        {yr}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </AlertDescription>
            </Alert>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {statistics.map((stat, index) => (
                    <StatisticCard
                        key={index}
                        title={stat.title}
                        value={stat.value}
                        description={stat.description}
                        icon={stat.icon}
                    />
                ))}
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7 mt-4">
                <div className="col-span-5">
                    <CarsOverviewPerMonth year={year} />
                </div>
                <div className="col-span-2">
                    <CarsOverviewByScraper year={year} />
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
