<script>
    import { onMount, onDestroy } from "svelte";
    import { insertCoin, isHost as isPlayroomHost, myPlayer, getState, setState, onPlayerJoin, getRoomCode, waitForState, RPC } from "playroomkit";
    import { getRandomWord } from './Dictionnary.js';
    
    export let inMultiplayerMode = false;
    export let roomCode = "";
    export let isHost = false;
    export let players = [];
    export let wordToGuess = "";
    export let scores = {};
    export let opponentMoves = {};
    export let playerId = "";
    export let gameStarted = false;
    
    let errorMessage = "";
    let isReady = false;
    let gameInitialized = false;
    let playerName = "";
    let joinRoomCode = "";
    let showJoinForm = true;

    import { createEventDispatcher } from "svelte";
    const dispatch = createEventDispatcher();

    async function initializeGame(joinCode = null) {
        try {
            // Initialize PlayroomKit and wait for launch
            await insertCoin({ 
                gameId: "YOUR_GAME_ID",
                maxPlayersPerRoom: 4,
                skipLobby: true,
                roomCode: joinCode,
                onDisconnect: (reason) => {
                    if (isHost) {
                        // Handle host disconnection
                        const currentPlayers = getState("players") || [];
                        const remainingPlayers = currentPlayers.filter(p => p.id !== playerId);
                        if (remainingPlayers.length > 0) {
                            // Transfer host to the next player
                            setState("players", remainingPlayers);
                        }
                    }
                    gameInitialized = false;
                    showJoinForm = true;
                    inMultiplayerMode = false;
                    dispatch("multiplayerModeChanged", { inMultiplayerMode });
                }
            }).then(() => {
                gameInitialized = true;
                playerId = myPlayer().id;
                isHost = isPlayroomHost();
                roomCode = getRoomCode();
                inMultiplayerMode = true;
                showJoinForm = false;
                
                if (isHost) {
                    setState("players", [{ id: playerId, name: playerName || "Player 1", ready: false }]);
                    setState("scores", { [playerId]: 0 });
                }

                dispatch("multiplayerModeChanged", { inMultiplayerMode });
            });
            
            // Set up player join handler
            onPlayerJoin((player) => {
                try {
                    const currentPlayers = getState("players") || [];
                    const currentScores = getState("scores") || {};
                    
                    // Only add the player if they're not already in the list
                    if (!currentPlayers.find(p => p.id === player.id)) {
                        const playerNumber = currentPlayers.length + 1;
                        const updatedPlayers = [...currentPlayers, { 
                            id: player.id, 
                            name: `Player ${playerNumber}`,
                            ready: false 
                        }];
                        setState("players", updatedPlayers);
                        currentScores[player.id] = 0;
                        setState("scores", currentScores);
                    }
                    
                    players = getState("players");
                    scores = getState("scores");
                    
                    // Set the player's name in the input if it's the current player
                    if (player.id === playerId && !playerName) {
                        const currentPlayer = players.find(p => p.id === playerId);
                        if (currentPlayer) {
                            playerName = currentPlayer.name;
                        }
                    }
                } catch (e) {
                    console.error("Error handling player join:", e);
                }
            });

            // Register RPC handlers
            RPC.register("playerMove", (data, sender) => {
                if (!opponentMoves[sender.id]) {
                    opponentMoves[sender.id] = [];
                }
                opponentMoves[sender.id].push({
                    row: data.row,
                    text: data.text,
                    status: data.status
                });
                opponentMoves = { ...opponentMoves };
                dispatch("opponentMove", { opponentMoves });
            });

            // Register name update handler
            RPC.register("updatePlayerName", (data) => {
                const { playerId: updatedPlayerId, name } = data;
                const currentPlayers = getState("players") || [];
                const updatedPlayers = currentPlayers.map(p => 
                    p.id === updatedPlayerId ? { ...p, name } : p
                );
                setState("players", updatedPlayers);
                players = updatedPlayers;
            });

            // Handle game start
            waitForState("gameStarted").then(() => {
                gameStarted = true;
                wordToGuess = getState("wordToGuess");
                dispatch("gameStart", { wordToGuess });
            });

            // Handle round completion
            waitForState("roundComplete").then(() => {
                const roundData = getState("roundComplete");
                scores = roundData.scores;
                dispatch("roundComplete", { 
                    winner: roundData.winner, 
                    scores, 
                    wordToGuess: roundData.wordToGuess 
                });
            });
        } catch (error) {
            errorMessage = error.message;
            setTimeout(() => {
                errorMessage = "";
            }, 5000);
            // Reset state on error
            gameInitialized = false;
            showJoinForm = true;
        }
    }
    
    onMount(() => {
        // Don't auto-initialize, wait for user to create or join room
    });
    
    function createRoom() {
        if (!playerName.trim()) {
            errorMessage = "Please enter your name first";
            setTimeout(() => {
                errorMessage = "";
            }, 3000);
            return;
        }
        initializeGame();
    }
    
    function joinRoom() {
        if (!playerName.trim()) {
            errorMessage = "Please enter your name first";
            setTimeout(() => {
                errorMessage = "";
            }, 3000);
            return;
        }
        if (!joinRoomCode.trim()) {
            errorMessage = "Please enter a room code";
            setTimeout(() => {
                errorMessage = "";
            }, 3000);
            return;
        }
        initializeGame(joinRoomCode.trim().toUpperCase());
    }

    // Mark player as ready and update name
    function setReady() {
        if (!playerName.trim()) {
            errorMessage = "Please enter your name first";
            setTimeout(() => {
                errorMessage = "";
            }, 3000);
            return;
        }

        isReady = true;
        const currentPlayers = getState("players") || [];
        const updatedPlayers = currentPlayers.map(p => 
            p.id === playerId ? { ...p, ready: true, name: playerName } : p
        );
        setState("players", updatedPlayers);
        
        // Broadcast name update to other players
        RPC.call("updatePlayerName", { playerId, name: playerName }, RPC.Mode.ALL);
        
        // Check if all players are ready
        if (updatedPlayers.length > 1 && updatedPlayers.every(p => p.ready)) {
            if (isHost) {
                setState("gameStarted", true);
                setState("wordToGuess", getRandomWord());
            }
        }
    }

    // Export functions for parent components
    export function sendMove(row, text, status) {
        RPC.call("playerMove", { row, text, status }, RPC.Mode.OTHERS);
    }

    export function sendWin() {
        if (isHost) {
            const currentScores = getState("scores") || {};
            currentScores[playerId] = (currentScores[playerId] || 0) + 1;
            setState("scores", currentScores);
            setState("roundComplete", {
                winner: playerId,
                scores: currentScores,
                wordToGuess: getState("wordToGuess")
            });
            
            // Start new round after delay
            setTimeout(() => {
                setState("wordToGuess", getRandomWord());
                setState("gameStarted", true);
                setState("players", players.map(p => ({ ...p, ready: false })));
                dispatch("newRound", { wordToGuess: getState("wordToGuess") });
            }, 5000);
        }
    }
