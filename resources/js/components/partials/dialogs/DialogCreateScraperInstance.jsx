import React, { useState } from "react";
import { useForm } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Dealer } from "@/Utils/Constants/Scraper";
import { useToast } from "@/hooks/use-toast";
import _ from "lodash";

export function DialogCreateScraperInstance({ successCb = null }) {
    const { toast } = useToast();
    const form = useForm({
        scraperName: "",
    });

    const submit = () => {
        form.post(route("scraper-processes.create-instance"), {
            preserveScroll: true,
            onSuccess: () => {
                form.reset();
                if (_.isFunction(successCb)) {
                    successCb();
                    toast({
                        variant: "success",
                        description: "Scraper instance has been created.",
                    });
                }
            },
            onError: () => {
                toast({
                    variant: "destructive",
                    title: "Uh oh! Something went wrong.",
                    description: "There was a problem with your request.",
                });
            }
        });
    };

    const onChange = (value) => form.setData("scraperName", value);

    return (
        <Dialog>
            <DialogTrigger>
                <Button size="sm" variant="secondary">
                    Create Scraper Instance
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Create a New Scraper Instance</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                    <div>
                        <Select
                            name="scraperName"
                            onValueChange={onChange}
                            value={form.data.scraperName}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Scraper for..." />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    {Object.keys(Dealer).map((key) => (
                                        <SelectItem key={key} value={Dealer[key]}>
                                            {Dealer[key]}
                                        </SelectItem>
                                    ))}
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                <DialogFooter className="flex item-center justify-between">
                    <DialogClose asChild>
                        <Button type="button" variant="secondary">
                            Close
                        </Button>
                    </DialogClose>
                    <Button type="submit" variant="outline" onClick={submit}>
                        Submit
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
