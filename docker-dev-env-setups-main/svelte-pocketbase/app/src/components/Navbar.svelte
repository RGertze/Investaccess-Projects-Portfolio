<script lang="ts">
    import { link, push } from "svelte-spa-router";
    import pb, { isAuthenticated } from "../api/pb";

    let isLoggedIn = pb.authStore.isValid;

    isAuthenticated.subscribe((value) => {
        isLoggedIn = value;
    });

    const logout = async () => {
        await pb.authStore.clear();
        push("/login");
    };
</script>

<nav>
    <ul>
        <li><h1><strong>Brand</strong></h1></li>
    </ul>
    <ul>
        <li><a href="/" use:link>Home</a></li>

        {#if !isLoggedIn}
            <li><a href="/login" use:link>login</a></li>
            <li><a href="/register" use:link>register</a></li>
        {:else}
            <li><button on:click={logout}>Logout</button></li>
        {/if}
    </ul>
</nav>

<style>
    nav {
        padding-left: 3rem;
        padding-right: 3rem;
        border-bottom: 1px solid #ccc;
    }
    h1 {
        font-size: 2rem;
        margin: 0;
    }
</style>
