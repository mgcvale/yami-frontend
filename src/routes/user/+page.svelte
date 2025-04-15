<script lang="ts">
    import { page } from "$app/state";   
</script>
<a href="/">go back</a>  
<p>User ID: {page.url.searchParams.get('id')} </p>