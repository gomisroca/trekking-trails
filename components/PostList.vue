<script setup lang="ts">
import { getPosts } from '@/utils/posts'
import type { Post, User, Comment } from '@prisma/client';
import {
    onMounted,
    ref
} from 'vue'

interface PostWithAuthor extends Post{
    author: User,
    comments: Comment[]
}
const posts = ref<PostWithAuthor[]>([]);
const page = ref(1);
const pageCount = 5

const paginatedPosts = computed(() => {
  return posts.value.slice((page.value - 1) * pageCount, (page.value) * pageCount)
})

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

onMounted(() => {
    fetchPosts();
});
</script>

<template>
    <UContainer class="flex flex-col gap-2 items-center">
        <UContainer class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <PostCard
            v-for="post in paginatedPosts" 
            :post="post"
            :key=post.title />
        </UContainer>
        <UPagination 
        v-if="posts.length > pageCount"
        v-model="page" 
        :page-count="pageCount" 
        :total="posts.length"
        show-last show-first />
    </UContainer>
</template>