<script setup lang="ts">
import { useUser } from '~/composables/states'
import { logoutUser } from '~/utils/users'
import ThemeToggle from './ThemeToggle.vue';
import RegisterForm from './RegisterForm.vue';
import LoginForm from './LoginForm.vue';
const user: Ref<JWTUser> = useUser()

const openRegister = ref<boolean>(false)
const openLogin = ref<boolean>(false)
</script>
<template>
    <UPopover class="absolute top-4 right-4 lg:top-10 lg:right-10" mode="hover">
        <UButton color="white" size="lg" icon="i-heroicons-queue-list-solid" class="bg-neutral-100/60 dark:bg-neutral-900/60 hover:bg-neutral-100 hover:dark:bg-neutral-900 transition duration-200" />
        <template #panel>
            <UCard>
                <div class="grid grid-cols-2 gap-2">
                    <UTooltip text="Toggle Theme">
                        <ThemeToggle />
                    </UTooltip>
                    <UTooltip text="Inbox">
                        <UButton variant="outline" icon="i-heroicons-envelope-solid"  />
                    </UTooltip>
                    <UTooltip text="Archive">
                        <UButton variant="outline" icon="i-heroicons-book-open-solid"  />
                    </UTooltip>
                    <UTooltip text="Search">
                        <UButton variant="outline" icon="i-heroicons-magnifying-glass"  />
                    </UTooltip>
                </div>
                <UDivider class="my-2" />
                <div class="flex items-center">
                    <div v-if="user" class="w-full flex flex-col gap-2 items-center">
                        <span class="uppercase font-semibold m-auto">{{user.name}}</span>
                        <div class="grid grid-cols-2 gap-2">
                            <UTooltip text="Settings">
                                <UButton color="blue" variant="outline" icon="i-heroicons-cog-6-tooth-solid" />
                            </UTooltip>
                            <UTooltip text="Logout">
                                <UButton color="red" variant="outline" icon="i-heroicons-arrow-right-on-rectangle-solid" @click="logoutUser()" />
                            </UTooltip>
                            <UTooltip v-if="user.role == 'USER'" text="Admin">
                                <UButton color="yellow" variant="outline" icon="i-heroicons-lock-closed-solid" />
                            </UTooltip>
                        </div>
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
