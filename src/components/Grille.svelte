<script>
    import { getRandomWord, isWordValid } from '../components/Dictionnary.js';

    export let wordToGuess = getRandomWord();

    let key;

    var status = Array.from(Array(6), () => new Array(6))

    var statusA = "none";
    var statusB = "none";
    var statusC = "none";
    var statusD = "none";
    var statusE = "none";
    var statusF = "none";
    var statusG = "none";
    var statusH = "none";
    var statusI = "none";
    var statusJ = "none";
    var statusK = "none";
    var statusL = "none";
    var statusM = "none";
    var statusN = "none";
    var statusO = "none";
    var statusP = "none";
    var statusQ = "none";
    var statusR = "none";
    var statusS = "none";
    var statusT = "none";
    var statusU = "none";
    var statusV = "none";
    var statusW = "none";
    var statusX = "none";
    var statusY = "none";
    var statusZ = "none";


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

    let letterPool = []

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
        for(let i = 0; i <5; i++){
            if(wordToGuess[i] == mot[i]){
                changeKeyboardColor(mot[i], "correct");
                status[row][i] = "correct";
            } else {
                letterPool.push(wordToGuess[i]);
            }
        }

        for(let i = 0; i < 5; i++){
            if(status[row][i] != "correct"){
                if(letterPool.includes(mot[i])){
                    status[row][i] = "present";
                    changeKeyboardColor(mot[i], "present");
                    letterPool.splice(letterPool.indexOf(mot[i]), 1);
                }
                else{
                    changeKeyboardColor(mot[i], "absent");
                }
            }
        }

        letterPool = [];
        
        if(mot == wordToGuess){
            gameEnded = true;
        } else {
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

function changeKeyboardColor(letter, status){
    if(status == "absent"){
        if(letter == "A"){
            if(statusA == "none"){
                statusA = "absent";
            }
        } else if(letter == "B"){
            if(statusB == "none"){
                statusB = "absent";
            }
        } else if(letter == "C"){
            if(statusC == "none"){
                statusC = "absent";
            }
        } else if(letter == "D"){
            if(statusD == "none"){
                statusD = "absent";
            }
        } else if(letter == "E"){
            if(statusE == "none"){
                statusE = "absent";
            }
        } else if(letter == "F"){
            if(statusF == "none"){
                statusF = "absent";
            }
        } else if(letter == "G"){
            if(statusG == "none"){
                statusG = "absent";
            }
        } else if(letter == "H"){
            if(statusH == "none"){
                statusH = "absent";
            }
        } else if(letter == "I"){
            if(statusI == "none"){
                statusI = "absent";
            }
        } else if(letter == "J"){
            if(statusJ == "none"){
                statusJ = "absent";
            }
        } else if(letter == "K"){
            if(statusK == "none"){
                statusK = "absent";
            }
        } else if(letter == "L"){
            if(statusL == "none"){
                statusL = "absent";
            }
        } else if(letter == "M"){
            if(statusM == "none"){
                statusM = "absent";
            }
        } else if(letter == "N"){
            if(statusN == "none"){
                statusN = "absent";
            }
        } else if(letter == "O"){
            if(statusO == "none"){
                statusO = "absent";
            }
        } else if(letter == "P"){
            if(statusP == "none"){
                statusP = "absent";
            }
        } else if(letter == "Q"){
            if(statusQ == "none"){
                statusQ = "absent";
            }
        } else if(letter == "R"){
            if(statusR == "none"){
                statusR = "absent";
            }
        } else if(letter == "S"){
            if(statusS == "none"){
                statusS = "absent";
            }
        } else if(letter == "T"){
            if(statusT == "none"){
                statusT = "absent";
            }
        } else if(letter == "U"){
            if(statusU == "none"){
                statusU = "absent";
            }
        } else if(letter == "V"){
            if(statusV == "none"){
                statusV = "absent";
            }
        } else if(letter == "W"){
            if(statusW == "none"){
                statusW = "absent";
            }
        } else if(letter == "X"){
            if(statusX == "none"){
                statusX = "absent";
            }
        } else if(letter == "Y"){
            if(statusY == "none"){
                statusY = "absent";
            }
        } else if(letter == "Z"){
            if(statusZ == "none"){
                statusZ = "absent";
            }
        }
    } else if(status == "present"){
        if(letter == "A"){
            if(statusA == "none"){
                statusA = "present";
            }
        } else if(letter == "B"){
            if(statusB == "none"){
                statusB = "present";
            }
        } else if(letter == "C"){
            if(statusC == "none"){
                statusC = "present";
            }
        } else if(letter == "D"){
            if(statusD == "none"){
                statusD = "present";
            }
        } else if(letter == "E"){
            if(statusE == "none"){
                statusE = "present";
            }
        } else if(letter == "F"){
            if(statusF == "none"){
                statusF = "present";
            }
        } else if(letter == "G"){
            if(statusG == "none"){
                statusG = "present";
            }
        } else if(letter == "H"){
            if(statusH == "none"){
                statusH = "present";
            }
        } else if(letter == "I"){
            if(statusI == "none"){
                statusI = "present";
            }
        } else if(letter == "J"){
            if(statusJ == "none"){
                statusJ = "present";
            }
        } else if(letter == "K"){
            if(statusK == "none"){
                statusK = "present";
            }
        } else if(letter == "L"){
            if(statusL == "none"){
                statusL = "present";
            }
        } else if(letter == "M"){
            if(statusM == "none"){
                statusM = "present";
            }
        } else if(letter == "N"){
            if(statusN == "none"){
                statusN = "present";
            }
        } else if(letter == "O"){
            if(statusO == "none"){
                statusO = "present";
            }
        } else if(letter == "P"){
            if(statusP == "none"){
                statusP = "present";
            }
        } else if(letter == "Q"){
            if(statusQ == "none"){
                statusQ = "present";
            }
        } else if(letter == "R"){
            if(statusR == "none"){
                statusR = "present";
            }
        } else if(letter == "S"){
            if(statusS == "none"){
                statusS = "present";
            }
        } else if(letter == "T"){
            if(statusT == "none"){
                statusT = "present";
            }
        } else if(letter == "U"){
            if(statusU == "none"){
                statusU = "present";
            }
        } else if(letter == "V"){
            if(statusV == "none"){
                statusV = "present";
            }
        } else if(letter == "W"){
            if(statusW == "none"){
                statusW = "present";
            }
        } else if(letter == "X"){
            if(statusX == "none"){
                statusX = "present";
            }
        } else if(letter == "Y"){
            if(statusY == "none"){
                statusY = "present";
            }
        } else if(letter == "Z"){
            if(statusZ == "none"){
                statusZ = "present";
            }
        }

    } else if(status = "correct"){
        console.log("la lettre" + letter + "est correcte")
        if(letter == "A"){
            if(statusA == "none" || statusA == "present"){
                statusA = "correct";
            }
        } else if(letter == "B"){
            if(statusB == "none" || statusB == "present"){
                statusB = "correct";
            }
        } else if(letter == "C"){
            if(statusC == "none" || statusC == "present"){
                statusC = "correct";
            }
        } else if(letter == "D"){
            if(statusD == "none" || statusD == "present"){
                statusD = "correct";
            }
        } else if(letter == "E"){
            if(statusE == "none" || statusE == "present"){
                statusE = "correct";
            }
        } else if(letter == "F"){
            if(statusF == "none" || statusF == "present"){
                statusF = "correct";
            }
        } else if(letter == "G"){
            if(statusG == "none" || statusG == "present"){
                statusG = "correct";
            }
        } else if(letter == "H"){
            if(statusH == "none" || statusH == "present"){
                statusH = "correct";
            }
        } else if(letter == "I"){
            if(statusI == "none" || statusI == "present"){
                statusI = "correct";
            }
        } else if(letter == "J"){
            if(statusJ == "none" || statusJ == "present"){
                statusJ = "correct";
            }
        } else if(letter == "K"){
            if(statusK == "none" || statusK == "present"){
                statusK = "correct";
            }
        } else if(letter == "L"){
            if(statusL == "none" || statusL == "present"){
                statusL = "correct";
            }
        } else if(letter == "M"){
            if(statusM == "none" || statusM == "present"){
                statusM = "correct";
            }
        } else if(letter == "N"){
            if(statusN == "none" || statusN == "present"){
                statusN = "correct";
            }
        } else if(letter == "O"){
            if(statusO == "none" || statusO == "present"){
                statusO = "correct";
            }
        } else if(letter == "P"){
            if(statusP == "none" || statusP == "present"){
                statusP = "correct";
            }
        } else if(letter == "Q"){
            if(statusQ == "none" || statusQ == "present"){
                statusQ = "correct";
            }
        } else if(letter == "R"){
            if(statusR == "none" || statusR == "present"){
                statusR = "correct";
            }
        } else if(letter == "S"){
            if(statusS == "none" || statusS == "present"){
                statusS = "correct";
            }
        } else if(letter == "T"){
            if(statusT == "none" || statusT == "present"){
                statusT = "correct";
            }
        } else if(letter == "U"){
            if(statusU == "none" || statusU == "present"){
                statusU = "correct";
            }
        } else if(letter == "V"){
            if(statusV == "none" || statusV == "present"){
                statusV = "correct";
            }
        } else if(letter == "W"){
            if(statusW == "none" || statusW == "present"){
                statusW = "correct";
            }
        } else if(letter == "X"){
            if(statusX == "none" || statusX == "present"){
                statusX = "correct";
            }
        } else if(letter == "Y"){
            if(statusY == "none" || statusY == "present"){
                statusY = "correct";
            }
        } else if(letter == "Z"){
            if(statusZ == "none" || statusZ == "present"){
                statusZ = "correct";
            }
        }
    }
}

function resetKeyboard(){
    statusA = "none";
    statusB = "none";
    statusC = "none";
    statusD = "none";
    statusE = "none";
    statusF = "none";
    statusG = "none";
    statusH = "none";
    statusI = "none";
    statusJ = "none";
    statusK = "none";
    statusL = "none";
    statusM = "none";
    statusN = "none";
    statusO = "none";
    statusP = "none";
    statusQ = "none";
    statusR = "none";
    statusS = "none";
    statusT = "none";
    statusU = "none";
    statusV = "none";
    statusW = "none";
    statusX = "none";
    statusY = "none";
    statusZ = "none";
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
    resetKeyboard();
    row = 0;
    column = 0;
    letterPool = [];
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
        <button class = "key" class:correct={statusA === 'correct'} class:present={statusA === 'present'} class:absent={statusA === 'absent'} on:click = {() => {keyPress('A')}} > A </button>
        <button class = "key" class:correct={statusZ === 'correct'} class:present={statusZ === 'present'} class:absent={statusZ === 'absent'} on:click = {() => {keyPress('Z')}} > Z </button>
        <button class = "key" class:correct={statusE === 'correct'} class:present={statusE === 'present'} class:absent={statusE === 'absent'} on:click = {() => {keyPress('E')}} > E </button>
        <button class = "key" class:correct={statusR === 'correct'} class:present={statusR === 'present'} class:absent={statusR === 'absent'} on:click = {() => {keyPress('R')}} > R </button>
        <button class = "key" class:correct={statusT === 'correct'} class:present={statusT === 'present'} class:absent={statusT === 'absent'} on:click = {() => {keyPress('T')}} > T </button>
        <button class = "key" class:correct={statusY === 'correct'} class:present={statusY === 'present'} class:absent={statusY === 'absent'} on:click = {() => {keyPress('Y')}} > Y </button>
        <button class = "key" class:correct={statusU === 'correct'} class:present={statusU === 'present'} class:absent={statusU === 'absent'} on:click = {() => {keyPress('U')}} > U </button>
        <button class = "key" class:correct={statusI === 'correct'} class:present={statusI === 'present'} class:absent={statusI === 'absent'} on:click = {() => {keyPress('I')}} > I </button>
        <button class = "key" class:correct={statusO === 'correct'} class:present={statusO === 'present'} class:absent={statusO === 'absent'} on:click = {() => {keyPress('O')}} > O </button>
        <button class = "key" class:correct={statusP === 'correct'} class:present={statusP === 'present'} class:absent={statusP === 'absent'} on:click = {() => {keyPress('P')}} > P </button>
    </div>
    <div class = "row" >
        <button class = "key" class:correct={statusQ === 'correct'} class:present={statusQ === 'present'} class:absent={statusQ === 'absent'} on:click = {() => {keyPress('Q')}} > Q </button>
        <button class = "key" class:correct={statusS === 'correct'} class:present={statusS === 'present'} class:absent={statusS === 'absent'} on:click = {() => {keyPress('S')}} > S </button>
        <button class = "key" class:correct={statusD === 'correct'} class:present={statusD === 'present'} class:absent={statusD === 'absent'} on:click = {() => {keyPress('D')}} > D </button>
        <button class = "key" class:correct={statusF === 'correct'} class:present={statusF === 'present'} class:absent={statusF === 'absent'} on:click = {() => {keyPress('F')}} > F </button>
        <button class = "key" class:correct={statusG === 'correct'} class:present={statusG === 'present'} class:absent={statusG === 'absent'} on:click = {() => {keyPress('G')}} > G </button>
        <button class = "key" class:correct={statusH === 'correct'} class:present={statusH === 'present'} class:absent={statusH === 'absent'} on:click = {() => {keyPress('H')}} > H </button>
        <button class = "key" class:correct={statusJ === 'correct'} class:present={statusJ === 'present'} class:absent={statusJ === 'absent'} on:click = {() => {keyPress('J')}} > J </button>
        <button class = "key" class:correct={statusK === 'correct'} class:present={statusK === 'present'} class:absent={statusK === 'absent'} on:click = {() => {keyPress('K')}} > K </button>
        <button class = "key" class:correct={statusL === 'correct'} class:present={statusL === 'present'} class:absent={statusL === 'absent'} on:click = {() => {keyPress('L')}} > L </button>
        <button class = "key" class:correct={statusM === 'correct'} class:present={statusM === 'present'} class:absent={statusM === 'absent'} on:click = {() => {keyPress('M')}} > M </button>
    </div>
    <div class = "row" >
        <button class = "vide"></button>
        <button class = "key" on:click = {() => {keyPress('backspace')}} > ← </button>
        <button class = "key" class:correct={statusW === 'correct'} class:present={statusW === 'present'} class:absent={statusW === 'absent'} on:click = {() => {keyPress('W')}} > W </button>
        <button class = "key" class:correct={statusX === 'correct'} class:present={statusX === 'present'} class:absent={statusX === 'absent'} on:click = {() => {keyPress('X')}} > X </button>
        <button class = "key" class:correct={statusC === 'correct'} class:present={statusC === 'present'} class:absent={statusC === 'absent'} on:click = {() => {keyPress('C')}} > C </button>
        <button class = "key" class:correct={statusV === 'correct'} class:present={statusV === 'present'} class:absent={statusV === 'absent'} on:click = {() => {keyPress('V')}} > V </button>
        <button class = "key" class:correct={statusB === 'correct'} class:present={statusB === 'present'} class:absent={statusB === 'absent'} on:click = {() => {keyPress('B')}} > B </button>
        <button class = "key" class:correct={statusN === 'correct'} class:present={statusN === 'present'} class:absent={statusN === 'absent'} on:click = {() => {keyPress('N')}} > N </button>
        <button class = "key" on:click = {() => {keyPress('enter')}} > ↩ </button>
        <button class = "vide"></button>
    </div>
</div>

{#if gameEnded == true}
<center>
{#if perdu == true}
<p class="answer">Le mot était {wordToGuess}</p>
{/if}
<button class = "playAgain" on:click = {() => {playAgain()}} > Rejouer </button>
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
        background-color: #ffffff;
        border: 2px solid #000000;
        border-radius: 10px;
        color: black;
        padding: 15px 32px;
        text-align: center;
        text-decoration: none;
        display: inline-block;
        font-size: 16px;
        cursor: pointer;
        border-radius: 10px;
    }

    .playAgain:hover{
        background-color: rgb(211, 211, 211);
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
    }

    .square.correct{
        background-color: #3eaa42;
    }

    .keyboard{
        text-align: center;
        font-size: 10px;
        color: #000000;
        background-color: #ffffff;
        border: 2px solid #000000;
        border-radius: 10px;
        padding: 5px;
        margin: 5px;
    }
    
    .row{
        display: flex;
        flex-direction: row;
        justify-content: center;
    }
    .key{
        width: 40px;
        height: 40px;
        border: 2px solid #000000;
        border-radius: 10px;
        margin: 3px;
        background-color: #ffffff;
        cursor: pointer;
    }

    .key:hover{
        background-color: rgb(211, 211, 211);
    }

    .key.correct{
        background-color: #3eaa42;
    }

    .key.correct:hover{
        background-color: #37963a;
    }

    .key.present{
        background-color: #df9637;
    }

    .key.present:hover{
        background-color: #ca8934;
    }

    .key.absent{
        background-color: #797979;
    }

    .key.absent:hover{
        background-color: #6a6a6a;
    }

    .vide{
        width: 40px;
        height: 40px;
        margin: 3px;
        background-color: #ffffff;
        border: none;
    }
</style>