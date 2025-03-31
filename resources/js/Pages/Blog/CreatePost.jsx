import AuthenticatedLayout from "@/components/layouts/AuthenticatedLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PostsTable } from "../../components/partials/tables/PostsTable";


import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useForm } from "@inertiajs/react"
import { FormTextError } from "@/components/partials/FormTextError"
import React from "react"
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
import dayjs from "dayjs";
import { Textarea } from "@/components/ui/textarea";
import FileUpload from "@/components/partials/FileUpload";

export default function CreatePost() {

    const breadcrumbItems = [
        {
            title: "Blog Management",
            href: route("blogs"),
            current: false,
        },
        {
            title: "Create Post",
            href: "#",
            current: true,
        },
    ];

    const { toast } = useToast();
    const form = useForm({
        title: "",
        content: "",
        subTitle: "",
        thumbnail: "",
        blogImage: "",
    });

    const submit = () => {
        form.post(route("blogs.posts.store"), {
            preserveScroll: true,
            onSuccess: () => {
                form.reset();
                toast({
                    variant: "success",
                    description: "New post has been created.",
                });
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
        <AuthenticatedLayout breadcrumbItems={breadcrumbItems}>
            <Card>
                <CardHeader>
                    <CardTitle>Create a Post</CardTitle>
                    <CardDescription>Please enter the post details.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">

                            <div>
                                <div className="mb-5">
                                    <Input
                                        type="text"
                                        name="title"
                                        value={form.data.title}
                                        onChange={onChange}
                                        placeholder="Title"
                                    />
                                    <FormTextError>{form.errors.title}</FormTextError>
                                </div>
                                <div className="mb-5">
                                    <Input
                                        type="text"
                                        name="subTitle"
                                        value={form.data.subTitle}
                                        onChange={onChange}
                                        placeholder="Sub Title"
                                    />
                                    <FormTextError>{form.errors.subTitle}</FormTextError>
                                </div>
                                <div className="mb-5">
                                    <Textarea
                                        className="min-h-[500px]"
                                        name="content"
                                        value={form.data.content}
                                        onChange={onChange}
                                        placeholder="Content"
                                    />
                                    <FormTextError>{form.errors.content}</FormTextError>
                                </div>
                            </div>


                            <div>
                                <div className="grid gap-4">
                                    <FileUpload
                                        onFilesUploaded={(file) => {
                                            form.setData("thumbnail", file);
                                        }}
                                        defaultText="Upload Thumbnail"
                                        uploadMode="single"
                                        mode="horizontal"
                                        acceptedFileTypes={{ "image/jpeg": ['.jpg'], "image/png": ['.png'] }}
                                        otherText='(JPEG or PNG up to 20MB)'
                                        errors={form.errors.thumbnail}
                                    />
                                </div>

                                <div className="grid gap-4">
                                    <FileUpload
                                        onFilesUploaded={(file) => {
                                            form.setData("blogImage", file);
                                        }}
                                        defaultText="Upload Blog Image"
                                        uploadMode="single"
                                        mode="horizontal"
                                        acceptedFileTypes={{ "image/jpeg": ['.jpg'], "image/png": ['.png'] }}
                                        otherText='(JPEG or PNG up to 20MB)'
                                        errors={form.errors.blogImage}
                                    />
                                </div>

                            </div>


                        </div>
                    </div>

                    <div className="space-y-4 mt-6">
                        <Button onClick={submit}>Create Post</Button>
                    </div>
                </CardContent>
            </Card>
        </AuthenticatedLayout>
    )
}
