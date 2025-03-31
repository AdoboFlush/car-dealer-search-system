import { Input } from "../ui/input";
import _ from "lodash";

import { Button } from "../ui/button"
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "../ui/select"
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Calendar } from "../ui/calendar"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "../ui/popover"
import dayjs from "dayjs";
import { Checkbox } from "../ui/checkbox";
import { Search } from "lucide-react";
import { ListRestart } from "lucide-react";
import { useState } from "react";

export default function DataFilter({ filters = [], filterParamCb = null, appendClass = "grid-cols-4" }) {

    const [filterParams, setFilterParams] = useState({});

    const handleSearch = () => {
        if (_.isFunction(filterParamCb)) {
            filterParamCb(filterParams);
        }
    };

    const handleClear = () => {
        if (_.isFunction(filterParamCb)) {
            setFilterParams({});
            filterParamCb({});
        }
    };

    return (
        <div className={`grid auto-rows-min gap-4 ${appendClass}`}>
            {filters.map((filter, k) => {
                return (
                    <div className="rounded-xl" key={k}>
                        {filter.type == "input" && (
                            <Input
                                name={filter.name}
                                key={`${filter.type}-${k}`}
                                value={_.get(filterParams, filter.name, "")}
                                onChange={(event) =>
                                    setFilterParams({
                                        ...filterParams,
                                        [filter.name]: event.target.value,
                                    })
                                }
                                className="max-w-sm"
                                placeholder={filter.placeholder ?? `Search ${filter.name}`}
                            />
                        )}
                        {filter.type == "select" && (
                            <Select
                                name={filter.name}
                                onValueChange={(value) => setFilterParams({
                                    ...filterParams,
                                    [filter.name]: value,
                                })}
                                value={filterParams[filter.name] ?? ""}
                                key={`${filter.type}-${k}`}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder={filter?.placeholder ? filter.placeholder : `Select ${filter.name}`} />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        {_.size(filter?.options) && filter.options.map((options, p) => (
                                            <SelectItem value={options.value} key={p}>{options.label}</SelectItem>
                                        ))}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        )}
                        {filter.type == "date" && (
                            <Popover key={`${filter.type}-${k}`}>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant={"outline"}
                                        className={cn(
                                            "w-[280px] justify-start text-left font-normal",
                                            !filterParams[filter.name] && "text-muted-foreground"
                                        )}
                                    >
                                        <CalendarIcon />
                                        <span>
                                            {filterParams[filter.name] ? filterParams[filter.name] : filter?.placeholder}
                                        </span>
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0">
                                    <Calendar
                                        mode="single"
                                        selected={filterParams[filter.name]}
                                        onSelect={(value) => setFilterParams({
                                            ...filterParams,
                                            [filter.name]: dayjs(value).format('YYYY-MM-DD'),
                                        })}
                                        initialFocus
                                    />
                                </PopoverContent>
                            </Popover>
                        )}
                        {filter.type == "check" && (
                            <div key={`${filter.type}-${k}`} className="items-top flex space-x-2">
                                <Checkbox
                                    name={filter.name}
                                    onCheckedChange={(check) => setFilterParams({
                                        ...filterParams,
                                        [filter.name]: check,
                                    })}
                                />
                                <div className="grid gap-1.5 leading-none">
                                    <label
                                        htmlFor={setting.key}
                                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                    >
                                        {filter.name}
                                    </label>
                                    <p className="text-sm text-muted-foreground">
                                        {filter.placeholder ?? `All ${filter.name}`}
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                );
            })}
            {_.size(filters) > 0 && (
                <div className="rounded-xl">
                    <Button onClick={handleSearch} variant="default" size="sm" className="mr-2"> <Search /> Search</Button>
                    <Button onClick={handleClear} variant="secondary" size="sm"><ListRestart /> Reset</Button>
                </div>
            )}
        </div>
    );
}