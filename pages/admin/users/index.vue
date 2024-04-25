<script setup lang="ts">
import type { User } from '@prisma/client';
import {
    onMounted,
    ref
} from 'vue'
definePageMeta({
    middleware: ['auth']
})

const users = ref<User[]>([]);
const page = ref(1);
const pageCount = 5;

const paginatedUsers = computed(() => {
    console.log(users.value)
  return users.value.slice((page.value - 1) * pageCount, (page.value) * pageCount)
})

async function fetchUsers() {
    try {
        const response = await getUsers();
        if(response){
            users.value = response
            console.log(users.value)
        }
    } catch (err: any) {
        if (err.response) {
            console.log("Server Error:", err);
        }
    }
}

onMounted(() => {
    fetchUsers();
});
</script>

<template>
    <UContainer class="flex flex-col gap-2 items-center">
        <UContainer class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <NuxtLink 
            v-for="user in paginatedUsers"
            :to="`/admin/users/edit/${user.id}`"
            :key=user.id>
                <UCard 
                class="relative hover:contrast-[1.1] transition duration-200">
                    {{ user.name }} - {{  user.email }}
                </UCard>
            </NuxtLink>
        </UContainer>
        <UPagination 
        v-if="users.length > pageCount"
        v-model="page" 
        :page-count="pageCount" 
        :total="users.length"
        show-last show-first />
    </UContainer>
</template>