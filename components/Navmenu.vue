<script setup lang="ts">
import { useUser } from '~/composables/states'
import { logoutUser } from '~/utils/users'
const user: Ref<JWTUser> = useUser()

const openRegister = ref<boolean>(false)
const openLogin = ref<boolean>(false)
</script>
<template>
    <UPopover>
        <UButton color="white" label="Open" />
        <template #panel>
            <UCard>
                <div class="grid grid-cols-2 gap-2">
                    <UTooltip text="Toggle Theme">
                        <ThemeToggle />
                    </UTooltip>
                    <UTooltip text="Inbox">
                        <UButton variant="outline" icon="i-heroicons-envelope-solid"  />
                    </UTooltip>
                    <UTooltip text="Collection">
                        <UButton variant="outline" icon="i-heroicons-book-open-solid"  />
                    </UTooltip>
                    <UTooltip text="Search">
                        <UButton variant="outline" icon="i-heroicons-magnifying-glass"  />
                    </UTooltip>
                </div>
                <UDivider icon="i-heroicons-user-circle" class="py-4" />
                <div class="flex items-center">
                    <div v-if="user" class="w-full flex flex-col gap-2 items-center">
                        <span class="uppercase font-bold m-auto">{{user.name}}</span>
                        <UButton label="Log Out" class="bg-red-500 dark:bg-red-600 hover:bg-red-600 hover:dark:bg-red-700 uppercase font-bold dark:text-secondary" @click="logoutUser()" />
                    </div>
                    <div v-else class="w-full flex flex-col gap-2 items-center">
                        <UButton label="Login" class="uppercase font-bold dark:text-secondary" @click="openLogin = true" />
                        <UButton label="Register" class="uppercase font-bold dark:text-secondary" @click="openRegister = true" />
                    </div>
                </div>
            </UCard>
        </template>
    </UPopover>
    <UModal v-model="openRegister">
        <RegisterForm />
    </UModal>
    <UModal v-model="openLogin">
        <LoginForm />
    </UModal>
</template>
