const urlParams = new URLSearchParams(window.location.search);

// CONFIG
const configFilePath = `../js/config.json`
let configRespone = await fetch(configFilePath)
let configs = await configRespone.json();
console.log(configs)
/// TESTING
const configFilePath2 = `../js/newConfig.json`
let configRespone2 = await fetch(configFilePath2)
let configs2 = await configRespone2.json();
console.log(configs2.courses[1])
/// TESTING 
const moduleList = configs.moduleList;
const subPart = configs.subPart;
const index = urlParams.get('index')
const subPartChosen = urlParams.get('subPart')
const moduleVer = urlParams.get('mVer')
var response, module

// get data bank
var moduleCode = configs.moduleCode[index]
if(moduleVer > 0){
    const linkToJSON = `../data/test/${moduleCode}-${moduleVer}.json`;
    response = await fetch(linkToJSON);
    module = await response.json();
} else {
    const linkToJSON = `../data/test/${moduleCode}.json`;
    response = await fetch(linkToJSON);
    module = await response.json();
}

//console.log(module) 
var isFullTestRandom = false;
var level3Only = 0;
var isFullTest;
if(subPartChosen >= '0'){isFullTest = false} else isFullTest = true;

document.getElementById("moduleName").innerText = module.ModuleName;
var descriptText1 = document.getElementById('descriptText1');
var QuestionList = module.Questions;
var CatInfo = module.CatInfos[0];
var requireLevel = [CatInfo.QuestionRequired[0], CatInfo.QuestionRequired[1], CatInfo.QuestionRequired[2]];
let wrongAnswerAllow = 0.25 * (requireLevel[0] + requireLevel[1] + requireLevel[2]);

var questionBlock_html = document.getElementById("questionsBlock");
// Assign button function
document.getElementById('submitButton').onclick = function() {submitTest()}
document.getElementById('resetButton').onclick = function() {resetTest()}

var currentQuestion = ComputeNewQuestion();

AddRandomButton();
AddRemoveLevel3Button();
DisplayQuestion();

