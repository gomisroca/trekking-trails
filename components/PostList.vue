<script setup lang="ts">
import { getPosts } from '@/utils/posts'
import Date from '@/components/Date.vue'
import type { Post, User } from '@prisma/client';
import {
    onMounted,
    ref
} from 'vue'

interface PostWithAuthor extends Post{
    author: User
}
const posts = ref<PostWithAuthor[]>([]);

async function fetchPosts() {
    try {
        const response = await getPosts();
        posts.value = response;
        console.log(posts.value)
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
    <UContainer class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <UCard 
        class="relative"
        v-for="post in posts" 
        :key=post.title>
            <div 
            v-if="post.covers && post.covers[0]" 
            className='rounded-t-md overflow-hidden grid content-center'>
                <img className='rounded-t-md h-[100px] md:h-[200px] align-center w-full' :src=post.covers[0] />
            </div>
            <div className='mx-6 absolute left-0 right-0 top-[160px] bottom-[160px] z-10 bg-neutral-800/80 p-2 items-center flex flex-col justify-center'>
                <div class="flex flex-col justify-center text-center">
                    <Date :date="post.date" />
                    <div class="flex">
                        <div 
                        class="mx-[2px] px-[8px]" 
                        v-for="cat in post.categories.slice(0, 4)">
                        {{ cat }}
                        </div>
                    </div>
                </div>
                <div className='font-semibold text-xl'>{{post.title}}</div>
                <div>
                    <small>
                        by {{post.author.name}}
                    </small>
                </div>
            </div>
            <div 
            v-if="post.covers && post.covers[1]" 
            className='rounded-b-md overflow-hidden grid content-center'>
                <img className='rounded-b-md h-[100px] md:h-[200px] align-center w-full' :src=post.covers[1] />
            </div>
        </UCard>
    </UContainer>
</template>