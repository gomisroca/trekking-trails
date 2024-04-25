<script setup lang="ts">
definePageMeta({
    middleware: ['auth']
})
</script>
<template>
    <UContainer>
        <UCard>
            <div class="py-4 flex justify-center uppercase font-semibold">
                <span>Admin Panel</span>
            </div>
            <div class="flex flex-col gap-4">
                <UCard>
                    <div class="flex gap-4">
                        <UButton variant="outline" label="See Posts" to="/admin/posts/" />
                        <UButton variant="outline" label="Add Post" to="/admin/posts/upload" />
                    </div>
                </UCard>
                <UCard>
                    <div class="flex gap-4">
                        <UButton variant="outline" label="See Users" to="/admin/users/" />
                    </div>
                </UCard>
            </div>
        </UCard>
    </UContainer>
</template>