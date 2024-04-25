import type { Post, User, Comment } from "@prisma/client";

interface PostWithAuthor extends Post{
    author: User,
    comments: Comment[]
}
interface SingleResponse extends Response{
    post: PostWithAuthor;
}
interface MultipleResponse extends Response{
    posts: PostWithAuthor[];
}

// Get Many
export async function getPosts(): Promise<PostWithAuthor[] | null> {
    const res = await $fetch<MultipleResponse>('/api/posts');
    if(res.status == 200){
        const posts = res.posts.filter(post => post.published == true)
        return posts
    }
    return null
}

// export async function getSortedPostsData() {
//     const allPostsData = await getPosts();
//     return (allPostsData).sort((a, b) => {
//         if (a.date < b.date) {
//             return 1;
//         } else {
//             return -1;
//         }
//     });
// }

//     export function getPostsByTag(tag) {
//       let data = allPostsData.data.filter(x => x.category.includes(tag));
//       return data.sort((a, b) => {
//         if (a.date < b.date) {
//           return 1;
//         } else {
//           return -1;
//         }
//       });
//     }

// Get Single
export async function getSinglePost(id: string): Promise<PostWithAuthor | null> {
    const res = await $fetch<SingleResponse>('/api/posts/' + id);
    if(res.status == 200){
        return res.post
    }
    return null
}

// Upload Post
export async function uploadPost(formData: FormData){
    const { message } = await $fetch<Response>('/api/posts/upload', {
        method: 'POST',
        body: formData,
    });
    return message
}

// Edit Single
export async function editPost(id: string, formData: FormData){
    const { message } = await $fetch<Response>('/api/posts/' + id,  {
        method: 'PUT',
        body: formData,
    });
    return message
}

// Delete Single
export async function removePost(id: string){
    const { message } = await $fetch<Response>('/api/posts/' + id,  {
        method: 'DELETE'
    });
    return message
}

// Publish or Hide Single
export async function toggleStatusPost(id: string){
    const { message } = await $fetch<Response>('/api/posts/' + id + '/status');
    return message
}

// Add Comment
export async function postComment(postId: string, userId: string, comment: string): Promise<Response>{
    const data = {
        postId: postId,
        userId: userId,
        comment: comment,
    }
    const res = await $fetch<Response>('/api/comments/',  {
        method: 'POST',
        body: data,
    });
    return res
}

// Move image
export async function movePostImage(image: string, type: string, id: string){
    const res = await $fetch<Response>('/api/posts/' + id + '/image',{
        method: 'PUT',
        body: {
            image: image,
            type: type
        }
    })
    return res
}

// Delete image
export async function removePostImage(image: string, type: string, id: string){
    const res = await $fetch<Response>('/api/posts/' + id + '/image',{
        method: 'DELETE',
        body: {
            image: image,
            type: type
        }
    })
    return res
}