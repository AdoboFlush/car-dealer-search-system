import React, { useEffect, useState } from "react";
import { Bar, BarChart, XAxis, YAxis, Tooltip } from "recharts";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import axios from "axios";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

export function CarsOverviewPerMonth({ year }) {
    const [data, setData] = useState([]);

    useEffect(() => {
        axios.get(route("dashboard.cars-by-month", { year: year })).then((response) => {
            setData(response.data.data);
        });
    }, [year]);

    const chartConfig = {
        desktop: {
            label: "Desktop",
            color: "hsl(var(--chart-1))",
        },
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Cars Overview Per Month ({year})</CardTitle>
            </CardHeader>
            <CardContent className="pl-2">
                <ChartContainer config={chartConfig}>
                    <BarChart data={data}>
                        <XAxis
                            dataKey="month" 
                            stroke="#888888"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                        />
                        <YAxis
                            stroke="#888888"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                            tickFormatter={(value) => `${value}`}
                        />
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent hideLabel />}
                        />
                        <Bar
                            dataKey="count"
                            fill="currentColor"
                            radius={[4, 4, 0, 0]}
                            className="fill-primary"
                        />
                    </BarChart>
                </ChartContainer>
            </CardContent>
        </Card>
    );
}
