<script>
    import { onMount, onDestroy } from "svelte";
    import io from "socket.io-client";
    
    export let inMultiplayerMode = false;
    export let roomCode = "";
    export let isHost = false;
    export let players = [];
    export let wordToGuess = "";
    export let scores = {};
    export let opponentMoves = {};
    export let playerId = "";
    export let gameStarted = false; // Expose gameStarted to parent
    
    let socket;
    let joinRoomInput = "";
    let errorMessage = "";
    let isConnected = false;
    let isReady = false;
    
    // Events that will be dispatched to parent components
    import { createEventDispatcher } from "svelte";
    const dispatch = createEventDispatcher();
    
    onMount(() => {
        // Connect to the Socket.io server
        socket = io("http://localhost:3001");
        
        socket.on("connect", () => {
            isConnected = true;
            console.log("Connected to server with ID:", socket.id);
            playerId = socket.id;
        });
        
        // Handle room creation
        socket.on("roomCreated", (data) => {
            roomCode = data.roomCode;
            isHost = true;
            inMultiplayerMode = true;
            dispatch("multiplayerModeChanged", { inMultiplayerMode });
        });
        
        // Handle joining a room
        socket.on("roomJoined", (data) => {
            roomCode = data.roomCode;
            inMultiplayerMode = true;
            dispatch("multiplayerModeChanged", { inMultiplayerMode });
        });
        
        // Handle player joins
        socket.on("playerJoined", (data) => {
            players = data.players;
        });
        
        // Handle player ready updates
        socket.on("playerReadyUpdate", (data) => {
            players = data.players;
        });
        
        // Handle game start
        socket.on("gameStart", (data) => {
            gameStarted = true;
            wordToGuess = data.wordToGuess;
            dispatch("gameStart", { wordToGuess });
        });
        
        // Handle opponent moves
        socket.on("opponentMove", (data) => {
            // Add move to opponent moves collection
            if (!opponentMoves[data.playerId]) {
                opponentMoves[data.playerId] = [];
            }
            
            opponentMoves[data.playerId].push({
                row: data.row,
                text: data.text,
                status: data.status
            });
            
            opponentMoves = { ...opponentMoves };
            dispatch("opponentMove", { opponentMoves });
        });
        
        // Handle round completion
        socket.on("roundComplete", (data) => {
            scores = data.scores;
            dispatch("roundComplete", { winner: data.winner, scores, wordToGuess: data.wordToGuess });
        });
        
        // Handle new round
        socket.on("newRound", (data) => {
            wordToGuess = data.wordToGuess;
            gameStarted = true; // Game starts again for new round
            isReady = false;
            opponentMoves = {};
            dispatch("newRound", { wordToGuess });
        });
        
        // Handle player leaving
        socket.on("playerLeft", (data) => {
            players = data.players;
        });
        
        // Handle errors
        socket.on("error", (error) => {
            errorMessage = error.message;
            setTimeout(() => {
                errorMessage = "";
            }, 5000);
        });
    });

    onDestroy(() => {
        if (socket) {
            socket.disconnect();
        }
    });

    // Create a new room
    function createRoom() {
        if (!isConnected) return;
        socket.emit("createRoom");
    }

    // Join an existing room
    function joinRoom() {
        if (!isConnected || !joinRoomInput) return;
        socket.emit("joinRoom", joinRoomInput.toUpperCase());
    }

    // Mark player as ready
    function setReady() {
        isReady = true;
        socket.emit("playerReady", { roomCode });
    }

    // Leave the current room
    export function leaveRoom() {
        if (socket && roomCode) {
            socket.emit("leaveRoom", roomCode);
            resetState();
        }
    }

    // Reset local state
    function resetState() {
        roomCode = "";
        isHost = false;
        players = [];
        inMultiplayerMode = false;
        gameStarted = false;
        isReady = false;
        wordToGuess = "";
        scores = {};
        opponentMoves = {};
        dispatch("multiplayerModeChanged", { inMultiplayerMode });
    }

    // Send a move to other players
    export function sendMove(row, text, status) {
        if (socket && roomCode) {
            socket.emit("playerMove", { roomCode, row, text, status });
        }
    }

    // Send win notification
    export function sendWin() {
        if (socket && roomCode) {
            socket.emit("playerWin", { roomCode });
        }
    }
</script>

<!-- Multiplayer UI -->
{#if !inMultiplayerMode}
    <div class="multiplayer-menu">
        <h2>Multiplayer Mode</h2>
        <div class="button-group">
            <button on:click={createRoom}>Create Game</button>
            <div class="join-room">
                <input 
                    type="text" 
                    placeholder="Enter Room Code" 
                    bind:value={joinRoomInput} 
                    maxlength="4" 
                />
                <button on:click={joinRoom}>Join Game</button>
            </div>
        </div>
    </div>
{:else if !gameStarted}
    <div class="room-lobby">
        <h2>Room: {roomCode}</h2>
        <div class="players-list">
            <h3>Players ({players.length}/4):</h3>
            <ul>
                {#each players as player}
                    <li class="{player.id === playerId ? 'current-player' : ''}">
                        {player.id === playerId ? 'You' : 'Player ' + (players.indexOf(player) + 1)} 
                        {player.ready ? '(Ready)' : '(Not Ready)'}
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
            <button on:click={leaveRoom}>Leave Game</button>
        </div>
        
        {#if errorMessage}
            <div class="error-message">
                {errorMessage}
            </div>
        {/if}
        
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
    </div>
{:else}
    <div class="game-info">
        <div class="room-info">
            Room: {roomCode}
        </div>
        
        <div class="scores-display">
            {#each players as player}
                <div class="player-score {player.id === playerId ? 'current-player-score' : ''}">
                    {player.id === playerId ? 'You' : 'Player ' + (players.indexOf(player) + 1)}: 
                    {scores[player.id] || 0}
                </div>
            {/each}
        </div>
    </div>
{/if}

<style>
    .multiplayer-menu,
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
    
    .join-room {
        display: flex;
        gap: 5px;
    }
    
    input {
        border: 2px solid black;
        border-radius: 5px;
        padding: 8px;
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
    
    .room-info {
        text-align: center;
        font-weight: bold;
    }
</style>