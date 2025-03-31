<?php

namespace App\Http\Controllers;

use App\Models\Comment;
use App\Models\Post;
use Carbon\Carbon;
use Illuminate\Http\RedirectResponse;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Pagination\Paginator;
use Illuminate\Support\Collection;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Inertia\Response;

class BlogController extends Controller
{
    public function index(Request $request): Response
    {
        return Inertia::render('Blog/Index');
    }

    public function getPosts(Request $request): Paginator|LengthAwarePaginator|Collection
    {
        $post = Post::with("user")->withCount(["comments"])
            ->when($request->title, fn($q) => $q->where("title", "LIKE", "%{$request->name}%"))
            ->when($request->is_opened, fn($q) => $q->where("is_opened", $request->is_opened));
        return $request->has("per_page") ? $post->paginate($request->per_page) : $post->get();
    }

    public function createPost(): Response
    {
        return Inertia::render('Blog/CreatePost');
    }

    public function storePost(Request $request): RedirectResponse
    {
        $post = new Post;
        $post->title = $request->title;
        $post->sub_title = $request->sub_title;
        $post->content = $request->content;
        $post->user_id = Auth::user()->id;
        if ($request->filled('thumbnail')) {
            $post->uploadImage($request->thumbnail, "thumbnail_path");
        }
        if ($request->filled('blog_image')) {
            $post->uploadImage($request->blog_image, "blog_image_path");
        }
        $post->save();

        return back();
    }

    public function editPost(Post $post): Response
    {
        return Inertia::render('Blog/EditPost', ["post" => collect($post)->keyToCamel()]);
    }

    public function updatePost(Request $request, Post $post): RedirectResponse
    {
        $post->title = $request->title;
        $post->sub_title = $request->sub_title;
        $post->content = $request->content;
        $post->is_active = $request->is_active;

        if ($request->filled('thumbnail')) {
            $post->uploadImage($request->thumbnail, "thumbnail_path");
        }
        if ($request->filled('blog_image')) {
            $post->uploadImage($request->blog_image, "blog_image_path");
        }

        $post->save();

        return back();
    }

    public function archivePost(Request $request)
    {
        return back();
    }

    public function showPost(Post $post): Response
    {
        return Inertia::render('Blog', ['post' => collect($post)->keyToCamel()]);
    }

    public function getComments(Request $request): Paginator|LengthAwarePaginator|Collection
    {
        $comments = Comment::with("user", "post")
            ->when($request->content, fn($q) => $q->where("content", "LIKE", "%{$request->content}%"))
            ->when($request->has("comment_id"), fn($q) => $q->where("comment_id", $request->comment_id))
            ->when($request->has("post_id"), fn($q) => $q->where("post_id", $request->post_id))
            ->with([
                'user',
                'post',
                'post.user',
                'replies',
                'replies.user',
            ]);

        return $request->has("per_page") ? $comments->paginate($request->per_page) : $comments->get();
    }

    public function getPostComments(Request $request, Post $post): Paginator|LengthAwarePaginator|Collection
    {
        $post = $post->comments()
            ->when($request->content, fn($q) => $q->where("content", "LIKE", "%{$request->name}%"))
            ->where("comment_id", 0)->with([
                'user',
                'post',
                'post.user',
                'replies',
                'replies.user',
            ]);

        return $request->has("per_page") ? $post->paginate($request->per_page) : $post->get();
    }

    public function createComment(Request $request) {
        
    }

    public function storeComment(Request $request, Post $post) 
    {
        $comment = Comment::create([
            'content' => $request->content,
            'user_id' => Auth::user()->id,
            'post_id' => $post->id,
            'comment_id' => $request->comment_id ? $request->comment_id : 0,
            'is_active' => true,
        ]);
        return back();
    }

    public function editComment(Request $request) {}

    public function updateComment(Request $request) {}

    public function archiveComment(Request $request) {}

    public function showComment(Request $request) {}

    public function updateMultiplePosts(Request $request): RedirectResponse
    {
        $allowable_update_fields = ["is_active"];
        if (is_array($request->ids) && in_array($request->field, $allowable_update_fields)) {
            foreach ($request->ids as $id) {
                $model = Post::find($id);
                if ($model) {
                    $model->update([$request->field => $request->value]);
                }
            }
        }
        return back();
    }

    public function updateMultipleComments(Request $request): RedirectResponse
    {
        $allowable_update_fields = ["is_active"];
        if (is_array($request->ids) && in_array($request->field, $allowable_update_fields)) {
            foreach ($request->ids as $id) {
                $model = Comment::find($id);
                if ($model) {
                    $model->update([$request->field => $request->value]);
                }
            }
        }
        return back();
    }
}
