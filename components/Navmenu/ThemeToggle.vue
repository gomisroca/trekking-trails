<script setup>
const colorMode = useColorMode()
</script>

<template>
    <div>
        <UButton 
        variant="outline"
        v-if="colorMode.preference == 'dark'" 
        @click="colorMode.preference = 'light'" 
        icon="i-heroicons-sun-solid" />
        <UButton 
        variant="outline"
        v-else
        @click="colorMode.preference = 'dark'" 
        icon="i-heroicons-moon-solid" />
    </div>
</template>