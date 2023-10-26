<script lang="ts">
    import { onMount } from "svelte";
    import pb from "../api/pb";
    import type { IPost } from "../interfaces/interfaces";
    import { push } from "svelte-spa-router";
    import { PlusCircle } from "svelte-bootstrap-icons";
    import Post from "../components/Post.svelte";

    let posts: IPost[] = [];
    let addingPost = false;
    let postContent = "";

    const getPosts = async () => {
        const retrievedPosts = await pb.collection("posts").getFullList({
            sort: "-created",
        });
        posts = retrievedPosts.map((p) => {
            return p as any;
        });
    };

    const addPost = async (event: Event) => {
        event.preventDefault();
        if (postContent === "") {
            alert("Please enter a message");
            return;
        }

        try {
            const post = await pb.collection("posts").create({
                userId: pb.authStore.model.id,
                message: postContent,
                likes: [],
                dislikes: [],
            });
            console.log(post);
            addingPost = false;
            postContent = "";
            getPosts();
        } catch (e) {
            console.log(e);
            alert("Failed to add post");
        }
    };

    onMount(() => {
        if (!pb.authStore.isValid) {
            push("/login");
        }

        getPosts();
    });
</script>

<div class="post-container">
    <div class="posts-header">
        <h1>Posts</h1>
        <button
            on:click={() => {
                addingPost = true;
            }}
            class="add-button"
        >
            <PlusCircle width={24} height={24} fill="green" />
        </button>
    </div>
    <div class="post-list">
        {#each posts as post}
            <Post {post} refresh={getPosts} />
        {/each}
        {#if posts.length === 0}
            <h4 class="no-posts-message">No posts</h4>
        {/if}
    </div>

    {#if addingPost}
        <dialog open>
            <article>
                <header>
                    <a
                        on:click={() => (addingPost = false)}
                        href="#close"
                        aria-label="Close"
                        class="close"
                    />
                    New Post
                </header>
                <form on:submit={(e) => addPost(e)}>
                    <label for="message">Message</label>
                    <textarea
                        id="message"
                        name="message"
                        rows="4"
                        cols="50"
                        bind:value={postContent}
                    />
                    <button type="submit">Submit</button>
                </form>
            </article>
        </dialog>
    {/if}
</div>

<style>
    .post-container {
        width: 100vw;
        display: flex;
        flex-direction: column;
        align-items: center;
        padding-top: 30px;
    }
    h1 {
        margin: 0;
    }
    .add-button {
        background-color: white;
        border: none;
        margin: 0;
        padding: 0;
        width: fit-content;
    }
    .posts-header {
        width: 500px;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        border-bottom: 1px solid #ccc;
        margin-bottom: 1rem;
    }
    .no-posts-message {
        padding-top: 40px;
    }
</style>
