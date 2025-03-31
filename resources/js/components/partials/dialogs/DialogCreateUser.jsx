import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useForm } from "@inertiajs/react"
import { FormTextError } from "@/components/partials/FormTextError"
import React, { useState } from "react"
import { DialogContainer } from "@/components/partials/DialogContainer"
import _ from "lodash"
import { useToast } from "@/hooks/use-toast"
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import dayjs from "dayjs"
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
import { PlusCircle } from "lucide-react"
import { MultiSelect } from "@/components/partials/MultiSelect"
import { Roles } from "@/Utils/Constants/RolesPermissions"

export function DialogCreateUser({ successCb = null }) {
    const { toast } = useToast();
    const form = useForm({
        firstName: "",
        lastName: "",
        middleName: "",
        suffix: "",
        birthDate: "",
        name: "",
        email: "",
        password: "",
        password_confirmation: "",
        roles: "",
    });

    const submit = () => {
        form.post(route("user.store"), {
            preserveScroll: true,
            onSuccess: () => {
                form.reset();
                if (_.isFunction(successCb)) {
                    successCb();
                    toast({
                        variant: "success",
                        description: "New user has been created.",
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

    const onChange = (event) =>
        form.setData(event.target.name, event.target.type === "checkbox" ? event.target.checked : event.target.value);

    return (
        <Dialog>
            <DialogTrigger>
                <Button
                    size="sm"
                    variant="secondary"
                >
                    <PlusCircle />
                    Create
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] md:max-w-[700px] lg:max-w-[900px]">
                <DialogHeader>
                    <DialogTitle>Create User</DialogTitle>
                    <DialogDescription></DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-1">
                        <div>
                            <Input
                                type="text"
                                name="name"
                                value={form.data.name}
                                onChange={onChange}
                                placeholder="Username"
                            />
                            <FormTextError>{form.errors.name}</FormTextError>
                        </div>
                        <div>
                            <Input
                                type="email"
                                name="email"
                                value={form.data.email}
                                onChange={onChange}
                                placeholder="Email"
                            />
                            <FormTextError>{form.errors.email}</FormTextError>
                        </div>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
                        <div>
                            <Input
                                type="text"
                                name="firstName"
                                value={form.data.firstName}
                                onChange={onChange}
                                placeholder="First Name"
                            />
                            <FormTextError>{form.errors.firstName}</FormTextError>
                        </div>

                        <div>
                            <Input
                                type="text"
                                name="lastName"
                                value={form.data.lastName}
                                onChange={onChange}
                                placeholder="Last Name"
                            />
                            <FormTextError>{form.errors.lastName}</FormTextError>
                        </div>

                        <div>
                            <Input
                                type="text"
                                name="middleName"
                                value={form.data.middleName}
                                onChange={onChange}
                                placeholder="Middle Name"
                            />
                            <FormTextError>{form.errors.middleName}</FormTextError>
                        </div>

                        <div>
                            <Input
                                type="text"
                                name="suffix"
                                value={form.data.suffix}
                                onChange={onChange}
                                placeholder="Suffix"
                            />
                            <FormTextError>{form.errors.suffix}</FormTextError>
                        </div>

                        <div>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant={"outline"}
                                        className={cn(
                                            "w-[100%] justify-start text-left font-normal",
                                            !form.data.birthDate && "text-muted-foreground"
                                        )}
                                    >
                                        <CalendarIcon />
                                        <span>
                                            {form.data.birthDate ? form.data.birthDate : 'Birth Date'}
                                        </span>
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent>
                                    <Calendar
                                        mode="single"
                                        selected={form.data.birthDate}
                                        onSelect={(value) => form.setData("birthDate", dayjs(value).format('YYYY-MM-DD'))}
                                        initialFocus
                                    />
                                </PopoverContent>
                            </Popover>
                            <FormTextError>{form.errors.birthDate}</FormTextError>
                        </div>

                        <div>
                            <Input
                                type="password"
                                name="password"
                                value={form.data.password}
                                onChange={onChange}
                                placeholder="Password"
                            />
                            <FormTextError>{form.errors.password}</FormTextError>
                        </div>

                        <div>
                            <Input
                                type="password"
                                name="password_confirmation"
                                value={form.data.password_confirmation}
                                onChange={onChange}
                                placeholder="Confirm Password"
                            />
                        </div>

                        <div>
                            <MultiSelect
                                records={Object.keys(Roles).map((key) => { return {value: Roles[key], label: Roles[key]} })}
                                onChange={(roles) => form.setData("roles", roles.map((role) => role.value))}
                                placeholder="Select user roles..."
                            />
                            <FormTextError>{form.errors.roles}</FormTextError>
                        </div>

                    </div>
                </div>

                <DialogFooter className="flex item-center justify-between">
                    <DialogClose asChild>
                        <Button type="button" variant="secondary">
                            Close
                        </Button>
                    </DialogClose>
                    <Button type="submit" variant="outline" onClick={submit}>Submit</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
