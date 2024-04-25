import type { User } from '@prisma/client';
import { useUser } from '~/composables/states';

export async function registerUser(form: any){
    const res = await $fetch('/api/users/register', {
        method: 'POST',
        body: form,
    });
    return res
}

export async function loginUser(form: any){
    const res = await $fetch('/api/users/login', {
        method: 'POST',
        body: form,
    });
    return res
}

export async function logoutUser(){
    const cookie = useCookie('trails_session');
    cookie.value = null;
    const userData: Ref<JWTUser | null> = useUser();
    userData.value = null;
}

export async function updateUser(id: string, form: any): Promise<Response>{
    const res = await $fetch<Response>('/api/users/' + id, {
        method: 'PUT',
        body: form,
    });
    return res
}

export async function deleteUser(id: string): Promise<Response>{
    const res = await $fetch<Response>('/api/users/' + id, {
        method: 'DELETE'
    });
    if(res.status == 200){
        const cookie = useCookie('trails_session');
        cookie.value = null;
        const userData: Ref<JWTUser | null> = useUser();
        userData.value = null;
    }
    return res
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

export async function getUsers(){
    const res = await $fetch('/api/users');
    return res.users
}
interface SingleResponse extends Response{
    user: User;
}
export async function getSingleUser(id: string){
    const res = await $fetch<SingleResponse>('/api/users/' + id);
    return res.user
}
