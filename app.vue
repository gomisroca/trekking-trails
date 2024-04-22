<script setup lang="ts">
    import backgroundImagePath from '@/public/background.jpg'
    import { getUser } from '~/utils/users'
    const user: Ref<JWTUser> = useUser()
    const token = useCookie('trails_session')
    if(!user.value && token.value){
        getUser();
    }
</script>
<template>
    <main :style="{ backgroundImage: `url(${backgroundImagePath})` }" class="transition ease-in-out duration-1000 grayscale-0 lg:grayscale hover:grayscale-0 min-h-screen flex min-w-screen overflow-x-hidden">  
        <NuxtLayout name="default">
            <div class="min-w-full min-h-screen">
                <Navmenu />
                <NuxtPage/>
            </div>
        </NuxtLayout>
    </main>
</template>
