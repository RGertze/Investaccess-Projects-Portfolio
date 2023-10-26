<script lang="ts">
    import { push } from "svelte-spa-router";
    import pb from "../api/pb";

    let email = "";
    let password = "";

    const onFormSubmit = async (event: Event) => {
        event.preventDefault();

        if (email === "" || password === "") {
            alert("Please fill in all fields");
            return;
        }

        try {
            const response = await pb.collection("users").create({
                email: email,
                emailVisibility: true,
                password: password,
                passwordConfirm: password,
                name: "n/a",
            });

            if (response.error) {
                alert(response.error);
                return;
            }

            push("/login");
        } catch (e) {
            console.log(e["data"]["data"]);
            let message = e["data"]["data"]["email"];
            if (message === undefined) message = e["data"]["data"]["password"];
            if (message === undefined) {
                alert("Unknown error");
                return;
            }

            alert(message["message"]);
        }
    };
</script>

<div class="register">
    <h1>Register</h1>

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

        <button type="submit">Register</button>
    </form>
</div>

<style>
    .register {
        width: 100vw;
        display: flex;
        flex-direction: column;
        align-items: center;
        padding-top: 2rem;
    }
</style>
