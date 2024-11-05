<script setup lang="ts">
import type { Comment, Post, User } from "@prisma/client";
import { getSinglePost } from "@/utils/posts";
import Date from "@/components/Date.vue";
import CarouselWrapper from "@/components/SinglePost/CarouselWrapper.vue";
import CommentSection from "@/components/SinglePost/CommentSection.vue";
import { onMounted, ref } from "vue";
const route = useRoute();
const { isMobile, isTablet } = useDevice();
interface PostWithAuthor extends Post {
  author: User;
  comments: Comment[];
}
const post = ref<PostWithAuthor | null>();

async function fetchPost() {
  try {
    const id: string = route.params.id as string;
    const response = await getSinglePost(id);
    post.value = response;
    console.log(post.value);
  } catch (err: any) {
    if (err.response) {
      console.log("Server Error:", err);
    }
  }
}

const isOpen = ref<boolean>(false);
const selectedImage = ref<number>();

const selectImage = (img: string) => {
  const idx = post.value?.gallery.findIndex((x) => x == img);
  isOpen.value = true;
  selectedImage.value = idx;
};

const page = ref(1);
const pageCount = isMobile ? 1 : isTablet ? 2 : 3;

const paginatedImages = computed(() => {
  return post.value?.gallery.slice(
    (page.value - 1) * pageCount,
    page.value * pageCount
  );
});

onMounted(() => {
  fetchPost();
});
const COVER_URL = import.meta.env.VITE_APP_COVER_URL as string;
const GALLERY_URL = import.meta.env.VITE_APP_GALLERY_URL as string;
</script>

<template>
  <UContainer class="w-screen pt-16 pb-4 lg:pt-24">
    <UCard class="m-auto relative">
      <div
        v-if="post && post.covers && post.covers[0]"
        className="rounded-md lg:h-[400px] overflow-hidden grid content-center"
      >
        <img
          className="rounded-md align-center w-full"
          :src="COVER_URL + post.covers[0]"
        />
      </div>
      <USkeleton class="w-full h-[14rem] md:h-[28rem] lg:h-[400px]" v-else />
      <div className="flex flex-col items-center justify-center p-2 lg:p-4">
        <div class="text-sm flex flex-col justify-center text-center gap-1">
          <Date v-if="post && post.date" :date="post.date" />
          <USkeleton class="h-[1.5rem] w-[5rem]" v-else />
          <div v-if="post && post.categories" class="flex">
            <div
              class="mx-[2px] px-[8px]"
              v-for="cat in post.categories.slice(0, 4)"
            >
              {{ cat }}
            </div>
          </div>
          <USkeleton class="h-[1.5rem] w-[5rem]" v-else />
        </div>
        <div v-if="post && post.title" className="font-semibold text-2xl">
          {{ post.title }}
        </div>
        <USkeleton class="h-[3rem] w-[15rem] my-1" v-else />
        <div>
          <div v-if="post && post.author" class="text-sm">
            by
            {{
              post.author.name.charAt(0).toUpperCase() +
              post.author.name.slice(1)
            }}
          </div>
          <USkeleton class="h-[1.5rem] w-[5rem]" v-else />
        </div>
      </div>
      <UDivider />
      <div v-if="post && post.content" class="py-4 lg:px-6">
        {{ post.content }}
      </div>
      <div class="w-full my-2" v-else>
        <USkeleton class="w-1/4 h-[2.5rem]" />
        <USkeleton class="w-2/3 h-[2.5rem] my-1" />
        <USkeleton class="w-1/2 h-[2.5rem] my-1" />
        <USkeleton class="w-2/3 h-[10rem] my-1" />
      </div>
      <div
        v-if="post && paginatedImages"
        class="flex flex-col items-center gap-2"
      >
        <div
          class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 lg:py-4 gap-2"
        >
          <div
            v-for="image in paginatedImages"
            className="transition duration-200 hover:contrast-[1.1] rounded-md overflow-hidden grid content-center cursor-default md:cursor-pointer"
          >
            <img
              class="w-full rounded-md"
              :key="image"
              :src="GALLERY_URL + image"
              @click="selectImage(image)"
            />
          </div>
        </div>
        <UPagination
          v-if="post.gallery.length > pageCount"
          v-model="page"
          :page-count="pageCount"
          :total="post.gallery.length"
          show-last
          show-first
        />
      </div>
      <USkeleton class="w-full h-[13rem] lg:h-[17rem]" v-else />
      <CommentSection v-if="post" :comments="post.comments" :post="post" />
      <USkeleton class="w-full h-[15rem] my-2" v-else />
    </UCard>
  </UContainer>
  <UModal
    v-model="isOpen"
    class="hidden md:flex items-center justify-center"
    :overlay="false"
    :ui="{ width: 'mx-2 w-screen lg:mx-4 xl:mx-none xl:w-3/4 sm:max-w-none' }"
  >
    <UCard class="m-auto flex justify-center items-center">
      <CarouselWrapper
        :selectedImage="selectedImage"
        :gallery="post!.gallery"
      />
    </UCard>
  </UModal>
</template>
