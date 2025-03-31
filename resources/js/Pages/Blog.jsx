import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { AspectRatio } from "@/components/ui/aspect-ratio"
import { CommentSection } from "@/components/partials/CommentSection"

import GuestLayout from '@/components/layouts/GuestLayout';
import { Header } from '@/components/sections/landing/Header';
import { Footer } from '@/components/sections/landing/Footer';

export default function Blog({ post }) {
    return (
        <GuestLayout>
            <Header />
            <div className="container mx-auto px-4 py-8 mt-20">
                <Card className="max-w-4xl mx-auto overflow-hidden">
                    <div className="relative">
                        <AspectRatio ratio={16 / 9}>
                            <img src={post?.blogImageLink} alt="Hero image for the blog post" className="absolute inset-0 w-full h-full object-cover" />
                        </AspectRatio>
                    </div>
                    <CardHeader>
                        <h1 className="text-3xl font-bold tracking-tight lg:text-4xl">{post?.title}</h1>
                        <p className="text-xl text-muted-foreground mt-2">
                            {post?.subTitle}
                        </p>
                    </CardHeader>
                    <CardContent>
                        <Separator className="my-4" />
                        <div className="prose dark:prose-invert max-w-none">
                            <div dangerouslySetInnerHTML={{ __html: post?.content }} />
                        </div>
                        <Separator className="my-4" />
                        <CommentSection postId={post.id} />
                    </CardContent>
                </Card>
            </div>
            <Footer />
        </GuestLayout>
    )
}

