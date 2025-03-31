import { X } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { useEffect, useState } from "react"
import { isFunction } from "lodash"

export function MultiSelect({
    records, // {label: "label", value: "value"}
    values = [], // {label: "label", value: "value"}
    onChange = null,
    placeholder = "Select from records",
    className = "",
}) {

    const [open, setOpen] = useState(false)
    const [selected, setSelected] = useState([]);

    const handleUnselect = (record) => {
        if(isFunction(onChange)) {
            let updatedValues = selected.filter((s) => s.value !== record.value)
            onChange(updatedValues)
            setSelected(updatedValues)
        }
    }

    const handleSelect = (record) => {
        if(isFunction(onChange)) {
            let updatedValues = [];
            if (selected.some((s) => s.value === record.value)) {
                updatedValues = selected.filter((s) => s.value !== record.value);
                onChange(updatedValues)
                setSelected(updatedValues)
            } else {
                updatedValues = [...selected, record]
                onChange(updatedValues)
                setSelected(updatedValues)
            }
        }
    }

    useEffect(() => {
        setSelected(values);
    }, []);

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <div
                    role="combobox"
                    aria-expanded={open}
                    className={cn(
                        "flex min-h-10 w-full flex-wrap items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2",
                        className,
                    )}
                    onClick={() => setOpen(true)}
                >
                    <div className="flex flex-wrap gap-1">
                        {selected.length > 0 ? (
                            selected.map((record) => (
                                <Badge key={record.value} variant="secondary" className="flex items-center gap-1 px-2">
                                    {record.label}
                                    <button
                                        type="button"
                                        className="rounded-full outline-none ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2"
                                        onClick={(e) => {
                                            e.stopPropagation()
                                            handleUnselect(record)
                                        }}
                                    >
                                        <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                                        <span className="sr-only">Remove {record.label}</span>
                                    </button>
                                </Badge>
                            ))
                        ) : (
                            <span className="text-muted-foreground">{placeholder}</span>
                        )}
                    </div>
                </div>
            </PopoverTrigger>
            <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
                <Command>
                    <CommandInput placeholder={placeholder} />
                    <CommandList>
                        <CommandEmpty>No records found.</CommandEmpty>
                        <CommandGroup className="max-h-64 overflow-auto">
                            {records.map((record) => {
                                const isSelected = selected.some((s) => s.value === record.value)
                                return (
                                    <CommandItem
                                        key={record.value}
                                        value={record.value}
                                        onSelect={() => handleSelect(record)}
                                        className={cn("flex items-center gap-2", isSelected ? "bg-accent text-accent-foreground" : "")}
                                    >
                                        <div
                                            className={cn(
                                                "flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                                                isSelected ? "bg-primary text-primary-foreground" : "opacity-50 [&_svg]:invisible",
                                            )}
                                        >
                                            <svg
                                                className={cn("h-3 w-3")}
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                                strokeWidth={2}
                                            >
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                            </svg>
                                        </div>
                                        <span>{record.label}</span>
                                    </CommandItem>
                                )
                            })}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    )
}

