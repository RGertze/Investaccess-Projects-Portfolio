<script setup lang="ts">

import {useStore} from "../store/main.ts";
import {useRouter} from "vue-router";
import {onMounted} from "vue";

const router = useRouter();

const store = useStore();

onMounted(() => {
    if (!store.getters.isLoggedIn)
        router.push("/login");
});

const logout = () => {
    store.commit("logout");
    router.push("/login");
}

</script>

<template>
    <v-app-bar :elevation="1">
        <v-toolbar-title>Task Manager</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn v-if="store.getters.isLoggedIn" to="/login" @click="logout">Logout</v-btn>
        <v-btn v-if="!store.getters.isLoggedIn" to="/login">Login</v-btn>
        <v-btn v-if="!store.getters.isLoggedIn" to="/register">Register</v-btn>
    </v-app-bar>
</template>