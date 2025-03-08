<script setup lang="ts">
import {RouterView} from 'vue-router';

//@ts-ignore
import Navbar from './components/Navbar.vue';
//@ts-ignore
import Search from './views/Search.vue';

</script>

<template>
  <header>
    <Navbar />
  </header>
  <div> 
    <RouterView />
  </div>
</template>

