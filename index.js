//Declaring variables from DOM
const deleteButton = document.getElementById("delete")
const submitButton = document.getElementById("submit")
const lettersDiv = document.getElementById("letters")
const answerDiv = document.getElementById("word")
const footer= document.getElementById("footer")

//<-----------------------------> Array containing Different Values as per the specification
const vowel = ["A","E","I","O","U"]
const consonant = ["B", "C", "D", "F", "G", "H", "J", "K", "L", "M", "N", "P", "Q", "R", "S", "T", "V", "W", "X", "Y", "Z"]
//Score Of Each Alphabet
const score1 = ["L", "N", "S", "T", "R"]
const score2 = ["D", "G"]
const score3 = ["B", "C", "M", "P"]
const score4 = ["F", "H", "V", "W", "Y"]
const score5 = ["K"]
const score6 = ["J", "X"]
const score7 = ["Z", "Q"]
//Power Of Alphabet
const powerArray = ["DL", "TL", "DW", "TW"]
var powerPointer = 0

//Dynamic Values During Game Play
var totalScore = 0
var tilesCount = 0
var currentWord = ""
var answerArray = []
var yourWords=[]
//<----------------------------->

//---------------------------------------------------------------->//Constructor Function
//To create All Alphabet Objects
class alphabetObject{
    constructor(name, count, score,power) {
        this.name = name,
        this.count = count,
        this.score = score,
        this.specialPower = power
        this.powerIndex = Math.floor(Math.random() * count + 1)
        this.isPower=false
    }
}

//<---------------------------------------------------------------->//Forming Letter Array
const alphabetArray = []
for (var i = 0; i < 5; i++){
    var count= Math.floor(Math.random()*4 +1)
    alphabetArray.push(new alphabetObject(vowel[i],count , 1, false))
}
while(alphabetArray.length<20) {
    var count = Math.floor(Math.random() * 4 + 1)
    var i = Math.floor((Math.random() * consonant.length - 1) + 1)
    if (consonant[i] == false) continue
    else {
        let score
        if (score1.includes(consonant[i])) score = 1
        else if (score2.includes(consonant[i])) score = 2
        else if (score3.includes(consonant[i])) score = 3
        else if (score4.includes(consonant[i])) score = 4
        else if (score5.includes(consonant[i])) score = 5
        else if (score6.includes(consonant[i])) score = 6
        else if (score7.includes(consonant[i])) score = 7

        let power = false
        const isTrue = Math.floor((Math.random() * 2))
        if (isTrue && powerPointer <powerArray.length){
            power = powerArray[powerPointer++]
        }
        alphabetArray.push(new alphabetObject(consonant[i], count, score, power))
        consonant[i] = false
    }
}
alphabetArray.map(item => {
    tilesCount+= item.count
})
//<---------------------------------------------------------------->//Function For Appending Elements
visible(alphabetArray)
function visible(alphabetArray) {
    if (tilesCount == 0 && answerArray.length==0) {
        localStorage.setItem("SatyajeetGameScore", JSON.stringify({ totalScore: totalScore, yourWords: yourWords }))
        window.location.href = "/score.html"
    }
    document.getElementById("score").innerText = totalScore
    document.getElementById("tilesCount").innerText = tilesCount
    lettersDiv.innerHTML = null
    alphabetArray.map((letter, index) => {
        const containerDiv = document.createElement("div")
        const nameDiv = document.createElement("div")
        nameDiv.setAttribute("class", "nameDiv")
        const name = document.createElement("div")
        name.innerText = letter.name
        name.setAttribute("class","digit")
        const score = document.createElement("p")
        score.innerText = letter.score
        score.setAttribute("class", "scoreDigit")
        if (letter.specialPower && letter.powerIndex == letter.count) {
            const power = document.createElement("p")
            power.innerText = letter.specialPower
            power.setAttribute("class", "powerDigit")
            score.setAttribute("style", "color:white")
            let color
            if (letter.specialPower == "DL") color = "#f6a534"
            if (letter.specialPower == "TL") color = "crimson"
            if (letter.specialPower == "DW") color = "#28a745"
            if (letter.specialPower == "TW") color = "royalblue"
            name.setAttribute("style", `background: ${color}; color: white;`)
            nameDiv.append(name, score, power)
            letter.isPower = true
        } else nameDiv.append(name, score)
        if (letter.count > 0) containerDiv.append(nameDiv)
        for (var i = letter.count - 2; i >=0 ; i--){
            const bar = document.createElement("div")
            bar.setAttribute("class", "bar")
            if (letter.specialPower && letter.powerIndex == i+1) {
                let color
                if (letter.specialPower == "DL") color = "#f6a534"
                if (letter.specialPower == "TL") color = "crimson"
                if (letter.specialPower == "DW") color = "#28a745"
                if (letter.specialPower == "TW") color = "royalblue"
                bar.setAttribute("style", `background: ${color}`)
            }
            containerDiv.append(bar)
        }
        nameDiv.addEventListener("click", () => {
            addToWord(letter, index, letter.isPower)
        })
        lettersDiv.append(containerDiv)
    })
}
//<----------------------------->

