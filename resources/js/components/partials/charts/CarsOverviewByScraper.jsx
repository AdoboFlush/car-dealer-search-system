import React, { useEffect, useState } from "react";
import { Pie, PieChart, Label, Cell } from "recharts";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardFooter,
} from "@/components/ui/card";
import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart";
import axios from "axios";

export function CarsOverviewByScraper({ year }) {
    const [data, setData] = useState([]);

    useEffect(() => {
        axios.get(route("dashboard.cars-by-scraper", { year: year })).then((response) => {
            setData(response.data.data);
        });
    }, [year]);

    const totalCars = data.reduce((acc, curr) => acc + curr.count, 0);

    const colors = [
        "hsl(var(--chart-1))",
        "hsl(var(--chart-2))",
        "hsl(var(--chart-3))",
        "hsl(var(--chart-4))",
        "hsl(var(--chart-5))",
    ];

    const chartConfig = {
        count: {
            label: "Cars",
        },
        scraper_name: {
            label: "Scraper",
        },
    };

    return (
        <Card className="flex flex-col">
            <CardHeader className="items-center pb-0">
                <CardTitle>Cars Overview By Scraper ({year})</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 pb-0">
                <ChartContainer
                    config={chartConfig}
                    className="mx-auto aspect-square max-h-[250px]"
                >
                    <PieChart>
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent hideLabel />}
                        />
                        <Pie
                            data={data}
                            dataKey="count"
                            nameKey="scraperName"
                            innerRadius={60}
                            strokeWidth={5}
                        >
                            {data.map((entry, index) => (
                                <Cell
                                    key={`cell-${index}`}
                                    fill={colors[index % colors.length]} // Cycle through colors
                                />
                            ))}
                            <Label
                                content={({ viewBox }) => {
                                    if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                                        return (
                                            <text
                                                x={viewBox.cx}
                                                y={viewBox.cy}
                                                textAnchor="middle"
                                                dominantBaseline="middle"
                                            >
                                                <tspan
                                                    x={viewBox.cx}
                                                    y={viewBox.cy}
                                                    className="fill-foreground text-3xl font-bold"
                                                >
                                                    {totalCars.toLocaleString()}
                                                </tspan>
                                                <tspan
                                                    x={viewBox.cx}
                                                    y={(viewBox.cy || 0) + 24}
                                                    className="fill-muted-foreground"
                                                >
                                                    Cars
                                                </tspan>
                                            </text>
                                        );
                                    }
                                }}
                            />
                        </Pie>
                    </PieChart>
                </ChartContainer>
            </CardContent>
            <CardFooter className="flex flex-col gap-2">
                {data.map((entry, index) => (
                    <div
                        key={entry.scraperName}
                        className="flex items-center justify-between text-sm font-medium"
                    >
                        <div className="flex items-center gap-2">
                            <span
                                className="inline-block h-3 w-3 rounded-full"
                                style={{ backgroundColor: colors[index % colors.length] }}
                            ></span>
                            {entry.scraperName}
                        </div>
                        <span className="ml-2">({entry.count})</span>
                    </div>
                ))}
            </CardFooter>
        </Card>
    );
}