function submitTest(){
    if(confirm('Bạn muốn nộp bài?') != true){
        return;
    }
    var subPartCount = subPart[index][moduleVer];
    var indexOfQuestion = Math.floor((subPartChosen - 1) / subPartCount * QuestionList.length + 1);;
    if(isFullTest) indexOfQuestion = 1;
    let wrongAnswers = 0;
    for(let idx = 0; idx < currentQuestion.length; idx++){
        let name = 'Q' + indexOfQuestion.toString();
        var ele = document.getElementsByName(name);
        var playerChosen = 0;
        for(var i = 0; i < ele.length; i++){
            if(ele[i].checked) playerChosen = i + 1; 
        }
        let correctAnswer = currentQuestion[idx].CorrectAnswer;
        if(playerChosen != correctAnswer){
            wrongAnswers++;
            let temp = correctAnswer - 1;
            let id = 'l' + indexOfQuestion.toString() + (temp).toString();
            var label = document.getElementById(id);
            label.classList.add('wrongAnswer');
        }
        indexOfQuestion++;
    };
    descriptText1.innerText = `Bạn đã đúng ${currentQuestion.length - wrongAnswers}/${currentQuestion.length} câu.`;
    
    if(isFullTest){
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
    currentQuestion = ComputeNewQuestion();
    DisplayQuestion();
}

function ComputeNewQuestion(){
    var newQuestions = [];
    if(!isFullTest){
        var subPartCount = subPart[index][moduleVer];
        var first = Math.floor((subPartChosen - 1) / subPartCount * QuestionList.length);
        var last = Math.floor(subPartChosen/ subPartCount * QuestionList.length);
        newQuestions = QuestionList.slice(first, last);
        newQuestions.forEach(question => {
            question = SwapAnswer(question)
        });
        if(level3Only == -1){
            for(var i = 0; i < newQuestions.length; i++){
                if(newQuestions[i].Level == 3){
                    newQuestions.splice(i,1);
                    i--;
                }
            }
        } else if(level3Only == 1){
            for(var i = 0; i < newQuestions.length; i++){
                if(newQuestions[i].Level != 3){
                    newQuestions.splice(i,1);
                    i--;
                }
            }
        }
        console.log(newQuestions)
        descriptText1.innerText = `Số câu hỏi: ${newQuestions.length}. Câu hỏi ${first + 1} - ${last}.`;
    } else {
        console.log("a")
        var qIndex = [];
        for(let i = 0; i < QuestionList.length; i++){
            qIndex.push(i);
        }
        for(let i = 0; i < 16; i++){
            let index = Math.floor(Math.random() * qIndex.length);
            newQuestions.push(QuestionList[index]);
            qIndex.splice(index, 1);
        }
        console.log(newQuestions)
        descriptText1.innerText = `Số câu hỏi: ${newQuestions.length} câu. Bạn cần đúng ${newQuestions.length * 0.75} câu.`;
        // var levelIndex = [[],[],[]];
        // for(let i = 0; i < QuestionList.length; i++){
        //     levelIndex[QuestionList[i].Level - 1].push(QuestionList[i].Index);
        // }
        // for(let i = 0; i < 3; i++){
        //     let tempIndex = levelIndex[i];
        //     for(let j = 0; j < requireLevel[i]; j++){
        //         let index = tempIndex[Math.floor(Math.random() * tempIndex.length)];
        //         newQuestions.push(SwapAnswer(QuestionList[index-1]));
        //         tempIndex.splice(tempIndex.indexOf(index), 1);
        //     }
        // }
        // descriptText1.innerText = `Số câu hỏi: ${newQuestions.length} câu. Bạn cần đúng ${newQuestions.length * 0.75} câu.`;
    }
    if(isFullTestRandom) shuffle(newQuestions);
    return newQuestions;
}

function DisplayQuestion(){
    questionBlock_html.innerHTML = "";
    var subPartCount = subPart[index][moduleVer];
    var indexOfQuestion = Math.floor((subPartChosen - 1) / subPartCount * QuestionList.length + 1);
    if(isFullTest) indexOfQuestion = 1;
    for(var idx = 0; idx < currentQuestion.length; idx++){
        let newForm = document.createElement('form');
        var questionP = document.createElement('p');
        questionP.className = "questionString";
        questionP.innerText = 'Câu ' + indexOfQuestion.toString() + ": " + currentQuestion[idx].QuestionString;
        questionBlock_html.appendChild(questionP);
        
        // Display 3 answers randomly
        for(let i = 0; i < 3; i++){
            // Radio button for each answer
            let newRadioInput = document.createElement('input');
            newRadioInput.type = 'radio';
            let id = 'q' + indexOfQuestion.toString() + i.toString();
            let radioName = 'Q' + indexOfQuestion.toString();
            newRadioInput.id = id;
            newRadioInput.value = i + 1;
            newRadioInput.name = radioName;
            newForm.append(newRadioInput);

            // Display answer
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
    if(!isFullTest){
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

function AddRemoveLevel3Button(){
    if(!isFullTest){
        var buttonHeaderDiv = document.getElementById('buttonHeaderDiv');
        var level3Button = document.createElement('button');
        level3Button.id = 'level3StateButton';
        console.log(level3Only)
        level3Button.classList.add('button');
        level3Button.onclick = changeLevel3State;
        buttonHeaderDiv.append(level3Button);
        setLevel3ButtonText();
    }
}

function SwapAnswer(question){
    const swapPos = [[0,1,2], [0,2,1], [1,0,2],[1,2,0],[2,0,1],[2,1,0]];
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

function setLevel3ButtonText(){
    var level3Button = document.getElementById('level3StateButton');
    if(level3Only == 0){
        level3Button.innerText = 'Giữ level 3';
    } else if (level3Only == -1){
        level3Button.innerText = 'Bỏ level 3';
    } else if (level3Only == 1) {
        level3Button.innerText = 'Chỉ còn level 3';
    }
}
function changeLevel3State(){
    if(level3Only == 0) {level3Only = -1}
    else if(level3Only == -1) {level3Only = 1}
    else level3Only = 0
    setLevel3ButtonText();
}