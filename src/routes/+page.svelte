<script>
    import Grille from '../components/Grille.svelte';
    import Top from '../components/Top.svelte';
    import Multiplayer from '../components/Multiplayer.svelte';
    import OpponentGrid from '../components/OpponentGrid.svelte';
    
    let gameMode = "menu"; // "menu", "solo", "multiplayer"
    let inMultiplayerMode = false;
    let multiplayerWordToGuess = "";
    let players = [];
    let opponentMoves = {};
    let scores = {};
    let roomCode = "";
    let isHost = false;
    let currentPlayerId = "";
    let gameStarted = false;
    
    let multiplayerRef;
    
    function handleMultiplayerModeChanged(event) {
        inMultiplayerMode = event.detail.inMultiplayerMode;
        if (inMultiplayerMode) {
            gameMode = "multiplayer";
        }
    }
    
    function handleGameStart(event) {
        multiplayerWordToGuess = event.detail.wordToGuess;
        gameStarted = true;
    }
    
    function handleRoundComplete(event) {
        scores = event.detail.scores;
    }
    
    function handleNewRound(event) {
        multiplayerWordToGuess = event.detail.wordToGuess;
        gameStarted = true;
    }
    
    function startSoloGame() {
        gameMode = "solo";
        inMultiplayerMode = false;
    }
    
    function startMultiplayerGame() {
        gameMode = "multiplayer";
    }
    
    function returnToMenu() {
        gameMode = "menu";
        gameStarted = false;
        inMultiplayerMode = false;
    }
    
    // Get formatted opponent names using PlayroomKit player profiles
    function getOpponentName(playerId) {
        const player = players.find(p => p.id === playerId);
        return player?.name || `Player ${players.indexOf(player) + 1}`;
    }
    
    // Get opponents (players except current player)
    $: opponents = players.filter(p => p.id !== currentPlayerId);
</script>

<title>Floodzle</title>
<meta name="description" content="Jouez au Floodzle en solo ou multijoueur">
<Top/>
<br>

<!-- Main Menu -->
{#if gameMode === "menu"}
    <div class="main-menu">
        <h2>Bienvenue sur Floodzle</h2>
        <div class="menu-options">
            <button class="menu-button" on:click={startSoloGame}>
                Mode Solo
            </button>
            <button class="menu-button" on:click={startMultiplayerGame}>
                Mode Multijoueur
            </button>
        </div>
    </div>
{:else if gameMode === "solo"}
    <div class="game-container solo-mode">
        <div class="controls">
            <button class="back-button" on:click={returnToMenu}>Retour au menu</button>
        </div>
        <Grille multiplayerMode={false} />
    </div>
{:else if gameMode === "multiplayer"}
    <div class="controls">
        <button class="back-button" on:click={returnToMenu}>Retour au menu</button>
    </div>
    
    <!-- Multiplayer Component -->
    <Multiplayer 
        bind:this={multiplayerRef}
        bind:inMultiplayerMode
        bind:wordToGuess={multiplayerWordToGuess}
        bind:players
        bind:opponentMoves
        bind:scores
        bind:roomCode
        bind:isHost
        bind:playerId={currentPlayerId}
        bind:gameStarted
        on:multiplayerModeChanged={handleMultiplayerModeChanged}
        on:gameStart={handleGameStart}
        on:roundComplete={handleRoundComplete}
        on:newRound={handleNewRound}
    />
    
    {#if inMultiplayerMode && gameStarted}
        <div class="game-container multiplayer-mode">
            <!-- Player's Grid in the middle -->
            <div class="player-grid">
                <h3>Votre grille</h3>
                <Grille 
                    multiplayerMode={inMultiplayerMode} 
                    {multiplayerWordToGuess}
                    {multiplayerRef}
                    {opponentMoves}
                    {players}
                />
            </div>
            
            <!-- Opponents Grids always on the right -->
            <div class="opponents-container">
                <h3>Adversaires</h3>
                <div class="opponents-grid">
                    {#if opponents.length > 0}
                        {#each opponents as opponent}
                            <OpponentGrid 
                                playerName={getOpponentName(opponent.id)} 
                                moves={opponentMoves[opponent.id] || []} 
                            />
                        {/each}
                    {:else}
                        <div class="waiting-message">En attente d'adversaires...</div>
                    {/if}
                </div>
            </div>
        </div>
    {/if}
{/if}

<style>
    :global(body) {
        display: flex;
        flex-direction: column;
        min-height: 100vh;
        margin: 0;
        padding: 0;
        font-family: Arial, sans-serif;
    }
    
    .main-menu {
        max-width: 500px;
        margin: 0 auto;
        padding: 20px;
        text-align: center;
    }
    
    .menu-options {
        display: flex;
        flex-direction: column;
        gap: 20px;
        margin-top: 30px;
    }
    
    .menu-button {
        background-color: white;
        border: 2px solid black;
        border-radius: 10px;
        padding: 15px 32px;
        font-size: 18px;
        cursor: pointer;
        font-weight: bold;
        transition: background-color 0.3s;
    }
    
    .menu-button:hover {
        background-color: rgb(211, 211, 211);
    }
    
    .controls {
        text-align: center;
        margin-bottom: 20px;
    }
    
    .back-button {
        background-color: white;
        border: 2px solid black;
        border-radius: 5px;
        padding: 8px 16px;
        cursor: pointer;
        font-weight: bold;
    }
    
    .back-button:hover {
        background-color: rgb(211, 211, 211);
    }
    
    .game-container.multiplayer-mode {
        display: flex;
        justify-content: center;
        position: relative;
        width: 100%;
    }
    
    .player-grid {
        margin: 0 auto;
        text-align: center;
        z-index: 1;
    }
    
    .player-grid h3 {
        margin-bottom: 10px;
    }
    
    .opponents-container {
        position: fixed;
        top: 200px;
        right: 20px;
        width: 200px;
        text-align: center;
        z-index: 2;
    }
    
    .opponents-container h3 {
        margin-bottom: 10px;
    }
    
    .opponents-grid {
        display: flex;
        flex-direction: column;
        gap: 15px;
        max-height: 70vh;
        overflow-y: auto;
        padding: 10px;
        background-color: rgba(255, 255, 255, 0.7);
        border-radius: 10px;
    }
    
    .waiting-message {
        padding: 10px;
        background-color: rgba(255, 165, 0, 0.1);
        border-radius: 5px;
        text-align: center;
    }
    
    /* Media query for small screens */
    @media (max-width: 800px) {
        .game-container.multiplayer-mode {
            flex-direction: column;
        }
        
        .opponents-container {
            position: static;
            width: 100%;
            margin-top: 30px;
        }
        
        .opponents-grid {
            flex-direction: row;
            flex-wrap: wrap;
            justify-content: center;
            max-height: none;
        }
    }
</style>