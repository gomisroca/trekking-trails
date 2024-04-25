<script setup lang="ts">
import { registerUser, getUser } from '~/utils/users';
const success = ref<string | null>();
const error = ref<string | null>();
const user: Ref<JWTUser> = useUser()
const state = reactive({
    name: user ? user.value.name : '',
    email: user ? user.value.email : '',
    oldPassword: '',
    newPassword: '',
})
const newPasswordToggle = ref(false)
async function onSubmit() {
    try {
        error.value = null;
        success.value = null;
        const data = {
            name: state.name,
            email: state.email,
            oldPassword: state.oldPassword,
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
        <UFormGroup label="Change Password?" name="newPasswordToggle" class="uppercase font-semibold">
            <UToggle v-model="newPasswordToggle" />
        </UFormGroup>
        <UFormGroup v-if="newPasswordToggle" label="New Password" name="newPassword" class="uppercase font-semibold">
            <UInput
            v-model="state.newPassword"
            />
        </UFormGroup>
        <UFormGroup label="Enter current password to update settings" name="oldPassword" class="pt-6 uppercase font-semibold" :error="!state.oldPassword && 'Required'">
            <UInput
            v-model="state.oldPassword"
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
