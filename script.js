const moduleList = [2, 3, 5, 6, 8, 9, 7];
const subPart = [1, 1, 1, 1, 1, 1, 2];
const moduleVersions = [];
var moduleSelectDiv = document.getElementById('moduleSelectDiv');
for(let i = 0; i < moduleList.length; i++){
    let module = moduleList[i];
    var moduleDescript = document.createElement('p').innerText = `Module ${module}`;
    moduleSelectDiv.append(moduleDescript);
    moduleSelectDiv.append(document.createElement('\p'))

    for(let j = 1; j <= subPart[i]; j++){
        var fullBankButton = document.createElement('button');  
        fullBankButton.innerText=`Bank Part ${j}`;
        //fullBankButton.id = `m${module}ButtonFull`;
        fullBankButton.onclick = function(){navigateTestPage(module, j)}
        moduleSelectDiv.append(fullBankButton);
        moduleSelectDiv.append(document.createTextNode( '\u00A0'));
    }

    var normalTestButton = document.createElement('button');  
    normalTestButton.innerText='Làm bài Test';
    //normalTestButton.id = `m${module}ButtonFull`;
    normalTestButton.onclick = function(){navigateTestPage(module, 0)}
    moduleSelectDiv.append(normalTestButton);
    moduleSelectDiv.append(document.createElement('\p'))
}

function navigateTestPage(module, subPartChosen){
    location.href = `./page/maintest.html?module=${module}&subPart=${subPartChosen}`;   
}