</script>

{#if !gameInitialized && showJoinForm}
    <div class="room-lobby">
        <h2>Join or Create Game</h2>
        <div class="name-input">
            <input 
                type="text" 
                bind:value={playerName} 
                placeholder="Enter your name"
                maxlength="20"
            />
        </div>
        <div class="join-options">
            <button on:click={createRoom}>Create Room</button>
            <div class="join-form">
                <input 
                    type="text" 
                    bind:value={joinRoomCode} 
                    placeholder="Enter room code"
                    maxlength="4"
                />
                <button on:click={joinRoom}>Join Room</button>
            </div>
        </div>
    </div>
{:else if gameInitialized}
    <div class="room-lobby">
        <h2>Room: {roomCode}</h2>
        {#if !gameStarted}
            <div class="name-input">
                <input 
                    type="text" 
                    bind:value={playerName} 
                    placeholder="Enter your name"
                    maxlength="20"
                    disabled={isReady}
                />
            </div>
            
            <div class="players-list">
                <h3>Players ({players.length}/4):</h3>
                <ul>
                    {#each players as player}
                        <li class="{player.id === playerId ? 'current-player' : ''}">
                            {player.name} 
                            {player.ready ? '(Ready ✓)' : '(Not Ready)'}
                            {#if player.id === playerId}
                                <span class="you-badge">YOU</span>
                            {/if}
                        </li>
                    {/each}
                </ul>
            </div>
            
            <div class="button-group">
                {#if !isReady}
                    <button on:click={setReady}>Ready</button>
                {:else}
                    <button disabled>Ready ✓</button>
                {/if}
            </div>
            
            {#if isHost}
                <div class="host-message">
                    <p>Share this code with friends to play together: <strong>{roomCode}</strong></p>
                </div>
            {/if}
            
            {#if players.length > 1 && players.every(p => p.ready)}
                <div class="starting-message">
                    <p>All players ready! Game starting...</p>
                </div>
            {:else if players.length > 1}
                <div class="waiting-message">
                    <p>Waiting for all players to ready up...</p>
                </div>
            {:else}
                <div class="waiting-message">
                    <p>Waiting for other players to join...</p>
                </div>
            {/if}
        {:else}
            <div class="game-info">
                <div class="scores-display">
                    {#each players as player}
                        <div class="player-score {player.id === playerId ? 'current-player-score' : ''}">
                            {player.name}: {scores[player.id] || 0}
                            {#if player.id === playerId}
                                <span class="you-badge">YOU</span>
                            {/if}
                        </div>
                    {/each}
                </div>
            </div>
        {/if}
    </div>
{/if}

{#if errorMessage}
    <div class="error-message">
        {errorMessage}
    </div>
{/if}

<style>
    .room-lobby,
    .game-info {
        background-color: white;
        border: 2px solid black;
        border-radius: 10px;
        padding: 15px;
        margin: 15px auto;
        max-width: 500px;
    }
    
    h2 {
        text-align: center;
        margin-top: 0;
    }
    
    .button-group {
        display: flex;
        justify-content: center;
        gap: 10px;
        margin: 15px 0;
    }
    
    button {
        background-color: white;
        border: 2px solid black;
        border-radius: 5px;
        padding: 8px 16px;
        cursor: pointer;
        font-weight: bold;
    }
    
    button:hover {
        background-color: rgb(211, 211, 211);
    }
    
    button:disabled {
        opacity: 0.7;
        cursor: not-allowed;
    }
    
    .players-list {
        margin: 15px 0;
    }
    
    .players-list ul {
        list-style-type: none;
        padding: 0;
    }
    
    .players-list li {
        margin: 5px 0;
        padding: 5px;
        border-radius: 5px;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
    }
    
    .current-player {
        font-weight: bold;
        background-color: rgba(0, 0, 0, 0.1);
    }
    
    .error-message {
        color: red;
        text-align: center;
        margin: 10px 0;
    }
    
    .host-message,
    .waiting-message,
    .starting-message {
        text-align: center;
        margin: 15px 0;
        padding: 10px;
        border-radius: 5px;
    }
    
    .host-message {
        background-color: rgba(0, 128, 0, 0.1);
    }
    
    .waiting-message {
        background-color: rgba(255, 165, 0, 0.1);
    }
    
    .starting-message {
        background-color: rgba(0, 128, 0, 0.1);
    }
    
    .scores-display {
        display: flex;
        justify-content: center;
        flex-wrap: wrap;
        gap: 20px;
        margin: 15px 0;
    }
    
    .player-score {
        font-weight: bold;
        padding: 5px 10px;
        border-radius: 5px;
    }
    
    .current-player-score {
        background-color: rgba(0, 0, 0, 0.1);
    }

    .name-input {
        text-align: center;
        margin-bottom: 20px;
    }
    
    .name-input input {
        padding: 8px 16px;
        font-size: 16px;
        border: 2px solid #000;
        border-radius: 5px;
        width: 200px;
        text-align: center;
    }
    
    .name-input input:disabled {
        background-color: #f0f0f0;
        cursor: not-allowed;
    }
    
    .you-badge {
        background-color: #3eaa42;
        color: white;
        padding: 2px 6px;
        border-radius: 4px;
        font-size: 12px;
        margin-left: 8px;
    }

    .join-options {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 20px;
        margin-top: 20px;
    }
    
    .join-form {
        display: flex;
        gap: 10px;
        align-items: center;
    }
    
    .join-form input {
        padding: 8px 16px;
        font-size: 16px;
        border: 2px solid #000;
        border-radius: 5px;
        width: 120px;
        text-align: center;
        text-transform: uppercase;
    }
</style>