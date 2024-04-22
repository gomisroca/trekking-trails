import { useUser } from '~/composables/states';

export async function registerUser(form: any){
    const res = await $fetch('/api/users/register', {
        method: 'POST',
        body: form,
    });
    if(res.status == 200){
        await getUser();
    }
    return res
}

export async function loginUser(form: any){
    const res = await $fetch('/api/users/login', {
        method: 'POST',
        body: form,
    });
    if(res.status == 200){
        await getUser();
    }
    return res
}

export async function logoutUser(){
    const cookie = useCookie('trails_session');
    cookie.value = null;
    const userData: Ref<JWTUser | null> = useUser();
    userData.value = null;
}

export async function getUser(){
    const cookie = useCookie('trails_session');
    if(cookie){
        const res = await $fetch('/api/users/info');
        if(res.status == 200){
            const userData: Ref<JWTUser | null> = useUser();
            userData.value = res.user as JWTUser;
        }
    }
}

