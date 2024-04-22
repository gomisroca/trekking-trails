<script setup lang="ts">
    import { getUser } from '~/utils/users'
    const user: Ref<JWTUser> = useUser()
    const token = useCookie('trails_session')
    if(!user.value && token.value){
        getUser();
    }
</script>
<template>
    <main class="min-h-screen flex min-w-screen overflow-x-hidden">  
        <NuxtLayout name="default">
            <Navmenu />
            <NuxtPage/>
        </NuxtLayout>
    </main>
</template>
