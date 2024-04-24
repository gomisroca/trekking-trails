<script setup lang="ts">
import { getPosts } from '@/utils/posts'
import Date from '@/components/Date.vue'
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
    <UContainer class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <PostCard
        v-for="post in posts" 
        :post="post"
        :key=post.title />
    </UContainer>
</template>