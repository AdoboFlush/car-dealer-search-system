import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { useForm, usePage } from "@inertiajs/react"
import { useEffect, useState } from "react"
import { useToast } from "@/hooks/use-toast"
import { fetchPostComments } from "@/API/Blog"
import dayjs from "dayjs"
import { isFunction, isNull } from "lodash"


function Comment ({comment, isReply = false, successCb = null}) {

    // Track which comments have their reply box open
    const [openReplyIds, setOpenReplyIds] = useState({})

    // Toggle reply textarea visibility
    const toggleReply = (commentId) => {
        setOpenReplyIds((prev) => ({
            ...prev,
            [commentId]: !prev[commentId],
        }))
    }

    return (
        <div className="flex items-start space-x-4" key={`comment-${comment.id}`}>
            <Avatar>
                <AvatarImage src={comment.user?.profileImageLink} alt={comment.post?.user?.fullName} />
                <AvatarFallback>{comment.post?.user?.fullName[0]}</AvatarFallback>
            </Avatar>
            <div className="space-y-1 flex-1">
                <div className="flex items-center justify-between">
                    <p className="text-sm font-medium">{comment.user?.fullName}</p>
                    <p className="text-xs text-muted-foreground">{dayjs(comment.createdAt).format("MMMM DD, YYYY HH:mm:ss")}</p>
                </div>
                <p className="text-sm text-muted-foreground">{comment.content}</p>
                {!isReply && (
                    <>
                        <Button variant="ghost" size="sm" onClick={() => toggleReply(comment.id)}>
                            {openReplyIds[comment.id] ? "Cancel" : "Reply"}
                        </Button>
                        {openReplyIds[comment.id] && (
                            <CommentInputArea 
                                postId={comment.postId} 
                                commentId={comment.id} 
                                isReply={true} 
                                successCb={() => {
                                    toggleReply(comment.id);
                                    if(isFunction(successCb)) {
                                        successCb();
                                    }
                                }}
                            />
                        )}
                    </>
                )}
            </div>
        </div>
    );
}

function CommentInputArea({ postId, commentId = 0, successCb = null, isReply = false }) {

    const { toast } = useToast();

    const form = useForm({
        content: "",
        commentId: commentId,
    });

    const submit = () => {
        if (!form.data?.content?.trim()) return
        form.post(route("blogs.posts.comments.store", { post: postId }), {
            preserveScroll: true,
            onSuccess: () => {
                form.reset();
                toast({
                    variant: "success",
                    description: `New ${isReply ? "Reply" : "Comment"} has been added`,
                });
                if(isFunction(successCb)) {
                    successCb();
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
    }

    return (
        <div className="flex space-y-4">
            <Textarea placeholder="Leave a comment..." onChange={(e) => form.setData('content', e.target?.value)} />
            <Button type="submit" size="sm" className="ml-4" onClick={submit}>Submit</Button>
        </div>
    );
}

export function CommentSection({ postId }) {

    const { auth } = usePage();

    const [comments, setComments] = useState([]);

    const loadComments = () => {
        fetchPostComments({post: postId}).then((response) => {
            setComments(response.data);
        });
    };

    useEffect(() => {
        loadComments();
    }, []);

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold">Comments ({comments?.length})</h2>
            <div className="space-y-4">
                {comments.map((comment) => (
                    <div key={comment.id}>
                        <div className="space-y-4">
                            <Comment comment={comment} />
                            {comment.replies && (
                                <div className="ml-8 space-y-4">
                                    {comment.replies.map((reply) => (
                                        <Comment comment={reply} isReply={true} successCb={() => loadComments()} />
                                    ))}
                                </div>
                            )}
                        </div>
                        <Separator className="my-4" />
                    </div>
                ))}
            </div>
            {!isNull(auth?.user) && (
                <CommentInputArea postId={postId} successCb={() => loadComments()}/>
            )}
        </div>
    )
}

