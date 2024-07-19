const configFilePath = "js/config.json"

let configRespone = await fetch(configFilePath)
let configs = await configRespone.json();  

const moduleList = configs.moduleList;
const moduleNames = configs.moduleName;
console.log(moduleNames)
const subPart = configs.subPart;
const moduleVersions = configs.moduleVersions;
var moduleSelectDiv = document.getElementById('moduleSelectDiv');
for(let i = 0; i < moduleList; i++){
    var moduleDescript = document.createElement('\h3');
    moduleDescript.textContent = moduleNames[i];
    moduleSelectDiv.append(moduleDescript);
    moduleSelectDiv.append(document.createElement('\p'))
    for(let k = 0; k < moduleVersions[i]; k++){
        var verifyIcon = ": ";
        if(configs.verifyTest[i] == k) verifyIcon = " ✅: "
        var versionDescript = document.createElement('span').innerText = `Bank ${k+1}` + verifyIcon;
        
        moduleSelectDiv.append(versionDescript)
        for(let j = 1; j <= subPart[i][k]; j++){
            var fullBankButton = document.createElement('button');  
            fullBankButton.innerText=`Phần ${j} / ${subPart[i][k]}`;
            fullBankButton.onclick = function(){navigateTestPage(i, k, j)}
            moduleSelectDiv.append(fullBankButton);
            moduleSelectDiv.append(document.createTextNode( '\u00A0')   );
        }
        //moduleSelectDiv.append(document.createElement('\p'))    
        var normalTestButton = document.createElement('button');  
        normalTestButton.innerText='Làm bài Test';
        normalTestButton.onclick = function(){navigateTestPage(i, k, -1)}
        moduleSelectDiv.append(normalTestButton);
        moduleSelectDiv.append(document.createElement('\p'))
    }
}

function navigateTestPage(index, moduleVersion, subPartChosen){
    location.href = `./page/maintest.html?index=${index}&mVer=${moduleVersion}&subPart=${subPartChosen}`;   
}