<script setup lang="ts">
import Comment from '@/components/SinglePost/Comment.vue'
import AddComment from '@/components/SinglePost/AddComment.vue'
const props = defineProps({
    comments: {
        type: Array,
    },
    post: {
        type: Object,
        required: true,
    }
});
const { comments } = props;
</script>

<template>
    <UContainer class="w-full m-auto py-4 mt-2 md:mt-4 lg:mt-0" :ui="{padding: 'px-0 md:px-0 lg:px-0'}">
        <UCard :ui="{ body: { padding: 'px-0 md:px-0 lg:px-4'} }">
            <AddComment :post="post" />
            <UContainer 
            :ui="{ padding: 'lg:px-0' }"
            v-if="comments && comments.length > 0" 
            class="m-auto relative max-h-[400px] overflow-y-scroll gap-2 flex flex-col py-1">
                <Comment 
                v-for="comment in comments" 
                :comment="comment" />
            </UContainer>
        </UCard>
    </UContainer>
</template>