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
        if (!carouselRef.value) return
        return carouselRef.value.select(selectedImage + 1)
    }, 1)
})

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
        <img :src="'/' + item" class="w-full rounded-md" draggable="false">
    </UCarousel>
</template>