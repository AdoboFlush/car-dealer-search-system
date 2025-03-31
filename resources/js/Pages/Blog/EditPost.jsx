import AuthenticatedLayout from "@/components/layouts/AuthenticatedLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PostsTable } from "../../components/partials/tables/PostsTable";


import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useForm } from "@inertiajs/react"
import { FormTextError } from "@/components/partials/FormTextError"
import React from "react"
import _ from "lodash"
import { useToast } from "@/hooks/use-toast"
import { Textarea } from "@/components/ui/textarea";
import FileUpload from "@/components/partials/FileUpload";
import { Checkbox } from "@/components/ui/checkbox";

export default function EditPost({ post }) {

    const breadcrumbItems = [
        {
            title: "Blog Management",
            href: route("blogs"),
            current: false,
        },
        {
            title: "Edit Post",
            href: "#",
            current: true,
        },
    ];

    const { toast } = useToast();
    const form = useForm({
        title: post.title,
        content: post.content,
        subTitle: post.subTitle,
        isActive: post.isActive,
        thumbnail: "",
        blogImage: "",
    });

    const submit = () => {
        form.post(route("blogs.posts.update", { post: post.id }), {
            preserveScroll: true,
            onSuccess: () => {
                toast({
                    variant: "success",
                    description: "New post has been updated.",
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
                    <CardTitle>Edit Post</CardTitle>
                    <CardDescription>Update post details.</CardDescription>
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

                                <div className="items-top flex space-x-2 mb-5 justify-end">
                                    <Checkbox 
                                        name="isActive" 
                                        checked={form.data.isActive == 1 ? true : false}
                                        onCheckedChange={(checked) => {
                                            form.setData("isActive", checked ? 1 : 0);
                                        }}
                                    />
                                    <div className="leading-none">
                                        <label
                                            htmlFor="isActive" 
                                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                        >
                                            Is Active
                                        </label>
                                    </div>
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
                                <div className="flex justify-center">
                                    <img className="h-100 w-100" src={post.thumbnailLink} alt={"N/A"}></img>
                                </div>
                                
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
                                <div className="flex justify-center">
                                    <img className="h-100 w-100" src={post.blogImageLink} alt={"N/A"}></img>
                                </div>
                            </div>
                        </div>

                    </div>

                    <div className="space-y-4 mt-6">
                        <Button onClick={submit}>Update Post</Button>
                    </div>
                </CardContent>
            </Card>
        </AuthenticatedLayout>
    )
}
