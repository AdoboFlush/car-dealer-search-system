import { MoveRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { fetchPosts } from "@/API/Blog";
import { isEmpty } from "lodash";
import { visit } from "@/Utils/Functions";

export default function BlogList({limit = 4}) {

    const [posts, setPosts] = useState([]);

    useEffect(() => {
        fetchPosts({ limit: limit, isActive: 1 }).then((response) => {
            setPosts(response.data);
        });
    }, []);

    return (
        <div className="w-full py-20 lg:py-40">
            <div className="container mx-auto flex flex-col gap-14">
                <div className="flex w-full flex-col sm:flex-row sm:justify-between sm:items-center gap-8">
                    <h4 className="text-3xl md:text-5xl tracking-tighter max-w-xl font-regular">
                        Latest blogs
                    </h4>
                    <Button className="gap-4">
                        View all blogs <MoveRight className="w-4 h-4" />
                    </Button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {!isEmpty(posts) && posts.map((post, k) => (
                        <div className="flex flex-col gap-2 hover:opacity-75 cursor-pointer" onClick={(e) => visit(e, 'blogs.posts.show', 'GET', {post: post.id})} key={k}>
                            <div className="bg-muted rounded-md aspect-video mb-4">
                                <img src={post.blogImageLink} alt="Blog image" className="object-cover w-full max-h-[10vw]" />
                            </div>
                            <h3 className="text-xl tracking-tight">{post.title}</h3>
                            <p className="text-muted-foreground text-base">
                                {post.subTitle}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}