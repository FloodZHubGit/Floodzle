<script>
    import { page } from '$app/stores';

</script>

<svelte:head>
	<title>Error {$page.status}</title>
</svelte:head>

<div class="error">
    <h1>{$page.status}: {$page.error.message}</h1>
	<img
		src="https://http.cat/{$page.status}.jpg"
		alt="Error :'("
	/>
</div>

<style>
	.error {
		height: 100vh;
		display: grid;
		gap: var(--spacing-32);
		place-content: center;
		place-items: center;
	}
</style>
