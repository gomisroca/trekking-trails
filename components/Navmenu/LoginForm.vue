<script setup lang="ts">
import { loginUser, getUser } from '~/utils/users';
const success = ref<string | null>();
const error = ref<string | null>();
const state = reactive({
    email: '',
    password: '',
    keepAlive: false,
})
const route = useRoute()
async function onSubmit() {
    try {
        error.value = null;
        success.value = null;
        const data = {
            email: state.email,
            password: state.password,
            keepAlive: state.keepAlive
        }
        const res = await loginUser(data);
        if(res.status == 200){
            success.value = res.message;
            let sessionCookie;
            const today = new Date()
            if(!state.keepAlive){
                today.setHours(today.getHours() + 1)
                sessionCookie = useCookie('trails_session', { expires: today });
            }else{
                const tomorrow = new Date(today)
                tomorrow.setDate(tomorrow.getDate() + 1)
                sessionCookie = useCookie('trails_session', { expires: tomorrow });
            }
            sessionCookie.value = res.token;
            await getUser();
            await navigateTo({path: route.fullPath},{ open:{ target: '_self'} });
        }
    } catch (e: any) {
        error.value = e.statusMessage;
    }
}
</script>
<template>
    <form class="p-4 flex flex-col space-y-4" @submit.prevent="onSubmit">
        <UFormGroup label="Email" name="email" class="uppercase font-semibold" :error="!state.email && 'Required'">
            <UInput
            v-model="state.email"
            />
        </UFormGroup>
        <UFormGroup label="Password" name="password" class="uppercase font-semibold" :error="!state.password && 'Required'">
            <UInput
            v-model="state.password"
            />
        </UFormGroup>
        <UFormGroup label="Stay Logged In?" name="keepAlive" class="uppercase font-semibold flex items-center gap-2">
            <UToggle
            v-model="state.keepAlive"
            />
        </UFormGroup>
        <UButton type="submit" class="uppercase font-bold dark:text-secondary">Log In</UButton>
        <div class="m-auto">
            <span v-if="success" class="text-primary font-semibold">{{ success }}</span>
            <span v-if="error" class="text-red-500 font-semibold">{{ error }}</span>
        </div>
    </form>
</template>
