<template>
    <UContainer class="flex items-center">
        <UCard class="w-[600px]">
            <form class="p-2 flex flex-col space-y-6" @submit.prevent="onSubmit">
                <UFormGroup label="Title" name="title" class="uppercase font-semibold">
                    <UInput
                    v-model="state.title"
                    />
                </UFormGroup>

                <UFormGroup label="Categories" name="categories" class="uppercase font-semibold">
                    <UInput
                    v-model="state.categories"
                    />
                </UFormGroup>

                <UFormGroup label="Content" name="content" class="uppercase font-semibold">
                    <UTextarea  
                    autoresize
                    v-model="state.content"
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
            <div class="m-auto">
                <span v-if="success" class="text-primary font-medium">{{ success }}</span>
                <span v-if="error" class="text-red-500 font-medium">{{ error }}</span>
            </div>
        </UCard>
    </UContainer>
</template>

<script setup lang="ts">
import { useUser } from '~/composables/states'
import { uploadPost } from '@/utils/posts';
definePageMeta({
    middleware: ['auth']
})
const covers = ref<HTMLInputElement>();
const gallery = ref<HTMLInputElement>();
const success = ref<string | null>();
const error = ref<string | null>();
const user: Ref<JWTUser> = useUser()

const state = reactive({
    title: '',
    categories: '',
    content: '',
    date: '',
})

async function onSubmit() {
    try {
        const userData = user.value;
        if(userData){
            error.value = null;
            success.value = null;
            const formData = new FormData();
            formData.append('title', state.title)
            formData.append('categories', state.categories)
            formData.append('content', state.content)
            formData.append('user', userData.email)
            formData.append('date', state.date)
            Array.from(covers.value?.files as FileList).map((file, index) => formData.append('covers', file));
            Array.from(gallery.value?.files as FileList).map((file, index) => formData.append('gallery', file));
            console.log(formData)
            success.value = await uploadPost(formData);
        } else{
            error.value = 'You must be logged in to do this.'
        }
    } catch (e: any) {
        error.value = e.statusMessage;
    }
}
</script>