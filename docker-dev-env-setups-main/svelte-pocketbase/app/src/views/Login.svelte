<script lang="ts">
    import { push } from "svelte-spa-router";
    import pb from "../api/pb";

    let email = "";
    let password = "";

    const onFormSubmit = async (event: Event) => {
        event.preventDefault();

        if (!email || !password) {
            alert("Please fill in all fields");
            return;
        }

        try {
            const response = await pb
                .collection("users")
                .authWithPassword(email, password);

            if (!pb.authStore.isValid) {
                alert("Invalid credentials");
                return;
            }

            push("/");
        } catch (e) {
            console.log(e["data"]);
            alert("Invalid credentials");
        }
    };
</script>

<div class="login">
    <h1>Login</h1>

    <form on:submit={(e) => onFormSubmit(e)}>
        <label for="email">Email</label>
        <input type="email" name="email" id="email" bind:value={email} />

        <label for="password">Password</label>
        <input
            type="password"
            name="password"
            id="password"
            bind:value={password}
        />

        <button type="submit">Login</button>
    </form>
</div>

<style>
    .login {
        width: 100vw;
        display: flex;
        flex-direction: column;
        align-items: center;
        padding-top: 2rem;
    }
</style>
