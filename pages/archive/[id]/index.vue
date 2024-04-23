<script setup lang="ts">
import type { Post, User } from '@prisma/client';
import { getSinglePost } from '@/utils/posts';
import Date from '@/components/Date.vue';
import {
    onMounted,
    ref
} from 'vue'
const route = useRoute()
interface PostWithAuthor extends Post{
    author: User
}
const post = ref<PostWithAuthor | null>();

async function fetchPost() {
    try {
        const id: string = route.params.id as string;
        const response = await getSinglePost(id);
        post.value = response;
        console.log(post.value)
    } catch (err: any) {
        if (err.response) {
            console.log("Server Error:", err);
        }
    }
}

onMounted(() => {
    fetchPost();
});
</script>

<template>
    <!-- grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 -->
    <UContainer class="grid grid-flow-col auto-cols-max gap-4">
        <UCard v-if="post" class="relative hover:contrast-[1.1] transition duration-200">
            <NuxtLink :to="`/archive/${post.id}`">
                <div 
                v-if="post.covers && post.covers[0]" 
                className='rounded-t-md overflow-hidden grid content-center'>
                    <img className='rounded-t-md h-[150px] md:h-[200px] align-center w-full' :src="'/' + post.covers[0]" />
                </div>
                <div className='mx-4 md:mx-6 absolute left-0 right-0 top-[100px] bottom-[100px] md:top-[130px] md:bottom-[130px] lg:top-[160px] lg:bottom-[160px] z-10 bg-neutral-100/85 dark:bg-neutral-900/85 p-2 items-center flex flex-col justify-center'>
                    <div class="text-sm text-shadow-sm flex flex-col justify-center text-center">
                        <Date :date="post.date" />
                        <div class="flex">
                            <div 
                            class="mx-[2px] px-[8px]" 
                            v-for="cat in post.categories.slice(0, 4)">
                            {{ cat }}
                            </div>
                        </div>
                    </div>
                    <div className='font-semibold text-2xl text-shadow-md'>{{post.title}}</div>
                    <div>
                        <div class="text-sm text-shadow-sm">
                            by {{post.author.name}}
                        </div>
                    </div>
                </div>
                <div 
                v-if="post.covers && post.covers[1]" 
                className='rounded-b-md overflow-hidden grid content-center'>
                    <img className='rounded-b-md h-[150px] md:h-[200px] align-center w-full' :src="'/' + post.covers[1]" />
                </div>
            </NuxtLink>
        </UCard>
    </UContainer>
</template>