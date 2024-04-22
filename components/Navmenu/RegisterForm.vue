<script setup lang="ts">
import { registerUser, getUser } from '~/utils/users';
const success = ref<string | null>();
const error = ref<string | null>();
const state = reactive({
    name: '',
    email: '',
    password: '',
})
async function onSubmit() {
    try {
        error.value = null;
        success.value = null;
        const data = {
            name: state.name,
            email: state.email,
            password: state.password
        }
        const res = await registerUser(data);
        if(res.status == 200){
            success.value = res.message;
            let sessionCookie;
            const today = new Date()
            const tomorrow = new Date(today)
            tomorrow.setDate(tomorrow.getDate() + 1)
            sessionCookie = useCookie('trails_session', { expires: tomorrow });
            sessionCookie.value = res.token;
            await getUser();
        }
    } catch (e: any) {
        error.value = e.statusMessage;
    }
}
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
        <UFormGroup label="Password" name="password" class="uppercase font-semibold">
            <UInput
            v-model="state.password"
            />
        </UFormGroup>
        <UButton type="submit" class="uppercase font-bold dark:text-secondary">Register</UButton>
        <div class="m-auto">
            <span v-if="success" class="text-primary font-semibold">{{ success }}</span>
            <span v-if="error" class="text-red-500 font-semibold">{{ error }}</span>
        </div>
    </form>
</template>
