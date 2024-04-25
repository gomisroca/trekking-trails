<template>
    <UContainer class="flex items-center my-4">
        <UCard class="mt-12 lg:mt-20">
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
                    <div class="grid grid-cols-1 md:grid-cols-2">
                        <UCard v-for="image in state.covers">
                            <img :src="'/' + image" class="rounded-md mb-2" />
                            <div class="flex justify-evenly">
                                <UButton @click="moveImageTo(image, 'covers')">To Gallery</UButton>
                                <UButton @click="removeImage(image, 'covers')">Remove</UButton>
                            </div>
                        </UCard>
                    </div>
                    <span v-if="coverMoveSuccess" class="text-primary font-medium">{{ coverMoveSuccess }}</span>
                    <span v-if="coverRemoveSuccess" class="text-primary font-medium">{{ coverRemoveSuccess }}</span>
                    <div class="font-light text-sm mt-2">Add New</div>
                    <input
                    class="file:rounded-l-md file:p-2 file:mr-5 p-[1px] file:dark:focus:ring-primary-400 file:border-[1px] relative block w-full disabled:cursor-not-allowed disabled:opacity-75 focus:outline-none border-0 rounded-md placeholder-gray-400 dark:placeholder-gray-500 text-sm shadow-sm bg-white dark:bg-gray-900 text-gray-900 dark:text-white ring-1 ring-inset ring-gray-300 dark:ring-gray-700 focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400"
                    ref="covers" type="file" multiple
                    />
                </UFormGroup>
                <UFormGroup label="Gallery Pictures" class="uppercase font-semibold">
                    <div class="grid grid-cols-1 md:grid-cols-2">
                        <UCard v-for="image in state.gallery">
                            <img :src="'/' + image" class="rounded-md mb-2" />
                            <div class="flex justify-evenly">
                                <UButton @click="moveImageTo(image, 'gallery')">To Covers</UButton>
                                <UButton @click="removeImage(image, 'gallery')">Remove</UButton>
                            </div>
                        </UCard>
                    </div>
                    <span v-if="galleryMoveSuccess" class="text-primary font-medium">{{ galleryMoveSuccess }}</span>
                    <span v-if="galleryRemoveSuccess" class="text-primary font-medium">{{ galleryRemoveSuccess }}</span>
                    <div class="font-light text-sm mt-2">Add New</div>
                    <input
                    class="file:rounded-l-md file:p-2 file:mr-5 p-[1px] file:dark:focus:ring-primary-400 file:border-[1px] relative block w-full disabled:cursor-not-allowed disabled:opacity-75 focus:outline-none border-0 rounded-md placeholder-gray-400 dark:placeholder-gray-500 text-sm shadow-sm bg-white dark:bg-gray-900 text-gray-900 dark:text-white ring-1 ring-inset ring-gray-300 dark:ring-gray-700 focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400"
                    ref="gallery" type="file" multiple
                    />
                </UFormGroup>
                <UButton type="submit" class="uppercase font-bold dark:text-secondary">Update Post</UButton>
            </form>
            <div class="m-auto">
                <span v-if="success" class="text-primary font-medium">{{ success }}</span>
                <span v-if="error" class="text-red-500 font-medium">{{ error }}</span>
            </div>
            <div class="m-auto flex mt-5 justify-evenly">
                <UButton v-if="state.published == false" @click="toggleStatusPost(route.params.id as string); state.published = true" label="Publish Post" color="green" size="sm" />
                <UButton v-else @click="toggleStatusPost(route.params.id as string); state.published = false" label="Hide Post" color="blue" size="sm" />
                <UButton @click="removePost(route.params.id as string)" label="Remove Post" color="red" size="sm" />
            </div>
        </UCard>
    </UContainer>
</template>

<script setup lang="ts">
import { useUser } from '~/composables/states'
import { getSinglePost, movePostImage, removePostImage, removePost, toggleStatusPost } from '@/utils/posts';
const covers = ref<HTMLInputElement>();
const gallery = ref<HTMLInputElement>();
const success = ref<string | null>();
const coverMoveSuccess = ref<string | null>();
const coverRemoveSuccess = ref<string | null>();
const galleryMoveSuccess = ref<string | null>();
const galleryRemoveSuccess = ref<string | null>();
const error = ref<string | null>();
const user: Ref<JWTUser> = useUser()
const route = useRoute()

const state = reactive({
    title: <string>'',
    categories: <string>'',
    content: <string | null>'',
    date: <string>'',
    covers: <string[]>[],
    gallery: <string[]>[],
    published: <boolean>false
})

async function fetchPost() {
    try {
        const id: string = route.params.id as string;
        const response = await getSinglePost(id);
        console.log(response)
        if(response){
            state.title = response.title;
            state.categories = response.categories.join(', ');
            state.content = response.content;
            state.covers = response.covers;
            state.gallery = response.gallery;
            state.published = response.published
            let d = new Date(response.date);
            let datestring = d.getFullYear().toString().padStart(4, '0') + '-' + (d.getMonth()+1).toString().padStart(2, '0') + '-' + d.getDate().toString().padStart(2, '0');
            state.date = datestring
        }
    } catch (err: any) {
        if (err.response) {
            console.log("Server Error:", err);
        }
    }
}

onMounted(() => {
    fetchPost();
})

async function moveImageTo(image: string, type: string){
    try{
        coverMoveSuccess.value = null;
        galleryMoveSuccess.value = null;
        coverRemoveSuccess.value = null;
        galleryRemoveSuccess.value = null;
        const id: string = route.params.id as string;
        const res = await movePostImage(image, type, id);    
        if (res.status == 200) {
            if(type == 'covers'){
                coverMoveSuccess.value = res.message;
            } else {
                galleryMoveSuccess.value = res.message;
            }
        }
    } catch (err: any){
        if(err.response){
            console.log("Server Error:", err);
        }
    }
}

async function removeImage(image: string, type: string){
    try{
        coverMoveSuccess.value = null;
        galleryMoveSuccess.value = null;
        coverRemoveSuccess.value = null;
        galleryRemoveSuccess.value = null;
        const id: string = route.params.id as string;
        const res = await removePostImage(image, type, id);
        if (res.status == 200) {
            if(type == 'covers'){
                coverRemoveSuccess.value = res.message;
            } else {
                galleryRemoveSuccess.value = res.message;
            }
        }
    } catch (err: any){
        if(err.response){
            console.log("Server Error:", err);
        }
    }
}

async function onSubmit() {
    try {
        const id: string = route.params.id as string;
        const userData = user.value;
        if(userData){
            error.value = null;
            success.value = null;
            const formData = new FormData();
            formData.append('title', state.title)
            formData.append('categories', state.categories)
            formData.append('content', state.content!)
            formData.append('user', userData.email)
            formData.append('date', state.date)
            Array.from(covers.value?.files as FileList).map((file, index) => formData.append('covers', file));
            Array.from(gallery.value?.files as FileList).map((file, index) => formData.append('gallery', file));
            console.log(formData)
            success.value = await editPost(id, formData);
        } else{
            error.value = 'You must be logged in to do this.'
        }
    } catch (e: any) {
        error.value = e.statusMessage;
    }
}
</script>