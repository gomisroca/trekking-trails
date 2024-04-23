import type { Post, User } from "@prisma/client";

interface PostWithAuthor extends Post{
    author: User
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
        return res.posts
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