let moduleChosen = 2;
let path = './data/Module' +  moduleChosen.toString() + 'Physics.json';
console.log(path)

import module from './data/Module 2 - Physics.json' assert {type: 'json'};

console.log(module);
console.log("fetch");
fetch('./data/Module 2 - Physics.json')
    .then((response) => response.json())
    .then((json) => console.log(json));