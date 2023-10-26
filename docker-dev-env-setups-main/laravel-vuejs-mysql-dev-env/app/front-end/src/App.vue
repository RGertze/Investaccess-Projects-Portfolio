<script setup lang="ts">
import Navbar from "./components/Navbar.vue";
</script>

<template>
    <v-app>
        <Navbar/>
        <div class="main-container">
            <router-view></router-view>
        </div>
    </v-app>
</template>

<style scoped>

.main-container {
    width: 100vw;
    padding-left: 4rem;
    padding-right: 4rem;
    margin: 8rem 0 0;
}

</style>
