<script setup lang="ts">
import { getPosts } from '@/utils/posts'
import type { Post, User, Comment } from '@prisma/client';
import {
    onMounted,
    ref
} from 'vue'
const state = reactive({
    categories: <string[]>[],
    months: <string[]>[],
    years: <number[]>[],
    filteredPosts: <Post[]>[],
    showCategories: <boolean>false,
    showYears: <boolean>false,
    showMonths: <boolean>false,
})
interface PostWithAuthor extends Post{
    author: User,
    comments: Comment[]
}
const posts = ref<PostWithAuthor[]>([]);

async function fetchPosts() {
    try {
        const response = await getPosts();
        if(response){
            posts.value = response
            console.log(posts.value)
            state.categories = getUniqueCategories(posts.value);
            console.log(state.categories)
            state.months = getUniqueMonths(posts.value);
            console.log(state.months)
            state.years = getUniqueYears(posts.value);
            console.log(state.years)
        }
    } catch (err: any) {
        if (err.response) {
            console.log("Server Error:", err);
        }
    }
}
function getUniqueCategories(posts: Post[]): string[] {
    const uniqueCategories = new Set();
    posts.forEach(post => {
        post.categories.forEach(category => {
            uniqueCategories.add(category);
        });
    });
    return Array.from(uniqueCategories) as string[];
}

function getUniqueMonths(posts: Post[]): string[] {    
    const uniqueMonths = new Set(); // Use a Set to automatically handle uniqueness

    // Iterate over each post and add its month and year to the uniqueMonths Set
    posts.forEach(post => {
        const date = new Date(post.date);
        const monthYearString = `${date.toLocaleString('en-GB', { month: 'long' })} ${date.getFullYear()}`; // Format: 'Month of Year'
        uniqueMonths.add(monthYearString);
    });

    // Convert the Set back to an array and return it
    return Array.from(uniqueMonths) as string[];
}

function getUniqueYears(posts: Post[]): number[] {
    const uniqueYears = new Set(); 
    posts.forEach(post => {
        const month = new Date(post.date).getFullYear();
        uniqueYears.add(month);
    });
    return Array.from(uniqueYears) as number[];
}

function filterByCategory(category: string) {
    const unfilteredPosts = posts.value;
    const filteredPosts = unfilteredPosts.filter(post => {
        return post.categories.includes(category.toLowerCase()); // Check if category exists in the categories array of the post
    });
    state.filteredPosts = filteredPosts
}

function filterByMonth(month: string) {
    const [monthName, year] = month.split(' '); // Split the input string into month name and year
    const monthIndex = new Date(`${monthName} 1, ${year}`).getMonth(); // Get the month index (0-indexed)
    console.log(monthName)
    const unfilteredPosts = posts.value;
    const filteredPosts = unfilteredPosts.filter(post => {
        const postDate = new Date(post.date);
        return postDate.getMonth() === monthIndex && postDate.getFullYear() === parseInt(year);
    });
    state.filteredPosts = filteredPosts
}

function filterByYear(year: number) {
    const unfilteredPosts = posts.value;
    const filteredPosts = unfilteredPosts.filter(post => {
        const postDate = new Date(post.date);
        return postDate.getFullYear() === year;
    });
    state.filteredPosts = filteredPosts
}

const { isMobile, isTablet } = useDevice();
const page = ref(1);
const pageCount = isMobile ? 1 : isTablet ? 2 : 3

const paginatedPosts = computed(() => {
    return state.filteredPosts.slice((page.value - 1) * pageCount, (page.value) * pageCount)
})
onMounted(() => {
    fetchPosts();
});
</script>
<template>
    <UCard class="flex flex-col min-h-[400px] lg:min-w-[600px] mx-auto mb-4 mt-16 md:mt-4 xl:mt-24" :ui="{ body: { padding: 'md:px-0' } }">
        <UContainer class="flex flex-col gap-2">
            <UCard>
                <div class="flex gap-2 items-center justify-evenly">
                    <UButton
                    class="font-bold"
                    variant="outline"
                    label="Category"
                    @click="state.showCategories = !state.showCategories; state.showYears = false; state.showMonths = false;" /> 
                    <UButton
                    class="font-bold"
                    variant="outline"
                    label="Year"
                    @click="state.showYears = !state.showYears; state.showCategories = false; state.showMonths = false;" /> 
                    <UButton 
                    class="font-bold"
                    variant="outline"
                    label="Month"
                    @click="state.showMonths = !state.showMonths; state.showCategories = false; state.showYears = false;" /> 
                </div>
            </UCard>
            <UCard v-if="state.showCategories || state.showMonths || state.showYears">
                <UContainer v-if="state.showCategories" class="flex grid-cols-4 gap-2 mt-2 justify-evenly">
                    <UButton 
                    variant="outline"
                    v-for="category in state.categories"
                    @click="filterByCategory(category)">
                        {{ category }}
                    </UButton>
                </UContainer>
                <UContainer v-if="state.showYears" class="flex grid-cols-4 gap-2 mt-2 justify-evenly">
                    <UButton 
                    variant="outline"
                    v-for="year in state.years"
                    @click="filterByYear(year)">
                        {{ year }}
                    </UButton>
                </UContainer>
                <UContainer v-if="state.showMonths" class="flex grid-cols-4 gap-2 mt-2 justify-evenly">
                    <UButton 
                    variant="outline"
                    v-for="month in state.months"
                    @click="filterByMonth(month)">
                        {{ month }}
                    </UButton>
                </UContainer>
            </UCard>
        </UContainer> 
        <UContainer class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-2 mt-8">
            <PostCard
            v-for="post in paginatedPosts" 
            :post="post"
            :key=post.title />
        </UContainer>
        <UPagination 
        class="justify-center mt-4"
        v-if="state.filteredPosts.length > pageCount"
        v-model="page" 
        :page-count="pageCount" 
        :total="state.filteredPosts.length"
        show-last show-first />
    </UCard>
</template>