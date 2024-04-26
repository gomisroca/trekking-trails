<script setup lang="ts">
import { getUser } from '~/utils/users';
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
const confirmationOpen = ref(false)
const deleteOpen = ref(false);
async function onSubmit() {
    try {
        error.value = null;
        success.value = null;
        confirmationOpen.value = false;
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
        <UFormGroup label="Change Password?" name="newPasswordToggle" class="uppercase font-semibold">
            <UToggle v-model="newPasswordToggle" />
        </UFormGroup>
        <UFormGroup v-if="newPasswordToggle" label="New Password" name="newPassword" class="uppercase font-semibold">
            <UInput
            v-model="state.newPassword"
            />
        </UFormGroup>
        <UFormGroup label="Current Password" name="oldPassword" class="pt-6 uppercase font-semibold" :error="!state.oldPassword && 'Required'">
            <UInput
            v-model="state.oldPassword"
            />
        </UFormGroup>
        <UButton class="uppercase font-bold dark:text-secondary" @click="confirmationOpen = true">Update</UButton>
        <UModal v-model="confirmationOpen">
            <UFormGroup label="Are you sure you want to update your settings?" class="p-8 uppercase font-semibold">
                <UButton @click="onSubmit" class="uppercase font-bold dark:text-secondary">Confirm</UButton>
            </UFormGroup>
        </UModal>
        <span v-if="success" class="text-primary font-semibold">{{ success }}</span>
        <span v-if="error" class="text-red-500 font-semibold">{{ error }}</span>
        <div>
            <UButton @click="deleteOpen = true" label="Delete Account" color="red" size="sm"  class="dark:text-secondary font-bold uppercase" />
            <UModal v-model="deleteOpen">
                <UFormGroup label="Are you sure you want to delete your account?" class="p-8 uppercase font-semibold">
                    <UButton color="red" @click="deleteUser(user.id); deleteOpen = false;" class="uppercase font-bold dark:text-secondary">Confirm</UButton>
                </UFormGroup>
            </UModal>
        </div>
    </form>
</template>
