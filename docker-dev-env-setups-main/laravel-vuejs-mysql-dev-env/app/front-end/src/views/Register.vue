<script setup lang="ts">

import {useRouter} from "vue-router";
import {ref} from "vue";
import {AuthApi} from "../api/authApi.ts";

const router = useRouter();
const email = ref("");
const password = ref("");
const confirmPassword = ref("");

const setEmail = (e: any) => {
    email.value = e.target.value;
}
const setPassword = (e: any) => {
    password.value = e.target.value;
}
const setConfirmPassword = (e: any) => {
    confirmPassword.value = e.target.value;
}

const register = async () => {
    if (password.value !== confirmPassword.value) {
        alert("Passwords do not match");
        return;
    }

    let result = await AuthApi.register(email.value, password.value);
    if (result === 0)
        return;
    else
        alert("Successfully registered");

    await router.push("/login");
}

</script>

<template>
    <h1>Register</h1>
    <v-form class="login-form">
        <v-text-field @change="setEmail" type="email" label="Email"></v-text-field>
        <v-text-field @change="setPassword" type="password" label="Password"></v-text-field>
        <v-text-field @change="setConfirmPassword" type="password" label="Confirm Password"></v-text-field>
        <v-btn @click="register">Register</v-btn>
    </v-form>
</template>

<style scoped>

.login-form {
    width: 400px;
    margin: 3rem auto 0;
}

</style>