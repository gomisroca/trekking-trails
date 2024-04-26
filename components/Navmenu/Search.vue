<script setup lang="ts">
import type { Post, User, Comment } from '@prisma/client';

interface PostWithAuthor extends Post{
    author: User,
    comments: Comment[]
}
const posts = ref<PostWithAuthor[]>([]);

async function fetchPosts() {
    try {
        const response = await getPosts();
        if(response){
            posts.value = response
            console.log(posts.value)
        }
    } catch (err: any) {
        if (err.response) {
            console.log("Server Error:", err);
        }
    }
}
function filterPostsByString(searchString: string) {
    // Filter the posts array to get posts that contain the searchString in any of their properties
    const postData = posts.value;
    const filteredPosts = postData.filter(post => {
        // Check if the searchString exists in the title, categories, or content of the post
        return (
            post.title.toLowerCase().includes(searchString.toLowerCase()) ||
            post.categories.some(category => category.toLowerCase().includes(searchString.toLowerCase())) ||
            post.content?.toLowerCase().includes(searchString.toLowerCase())
        );
    });

    return filteredPosts;
}

const searchInput = ref('');
const searchResult = ref<PostWithAuthor[]>([]);
const page = ref(1);
const pageCount = 5

const paginatedPosts = computed(() => {
  return searchResult.value.slice((page.value - 1) * pageCount, (page.value) * pageCount)
})
watch(searchInput, async() => {
    searchResult.value = filterPostsByString(searchInput.value);
})



onMounted(() => {
    fetchPosts();
});
</script>
<template>
    <form class="p-4 flex gap-4">
        <UFormGroup name="sesearchInputarch" class="flex-1 uppercase font-semibold">
            <UInput
            v-model="searchInput"
            placeholder="Search for anything..."
            />
        </UFormGroup>
    </form>
    <UContainer class="flex flex-col gap-2 items-center min-h-[20rem]" :ui="{padding: 'px-0 sm:px-0 lg:px-0'}">
        <UContainer class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2" :ui="{padding: 'px-0 sm:px-0 lg:px-0'}">
            <PostCard
            v-if="posts"
            v-for="post in paginatedPosts" 
            :post="post"
            :key=post.title />
        </UContainer>
        <UPagination 
        v-if="posts.length > pageCount"
        v-model="page" 
        :page-count="pageCount" 
        :total="searchResult.length"
        show-last show-first />
    </UContainer>
</template>