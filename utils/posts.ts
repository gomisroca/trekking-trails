import type { Post } from "@prisma/client";

export async function getPosts(): Promise<any> {
  const res = await $fetch('/api/posts');
  console.log(res)
  return res.posts
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

// // get /:id
// export async function getPostData(id) {
//   const res = await axios.get('http://localhost:3030/posts/' + id).then(response => {
//     return response
//   })
  
//   return res
// }

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