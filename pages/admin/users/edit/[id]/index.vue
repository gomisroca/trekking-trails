<script setup lang="ts">
import { getUser, getSingleUser, getUserComments } from '~/utils/users';
import Comment from '@/components/SinglePost/Comment.vue';
definePageMeta({
    middleware: ['auth']
})
const success = ref<string | null>();
const error = ref<string | null>();
const newPasswordToggle = ref(false);
const confirmationOpen = ref(false);
const deleteOpen = ref(false);
const user: Ref<JWTUser> = useUser();
const route = useRoute();

const state = reactive({
    name: '',
    email: '',
    newPassword: '',
    comments: <any[]>[]
})

async function onSubmit() {
    try {
        error.value = null;
        success.value = null;
        confirmationOpen.value = false;
        const id: string = route.params.id as string;
        const data = {
            name: state.name,
            email: state.email,
            newPassword: state.newPassword
        }
        const res = await updateUser(id, data);
        if(res.status == 200){
            success.value = res.message;
            await getUser();
        }
    } catch (e: any) {
        error.value = e.statusMessage;
    }
}

async function fetchUser() {
    try {
        const id: string = route.params.id as string;
        const response = await getSingleUser(id);
        if(response){
            state.name = response.name;
            state.email = response.email;
            const commentsResponse = await getUserComments(id)
            if(commentsResponse){
                console.log(commentsResponse)
                state.comments = commentsResponse;
            }
        }
    } catch (err: any) {
        if (err.response) {
            console.log("Server Error:", err);
        }
    }
}

onMounted(() => {
    fetchUser();
});
</script>
<template>
    <UCard class="relative m-auto">
        <UCard>
            <form class="p-4 flex flex-col space-y-4" @submit.prevent="onSubmit">
                <UFormGroup label="Username" name="username" class="uppercase font-semibold" :error="!state.name && 'Required'">
                    <UInput
                    v-model="state.name"
                    />
                </UFormGroup>
                <UFormGroup label="Email" name="email" class="uppercase font-semibold" :error="!state.email && 'Required'">
                    <UInput
                    v-model="state.email"
                    />
                </UFormGroup>
                <UFormGroup label="Change Password? This could have critical consequences for the user" name="newPasswordToggle" class="uppercase font-semibold">
                    <UToggle v-model="newPasswordToggle" />
                </UFormGroup>
                <UFormGroup v-if="newPasswordToggle" label="New Password" name="newPassword" class="uppercase font-semibold">
                    <UInput
                    v-model="state.newPassword"
                    />
                </UFormGroup>
                <UButton class="uppercase font-bold dark:text-secondary" @click="confirmationOpen = true">Update</UButton>
                <UModal v-model="confirmationOpen">
                    <UFormGroup label="Are you sure you want to update these settings?" class="p-8 uppercase font-semibold">
                        <UButton @click="onSubmit" class="uppercase font-bold dark:text-secondary">Confirm</UButton>
                    </UFormGroup>
                </UModal>
                <div class="m-auto">
                    <span v-if="success" class="text-primary font-semibold">{{ success }}</span>
                    <span v-if="error" class="text-red-500 font-semibold">{{ error }}</span>
                </div>
                <div>
                    <UButton @click="deleteOpen = true" label="Delete Account" color="red" size="sm"  class="dark:text-secondary font-bold uppercase" />
                    <UModal v-model="deleteOpen">
                        <UFormGroup label="Are you sure you want to delete this account?" class="p-8 uppercase font-semibold">
                            <UButton color="red" @click="deleteUser(user.id); deleteOpen = false;" class="uppercase font-bold dark:text-secondary">Confirm</UButton>
                        </UFormGroup>
                    </UModal>
                </div>
            </form>
        </UCard>
        <UContainer 
        :ui="{ padding: 'lg:px-0' }"
        v-if="state.comments && state.comments.length > 0" 
        class="m-auto relative h-[400px] overflow-y-scroll gap-2 flex flex-col py-4 mt-8">
            <Comment 
            v-for="comment in state.comments" 
            :comment="comment" />
        </UContainer>
    </UCard>
</template>
