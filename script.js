const moduleList = [2, 3, 5, 6, 8, 9, 7];
const subModuleCount = [1, 1, 1, 1, 1, 1, 2];
var moduleSelectDiv = document.getElementById('moduleSelectDiv');
for(let i = 0; i < moduleList.length; i++){
    let module = moduleList[i];
    var moduleDescript = document.createElement('p').innerText = `Module ${module}`;
    moduleSelectDiv.append(moduleDescript);
    moduleSelectDiv.append(document.createElement('\p'))

    for(let j = 0; j < subModuleCount[i]; j++){
        var fullTestButton = document.createElement('button');  
        fullTestButton.innerText=`Bank Part ${j + 1}`;
        fullTestButton.id = `m${module}ButtonFull`;
        fullTestButton.onclick = function(){navigateTestPage(module, String.fromCharCode(97 + j), true)}
        moduleSelectDiv.append(fullTestButton);
        moduleSelectDiv.append(document.createTextNode( '\u00A0'));
    }

    var normalTestButton = document.createElement('button');  
    normalTestButton.innerText='Làm bài Test';
    normalTestButton.id = `m${module}ButtonFull`;
    normalTestButton.onclick = function(){navigateTestPage(module,0, false)}
    moduleSelectDiv.append(normalTestButton);
    moduleSelectDiv.append(document.createElement('\p'))
}

function navigateTestPage(module, part, isFullTest){
    if(isFullTest){
        location.href = `./page/maintest.html?module=${module}${part}&fullTest=${isFullTest}`; 
    } else {
        location.href = `./page/maintest.html?module=${module}&fullTest=${isFullTest}`; 
    }
}