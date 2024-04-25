<script setup lang="ts">
import { getUser, getSingleUser } from '~/utils/users';
definePageMeta({
    middleware: ['auth']
})
const success = ref<string | null>();
const error = ref<string | null>();
const newPasswordToggle = ref(false)
const user: Ref<JWTUser> = useUser()
const route = useRoute();

const state = reactive({
    name: '',
    email: '',
    newPassword: '',
})

async function onSubmit() {
    try {
        error.value = null;
        success.value = null;
        const data = {
            name: state.name,
            email: state.email,
            newPassword: state.newPassword
        }
        const res = await updateUser(user.value.id, data);
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
        console.log(response)
        if(response){
            state.name = response.name;
            state.email = response.email;
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
    <form class="p-4 flex flex-col space-y-4" @submit.prevent="onSubmit">
        <UFormGroup label="Username" name="username" class="uppercase font-semibold">
            <UInput
            v-model="state.name"
            />
        </UFormGroup>
        <UFormGroup label="Email" name="email" class="uppercase font-semibold">
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
        <UButton type="submit" class="uppercase font-bold dark:text-secondary">Update</UButton>
        <div class="m-auto">
            <span v-if="success" class="text-primary font-semibold">{{ success }}</span>
            <span v-if="error" class="text-red-500 font-semibold">{{ error }}</span>
        </div>
        <div>
            <UButton @click="deleteUser(user.id)" label="Delete Account" color="red" size="sm" />
        </div>
    </form>
</template>
