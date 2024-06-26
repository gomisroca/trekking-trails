<script setup lang="ts">
import { useUser } from '~/composables/states'
const user: Ref<JWTUser> = useUser()
const props = defineProps({
    comment: {
        type: Object,
        required: true,
    },
});
const { comment } = props;
const createdAtDate = comment.createdAt;
const updatedAtDate = comment.updatedAt;
const success = ref<string | null>();
const error = ref<string | null>();
const deleteOpen = ref(false)
const state = reactive({
    showEditForm: <boolean>false,
    comment: comment.content,
})

async function onSubmit () {
    try {
        error.value = null;
        success.value = null;
        const userData = user.value;
        if(userData){
        const res = await editComment(comment.id, state.comment);
            if(res.status == 200){
                success.value = res.message;
                state.showEditForm = false;
                comment.content = state.comment;
            }
        }else{
            throw createError({
                statusMessage: "Not logged in",
                statusCode: 400,
            }); 
        }
    } catch (e: any) {
        error.value = e.statusMessage;
    }
}
</script>

<template>
    <UCard v-if="comment" class="mx-1 flex flex-col" :ui="{ ring: 'ring-neutral-300 dark:ring-neutral-700 hover:ring-neutral-400 hover:dark:ring-neutral-600 transition duration-200'}">
        <div class="rounded-md p-2 pt-0 gap-4 flex items-center">
            <div class="flex flex-row w-full justify-between">
                <div class="flex gap-6">
                    <div class="flex gap-2 items-center">
                        <span v-if="comment.author && comment.author.name.length > 0" class="font-semibold">
                            {{ comment.author.name.charAt(0).toUpperCase() + comment.author.name.slice(1) }}
                        </span>
                        <span v-else class="text-neutral-600">
                            User Deleted
                        </span>
                        <span class="text-sm mt-[0.2rem]">
                            <UTooltip text="Date of publication">
                                <Date :date="createdAtDate" /> - {{ (new Date(createdAtDate)).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) }}
                            </UTooltip>
                        </span>
                    </div>
                    <div v-if="createdAtDate !== updatedAtDate" class="text-sm mt-[0.2rem] flex items-center gap-1">
                        <UTooltip text="Date of this comment's last edit">
                            <UIcon name="i-heroicons-pencil-20-solid" class="mt-1" />
                            <Date :date="updatedAtDate" /> - {{ (new Date(updatedAtDate)).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) }}
                        </UTooltip>
                    </div>
                </div>
                <div class="flex gap-2">
                    <UTooltip text="Edit Comment"
                    v-if="user && user.id == comment.author.id && comment.content.length > 0">
                        <UButton 
                        variant="outline" 
                        icon="i-heroicons-pencil-20-solid" 
                        @click="state.showEditForm = !state.showEditForm"/>
                    </UTooltip>
                    <UTooltip text="Delete Comment" 
                    v-if="user && (user.id == comment.author.id || user.role == 'ADMIN') && comment.content.length > 0">
                        <UButton 
                        color="red"
                        variant="outline" 
                        icon="i-heroicons-trash-solid" 
                        @click="deleteOpen = true"/>
                        <UModal v-model="deleteOpen">
                            <UFormGroup label="Are you sure you want to delete this comment?" class="p-8 uppercase font-semibold">
                                <UButton 
                                color="red" 
                                @click="deleteComment(comment.id); deleteOpen = false;" 
                                class="uppercase font-bold dark:text-secondary">
                                    Confirm
                                </UButton>
                            </UFormGroup>
                        </UModal>
                    </UTooltip>
                </div>
            </div>
        </div>
        <div v-if="!state.showEditForm" class="p-2 text-lg">
            <span v-if="comment.content.length > 0">{{ comment.content }}</span>
            <span v-else class="text-neutral-600">This comment has been deleted.</span>
        </div>
        <form v-if="state.showEditForm"  @submit.prevent="onSubmit" class="flex">
            <UFormGroup name="comment" class="flex-1 mr-2" :error="!state.comment && 'Comment cannot be blank'">
                <UTextarea 
                v-model="state.comment" 
                size="md"
                :ui="{ size: { md: 'text-lg' } }" />
            </UFormGroup>
            <div class="flex flex-col items-center">
                <UButton 
                v-if="!success"
                type="submit" 
                size="xl"
                variant="ghost"
                class="flex-1"
                icon="i-heroicons-arrow-right-16-solid" />
                <div class="m-auto">
                    <UIcon v-if="success" name="i-heroicons-check-16-solid" class="text-primary text-[2.5rem]"/>
                    <span v-if="error" class="text-red-500 font-semibold text-sm">{{ error }}</span>
                </div>
            </div>
        </form>
    </UCard>
</template>