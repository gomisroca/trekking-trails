<script setup>
import { parseISO, format } from 'date-fns';

const dateString  = defineProps({
    date: String,
});
let string = (dateString.date).toString();
const date = parseISO(string);

</script>
<template>
    <time>{{format(date, 'LLLL d, yyyy')}}</time>
</template>

