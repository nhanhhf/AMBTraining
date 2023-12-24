const urlParams = new URLSearchParams(window.location.search);
const swapPos = [[0,1,2], [0,2,1], [1,0,2],[1,2,0],[2,0,1],[2,1,0]];
const moduleChosen = urlParams.get('module')
const isFullTest = urlParams.get('fullTest')
console.log(isFullTest);
const linkToJSON = `../data/test/Module ${moduleChosen}.json`;
let response = await fetch(linkToJSON);
let module = await response.json();
var isFullTestRandom = false;

document.getElementById("moduleName").innerText = module.ModuleName;
var descriptText1 = document.getElementById('descriptText1');
var QuestionList = module.Questions;
var CatInfo = module.CatInfos[0];
var requireLevel = [CatInfo.QuestionRequired[0], CatInfo.QuestionRequired[1], CatInfo.QuestionRequired[2]];
let wrongAnswerAllow = 0.25 * (requireLevel[0] + requireLevel[1] + requireLevel[2]);
var levelIndex = [[],[],[]];
for(let i = 0; i < QuestionList.length; i++){
    levelIndex[QuestionList[i].Level - 1].push(QuestionList[i].Index);
}
var questionBlock_html = document.getElementById("questionsBlock");
// Assign button function
document.getElementById('submitButton').onclick = function() {submitTest()}
document.getElementById('resetButton').onclick = function() {resetTest()}

var currentQuestion = [];
ComputeNewQuestion();

AddRandomButton();
DisplayQuestion();

function submitTest(){
    if(confirm('Bạn muốn nộp bài?') != true){
        return;
    }
    var indexOfQuestion = 1;
    let wrongAnswers = 0;
    for(let idx = 0; idx < currentQuestion.length; idx++){
        let name = 'Q' + indexOfQuestion.toString();
        //console.log("name: " + name);
        var ele = document.getElementsByName(name);
        //console.log(ele);
        var playerChosen = 0;
        for(var i = 0; i < ele.length; i++){
            if(ele[i].checked) playerChosen = i + 1; 
        }
        let correctAnswer = currentQuestion[idx].CorrectAnswer;
        if(playerChosen != correctAnswer){
            wrongAnswers++;
            let temp = correctAnswer - 1;
            let id = 'l' + indexOfQuestion.toString() + (temp).toString();
            // console.log(id);
            // console.log(document.getElementById(id));
            var label = document.getElementById(id);
            // console.log(label);
            label.classList.add('wrongAnswer');
        }
        indexOfQuestion++;
    };
    descriptText1.innerText = `Bạn đã đúng ${currentQuestion.length - wrongAnswers}/${currentQuestion.length} câu.`;
    
    if(isFullTest == 'false'){
        if(wrongAnswers <= wrongAnswerAllow){
            descriptText1.innerText += ' Bạn đã đạt bài thi.';
        } else{ 
            descriptText1.innerText += ' Bạn chưa đạt bài thi.';
        }
    }
    window.scrollTo(0, 0);
}

function resetTest(){
    if(confirm('Bạn muốn làm bài test mới?') != true){
        return;
    }
    ComputeNewQuestion();
    DisplayQuestion();
}

function ComputeNewQuestion(){
    currentQuestion = [];
    if(isFullTest == 'true'){
        for(let i = 0; i < 3; i++){
            if(requireLevel[i] > 0){
                for(let j = 0; j < levelIndex[i].length; j++){
                    let index = levelIndex[i][j]
                    currentQuestion.push(SwapAnswer(QuestionList[index - 1]));
                }
            }
        }
        descriptText1.innerText = `Số câu hỏi: ${currentQuestion.length} câu.`;
    } else {
        for(let i = 0; i < 3; i++){
            let tempIndex = levelIndex[i];
            for(let j = 0; j < requireLevel[i]; j++){
                let index = tempIndex[Math.floor(Math.random() * tempIndex.length)];
                currentQuestion.push(SwapAnswer(QuestionList[index-1]));
                tempIndex.splice(tempIndex.indexOf(index), 1);
            }
        }
        descriptText1.innerText = `Số câu hỏi: ${currentQuestion.length} câu. Bạn cần đúng ${currentQuestion.length * 0.75} câu.`;
    }
}

function SwapAnswer(question){
    let si = Math.floor(Math.random() * 6);
    let newAnswer = [];
    let newCorrectAnswer;
    for(let k = 0; k < 3; k++){
        newAnswer.push(question.Answers[swapPos[si][k]]);
        if(swapPos[si][k] + 1 == question.CorrectAnswer) newCorrectAnswer = k + 1;
    }
    question.Answers = newAnswer;
    question.CorrectAnswer = newCorrectAnswer;
    return question;
}

function DisplayQuestion(){
    questionBlock_html.innerHTML = "";
    var indexOfQuestion = 1;
    if(isFullTestRandom) shuffle(currentQuestion);
    for(var idx = 0; idx < currentQuestion.length; idx++){
        let newForm = document.createElement('form');
        var questionP = document.createElement('p');
        questionP.className = "questionString";
        questionP.innerText = 'Câu ' + indexOfQuestion.toString() + ": " + currentQuestion[idx].QuestionString;
        questionBlock_html.appendChild(questionP);
        
        // Radio button & label
        for(let i = 0; i < 3; i++){
            // Radio button
            let newRadioInput = document.createElement('input');
            newRadioInput.type = 'radio';
            let id = 'q' + indexOfQuestion.toString() + i.toString();
            let radioName = 'Q' + indexOfQuestion.toString();
            newRadioInput.id = id;
            newRadioInput.value = i + 1;
            newRadioInput.name = radioName;
            newForm.append(newRadioInput);

            // Label for Radio Button
            let newLabel = document.createElement('label');
            newLabel.innerText = currentQuestion[idx].Answers[i];
            newLabel.htmlFor = id;
            let labelId = 'l' + indexOfQuestion.toString() + i.toString();
            newLabel.id = labelId;
            newLabel.classList.add('answerString');
            newForm.append(newLabel);
            newForm.append(document.createElement('br'));
        }
        indexOfQuestion++;
        questionBlock_html.append(newForm);
    }
}

function AddRandomButton(){
    if(isFullTest == 'true'){
        var buttonHeaderDiv = document.getElementById('buttonHeaderDiv');
        var randomButton = document.createElement('button');
        randomButton.id = 'randomStateButton';
        if(isFullTestRandom == false){
            randomButton.innerText = 'Xáo trộn câu hỏi: Tắt';
        } else {
            randomButton.innerText = 'Xáo trộn câu hỏi: Bật';
        }
        
        randomButton.classList.add('button');
        randomButton.onclick = changeRandomState;
        buttonHeaderDiv.append(randomButton);
    }
}

function shuffle(a) {
    var j, x, i;
    for (i = a.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        x = a[i];
        a[i] = a[j];
        a[j] = x;
    }
    return a;
}

function changeRandomState(){
    isFullTestRandom = !isFullTestRandom;
    var t = document.getElementById('randomStateButton');
    if(isFullTestRandom == false){
        t.innerText = 'Xáo trộn câu hỏi: Tắt';
    } else {
        t.innerText = 'Xáo trộn câu hỏi: Bật';
    }
}
