<script lang="ts">
    import { goto } from "$app/navigation";

    let id: string = $state("");
</script>

<label>
    Input the user id to whom you want to go to
    <input type="text" bind:value={id}>
</label>
<button onclick={() => {
            console.log("going thete");
            goto(`/user?id=${id}`);
        }}
        >Go there</button>