<script lang="ts">
  import Router from "svelte-spa-router";
  import Home from "./views/Home.svelte";
  import Navbar from "./components/Navbar.svelte";
  import Login from "./views/Login.svelte";
  import Register from "./views/Register.svelte";

  const routes = {
    "/": Home,
    "/login": Login,
    "/register": Register,
  };
</script>

<main>
  <Navbar />
  <Router {routes} />
</main>

<style>
</style>
