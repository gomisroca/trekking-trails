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

// put /
export async function uploadPost(formData: FormData){
    const { message } = await $fetch('/api/posts/upload', {
        method: 'POST',
        body: formData,
    });
    return message
}

// // put /:id
// export async function editPost(data){
//   const res = await axios.put('http://localhost:3030/posts/' + data.get('id'), data, {
//   }).then(res => {
//       return res
//   })
  
//   return res
// }

// // delete /:id
// export async function removePost(id){
//   const res = await axios.delete('http://localhost:3030/posts/' + id, {
//   }).then(res => {
//       return res
//   })
  
//   return res
// }

// // put /:id/image
// export async function movePostImage(image, type, id){
//   const res = await axios.put('http://localhost:3030/posts/' + id + "/image", {
//     image: image,
//     type: type,
//   }).then(res => {
//       return res
//   })
  
//   return res
// }

// // delete /:id/image
// export async function removePostImage(image, type, id){
//   const res = await axios.delete('http://localhost:3030/posts/' + id + "/image", {
//     image: image,
//     type: type,
//   }).then(res => {
//       return res
//   })
  
//   return res
// }