<script>
    import { getRandomWord, isWordValid } from '../components/Dictionnary.js';

    export let wordToGuess = getRandomWord();

    let key;

    var gris = "#444";
    var orange = "#f90";
    var vert = "#0f0";

    var currentColor = gris;

    var status = Array.from(Array(6), () => new Array(6))


    var text = Array.from(Array(6), () => new Array(6))
    text[0][0] = " ";
    text[0][1] = " ";
    text[0][2] = " ";
    text[0][3] = " ";
    text[0][4] = " ";
    text[1][0] = " ";
    text[1][1] = " ";
    text[1][2] = " ";
    text[1][3] = " ";
    text[1][4] = " ";
    text[2][0] = " ";
    text[2][1] = " ";
    text[2][2] = " ";
    text[2][3] = " ";
    text[2][4] = " ";
    text[3][0] = " ";
    text[3][1] = " ";
    text[3][2] = " ";
    text[3][3] = " ";
    text[3][4] = " ";
    text[4][0] = " ";
    text[4][1] = " ";
    text[4][2] = " ";
    text[4][3] = " ";
    text[4][4] = " ";
    text[5][0] = " ";
    text[5][1] = " ";
    text[5][2] = " ";
    text[5][3] = " ";
    text[5][4] = " ";

    var mot = "";

    let row = 0;
    let column = 0;

    const duplicateChars = new Set();

    let gameEnded = false;

    let perdu = false;

function keyPress(key) {
    if(row <6 && gameEnded == false){
        if(key == "backspace") {
            if(column != 0) {
                column--;
                text[row][column] = "";
            }
        } else if(key == "enter") {
            if(column == 5) {
                ecrireMot();
                checkMot();
            }
        } else {
            if(column < 5){
                text[row][column] = key;
                column++;
            }
        }
    }
}

function ecrireMot(){
    mot = "";
    for(var i = 0; i < 5; i++){
        mot += text[row][i];
    }
}

function checkMot(){
    if(isWordValid(mot)){
        for(let i = 0; i < 5; i++) {
        if(wordToGuess[i] == mot[i]) {
            status[row][i] = "correct";
            duplicateChars.add(mot[i]);
        } else {
            if(wordToGuess.includes(mot[i])) {
                if(!duplicateChars.has(mot[i])){
                    status[row][i] = "present";
                    duplicateChars.add(mot[i]);
                }
            } else {
                ///absent
            }
        }
   }
   if(mot == wordToGuess){
        gameEnded = true;
    }else{
        duplicateChars.clear();
        row++;
        column = 0;
        if(row == 6) {
            gameEnded = true;
            perdu = true;
        }
    }
    } else {
        alert('mot invalide');
    }
}

function handleKeydown(event) {
    if(gameEnded == false){
        key = event.key;
        if(key == "a" || key == "b" || key == "c" || key == "d" || key == "e" || key == "f" || key == "g" || key == "h" || key == "i" || key == "j" || key == "k" || key == "l" || key == "m" || key == "n" || key == "o" || key == "p" || key == "q" || key == "r" || key == "s" || key == "t" || key == "u" || key == "v" || key == "w" || key == "x" || key == "y" || key == "z") {
            keyPress(key.toUpperCase());
        } else if(key == "Backspace") {
            keyPress("backspace");
        } else if(key == "Enter") {
            keyPress("enter");
        }
    }
	}

function playAgain(){
    wordToGuess = getRandomWord();
    row = 0;
    column = 0;
    duplicateChars.clear();
    gameEnded = false;
    perdu = false;
    for(var i = 0; i < 6; i++){
        for(var j = 0; j < 5; j++){
            text[i][j] = "";
            status[i][j] = "";
        }
    }
}

</script>

<svelte:window on:keydown={handleKeydown}/>

