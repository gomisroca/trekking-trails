<template>
    <form class="p-8 flex flex-col space-y-4" @submit.prevent="onSubmit">
        <UFormGroup label="Title" name="title">
            <UInput
            v-model="state.title"
            />
        </UFormGroup>

        <UFormGroup label="Category" name="category">
            <UInput
            v-model="state.category"
            />
        </UFormGroup>

        <UFormGroup label="Content" name="content">
            <UTextarea  
            v-model="state.content"
            />
        </UFormGroup>
        
        <UFormGroup label="Author Name" name="author_name">
            <UInput
            v-model="state.author_name"
            />
        </UFormGroup>

        <UFormGroup label="Date" name="date">
            <UInput
            type="date"
            v-model="state.date"
            />
        </UFormGroup>
        <UFormGroup class="flex items-center justify-center">
            <label for="dropzone-file" class="flex flex-col items-center justify-center border-2 border-gray-300 hover:border-blue-200 rounded-full cursor-pointer">
                <input ref="covers" id="dropzone-file" type="file" multiple />
            </label>
        </UFormGroup>
        <UFormGroup class="flex items-center justify-center">
            <label for="dropzone-file" class="flex flex-col items-center justify-center border-2 border-gray-300 hover:border-blue-200 rounded-full cursor-pointer">
                <input ref="gallery" id="dropzone-file" type="file" multiple />
            </label>
        </UFormGroup>
        <UButton type="submit">Upload Post</UButton>
    </form>
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
        Array.from(covers.value.files).map((file, index) => formData.append('covers', file));
        Array.from(gallery.value.files).map((file, index) => formData.append('gallery', file));
        console.log(formData)
        success.value = uploadPost(formData);
    } catch (e) {
        error.value = e.statusMessage;
    }
}
</script>