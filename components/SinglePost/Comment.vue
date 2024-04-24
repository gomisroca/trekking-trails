<script setup lang="ts">
const props = defineProps({
    comment: {
        type: Object,
        required: true,
    },
});
const { comment } = props;
const date = comment.createdAt
</script>

<template>
    <UCard v-if="comment" class="mx-1 flex flex-col" :ui="{ ring: 'ring-neutral-300 dark:ring-neutral-700 hover:ring-neutral-400 hover:dark:ring-neutral-600 transition duration-200'}">
        <div class="rounded-md p-2 pt-0 gap-4 flex items-center">
            <span class="font-semibold">
                {{ comment.author.name.charAt(0).toUpperCase() + comment.author.name.slice(1) }}
            </span>
            <span class="text-sm mt-[0.2rem]">
                <Date :date="date" /> - {{ (new Date(date)).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) }}
            </span>
        </div>
        <div class="p-2 text-lg">
            {{ comment.content }}
        </div>
    </UCard>
</template>