//<---------------------------------------------------------------->//Timer Started
const timer = document.getElementById("timer");
var time = 99
const interval = setInterval(() => {
    timer.innerText = null;
    timer.innerText = time
    //<----------------------------->//On timer reaching zero the game will stop
    //And the player will be redirected to Score page
    if (time == 0) {
        clearInterval(interval)
        localStorage.setItem("SatyajeetGameScore", JSON.stringify({ totalScore: totalScore, yourWords: yourWords }))
        window.location.href="/score.html"
    }
    time -= 1
}, 1000)

//<----------------------------->


//<----------------------------------------------------------------> Game Play
//Creating Word
function addToWord(letter, index, isPower) {
    deleteButton.setAttribute("style", "display:block")
    submitButton.setAttribute("style", "display:block")
    footer.setAttribute("style", "display:block")
    //<----------------------------->

    //<-------------------------------Logic--------------------------------->
    alphabetArray[index].count--
    answerDiv.innerHTML = null
    answerArray.push([letter, index, isPower])
    currentWord = ""
    answerArray.map(item => {
        currentWord += item[0].name
    })
    tilesCount--
    answerDiv.innerHTML = currentWord
    //<----------------------------->
    visible(alphabetArray)
}


//<-------------------------------------------------------------------------------------------------------------------------------->

// Clicking on Delete Button
deleteButton.addEventListener("click", () => {
    deleteFunction()
})
function deleteFunction() {
    answerDiv.innerHTML = null
    answerArray.map((item, index) => {
        alphabetArray[item[1]].count += 1
        tilesCount++
    })
    answerArray=[]
    currentWord=""
    deleteButton.setAttribute("style", "display:none")
    submitButton.setAttribute("style", "display:none")
    footer.setAttribute("style", "display:none")
    visible(alphabetArray)
}
//<-------------------------------------------------------------------------------------------------------------------------------->
// Clicking on Submit Button

submitButton.addEventListener("click", async () => {
    Toastify({
        text: "Wait Let Us Check",
        duration: 1500,
        destination: "https://github.com/apvarun/toastify-js",
        newWindow: true,
        close: true,
        gravity: "top",
        position: "right",
        stopOnFocus: true,
        style: {
            background: "linear-gradient(to right, #bb8f43, #96c93d)",
        },
    }).showToast();
    let isTrue = false
        await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${currentWord}`)
            .then(response => response.json())
            .then(data => {
                console.log(data)
                if (data.length > 0) isTrue = true
            })
    if (isTrue) {
        yourWords.push(currentWord)
        let flagTW = false
        let flagDW = false
        answerArray.map(item => {
            if (item[2]) {
                let type = item[0].specialPower
                if (type == "DL") totalScore += (item[0].score * 2)
                else if (type == "TL") totalScore += (item[0].score * 3)
                else {
                    if (type == "TW") flagTW = true
                    if (type == "DW") flagDW = true
                    totalScore += item[0].score
                }
            }
            else totalScore += item[0].score
        })
        if (flagTW) totalScore = totalScore * 3
        if (flagDW) totalScore = totalScore * 2


        deleteButton.setAttribute("style", "display:none")
        submitButton.setAttribute("style", "display:none")
        footer.setAttribute("style", "display:none")
        answerDiv.innerHTML = null
        answerArray = []
        Toastify({
            text: "Congrats, Your Score: " + totalScore,
            duration: 3000,
            destination: "https://github.com/apvarun/toastify-js",
            newWindow: true,
            close: true,
            gravity: "top",
            position: "right",
            stopOnFocus: true,
            style: {
                background: "linear-gradient(to right, #bb8f43, #96c93d)",
            },
        }).showToast();
        visible(alphabetArray)
    } else {
        Toastify({
            text: "Incorrect Word",
            duration: 3000,
            destination: "https://github.com/apvarun/toastify-js",
            newWindow: true,
            close: true,
            gravity: "top", 
            position: "right", 
            stopOnFocus: true, 
            style: {
                background: "linear-gradient(to right, #bb8f43, #96c93d)",
            },
        }).showToast();


        deleteFunction()
    }
})

//<-------------------------------------------------------------------------------------------------------------------------------->
//Clicking on the word to remove last letter
answerDiv.addEventListener("click", () => {
    let index = answerArray[answerArray.length - 1][1]
    answerArray.pop()
    alphabetArray[index].count += 1
    currentWord = ""
    answerArray.map(item => {
        currentWord += item[0].name
    })
    tilesCount++
    answerDiv.innerHTML = currentWord
    if (answerArray.length == 0) {
        deleteButton.setAttribute("style", "display:none")
        submitButton.setAttribute("style", "display:none")
        footer.setAttribute("style", "display:none")
    }
    visible(alphabetArray)
})

//<-------------------------------------------------------------------------------------------------------------------------------->
//Quit Game 

const redirect = document.getElementById("redirect")
redirect.addEventListener("click", () => {
    localStorage.setItem("SatyajeetGameScore", JSON.stringify({ totalScore: totalScore, yourWords: yourWords }))
    window.location.href = "/score.html"
})