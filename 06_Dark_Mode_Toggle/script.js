const input = document.querySelector('.input');

input.checked = JSON.parse(localStorage.getItem('mode'));


const bodyEl = document.querySelector('body');

updateBody()

function updateBody(){
    if (input.checked) {
        bodyEl.style.background ='black';
    } else {
        bodyEl.style.background = 'white';
    }
}

input.addEventListener('input',()=>{
    updateBody();
    updateLocalStorage();
} )


function updateLocalStorage(){
    localStorage.setItem('mode', JSON.stringify(input.checked))
}