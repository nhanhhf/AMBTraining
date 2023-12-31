const queryString = window.location.search;
console.log(queryString);
const urlParams = new URLSearchParams(queryString);
var moduleChosen = 2;
moduleChosen = urlParams.get('module')
console.log(moduleChosen);
let linkToJSON = `../data/Module ${moduleChosen}.json`
let response = await fetch(linkToJSON)
let module = await response.json();
console.log(module)

document.getElementById("moduleName").innerText = module.ModuleName;
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
DisplayQuestion();

function submitTest(){
    if(confirm('Bạn muốn nộp bài?') != true){
        return;
    }
    var indexOfQuestion = 1;
    let wrongAnswers = 0;
    for(var idx = 0; idx < currentQuestion.length; idx++){
        let name = 'Q' + indexOfQuestion.toString();
        //console.log("name: " + name);
        var ele = document.getElementsByName(name);
        //console.log(ele);
        var playerChosen = 0;
        for(var i = 0; i < ele.length; i++){
            if(ele[i].checked) playerChosen = i + 1; 
        }
        var correctAnswer = currentQuestion[idx].CorrectAnswer;
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
    
    if(wrongAnswers <= wrongAnswerAllow){
        alert('Chúc mừng bạn đã đạt đủ điểm');
    } else alert('Chưa đủ điểm để đạt. Bạn cần cố gắng hơn!');
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
    for(let i = 0; i < 3; i++){
        let tempIndex = levelIndex[i];
        for(let j = 0; j < requireLevel[i]; j++){
            let index = tempIndex[Math.floor(Math.random() * tempIndex.length)];
            currentQuestion.push(QuestionList[index-1]);
            tempIndex.splice(tempIndex.indexOf(index), 1);
        }
    }
}

function DisplayQuestion(){
    questionBlock_html.innerHTML = "";
    var indexOfQuestion = 1;
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