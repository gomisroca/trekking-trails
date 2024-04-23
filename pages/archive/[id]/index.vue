<script setup lang="ts">
import type { Post, User } from '@prisma/client';
import { getSinglePost } from '@/utils/posts';
import Date from '@/components/Date.vue';
import CarouselWrapper from '@/components/SinglePost/CarouselWrapper.vue'
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

const isOpen = ref<boolean>(false)
const selectedImage = ref<number>();

const selectImage = ((img: string) => {
    const idx = post.value?.gallery.findIndex(x => x == img);
    isOpen.value = true;
    selectedImage.value = idx;
})

onMounted(() => {
    fetchPost();
})
</script>

<template>
    <!-- grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 -->
    <UContainer class="w-screen pt-16 pb-4">
        <UCard v-if="post" class="m-auto relative">
            <div 
            v-if="post.covers && post.covers[0]" 
            className='rounded-md lg:h-[400px] overflow-hidden grid content-center'>
                <img className='rounded-md align-center w-full' :src="'/' + post.covers[0]" />
            </div>
            <div className='flex flex-col items-center justify-center p-2 lg:p-4'>
                <div class="text-sm text-shadow dark:text-shadow-sm flex flex-col justify-center text-center">
                    <Date :date="post.date" />
                    <div class="flex">
                        <div 
                        class="mx-[2px] px-[8px]" 
                        v-for="cat in post.categories.slice(0, 4)">
                        {{ cat }}
                        </div>
                    </div>
                </div>
                <div className='font-semibold text-2xl text-shadow-sm dark:text-shadow-md'>{{post.title}}</div>
                <div>
                    <div class="text-sm text-shadow dark:text-shadow-sm">
                        by {{post.author.name}}
                    </div>
                </div>
            </div>
            <UDivider />
            <div class="py-4 lg:px-6">
                {{ post.content }}
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 lg:py-4 gap-2">
                <div 
                v-for="image in post.gallery" 
                className='transition duration-200 hover:contrast-[1.1] rounded-md overflow-hidden grid content-center cursor-default md:cursor-pointer'>
                    <img 
                    class="w-full rounded-md"
                    :key="image"
                    :src="'/' + image" 
                    @click="selectImage(image)" />
                </div>
            </div>
        </UCard> 
    </UContainer>
    <UModal v-model="isOpen" class="hidden md:flex items-center justify-center" :overlay="false" :ui="{ width: 'mx-2 w-screen lg:mx-4 xl:mx-none xl:w-3/4 sm:max-w-none' }">
        <UCard class="m-auto flex justify-center items-center">
            <CarouselWrapper :selectedImage="selectedImage" :gallery="post!.gallery" />
        </UCard>
    </UModal>
</template>