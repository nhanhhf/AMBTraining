const moduleList = [2, 3, 5, 6, 8];
var moduleSelectDiv = document.getElementById('moduleSelectDiv');
for(let i = 0; i < moduleList.length; i++){
    let module = moduleList[i];
    var moduleDescript = document.createElement('p').innerText = `Module ${module}`;
    moduleSelectDiv.append(moduleDescript);
    moduleSelectDiv.append(document.createElement('\p'))

    var fullTestButton = document.createElement('button');  
    fullTestButton.innerText='Full Bank';
    fullTestButton.id = `m${module}ButtonFull`;
    fullTestButton.onclick = function(){navigateTestPage(module, true)}
    moduleSelectDiv.append(fullTestButton);
    moduleSelectDiv.append(document.createTextNode( '\u00A0'));

    var normalTestButton = document.createElement('button');  
    normalTestButton.innerText='Làm bài Test';
    normalTestButton.id = `m${module}ButtonFull`;
    normalTestButton.onclick = function(){navigateTestPage(module, false)}
    moduleSelectDiv.append(normalTestButton);
    moduleSelectDiv.append(document.createElement('\p'))
}

function navigateTestPage(module, isFullTest){
    location.href = `./page/maintest.html?module=${module}&fullTest=${isFullTest}`;
}