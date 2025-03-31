import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import AuthenticatedLayout from "@/components/layouts/AuthenticatedLayout";

import { FormTextError } from "@/components/partials/FormTextError"
import React, { useEffect, useState } from "react"
import _ from "lodash"
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import dayjs from "dayjs";
import { useToast } from "@/hooks/use-toast"
import { useForm, usePage } from "@inertiajs/react"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import FileUpload from "@/components/partials/FileUpload"
import { Save } from "lucide-react"
import { ActivityLogTable } from "@/components/partials/tables/ActivityLogsTable"
import { Edit } from "lucide-react"
import { CircleX } from "lucide-react"
import { DialogChangePassword } from "../../components/partials/dialogs/DialogChangePassword"

export default function Profile() {

    const { auth } = usePage().props;
    const { toast } = useToast();
    const [updateEnabled, setUpdateEnabled] = useState(false);

    const form = useForm({
        firstName: auth.user?.firstName,
        lastName: auth.user?.lastName,
        middleName: auth.user?.middleName,
        suffix: auth.user?.suffix,
        birthDate: auth.user?.birthDate,
        name: auth.user?.name,
        email: auth.user?.email,
        profileImage: "",
    });

    const onChange = (event) =>
        form.setData(event.target.name, event.target.type === "checkbox" ? event.target.checked : event.target.value);

    const breadcrumbItems = [
        {
            title: "Profile",
            href: "#",
            current: true,
        },
    ];

    useEffect(() => {
        
    }, []);

    const handleFilesUploaded = (file) => {
        form.setData('profileImage', file);
    };

    const handleUpdate = (e) => {
        e.preventDefault();
        form.post(route("profile.update"), {
            preserveScroll: true,
            onSuccess: () => {
                toast({
                    variant: "success",
                    description: "Account has been updated.",
                });
                setUpdateEnabled(updateEnabled ? false : true);
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

    const toggleUpdate = () => {
        if(updateEnabled) {
            form.reset(); 
        }
        setUpdateEnabled(updateEnabled ? false : true);
    };

    return (
        <AuthenticatedLayout breadcrumbItems={breadcrumbItems}>
            <div className="flex flex-col gap-3">
                <Card>
                    <CardContent>
                        <div className="flex items-center justify-between pb-2 pt-4 dark:border-gray-800">
                            <div className="flex items-center gap-4">
                                <Avatar className="h-12 w-12">
                                    <AvatarImage src={auth.user?.profileImageLink} alt="@shadcn" />
                                    <AvatarFallback>ADB</AvatarFallback>
                                </Avatar>
                                <div className="grid gap-1">
                                    <h1 className="text-xl font-semibold">{auth.user?.name}</h1>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">{auth.user?.email}</p>
                                </div>
                            </div>
                            <DialogChangePassword />
                        </div>
                    </CardContent>
                </Card>

                <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-2">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex justify-between items-center">
                                Basic Information
                                <span>
                                    <Button variant='default' size='sm' onClick={toggleUpdate}>
                                        {updateEnabled ? ( <><CircleX />Cancel</> ) : (<><Edit />Update</>) }
                                        
                                    </Button>
                                    {updateEnabled && (
                                        <Button onClick={handleUpdate} variant="secondary" size="sm" className="ml-2"> <Save /> Save Changes</Button>
                                    )}
                                </span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="pl-2">
                            <div className="space-y-4">
                                <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-1">
                                    <div>
                                        <Input
                                            type="text"
                                            name="name"
                                            value={form.data.name}
                                            placeholder="Username"
                                            disabled={true}
                                        />
                                        <FormTextError>{form.errors.name}</FormTextError>
                                    </div>
                                    <div>
                                        <Input
                                            type="email"
                                            name="email"
                                            value={form.data.email}
                                            placeholder="Email"
                                            disabled={true}
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
                                            disabled={!updateEnabled}
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
                                            disabled={!updateEnabled}
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
                                            disabled={!updateEnabled}
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
                                            disabled={!updateEnabled}
                                        />
                                        <FormTextError>{form.errors.suffix}</FormTextError>
                                    </div>

                                    <div>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <Button
                                                    disabled={!updateEnabled}
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
                                </div>

                                <div className="grid gap-4">
                                    {updateEnabled && (
                                        <FileUpload
                                            disabled={!updateEnabled}
                                            onFilesUploaded={handleFilesUploaded}
                                            defaultText="Upload Profile Image"
                                            uploadMode="single"
                                            mode="horizontal"
                                            acceptedFileTypes={{ "image/jpeg": ['.jpg'], "image/png": ['.png'] }}
                                            otherText='(JPEG or PNG up to 20MB)'
                                            errors={form.errors.profileImage}
                                        />
                                    )}
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <ActivityLogTable title="Activities" passedQueryParams={{ causerId: auth.user.id }} showCauser={false} />
                </div>

            </div>
        </AuthenticatedLayout>
    )
}
