<script>
    import { onMount } from 'svelte';
    import { tweened } from 'svelte/motion';
    import { fade } from 'svelte/transition';
    import { fly } from 'svelte/transition';
    import { slide } from 'svelte/transition';
    import { scale } from 'svelte/transition';
</script>

<!--create a nice header for a wordle game called floodzle-->
<div class="header">
    <h1>Floodzle</h1>
</div>

<style>
    .header{
        text-align: center;
        font-family: 'Courier New', Courier, monospace;
        font-size: 10px;
        color: #000000;
        background-color: #ffffff;
        border: 2px solid #000000;
        border-radius: 10px;
        padding: 10px;
        margin: 10px;
    }
</style>