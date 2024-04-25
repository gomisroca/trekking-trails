<script setup lang="ts">
import { useUser } from '~/composables/states'
import { postComment } from '@/utils/posts';

const props = defineProps({
    post: {
        type: Object,
        required: true,
    },
});

const { post } = props;
const user: Ref<JWTUser> = useUser()
const success = ref<string | null>();
const error = ref<string | null>();
const state = reactive({
  comment: ''
})

async function onSubmit () {
    try {
        error.value = null;
        success.value = null;
        const userData = user.value;
        if(userData){
        const res = await postComment(post.id, userData.id, state.comment);
            if(res.status == 200){
                success.value = res.message;
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
    <UContainer :ui="{ padding: 'lg:px-0 pb-6' }">
        <form  @submit.prevent="onSubmit" class="flex">
            <UFormGroup name="comment" class="flex-1 mr-2">
                <UTextarea 
                v-model="state.comment" 
                size="md"
                :ui="{ size: { md: 'text-md' } }"
                placeholder="Share your opinion" />
            </UFormGroup>
            <div class="flex flex-col items-center">
                <UTooltip class="flex-1" v-if="!success" text="Post">
                    <UButton 
                    type="submit" 
                    size="xl"
                    variant="ghost"
                    class="flex-1"
                    icon="i-heroicons-arrow-right-16-solid" />
                </UTooltip>
                <div class="m-auto">
                    <UIcon v-if="success" name="i-heroicons-check-16-solid" class="text-primary text-[2.5rem]"/>
                    <span v-if="error" class="text-red-500 font-semibold text-sm">{{ error }}</span>
                </div>
            </div>
        </form>
    </UContainer>
</template>