import AuthenticatedLayout from "@/components/layouts/AuthenticatedLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PostsTable } from "@/components/partials/tables/PostsTable";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CommentsTable } from "@/components/partials/tables/CommentsTable";

export default function Index() {
    const breadcrumbItems = [
        {
            title: "Blog Management",
            href: "#",
            current: true, 
        },
    ];
    return (
        <AuthenticatedLayout breadcrumbItems={breadcrumbItems}> 
            <Card>
                <CardHeader>
                   <CardTitle>Blog Management</CardTitle>
                   <CardDescription>Manage blog contents.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Tabs defaultValue="posts" className="w-full">
                        <TabsList>
                            <TabsTrigger value="posts">Posts</TabsTrigger>
                            <TabsTrigger value="comments">Comments</TabsTrigger>
                        </TabsList>
                        <TabsContent value="posts">
                            <PostsTable />
                        </TabsContent>
                        <TabsContent value="comments">
                            <CommentsTable passedQueryParams={{commentId: 0}}/>
                        </TabsContent>
                    </Tabs>
                   
                </CardContent>
            </Card>
        </AuthenticatedLayout>
    )
}
