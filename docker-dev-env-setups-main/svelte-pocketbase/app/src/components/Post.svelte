<script lang="ts">
    import { Trash } from "svelte-bootstrap-icons";
    import pb from "../api/pb";
    import type { IPost } from "../interfaces/interfaces";

    export let post: IPost;
    export let refresh: any;

    const likePost = async () => {
        if (post.likes.find((v) => v === pb.authStore.model.id)) {
            alert("Already liked");
            return;
        }

        try {
            await pb.collection("posts").update(post.id, {
                likes: [...post.likes, pb.authStore.model.id],
                dislikes: post.dislikes.filter(
                    (v) => v !== pb.authStore.model.id
                ),
            });
            refresh();
        } catch (e) {
            console.log(e);
            alert("Failed to like post");
        }
    };

    const dislikePost = async () => {
        if (post.dislikes.find((v) => v === pb.authStore.model.id)) {
            alert("Already disliked");
            return;
        }

        try {
            await pb.collection("posts").update(post.id, {
                dislikes: [...post.dislikes, pb.authStore.model.id],
                likes: post.likes.filter((v) => v !== pb.authStore.model.id),
            });
            refresh();
        } catch (e) {
            console.log(e);
            alert("Failed to dislike post");
        }
    };

    const deletePost = async () => {
        if (post.userId !== pb.authStore.model.id) {
            alert("Not your post!");
            return;
        }
        try {
            await pb.collection("posts").delete(post.id);
            refresh();
        } catch (e) {
            console.log(e);
            alert("Failed to delete post");
        }
    };
</script>

<article class="post">
    <header>
        {post.created.substring(0, 19)}
        {#if post.userId === pb.authStore.model.id}
            <button class="del-btn" on:click={deletePost}>
                <Trash width={24} height={24} fill="red" />
            </button>
        {/if}
    </header>
    {post.message}
    <footer>
        <div class="post-btns">
            <button on:click={() => likePost()}>
                Like:
                {post.likes.length}
            </button>
            <button on:click={() => dislikePost()}>
                Dislike:
                {post.dislikes.length}
            </button>
        </div>
    </footer>
</article>

<style>
    .post {
        width: 500px;
    }
    .post-btns {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-evenly;
    }

    button {
        width: 200px;
    }

    header {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
    }

    .del-btn {
        width: fit-content;
        height: fit-content;
        background-color: white;
        border: none;
    }
</style>
