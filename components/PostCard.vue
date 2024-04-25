<script setup lang="ts">
import Date from '@/components/Date.vue'
const props = defineProps({
    post: {
        type: Object,
        required: true,
    },
});
const { post } = props;
</script>

<template>
        <UCard 
        class="relative hover:contrast-[1.1] transition duration-200"
        :key=post.title>
            <NuxtLink :to="`/archive/${post.id}`">
                <div 
                v-if="post.covers && post.covers[0]" 
                className='rounded-t-md overflow-hidden grid content-center'>
                    <img className='rounded-t-md h-[150px] md:h-[200px] align-center w-full' :src=post.covers[0] />
                </div>
                <div className='mx-4 md:mx-6 absolute left-0 right-0 top-[100px] bottom-[100px] md:top-[130px] md:bottom-[130px] lg:top-[160px] lg:bottom-[160px] z-10 bg-neutral-100/85 dark:bg-neutral-900/85 p-2 items-center flex flex-col justify-center'>
                    <div class="text-sm flex flex-col justify-center text-center">
                        <Date :date="post.date" />
                        <div class="flex">
                            <div 
                            class="mx-[2px] px-[8px]" 
                            v-for="cat in post.categories.slice(0, 4)">
                            {{ cat }}
                            </div>
                        </div>
                    </div>
                    <div className='font-semibold text-2xl'>{{post.title}}</div>
                    <div>
                        <div class="text-sm">
                            by {{ post.author.name.charAt(0).toUpperCase() + post.author.name.slice(1) }}
                        </div>
                    </div>
                </div>
                <div 
                v-if="post.covers && post.covers[1]" 
                className='rounded-b-md overflow-hidden grid content-center'>
                    <img className='rounded-b-md h-[150px] md:h-[200px] align-center w-full' :src=post.covers[1] />
                </div>
            </NuxtLink>
        </UCard>
</template>