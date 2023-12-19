fetch('./data/module 2.json')
    .then((response) => response.json())
    .then((json) => console.log(json));