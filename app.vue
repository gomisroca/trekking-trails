<script setup lang="ts">
import bgDesktop from '@/public/bg-desktop.jpg'
import bgMobile from '@/public/bg-mobile.jpg'
import { getUser } from '~/utils/users'
const user: Ref<JWTUser> = useUser()
const { isMobileOrTablet } = useDevice();
const token = useCookie('trails_session')
if(!user.value && token.value){
    getUser();
}
</script>
<template>
    <!-- transition ease-in-out duration-1000 grayscale-0 lg:grayscale hover:grayscale-0  -->
    <main 
    :style="{ backgroundImage: `url(${isMobileOrTablet ? bgMobile : bgDesktop})` }" 
    class="animated-background min-h-screen flex min-w-screen overflow-x-hidden bg-cover">  
        <NuxtLayout name="default">
            <div 
            class="min-w-full min-h-screen items-center flex bg-gradient-to-br animated-background from-orange-400/50 via-cyan-400/50 to-emerald-600/50 dark:from-orange-800/50 dark:via-neutral-700/50 dark:to-neutral-900/50" >
                <Navmenu />
                <NuxtPage/>
            </div>
        </NuxtLayout>
    </main>
</template>
