<script setup lang="ts">

import {useRouter} from "vue-router";
import {ref} from "vue";
import {AuthApi} from "../api/authApi.ts";
import {useStore} from "../store/main.ts";

const store = useStore();

const router = useRouter();
const email = ref("");
const password = ref("");

const setEmail = (e: any) => {
    email.value = e.target.value;
}
const setPassword = (e: any) => {
    password.value = e.target.value;
}
const login = async () => {
    let result = await AuthApi.login(email.value, password.value);
    if (result === 0)
        return;

    store.commit("login", result);

    await router.push("/home");
}

</script>

<template>
    <h1>Login</h1>
    <v-form class="login-form">
        <v-text-field @change="setEmail" type="email" label="Email"></v-text-field>
        <v-text-field @change="setPassword" type="password" label="Password"></v-text-field>
        <v-btn @click="login">Login</v-btn>
    </v-form>
</template>

<style scoped>

.login-form {
    width: 400px;
    margin: 3rem auto 0;
}

</style>