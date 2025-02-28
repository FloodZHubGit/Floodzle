<script>
    // This component displays a small grid showing opponent moves
    export let playerName;
    export let moves = [];
</script>

<div class="opponent-grid-container">
    <div class="opponent-name">{playerName}</div>
    <div class="opponent-grid">
        {#each Array(6) as _, rowIndex}
            <div class="opponent-row">
                {#each Array(5) as _, colIndex}
                    {#if moves[rowIndex] && moves[rowIndex].text && moves[rowIndex].status}
                        <div class="opponent-square 
                            {moves[rowIndex].status[colIndex] === 'correct' ? 'correct' : ''} 
                            {moves[rowIndex].status[colIndex] === 'present' ? 'present' : ''}">
                            <!-- Removed text display -->
                        </div>
                    {:else}
                        <div class="opponent-square"></div>
                    {/if}
                {/each}
            </div>
        {/each}
    </div>
</div>

<style>
    .opponent-grid-container {
        margin: 10px;
        display: inline-block;
    }
    
    .opponent-name {
        font-size: 14px;
        font-weight: bold;
        text-align: center;
        margin-bottom: 5px;
    }
    
    .opponent-grid {
        display: grid;
        grid-template-rows: repeat(6, 1fr);
        gap: 2px;
        background-color: #fff;
        border: 1px solid #000;
        border-radius: 5px;
        padding: 3px;
    }
    
    .opponent-row {
        display: grid;
        grid-template-columns: repeat(5, 1fr);
        gap: 2px;
    }
    
    .opponent-square {
        background-color: #444;
        width: 20px;
        height: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 3px;
    }
    
    .opponent-square.correct {
        background-color: #3eaa42;
    }
    
    .opponent-square.present {
        background-color: #cd8729;
    }
</style>