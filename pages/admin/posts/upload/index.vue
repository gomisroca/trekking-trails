<template>
    <UContainer class="flex items-center">
        <UCard class="w-[600px]">
            <form class="p-2 flex flex-col space-y-6" @submit.prevent="onSubmit">
                <UFormGroup label="Title" name="title" class="uppercase font-semibold">
                    <UInput
                    
                    v-model="state.title"
                    />
                </UFormGroup>

                <UFormGroup label="Category" name="category" class="uppercase font-semibold">
                    <UInput
                    padded
                    v-model="state.category"
                    />
                </UFormGroup>

                <UFormGroup label="Content" name="content" class="uppercase font-semibold">
                    <UTextarea  
                    autoresize
                    v-model="state.content"
                    />
                </UFormGroup>
                
                <UFormGroup label="Author Name" name="author_name" class="uppercase font-semibold">
                    <UInput
                    v-model="state.author_name"
                    />
                </UFormGroup>

                <UFormGroup label="Date" name="date" class="uppercase font-semibold">
                    <UInput
                    type="date"
                    v-model="state.date"
                    />
                </UFormGroup>
                <UFormGroup label="Cover Pictures" class="uppercase font-semibold">
                    <input
                    class="file:rounded-l-md file:p-2 file:mr-5 p-[1px] file:dark:focus:ring-primary-400 file:border-[1px] relative block w-full disabled:cursor-not-allowed disabled:opacity-75 focus:outline-none border-0 rounded-md placeholder-gray-400 dark:placeholder-gray-500 text-sm shadow-sm bg-white dark:bg-gray-900 text-gray-900 dark:text-white ring-1 ring-inset ring-gray-300 dark:ring-gray-700 focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400"
                    ref="covers" type="file" multiple
                    />
                </UFormGroup>
                <UFormGroup label="Gallery Pictures" class="uppercase font-semibold">
                    <input
                    class="file:rounded-l-md file:p-2 file:mr-5 p-[1px] file:dark:focus:ring-primary-400 file:border-[1px] relative block w-full disabled:cursor-not-allowed disabled:opacity-75 focus:outline-none border-0 rounded-md placeholder-gray-400 dark:placeholder-gray-500 text-sm shadow-sm bg-white dark:bg-gray-900 text-gray-900 dark:text-white ring-1 ring-inset ring-gray-300 dark:ring-gray-700 focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400"
                    ref="gallery" type="file" multiple
                    />
                </UFormGroup>
                <UButton type="submit" class="uppercase font-bold dark:text-secondary">Upload Post</UButton>
            </form>
        </UCard>
    </UContainer>
</template>

<script setup>
import { uploadPost } from '@/utils/posts';
const covers = ref();
const gallery = ref();
const success = ref();
const error = ref();

const state = reactive({
    title: undefined,
    category: undefined,
    content: undefined,
    author_name: undefined,
    date: undefined,
})

async function onSubmit() {
    try {
        error.value = null;
        success.value = null;
        const formData = new FormData();
        formData.append('title', state.title)
        formData.append('content', state.content)
        formData.append('author_name', state.author_name)
        formData.append('date', state.date)
        console.log(covers.value.files)
        Array.from(covers.value.files).map((file, index) => formData.append('covers', file));
        Array.from(gallery.value.files).map((file, index) => formData.append('gallery', file));
        console.log(formData)
        success.value = uploadPost(formData);
    } catch (e) {
        error.value = e.statusMessage;
    }
}
</script>