<div class="grid">
    <div class="square" class:correct={status[0][0] === 'correct'} class:present={status[0][0] === 'present'}>{text[0][0]}</div>
    <div class="square" class:correct={status[0][1] === 'correct'} class:present={status[0][1] === 'present'}>{text[0][1]}</div>
    <div class="square" class:correct={status[0][2] === 'correct'} class:present={status[0][2] === 'present'}>{text[0][2]}</div>
    <div class="square" class:correct={status[0][3] === 'correct'} class:present={status[0][3] === 'present'}>{text[0][3]}</div>
    <div class="square" class:correct={status[0][4] === 'correct'} class:present={status[0][4] === 'present'}>{text[0][4]}</div>
    {#if row > 0}
    <div class="square" class:correct={status[1][0] === 'correct'} class:present={status[1][0] === 'present'}>{text[1][0]}</div>
    <div class="square" class:correct={status[1][1] === 'correct'} class:present={status[1][1] === 'present'}>{text[1][1]}</div>
    <div class="square" class:correct={status[1][2] === 'correct'} class:present={status[1][2] === 'present'}>{text[1][2]}</div>
    <div class="square" class:correct={status[1][3] === 'correct'} class:present={status[1][3] === 'present'}>{text[1][3]}</div>
    <div class="square" class:correct={status[1][4] === 'correct'} class:present={status[1][4] === 'present'}>{text[1][4]}</div>
    {/if}
    {#if row > 1} 
    <div class="square" class:correct={status[2][0] === 'correct'} class:present={status[2][0] === 'present'}>{text[2][0]}</div>
    <div class="square" class:correct={status[2][1] === 'correct'} class:present={status[2][1] === 'present'}>{text[2][1]}</div>
    <div class="square" class:correct={status[2][2] === 'correct'} class:present={status[2][2] === 'present'}>{text[2][2]}</div>
    <div class="square" class:correct={status[2][3] === 'correct'} class:present={status[2][3] === 'present'}>{text[2][3]}</div>
    <div class="square" class:correct={status[2][4] === 'correct'} class:present={status[2][4] === 'present'}>{text[2][4]}</div>
    {/if}
    {#if row > 2}
    <div class="square" class:correct={status[3][0] === 'correct'} class:present={status[3][0] === 'present'}>{text[3][0]}</div>
    <div class="square" class:correct={status[3][1] === 'correct'} class:present={status[3][1] === 'present'}>{text[3][1]}</div>
    <div class="square" class:correct={status[3][2] === 'correct'} class:present={status[3][2] === 'present'}>{text[3][2]}</div>
    <div class="square" class:correct={status[3][3] === 'correct'} class:present={status[3][3] === 'present'}>{text[3][3]}</div>
    <div class="square" class:correct={status[3][4] === 'correct'} class:present={status[3][4] === 'present'}>{text[3][4]}</div>
    {/if}
    {#if row > 3}
    <div class="square" class:correct={status[4][0] === 'correct'} class:present={status[4][0] === 'present'}>{text[4][0]}</div>
    <div class="square" class:correct={status[4][1] === 'correct'} class:present={status[4][1] === 'present'}>{text[4][1]}</div>
    <div class="square" class:correct={status[4][2] === 'correct'} class:present={status[4][2] === 'present'}>{text[4][2]}</div>
    <div class="square" class:correct={status[4][3] === 'correct'} class:present={status[4][3] === 'present'}>{text[4][3]}</div>
    <div class="square" class:correct={status[4][4] === 'correct'} class:present={status[4][4] === 'present'}>{text[4][4]}</div>
    {/if}
    {#if row > 4}
    <div class="square" class:correct={status[5][0] === 'correct'} class:present={status[5][0] === 'present'}>{text[5][0]}</div>
    <div class="square" class:correct={status[5][1] === 'correct'} class:present={status[5][1] === 'present'}>{text[5][1]}</div>
    <div class="square" class:correct={status[5][2] === 'correct'} class:present={status[5][2] === 'present'}>{text[5][2]}</div>
    <div class="square" class:correct={status[5][3] === 'correct'} class:present={status[5][3] === 'present'}>{text[5][3]}</div>
    <div class="square" class:correct={status[5][4] === 'correct'} class:present={status[5][4] === 'present'}>{text[5][4]}</div>
    {/if}
</div>

<div class = "keyboard" >
    <div class = "row" >
        <button class = "key" on:click = {() => {keyPress('A')}} > A </button>
        <button class = "key" on:click = {() => {keyPress('Z')}} > Z </button>
        <button class = "key" on:click = {() => {keyPress('E')}} > E </button>
        <button class = "key" on:click = {() => {keyPress('R')}} > R </button>
        <button class = "key" on:click = {() => {keyPress('T')}} > T </button>
        <button class = "key" on:click = {() => {keyPress('Y')}} > Y </button>
        <button class = "key" on:click = {() => {keyPress('U')}} > U </button>
        <button class = "key" on:click = {() => {keyPress('I')}} > I </button>
        <button class = "key" on:click = {() => {keyPress('O')}} > O </button>
        <button class = "key" on:click = {() => {keyPress('P')}} > P </button>
    </div>
    <div class = "row" >
        <button class = "key" on:click = {() => {keyPress('Q')}} > Q </button>
        <button class = "key" on:click = {() => {keyPress('S')}} > S </button>
        <button class = "key" on:click = {() => {keyPress('D')}} > D </button>
        <button class = "key" on:click = {() => {keyPress('F')}} > F </button>
        <button class = "key" on:click = {() => {keyPress('G')}} > G </button>
        <button class = "key" on:click = {() => {keyPress('H')}} > H </button>
        <button class = "key" on:click = {() => {keyPress('J')}} > J </button>
        <button class = "key" on:click = {() => {keyPress('K')}} > K </button>
        <button class = "key" on:click = {() => {keyPress('L')}} > L </button>
        <button class = "key" on:click = {() => {keyPress('M')}} > M </button>
    </div>
    <div class = "row" >
        <button class = "key" on:click = {() => {keyPress('enter')}} > ↩ </button>
        <button class = "key" on:click = {() => {keyPress('W')}} > W </button>
        <button class = "key" on:click = {() => {keyPress('X')}} > X </button>
        <button class = "key" on:click = {() => {keyPress('C')}} > C </button>
        <button class = "key" on:click = {() => {keyPress('V')}} > V </button>
        <button class = "key" on:click = {() => {keyPress('B')}} > B </button>
        <button class = "key" on:click = {() => {keyPress('N')}} > N </button>
        <button class = "key" on:click = {() => {keyPress('backspace')}} > ← </button>
    </div>
</div>

{#if gameEnded == true}
<center>
<button class = "playAgain" on:click = {() => {playAgain()}} > Rejouer </button>
{#if perdu == true}
<p class="answer">Le mot était {wordToGuess}</p>
{/if}
</center>
{/if}

<style>
    .answer{
        font-size: 18px;
        font-family: 'Roboto', sans-serif;
        color: #000000;
    }

    .playAgain{
        font-size: 30px;
        background-color: #444;
        border: none;
        color: white;
        padding: 15px 32px;
        text-align: center;
        text-decoration: none;
        display: inline-block;
        font-size: 16px;
        cursor: pointer;
        border-radius: 10px;
    }

    .grid {
        display: grid;
        grid-template-columns: repeat(5, 1fr);
        grid-template-rows: repeat(6, 1fr);
        grid-gap: 3px;
        background-color: #fff;
        color: #444;
        padding: 10px;
        width: 325px;
        height: 300px;
        margin: auto;
        margin-bottom: 50px;

    }
    .square{
        font-family: 'Arial', Courier, monospace;
        background-color: #444;
        color: #fff;
        height: 1.75rem;    
        border: 2px solid #000;
        border-radius: 10px;
        padding: 10px;
        font-size: 20px;
        text-align: center;
    }

    .square.present{
        background-color: #cd8729;
        color: #fff;
        height: 1.75rem;
        border: 2px solid #000;
        border-radius: 10px;
        padding: 10px;
        font-size: 20px;
        text-align: center;
    }

    .square.correct{
        background-color: #3eaa42;
        color: #fff;
        height: 1.75rem;
        border: 2px solid #000;
        border-radius: 10px;
        padding: 10px;
        font-size: 20px;
        text-align: center;
    }

    .keyboard{
        text-align: center;
        font-size: 10px;
        color: #000000;
        background-color: #ffffff;
        border: 2px solid #000000;
        border-radius: 10px;
        padding: 10px;
        margin: 10px;
    }
    .row{
        display: flex;
        flex-direction: row;
        justify-content: center;
    }
    .key{
        width: 30px;
        height: 30px;
        border: 2px solid #000000;
        border-radius: 10px;
        margin: 5px;
        background-color: #ffffff;
        cursor: pointer;
    }
</style>