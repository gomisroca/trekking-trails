<script setup lang="ts">
import { getPosts } from "@/utils/posts";
import type { Post, User, Comment } from "@prisma/client";
import { onMounted, ref } from "vue";

interface PostWithAuthor extends Post {
  author: User;
  comments: Comment[];
}
const res = ref(null);
const posts = ref<PostWithAuthor[]>([]);
const page = ref(1);
const pageCount = 5;

const paginatedPosts = computed(() => {
  return posts.value.slice(
    (page.value - 1) * pageCount,
    page.value * pageCount
  );
});

async function fetchPosts() {
  try {
    const response = await $fetch<PostWithAuthor[]>("/api/posts/");
    if (response) {
      posts.value = response;
    }
  } catch (err: any) {
    if (err.response) {
      console.log("Server Error:", err);
    }
  }
}

onMounted(() => {
  fetchPosts();
});
</script>

<template>
  <UContainer class="flex flex-col gap-2 items-center min-h-[28rem]">
    <UContainer class="flex flex-wrap gap-4">
      <PostCard
        v-if="posts"
        v-for="post in paginatedPosts"
        :post="post"
        :key="post.title"
      />
    </UContainer>
    <UPagination
      v-if="posts.length > pageCount"
      v-model="page"
      :page-count="pageCount"
      :total="posts.length"
      show-last
      show-first
    />
  </UContainer>
</template>
