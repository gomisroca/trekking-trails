<script setup lang="ts">
const props = defineProps({
  gallery: {
    type: Array,
    required: true,
  },
  selectedImage: {
    type: Number,
    required: true,
  },
});

const { selectedImage } = props;

const carouselRef = ref();
function setValue() {
  return carouselRef.value.select(selectedImage);
}
onMounted(() => {
  setTimeout(() => {
    if (!carouselRef.value) return;
    return carouselRef.value.select(selectedImage + 1);
  }, 1);
});

const GALLERY_URL = import.meta.env.VITE_APP_GALLERY_URL as string;
</script>

<template>
  <UCarousel
    ref="carouselRef"
    v-slot="{ item }"
    :items="gallery"
    :ui="{ item: 'basis-full' }"
    arrows
    class="rounded-md"
  >
    <img
      :src="GALLERY_URL + item"
      class="w-full rounded-md"
      draggable="false"
    />
  </UCarousel>
</template>
