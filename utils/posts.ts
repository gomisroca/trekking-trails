import type { Post, User, Comment } from "@prisma/client";

interface PostWithAuthor extends Post {
  author: User;
  comments: Comment[];
}
interface SingleResponse extends Response {
  post: PostWithAuthor;
}
interface MultipleResponse extends Response {
  posts: PostWithAuthor[];
}

// Get Many
export async function getPosts(): Promise<PostWithAuthor[] | null> {
  const res = await $fetch<MultipleResponse>("/api/posts/");
  if (res.status == 200) {
    return res.posts.filter((post) => post.published);
  }
  return null;
}

// Get Single
export async function getSinglePost(
  id: string
): Promise<PostWithAuthor | null> {
  const res = await $fetch<SingleResponse>("/api/posts/" + id);
  if (res.status == 200) {
    return res.post;
  }
  return null;
}

// Upload Post
export async function uploadPost(formData: FormData) {
  const { message } = await $fetch<Response>("/api/posts/upload", {
    method: "POST",
    body: formData,
  });
  return message;
}

// Edit Single
export async function editPost(id: string, formData: FormData) {
  const { message } = await $fetch<Response>("/api/posts/" + id, {
    method: "PUT",
    body: formData,
  });
  return message;
}

// Delete Single
export async function removePost(id: string) {
  const { message } = await $fetch<Response>("/api/posts/" + id, {
    method: "DELETE",
  });
  return message;
}

// Publish or Hide Single
export async function toggleStatusPost(id: string) {
  const { message } = await $fetch<Response>("/api/posts/" + id + "/status");
  return message;
}

// Add Comment
export async function postComment(
  postId: string,
  userId: string,
  comment: string
): Promise<Response> {
  const data = {
    postId: postId,
    userId: userId,
    comment: comment,
  };
  const res = await $fetch<Response>("/api/comments/", {
    method: "POST",
    body: data,
  });
  return res;
}

// Edit Comment
export async function editComment(
  commentId: string,
  comment: string
): Promise<Response> {
  const data = {
    commentId: commentId,
    content: comment,
  };
  const res = await $fetch<Response>("/api/comments/", {
    method: "PUT",
    body: data,
  });
  return res;
}

// Delete Comment
export async function deleteComment(commentId: string): Promise<Response> {
  const data = {
    commentId: commentId,
  };
  const res = await $fetch<Response>("/api/comments/", {
    method: "DELETE",
    body: data,
  });
  console.log(res);
  return res;
}

// Move image
export async function movePostImage(image: string, type: string, id: string) {
  const res = await $fetch<Response>("/api/posts/" + id + "/image", {
    method: "PUT",
    body: {
      image: image,
      type: type,
    },
  });
  return res;
}

// Delete image
export async function removePostImage(image: string, type: string, id: string) {
  const res = await $fetch<Response>("/api/posts/" + id + "/image", {
    method: "DELETE",
    body: {
      image: image,
      type: type,
    },
  });
  return res;
}
